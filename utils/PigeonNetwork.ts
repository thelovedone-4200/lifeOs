/**
 * PIGEON NETWORK (P2P Serverless Protocol)
 * 
 * Logic:
 * 1. Identify users via a locally generated UUID.
 * 2. Send messages by encoding payload into a URL parameter.
 * 3. Receive messages by parsing URL parameters on app load.
 */

export interface PostalMessage {
    id: string;
    from: string; // The sender's ID or Name
    to: string;   // Recipient ID (optional validation)
    content: string;
    date: string;
    stamp: {
        id: string;
        icon: string;
        name: string;
        color: string;
    };
    signature: string; // Simple hash to verify integrity
}

export interface Contact {
    id: string;
    name: string;
    handle: string; // The unique ID used for addressing
    type: 'human' | 'bot';
    addedAt: number;
    avatar?: string;
    bio?: string;
}

export interface Passport {
    id: string;
    name: string;
    type: 'passport';
}

// Generate a random ID for the user if one doesn't exist
export const getMyIdentity = (): string => {
    let id = localStorage.getItem('hb_pigeon_id');
    if (!id) {
        // Use a friendly prefix for manual typing if needed, but keep it unique
        id = 'poly_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem('hb_pigeon_id', id);
    }
    return id;
};

// Base64 Helpers
const encode = (str: string) => btoa(encodeURIComponent(str));
const decode = (str: string) => decodeURIComponent(atob(str));

// Compress and Encode message to a URL safe string
export const wrapPigeon = (message: PostalMessage): string => {
    try {
        const json = JSON.stringify(message);
        return encode(json);
    } catch (e) {
        console.error("Failed to wrap pigeon", e);
        return "";
    }
};

// Decode message from URL string
export const unwrapPigeon = (encoded: string): PostalMessage | null => {
    try {
        const json = decode(encoded);
        const message = JSON.parse(json);
        if (!message.content || !message.from) return null;
        return message;
    } catch (e) {
        console.error("Failed to unwrap pigeon", e);
        return null;
    }
};

// --- PASSPORT SYSTEM (FRIEND REQUESTS) ---

export const generatePassportLink = (name: string, id: string): string => {
    const passport: Passport = { id, name, type: 'passport' };
    const payload = encode(JSON.stringify(passport));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?passport=${payload}`;
};

export const getQRCodeUrl = (data: string): string => {
    // Using a public reliable QR code API for the "No Server" constraint
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}&color=1c1f26&bgcolor=FDFBF7`;
};

export const checkForPassport = (): Passport | null => {
    const params = new URLSearchParams(window.location.search);
    const passportData = params.get('passport');
    if (passportData) {
        try {
            const json = decode(passportData);
            return JSON.parse(json);
        } catch (e) { return null; }
    }
    return null;
};

// --- SIMULATED DIRECTORY (TOWNSFOLK) ---
export const MOCK_TOWNSFOLK: Contact[] = [
    { id: 'bot_1', name: 'The Gardener', handle: '@gardener', type: 'bot', addedAt: 0, avatar: 'G', bio: 'Tending to digital roots.' },
    { id: 'bot_2', name: 'Alice', handle: '@alice', type: 'bot', addedAt: 0, avatar: 'A', bio: 'Always wandering.' },
    { id: 'bot_3', name: 'Protocol Droid', handle: '@proto', type: 'bot', addedAt: 0, avatar: 'P', bio: 'Optimizing loops.' },
    { id: 'bot_4', name: 'Sunday Editor', handle: '@editor', type: 'bot', addedAt: 0, avatar: 'E', bio: 'Curating the weekly.' }
];

// --- TRANSPORT ---

// Generate the shareable link
export const generateFlightPath = (message: PostalMessage): string => {
    const payload = wrapPigeon(message);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?pigeon=${payload}`;
};

// Check if current URL has a pigeon
export const checkForIncomingPigeon = (): PostalMessage | null => {
    const params = new URLSearchParams(window.location.search);
    const pigeonData = params.get('pigeon');
    
    if (pigeonData) {
        return unwrapPigeon(pigeonData);
    }
    return null;
};

// Clear the pigeon/passport from URL
export const clearSky = () => {
    const url = new URL(window.location.href);
    let changed = false;
    if (url.searchParams.has('pigeon')) { url.searchParams.delete('pigeon'); changed = true; }
    if (url.searchParams.has('passport')) { url.searchParams.delete('passport'); changed = true; }
    if (changed) window.history.replaceState({}, document.title, url.toString());
};

// Native Share API Wrapper
export const dispatchPigeon = async (title: string, text: string, url: string): Promise<boolean> => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            return true;
        } catch (err) {
            return false; // User cancelled or failed
        }
    }
    return false; // Not supported
};
