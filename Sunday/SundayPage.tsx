import React, { useState, useEffect } from 'react';
import { 
  Coffee, PenTool, Image as ImageIcon, Link as LinkIcon, 
  Book, Send, Heart, MessageCircle, Feather,
  BookOpen, Edit3, Bird, QrCode, Signal, Radio, Lock, Globe, CheckCircle, RefreshCw, Trash2, UserPlus, Users
} from 'lucide-react';
import { getIdentity, updateHandle, publishBundle, fetchBundles, getFollowing, followUser, unfollowUser, Identity, SundayBundle, Contact } from '../utils/SundayProtocol';

interface SundayPageProps {
  isSundayMode: boolean;
  setIsSundayMode: (val: boolean) => void;
  pressDrafts: any[];
  setPressDrafts: (drafts: any[]) => void;
  pressInput: string;
  setPressInput: (val: string) => void;
  pressType: 'text' | 'image' | 'link';
  setPressType: (val: 'text' | 'image' | 'link') => void;
  playSound: (type: 'click' | 'success' | 'hover' | 'toggle' | 'delete' | 'tap' | 'beat' | 'tone') => void;
  showToast: (msg: string) => void;
  userName: string;
  onExperienceGain: (amount: number, reason: string) => void;
  theme: any;
}

type Tab = 'journal' | 'paper' | 'network';

export default function SundayPage({
  isSundayMode,
  setIsSundayMode,
  pressDrafts,
  setPressDrafts,
  pressInput,
  setPressInput,
  pressType,
  setPressType,
  playSound,
  showToast,
  userName,
  onExperienceGain,
  theme
}: SundayPageProps) {

  // Protocol State
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('journal');
  const [feed, setFeed] = useState<SundayBundle[]>([]);
  const [following, setFollowing] = useState<Contact[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [broadcastStep, setBroadcastStep] = useState(0); // 0:Idle, 1:Bundle, 2:Sign, 3:Send, 4:Done
  const [feedMode, setFeedMode] = useState<'global' | 'following'>('global');
  
  // Network Input
  const [connectInput, setConnectInput] = useState('');

  useEffect(() => {
      // Init Identity
      const id = getIdentity();
      if (userName && id.handle !== userName) {
          const updated = updateHandle(userName);
          setIdentity(updated);
      } else {
          setIdentity(id);
      }
      
      // Load Following List
      setFollowing(getFollowing());
  }, [userName]);

  useEffect(() => {
      // Fetch Feed when entering Paper mode or switching feed modes
      if (activeTab === 'paper') {
          refreshFeed();
      }
      // Refresh following list when entering Network
      if (activeTab === 'network') {
          setFollowing(getFollowing());
      }
  }, [activeTab, feedMode]);

  const refreshFeed = () => {
      setIsFetching(true);
      const followingKeys = feedMode === 'following' ? getFollowing().map(c => c.pub) : [];
      
      // If following mode but no friends, skip fetch
      if (feedMode === 'following' && followingKeys.length === 0) {
          setFeed([]);
          setIsFetching(false);
          return;
      }

      fetchBundles(followingKeys).then(data => {
          setFeed(data);
          setIsFetching(false);
      });
  };

  const handleTabChange = (tab: Tab) => {
      playSound('click');
      setActiveTab(tab);
      setIsSundayMode(tab === 'paper');
  };

  const handleSaveDraft = () => {
      if(pressInput.trim()) { 
          playSound('success');
          setPressDrafts([...pressDrafts, {id: Date.now(), type: pressType, content: pressInput, time: Date.now()}]); 
          setPressInput(''); 
          showToast("Draft Encrypted & Saved Locally.");
      }
  };

  const handleBroadcast = async () => {
      if (!identity || pressDrafts.length === 0) return;
      
      playSound('click');
      setIsBroadcasting(true);
      
      // Simulation Steps
      setBroadcastStep(1); // Bundle
      await new Promise(r => setTimeout(r, 1000));
      playSound('tap');
      
      setBroadcastStep(2); // Sign
      await new Promise(r => setTimeout(r, 1000));
      playSound('tap');
      
      setBroadcastStep(3); // Relay
      await publishBundle(pressDrafts, identity);
      playSound('beat');
      
      setBroadcastStep(4); // Done
      await new Promise(r => setTimeout(r, 1000));
      
      // SUCCESS INTEGRATION
      onExperienceGain(500, "Published Sunday Issue"); // Unified XP System
      setPressDrafts([]); // Clear local drafts
      setIsBroadcasting(false);
      setBroadcastStep(0);
      handleTabChange('paper');
  };
  
  const handleFollow = () => {
      if (!connectInput.trim()) return;
      const success = followUser(connectInput.trim(), 'Friend');
      if (success) {
          playSound('success');
          setFollowing(getFollowing());
          setConnectInput('');
          showToast("Connected to frequency.");
      } else {
          playSound('delete');
          showToast("Invalid key or already following.");
      }
  };

  const handleUnfollow = (pub: string) => {
      playSound('delete');
      const newList = unfollowUser(pub);
      setFollowing(newList);
      showToast("Frequency muted.");
  };

  const renderBroadcastingOverlay = () => (
      <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
          <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/10 animate-ping absolute inset-0"></div>
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.5)]">
                  <Radio size={48} className="text-black" />
              </div>
          </div>
          
          <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                  {broadcastStep === 1 && "Bundling Drafts..."}
                  {broadcastStep === 2 && "Signing Bundle..."}
                  {broadcastStep === 3 && "Broadcasting..."}
                  {broadcastStep === 4 && "Published."}
              </h3>
              <p className="text-sm font-mono text-white/50">
                  {broadcastStep === 2 && `KEY: ${identity?.priv.substring(0, 12)}...`}
                  {broadcastStep === 3 && "RELAY: wss://relay.sunday.network"}
              </p>
          </div>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out"
                style={{ width: `${broadcastStep * 25}%` }}
              />
          </div>
      </div>
  );

  return (
    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out pb-32 min-h-full -mx-6 -mt-6 relative overflow-hidden transition-colors duration-700`}>
        
        {isBroadcasting && renderBroadcastingOverlay()}

        {/* Top Navigation - Aligned Opacity */}
        <div className={`sticky top-0 z-40 px-6 py-6 backdrop-blur-md border-b border-white/5 bg-white/[0.02] shadow-sm`}>
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className={`text-3xl font-serif font-bold tracking-tight text-white`}>
                            Sunday
                        </h1>
                        <p className={`text-xs font-medium uppercase tracking-widest mt-1 text-white/50`}>
                            {activeTab === 'network' ? 'Decentralized Network' : (activeTab === 'paper' ? 'Live Feed' : 'Local Drafts')}
                        </p>
                    </div>
                    {/* Identity Badge */}
                    {activeTab !== 'network' && (
                        <button onClick={() => handleTabChange('network')} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all border-white/10 bg-white/5 text-white/60 hover:bg-white/10`}>
                            <div className={`w-2 h-2 rounded-full bg-white animate-pulse`}></div>
                            {identity?.handle}
                        </button>
                    )}
                </div>

                {/* Sub-Nav */}
                <div className={`flex p-1.5 rounded-full border bg-white/5 border-white/5`}>
                    <button onClick={() => handleTabChange('journal')} className={`flex-1 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'journal' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>
                        <Edit3 size={14}/> Write
                    </button>
                    <button onClick={() => handleTabChange('paper')} className={`flex-1 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'paper' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>
                        <BookOpen size={14}/> Read
                    </button>
                    <button onClick={() => handleTabChange('network')} className={`flex-1 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'network' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>
                        <Signal size={14}/> Connect
                    </button>
                </div>
            </div>
        </div>
        
        <div className="px-6 py-8 min-h-[60vh]">
          
          {/* --- JOURNAL TAB --- */}
          {activeTab === 'journal' && (
              <div className="flex flex-col pt-2 animate-in-up max-w-xl mx-auto">
                    {/* Intro Card */}
                    <div className={`mb-8 p-6 rounded-[2rem] flex items-start gap-4 glass-panel`}>
                        <div className={`p-3 rounded-full bg-white/10 text-white`}><Feather size={24}/></div>
                        <div>
                            <h3 className={`font-bold text-base text-white`}>Drafting Mode</h3>
                            <p className={`text-sm mt-1 leading-relaxed text-white/60`}>
                                Content is stored locally on your device. On Sunday, bundle your drafts and broadcast them to the relay network.
                            </p>
                        </div>
                    </div>

                    {/* Composer */}
                    <div className={`glass-panel rounded-[2.5rem] overflow-hidden shadow-lg mb-8 focus-within:border-white/20 transition-colors`}>
                        <textarea 
                            value={pressInput}
                            onChange={(e) => setPressInput(e.target.value)}
                            placeholder={pressType === 'image' ? "Paste Image URL here..." : "Capture a thought..."}
                            className={`w-full h-48 p-8 bg-transparent text-xl text-white placeholder-white/40 resize-none outline-none ${pressType === 'image' ? 'font-mono' : 'font-serif'} leading-relaxed`}
                        />
                        
                        <div className={`bg-white/[0.02] px-6 py-4 flex justify-between items-center border-t border-white/5`}>
                            <div className="flex gap-2">
                                <button onClick={() => { setPressType('text'); playSound('click'); }} className={`p-3 rounded-full transition-all ${pressType==='text' ? `bg-white text-black` : 'text-white/40 hover:bg-white/10'}`}><PenTool size={18}/></button>
                                <button onClick={() => { setPressType('image'); playSound('click'); }} className={`p-3 rounded-full transition-all ${pressType==='image' ? `bg-white text-black` : 'text-white/40 hover:bg-white/10'}`}><ImageIcon size={18}/></button>
                                <button onClick={() => { setPressType('link'); playSound('click'); }} className={`p-3 rounded-full transition-all ${pressType==='link' ? `bg-white text-black` : 'text-white/40 hover:bg-white/10'}`}><LinkIcon size={18}/></button>
                            </div>
                            <button onClick={handleSaveDraft} disabled={!pressInput.trim()} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active-squish ${pressInput.trim() ? 'bg-white text-black hover:bg-white/90' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
                                Encrypt <Lock size={12}/>
                            </button>
                        </div>
                    </div>

                    {/* Drafts List */}
                    <div>
                        <div className="flex justify-between items-end mb-6 px-2">
                            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Encrypted Bundle ({pressDrafts.length})</h3>
                            {pressDrafts.length > 0 && (
                                <button onClick={handleBroadcast} className={`text-xs font-bold text-white flex items-center gap-2 animate-pulse`}>
                                    <Radio size={14}/> BROADCAST NOW
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {pressDrafts.length === 0 ? (
                                <div className={`text-center py-12 border border-dashed rounded-[2rem] border-white/10`}>
                                    <Book size={32} className={`mx-auto mb-3 text-white/20`}/>
                                    <p className={`text-sm text-white/40`}>Bundle is empty.</p>
                                </div>
                            ) : (
                                pressDrafts.map((draft, i) => (
                                    <div key={i} className={`glass-panel p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-white/5 transition-all`}>
                                        <div className={`w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]`}></div>
                                        <p className={`text-base font-serif truncate flex-1 text-white/90`}>{draft.content}</p>
                                        <span className={`text-[10px] font-medium uppercase px-3 py-1 rounded-full bg-white/10 text-white/60`}>{draft.type}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
              </div>
          )}

          {/* --- PAPER TAB --- */}
          {activeTab === 'paper' && (
              <div className="space-y-10 animate-in-up">
                    
                    {/* FEED TOGGLE */}
                    <div className="flex justify-center mb-6">
                        <div className={`p-1.5 rounded-full border flex shadow-sm bg-white/5 border-white/5`}>
                            <button onClick={() => { setFeedMode('global'); playSound('click'); }} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${feedMode === 'global' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>
                                <Globe size={12} /> Global
                            </button>
                            <button onClick={() => { setFeedMode('following'); playSound('click'); }} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${feedMode === 'following' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>
                                <Users size={12} /> Following
                            </button>
                        </div>
                    </div>

                    {isFetching ? (
                        <div className="py-32 text-center space-y-6">
                            <div className={`w-16 h-16 border-2 rounded-full animate-spin mx-auto border-white/10 border-t-white`}></div>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Fetching from Relays...</p>
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto space-y-10">
                            {/* Feed Items */}
                            {feed.length === 0 ? (
                                <div className="text-center py-20 text-white/40">
                                    <p>{feedMode === 'following' ? "You aren't following anyone yet, or they haven't posted." : "No issues found on the network."}</p>
                                    <p className="text-xs mt-2">Check the Network tab to connect.</p>
                                </div>
                            ) : feed.map((bundle, idx) => (
                                <div key={idx} className="glass-panel rounded-[2.5rem] p-8 shadow-sm hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/60 font-serif font-bold text-xl border border-white/5">{bundle.handle[0]}</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-base text-white">{bundle.handle}</span>
                                                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-full font-mono truncate max-w-[80px]">{bundle.author.substring(0, 12)}...</span>
                                            </div>
                                            <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Sunday 6:00 AM</span>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {bundle.items.map((item, i) => (
                                            <div key={i} className="space-y-4">
                                                {item.type === 'text' && <p className="font-serif text-xl leading-relaxed text-white/90">{item.content}</p>}
                                                {item.type === 'image' && (
                                                    <div className="rounded-2xl overflow-hidden bg-white/5 shadow-inner">
                                                        <img src={item.content} alt="Post" className="w-full h-auto object-cover" onError={(e) => (e.currentTarget.style.display='none')} />
                                                    </div>
                                                )}
                                                {item.type === 'link' && (
                                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                                        <Globe size={20} className="text-white/60"/>
                                                        <a href={item.content} target="_blank" rel="noreferrer" className="font-medium text-white underline decoration-white/30 underline-offset-4 break-all text-sm">{item.content}</a>
                                                    </div>
                                                )}
                                                {item.caption && <p className="text-sm text-white/50 italic border-l-2 border-white/20 pl-4">{item.caption}</p>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-8 mt-8 border-t border-white/5">
                                        <button className="text-white/40 hover:text-red-500 transition-colors active-squish"><Heart size={20} /></button>
                                        <button className="text-white/40 hover:text-white transition-colors ml-auto active-squish"><Send size={20} /></button>
                                    </div>
                                </div>
                            ))}
                            <div className="py-12 text-center">
                                <Coffee size={24} className="mx-auto text-white/20 mb-4"/>
                                <p className="font-serif italic text-white/40">You've reached the end of the feed.</p>
                            </div>
                        </div>
                    )}
              </div>
          )}

          {/* --- NETWORK TAB --- */}
          {activeTab === 'network' && (
              <div className="flex flex-col pt-2 animate-in-up max-w-xl mx-auto space-y-8">
                  {/* Identity Card */}
                  <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5"><Signal size={80} className="text-white"/></div>
                      <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Your Frequency</h3>
                      <div className="flex items-center gap-6 mb-8">
                          <div className="bg-white p-3 rounded-2xl shadow-lg">
                              <QrCode size={64} className="text-black"/>
                          </div>
                          <div className="overflow-hidden">
                              <h2 className="text-3xl font-bold text-white truncate">{identity?.handle}</h2>
                              <p className={`text-xs font-mono mt-2 break-all truncate text-white/60`}>
                                  {identity?.npub.substring(0, 20)}...
                              </p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <button onClick={() => {navigator.clipboard.writeText(identity?.npub || ''); showToast("Copied Key")}} className="flex-1 py-3 bg-white/10 rounded-full text-xs font-bold text-white/80 hover:bg-white hover:text-black transition-all active-squish">Copy Public Key</button>
                          <button className="flex-1 py-3 bg-white/10 rounded-full text-xs font-bold text-white/80 hover:bg-white hover:text-black transition-all active-squish">Backup Private Key</button>
                      </div>
                  </div>

                  {/* Following */}
                  <div>
                      <div className="flex justify-between items-center mb-6 px-2">
                          <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Tuned In ({following.length})</h3>
                          <button onClick={() => { setIsFetching(true); fetchBundles(following.map(f => f.pub)).then(d => { setFeed(d); setIsFetching(false); showToast("Sync Complete"); }); }} className={`text-xs font-bold flex items-center gap-2 text-white bg-white/10 px-3 py-1 rounded-full`}><RefreshCw size={12}/> Refresh</button>
                      </div>
                      <div className="space-y-3">
                          {following.length === 0 ? (
                              <div className="p-8 border border-dashed border-white/10 rounded-[2rem] text-center">
                                  <p className="text-sm text-white/40">You aren't following anyone yet.</p>
                              </div>
                          ) : following.map(contact => (
                              <div key={contact.pub} className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
                                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-serif text-white/60 font-bold border border-white/5">
                                      {contact.handle[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                      <div className="text-sm font-bold text-white truncate">{contact.handle}</div>
                                      <div className="text-[10px] text-white/40 font-mono truncate max-w-[150px]">{contact.pub.substring(0, 16)}...</div>
                                  </div>
                                  <button onClick={() => handleUnfollow(contact.pub)} className="text-white/40 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 p-2">
                                      <Trash2 size={18}/>
                                  </button>
                                  <div className="text-emerald-400"><CheckCircle size={18}/></div>
                              </div>
                          ))}
                          
                          {/* Add New */}
                          <div className="mt-8 pt-8 border-t border-white/10">
                              <p className="text-xs text-white/40 mb-4 uppercase tracking-widest font-bold">Tune into a new frequency</p>
                              <div className="flex gap-3">
                                  <input 
                                    type="text" 
                                    value={connectInput}
                                    onChange={(e) => setConnectInput(e.target.value)}
                                    placeholder="Paste Public Key (npub1... or hex)" 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-xs text-white focus:outline-none focus:border-white/30 font-mono" 
                                  />
                                  <button onClick={handleFollow} className={`bg-white text-black px-6 rounded-full font-bold text-xs flex items-center gap-2 active-squish`}>
                                      <UserPlus size={14}/> Connect
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
        </div>
    </div>
  );
}