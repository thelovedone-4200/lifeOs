import React, { useState, useMemo } from 'react';
import { 
    Check, Flame, Calendar as CalendarIcon, LayoutGrid, 
    BarChart2, Trophy, MoreHorizontal, ArrowUpRight, Zap, Target,
    CheckCircle2, Circle, Activity
} from 'lucide-react';
import { getTodayString } from '../utils/helpers';
import { CHART_COLORS } from '../utils/constants';

interface HabitsPageProps {
    customHabits: any[];
    handleHabitCheck: (id: string, idx: number) => void;
    openHabitEdit: (h: any) => void;
    setNewItemType: (t: string) => void;
    setIsModalOpen: (o: boolean) => void;
    playSound: (type: any) => void;
}

export default function HabitsPage({
    customHabits, handleHabitCheck, openHabitEdit, setNewItemType, setIsModalOpen, playSound
}: HabitsPageProps) {
    const [viewMode, setViewMode] = useState<'today' | 'month'>('today');
    const todayDate = new Date();
    const currentDayIndex = todayDate.getDate() - 1; // 0-based index for array

    // --- COMPUTED STATS ---
    const stats = useMemo(() => {
        const totalActive = customHabits.length;
        if (totalActive === 0) return { completion: 0, bestStreak: 0, completedCount: 0 };

        const todayCompletions = customHabits.filter(h => h.completions[currentDayIndex]).length;
        const completionRate = Math.round((todayCompletions / totalActive) * 100);

        // Calculate best current streak across all habits
        // (Simplified logic based on consecutive checks ending at yesterday/today)
        let maxStreak = 0;
        customHabits.forEach(h => {
            let currentStreak = 0;
            // Check backwards from today
            for (let i = currentDayIndex; i >= 0; i--) {
                if (h.completions[i]) currentStreak++;
                else break; 
            }
            if (currentStreak > maxStreak) maxStreak = currentStreak;
        });

        return {
            completion: completionRate,
            bestStreak: maxStreak,
            completedCount: todayCompletions
        };
    }, [customHabits, currentDayIndex]);

    // --- RENDER HELPERS ---
    const getCategoryColor = (category: string) => {
        switch(category) {
            case 'Health': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Mind': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Create': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
            case 'Learn': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Social': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getCompletionColor = (percentage: number) => {
        if (percentage >= 80) return 'text-emerald-400';
        if (percentage >= 50) return 'text-blue-400';
        return 'text-white';
    };

    // --- MONTH HEATMAP GENERATOR ---
    const renderHeatmap = () => {
        const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
        
        return (
            <div className="glass-panel p-6 rounded-[2rem]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-white">Monthly Activity</h3>
                    <CalendarIcon size={16} className="text-white/40"/>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                    {/* Weekday Headers */}
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-bold text-white/30 uppercase pb-2">{d}</div>
                    ))}
                    
                    {/* Empty slots for start of month */}
                    {Array.from({ length: new Date(todayDate.getFullYear(), todayDate.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayIndex = i; // 0-based index matches our data structure
                        const habitsCount = customHabits.length;
                        const completedCount = customHabits.filter(h => h.completions[dayIndex]).length;
                        const intensity = habitsCount > 0 ? completedCount / habitsCount : 0;
                        
                        let bgClass = 'bg-white/5';
                        if (intensity > 0) bgClass = 'bg-emerald-900/40';
                        if (intensity >= 0.4) bgClass = 'bg-emerald-600/60';
                        if (intensity >= 0.7) bgClass = 'bg-emerald-500';
                        if (intensity === 1) bgClass = 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';

                        const isToday = dayIndex === currentDayIndex;

                        return (
                            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center relative group ${bgClass} ${isToday ? 'ring-1 ring-white' : ''}`}>
                                <span className={`text-[9px] font-bold ${intensity > 0.6 ? 'text-black' : 'text-white/50'}`}>{i + 1}</span>
                                {isToday && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-xs text-white/50">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded bg-white/5"></div>
                        <div className="w-3 h-3 rounded bg-emerald-900/40"></div>
                        <div className="w-3 h-3 rounded bg-emerald-600/60"></div>
                        <div className="w-3 h-3 rounded bg-emerald-500"></div>
                        <div className="w-3 h-3 rounded bg-emerald-400"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-32">
            
            {/* 1. Header & Date */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
                        {todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h1>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-emerald-400"/> Daily Wellness Tracker
                    </p>
                </div>
                <button onClick={() => { playSound('click'); setNewItemType('habitTracker'); setIsModalOpen(true); }} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active-squish">
                    <Check size={20} strokeWidth={3}/>
                </button>
            </div>

            {/* 2. Stats Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Completion Card */}
                <div className="glass-panel p-5 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={64} /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-500/20 rounded-full text-blue-400"><Target size={14}/></div>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Completion</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-bold ${getCompletionColor(stats.completion)}`}>{stats.completion}%</span>
                            <span className="text-xs text-white/40 font-medium">today</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${stats.completion}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div className="glass-panel p-5 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Flame size={64} /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-orange-500/20 rounded-full text-orange-400"><Flame size={14} fill="currentColor"/></div>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Best Streak</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-orange-400">{stats.bestStreak}</span>
                            <span className="text-xs text-white/40 font-medium">days</span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-3 font-medium">Keep the fire burning!</p>
                    </div>
                </div>

                {/* Habits Count Card */}
                <div className="glass-panel p-5 rounded-[2rem] relative overflow-hidden group md:col-span-1 col-span-1">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 size={64} /></div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-purple-500/20 rounded-full text-purple-400"><CheckCircle2 size={14}/></div>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Habits</span>
                        </div>
                         <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-purple-400">{customHabits.length}</span>
                            <span className="text-xs text-white/40 font-medium">active</span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-3 font-medium">{stats.completedCount} completed today</p>
                     </div>
                </div>
            </div>

            {/* 3. View Toggle */}
            <div className="flex justify-center">
                <div className="bg-white/5 p-1 rounded-full border border-white/10 flex shadow-inner">
                    <button 
                        onClick={() => { setViewMode('today'); playSound('click'); }} 
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all active-squish flex items-center gap-2 ${viewMode === 'today' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}
                    >
                        <LayoutGrid size={14}/> Today
                    </button>
                    <button 
                        onClick={() => { setViewMode('month'); playSound('click'); }} 
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all active-squish flex items-center gap-2 ${viewMode === 'month' ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'}`}
                    >
                        <CalendarIcon size={14}/> Month
                    </button>
                </div>
            </div>

            {/* 4. Main Content Area */}
            {viewMode === 'today' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-sm font-bold text-white">Today's Habits</h3>
                    </div>
                    
                    {customHabits.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-[2rem]">
                            <p className="text-sm text-white/40">No habits tracked yet.</p>
                            <button onClick={() => { playSound('click'); setNewItemType('habitTracker'); setIsModalOpen(true); }} className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Create your first habit</button>
                        </div>
                    ) : (
                        customHabits.map((habit) => {
                            const isCompleted = habit.completions[currentDayIndex];
                            
                            // Calculate current streak for this specific habit
                            let streak = 0;
                            for (let i = currentDayIndex; i >= 0; i--) {
                                if (habit.completions[i]) streak++; else break;
                            }

                            return (
                                <div key={habit.id} className={`glass-panel p-4 rounded-[1.5rem] flex items-center gap-4 group transition-all duration-300 ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'hover:bg-white/5'}`}>
                                    {/* Check Button */}
                                    <button 
                                        onClick={() => handleHabitCheck(habit.id, currentDayIndex)}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 active-squish shadow-sm ${isCompleted ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/5 border border-white/10 text-white/20 hover:border-white/30 hover:text-white'}`}
                                    >
                                        <Check size={24} strokeWidth={3} className={`transition-all duration-300 ${isCompleted ? 'scale-100' : 'scale-75'}`}/>
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0" onClick={() => openHabitEdit(habit)}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-base font-bold truncate transition-all ${isCompleted ? 'text-white/40 line-through' : 'text-white'}`}>
                                                {habit.name}
                                            </h4>
                                            {/* Streak Badge */}
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20">
                                                <Flame size={10} fill="currentColor"/> {streak}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(habit.category)}`}>
                                                {habit.category}
                                            </span>
                                            <span className="text-[10px] text-white/30 font-medium">
                                                {habit.duration} day challenge
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Insight Card (Bottom) */}
                    {customHabits.length > 0 && (
                        <div className="glass-panel p-6 rounded-[2rem] mt-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-full text-white"><Zap size={20}/></div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Today's Insight</h4>
                                    <p className="text-xs text-white/60 leading-relaxed">
                                        {stats.completion === 100 
                                            ? "Perfect day! You've crushed all your habits. Rest and recover for tomorrow." 
                                            : stats.completion >= 50 
                                                ? "You're over halfway there! Finish strong to keep your momentum building." 
                                                : "Small steps compound. Focus on completing just one more habit right now."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-2 duration-500">
                    {renderHeatmap()}
                    
                    <div className="mt-6 glass-panel p-6 rounded-[2rem]">
                        <h3 className="text-sm font-bold text-white mb-4">Recent Achievements</h3>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center">
                                <Trophy size={20}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Consistency King</h4>
                                <p className="text-[10px] text-white/50">Logged in for 7 days straight</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}