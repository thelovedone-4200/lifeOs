import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent, nip19 } from 'nostr-tools';
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';

// FIX: Added promiseAny polyfill for environments that do not support Promise.any (ES2020 and older)
const promiseAny = <T>(promises: Promise<T>[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        let rejectedCount = 0;
        const errors: any[] = [];
        if (promises.length === 0) return reject(new Error("No promises"));
        
        promises.forEach(p => 
            Promise.resolve(p).then(resolve).catch(err => {
                rejectedCount++;
                errors.push(err);
                if (rejectedCount === promises.length) reject(new Error("All promises rejected"));
            })
        );
    });
};

/**
 * SUNDAY PROTOCOL (LIVE NOSTR IMPLEMENTATION)
 * 
 * 1. Identity: Real Ed25519 Keypairs (nsec/npub).
 * 2. Storage: Public Nostr Relays (wss://...).
 * 3. Structure: Kind 1 Events containing JSON stringified SundayBundles.
 */

// --- CONFIG ---

const RELAYS = [
    'wss://relay.damus.io',
    'wss://relay.primal.net',
    'wss://relay.nostr.band',
    'wss://relay.snort.social'
];

// --- TYPES ---

export interface Identity {
    pub: string;
    priv: string;
    npub: string;
    handle: string;
}

export interface Contact {
    pub: string;
    handle: string;
    addedAt: number;
}

export interface SundayBundle {
    id: string;
    author: string;
    handle: string;
    timestamp: number;
    items: SundayItem[];
    signature: string;
}

export interface SundayItem {
    type: 'text' | 'image' | 'link';
    content: string;
    caption?: string;
    timestamp: number;
}

// --- IDENTITY (REAL CRYPTO) ---

export const getIdentity = (): Identity => {
    const stored = localStorage.getItem('sunday_identity_v2');
    if (stored) return JSON.parse(stored);

    const sk = generateSecretKey(); 
    const skHex = bytesToHex(sk);
    const pk = getPublicKey(sk);
    const npub = nip19.npubEncode(pk);

    const id: Identity = {
        pub: pk,
        priv: skHex,
        npub: npub,
        handle: 'Traveler'
    };
    
    localStorage.setItem('sunday_identity_v2', JSON.stringify(id));
    return id;
};

export const updateHandle = (newHandle: string) => {
    const id = getIdentity();
    id.handle = newHandle;
    localStorage.setItem('sunday_identity_v2', JSON.stringify(id));
    return id;
};

// --- ADDRESS BOOK (FOLLOWING) ---

export const getFollowing = (): Contact[] => {
    try {
        const stored = localStorage.getItem('sunday_following_v2');
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
};

export const followUser = (pubInput: string, handle: string = 'Anonymous'): boolean => {
    try {
        let pub = pubInput;
        // Handle npub format if pasted
        if (pubInput.startsWith('npub')) {
            const { data } = nip19.decode(pubInput);
            pub = data as string;
        }

        const list = getFollowing();
        if (list.some(c => c.pub === pub)) return false; // Already following

        const newContact: Contact = { pub, handle, addedAt: Date.now() };
        localStorage.setItem('sunday_following_v2', JSON.stringify([...list, newContact]));
        return true;
    } catch (e) {
        console.error("Invalid key", e);
        return false;
    }
};

export const unfollowUser = (pub: string) => {
    const list = getFollowing();
    const filtered = list.filter(c => c.pub !== pub);
    localStorage.setItem('sunday_following_v2', JSON.stringify(filtered));
    return filtered;
};

// --- REAL RELAY ACTIONS ---

export const publishBundle = async (drafts: any[], identity: Identity): Promise<boolean> => {
    try {
        const bundleContent = JSON.stringify({
            handle: identity.handle,
            items: drafts,
            app: 'Sunday/1.0'
        });

        const eventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', 'sunday-issue'], ['client', 'LifeOS']],
            content: bundleContent,
        };

        const skBytes = hexToBytes(identity.priv);
        const signedEvent = finalizeEvent(eventTemplate, skBytes);

        await promiseAny(RELAYS.map(url => {
            return new Promise((resolve, reject) => {
                const ws = new WebSocket(url);
                const timeout = setTimeout(() => { ws.close(); reject('Timeout'); }, 5000);
                ws.onopen = () => { ws.send(JSON.stringify(["EVENT", signedEvent])); };
                ws.onmessage = (msg) => {
                    const data = JSON.parse(msg.data);
                    if (data[0] === "OK" && data[1] === signedEvent.id && data[2]) {
                        clearTimeout(timeout);
                        ws.close();
                        resolve(true);
                    }
                };
                ws.onerror = (err) => { clearTimeout(timeout); ws.close(); reject(err); };
            });
        }));

        return true;
    } catch (e) {
        return false;
    }
};

export const fetchBundles = async (followingKeys: string[]): Promise<SundayBundle[]> => {
    // We fetch from ALL relays in parallel and merge results
    const allBatches = await Promise.all(RELAYS.map(url => {
        return new Promise<SundayBundle[]>((resolve) => {
            const ws = new WebSocket(url);
            let subId = "sub_" + Math.random().toString(36).substring(2);
            let relayBundles: SundayBundle[] = [];
            let resolved = false;

            const finish = () => {
                if (!resolved) {
                    resolved = true;
                    if(ws.readyState === WebSocket.OPEN) ws.close();
                    resolve(relayBundles);
                }
            };

            ws.onopen = () => {
                // FILTER LOGIC
                let filter: any = {
                    kinds: [1],
                    '#t': ['sunday-issue'],
                    limit: 30
                };

                // If specific keys are requested, add authors filter
                if (followingKeys && followingKeys.length > 0) {
                    filter = {
                        ...filter,
                        authors: followingKeys
                    };
                }

                ws.send(JSON.stringify(["REQ", subId, filter]));
            };

            ws.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (data[0] === "EVENT" && data[1] === subId) {
                        const ev = data[2];
                        try {
                            const parsedContent = JSON.parse(ev.content);
                            if (parsedContent.items && Array.isArray(parsedContent.items)) {
                                relayBundles.push({
                                    id: ev.id,
                                    author: ev.pubkey,
                                    handle: parsedContent.handle || 'Anonymous',
                                    timestamp: ev.created_at * 1000,
                                    items: parsedContent.items,
                                    signature: ev.sig
                                });
                            }
                        } catch (e) { }
                    }
                    if (data[0] === "EOSE" && data[1] === subId) finish();
                } catch(e) { finish(); }
            };

            ws.onerror = () => finish();
            setTimeout(() => finish(), 3000);
        });
    }));

    // Deduplicate
    const allEvents = allBatches.flat();
    const seen = new Set();
    const uniqueBundles = [];
    
    for (const b of allEvents) {
        if (!seen.has(b.id)) {
            seen.add(b.id);
            uniqueBundles.push(b);
        }
    }

    return uniqueBundles.sort((a,b) => b.timestamp - a.timestamp);
};