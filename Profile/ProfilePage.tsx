import React, { useState } from 'react';
import { 
  Activity, Palette, Settings, User, Trophy, Zap, 
  Shield, Download, Upload, LogOut, ShoppingBag, 
  Moon, Lock, Check, Smartphone, Watch, Sun, Flame
} from 'lucide-react';
import { THEMES, SHOP_ITEMS, ACHIEVEMENTS } from '../utils/constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { getIcon } from '../utils/helpers';

interface ProfilePageProps {
  user: string | null;
  currencyXP: number;
  inventory: { items: string[], badges: string[] };
  stats: any;
  skills: any;
  tier: any;
  theme: any;
  setAppTheme: (theme: string) => void;
  showShop: boolean;
  setShowShop: (show: boolean) => void;
  showBackup: boolean;
  setShowBackup: (show: boolean) => void;
  showBioSettings: boolean;
  setShowBioSettings: (show: boolean) => void;
  sleepConfig: { sleep: string, wake: string };
  setSleepConfig: (config: { sleep: string, wake: string }) => void;
  handleExportData: () => void;
  handleImportData: () => void;
  buyItem: (item: any) => void;
  setUserName: (name: string | null) => void;
  setIsOnboarding: (isOnboarding: boolean) => void;
  setOnboardingStep: (step: number) => void;
  playSound: (type: 'click' | 'success' | 'hover' | 'toggle' | 'delete' | 'tap' | 'beat' | 'tone') => void;
  radarData: any[];
}

export default function ProfilePage({
  user,
  currencyXP,
  inventory,
  stats,
  tier,
  theme,
  setAppTheme,
  sleepConfig,
  setSleepConfig,
  handleExportData,
  handleImportData,
  buyItem,
  setUserName,
  setIsOnboarding,
  setOnboardingStep,
  playSound,
  radarData
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-32">
        
        {/* HERO PROFILE HEADER */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
            <div className="relative mb-6 group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Avatar Container */}
                <div className="w-28 h-28 rounded-full bg-black/40 border border-white/10 flex items-center justify-center relative backdrop-blur-sm z-10 shadow-2xl">
                    <User size={48} className="text-white/80" strokeWidth={1.5} />
                    
                    {/* Tier Badge */}
                    <div className="absolute -bottom-3 px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase rounded-full tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        {tier?.name || 'Novice'}
                    </div>
                </div>
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight text-center">{user || 'Traveler'}</h1>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                 <Zap size={14} className="text-emerald-400" fill="currentColor" /> 
                 <span className="text-sm font-mono font-bold text-white">{currencyXP.toLocaleString()} XP</span>
            </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-full mx-4 backdrop-blur-md">
            <button 
                onClick={() => { setActiveTab('status'); playSound('click'); }} 
                className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active-squish flex items-center justify-center gap-2 ${activeTab === 'status' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
                <Activity size={14} /> Status
            </button>
            <button 
                onClick={() => { setActiveTab('visuals'); playSound('click'); }} 
                className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active-squish flex items-center justify-center gap-2 ${activeTab === 'visuals' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
                <Palette size={14} /> Visuals
            </button>
            <button 
                onClick={() => { setActiveTab('system'); playSound('click'); }} 
                className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active-squish flex items-center justify-center gap-2 ${activeTab === 'system' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
                <Settings size={14} /> System
            </button>
        </div>

        {/* CONTENT AREA */}
        <div className="px-2">
            
            {/* --- STATUS TAB --- */}
            {activeTab === 'status' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest mb-2 relative z-10">Completion</span>
                            <div className="relative z-10 flex items-baseline">
                                <span className="text-4xl font-bold text-white">{stats.completionRate}</span>
                                <span className="text-sm text-white/40">%</span>
                            </div>
                        </div>
                         <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent"></div>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest mb-2 relative z-10">Streak</span>
                            <div className="relative z-10 flex items-center gap-2 text-orange-400">
                                <Flame size={24} fill="currentColor" /> 
                                <span className="text-4xl font-bold">{stats.streak}</span>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="glass-panel p-6 rounded-[2.5rem] relative min-h-[340px] flex flex-col items-center">
                         <div className="flex items-center gap-2 mb-6 self-start pl-2">
                            <Activity size={16} className="text-white/40" />
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Polymath Matrix</h3>
                         </div>
                         <div className="w-full h-[250px] relative -mt-4">
                             <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Balance" dataKey="A" stroke={theme.chart || "#fff"} strokeWidth={2} fill={theme.chart || "#fff"} fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Badges Grid */}
                    <div className="glass-panel p-6 rounded-[2.5rem]">
                        <div className="flex items-center gap-2 mb-6 pl-2">
                            <Trophy size={16} className="text-white/40" />
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Achievements</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {ACHIEVEMENTS.map(ach => {
                                 const owned = inventory.badges.includes(ach.id);
                                 return (
                                     <div key={ach.id} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${owned ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5 opacity-40'}`}>
                                         <div className={`p-2 rounded-full ${owned ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/20'}`}>
                                            {getIcon(ach.icon, "w-4 h-4")}
                                         </div>
                                         <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs font-bold text-white truncate">{ach.name}</span>
                                            <span className="text-[9px] text-white/40 truncate">{ach.desc}</span>
                                         </div>
                                     </div>
                                 )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- VISUALS TAB --- */}
            {activeTab === 'visuals' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="glass-panel p-6 rounded-[2.5rem]">
                         <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 pl-2">Atmosphere</h3>
                         <div className="grid grid-cols-1 gap-4">
                             {Object.entries(THEMES).map(([key, t]: [string, any]) => (
                                 <button 
                                    key={key}
                                    onClick={() => { setAppTheme(key); playSound('click'); }}
                                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 active-squish h-24 ${theme.name === key ? 'border-white ring-1 ring-white/50' : 'border-white/10 opacity-70 hover:opacity-100'}`}
                                 >
                                     {/* Background Gradient Preview */}
                                     <div className="absolute inset-0 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${t.blobs[0]}, ${t.blobs[1]})` }}></div>
                                     
                                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>

                                     <div className="relative z-10 flex items-center justify-between h-full px-6">
                                         <span className="text-lg font-bold text-white drop-shadow-md">{t.name}</span>
                                         {theme.name === key && (
                                             <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                                                 <Check size={16} strokeWidth={3} />
                                             </div>
                                         )}
                                     </div>
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
            )}

            {/* --- SYSTEM TAB --- */}
            {activeTab === 'system' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                     
                     {/* Bio-Rhythm */}
                     <div className="glass-panel p-6 rounded-[2.5rem]">
                         <div className="flex items-center gap-2 mb-6 pl-2">
                             <Moon size={16} className="text-white/40"/>
                             <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Bio-Rhythm</h3>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                                 <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-wider">
                                     <Moon size={12} /> Bedtime
                                 </div>
                                 <input type="time" value={sleepConfig.sleep} onChange={(e) => setSleepConfig({...sleepConfig, sleep: e.target.value})} className="bg-transparent text-xl font-mono text-white text-center focus:outline-none w-full" />
                             </div>
                             <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                                 <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-wider">
                                     <Sun size={12} /> Wake Up
                                 </div>
                                 <input type="time" value={sleepConfig.wake} onChange={(e) => setSleepConfig({...sleepConfig, wake: e.target.value})} className="bg-transparent text-xl font-mono text-white text-center focus:outline-none w-full" />
                             </div>
                         </div>
                     </div>

                     {/* Marketplace */}
                     <div className="glass-panel p-6 rounded-[2.5rem]">
                         <div className="flex items-center gap-2 mb-6 pl-2">
                             <ShoppingBag size={16} className="text-white/40"/>
                             <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Exchange</h3>
                         </div>
                         <div className="space-y-3">
                             {SHOP_ITEMS.map(item => (
                                 <button key={item.id} onClick={() => buyItem(item)} className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all active-squish">
                                     <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                         {getIcon(item.icon, "w-5 h-5")}
                                     </div>
                                     <div className="text-left flex-1">
                                         <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{item.name}</div>
                                         <div className="text-[10px] text-white/40">{item.desc}</div>
                                     </div>
                                     <div className="px-3 py-1.5 bg-black/40 rounded-full text-xs font-mono text-emerald-400 font-bold border border-white/5 whitespace-nowrap">
                                         {item.cost} XP
                                     </div>
                                 </button>
                             ))}
                         </div>
                     </div>

                     {/* Data Management */}
                     <div className="glass-panel p-6 rounded-[2.5rem]">
                         <div className="flex items-center gap-2 mb-6 pl-2">
                             <Shield size={16} className="text-white/40"/>
                             <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Memory Core</h3>
                         </div>
                         <div className="grid grid-cols-2 gap-3 mb-4">
                             <button onClick={handleExportData} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 active-squish group">
                                 <Download size={20} className="text-white/60 group-hover:text-white transition-colors" />
                                 <span className="text-[10px] font-bold text-white/60 uppercase">Backup</span>
                             </button>
                             <button onClick={handleImportData} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 active-squish group">
                                 <Upload size={20} className="text-white/60 group-hover:text-white transition-colors" />
                                 <span className="text-[10px] font-bold text-white/60 uppercase">Restore</span>
                             </button>
                         </div>
                         <button onClick={() => { setUserName(null); setIsOnboarding(true); setOnboardingStep(0); playSound('delete'); }} className="w-full p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-2 text-rose-400 font-bold text-xs uppercase hover:bg-rose-500/20 active-squish transition-colors">
                             <LogOut size={16} /> Reset Identity
                         </button>
                     </div>
                </div>
            )}
        </div>
    </div>
  );
}