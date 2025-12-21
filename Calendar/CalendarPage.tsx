import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Lock, RefreshCw, Trash2 } from 'lucide-react';
import { getTodayString } from '../utils/helpers';

interface CalendarPageProps {
    tasks: any[];
    currentDate: Date;
    setCurrentDate: (d: Date) => void;
    selectedDate: string;
    setSelectedDate: (s: string) => void;
    handleTaskToggle: (id: string) => void;
    handleDeleteTask: (id: string) => void;
    playSound: (type: any) => void;
    setNewItemType: (t: string) => void;
    setNewItemDate: (d: string) => void;
    setIsModalOpen: (o: boolean) => void;
    getDayGrade: (d: string) => any;
}

export default function CalendarPage({
    tasks, currentDate, setCurrentDate, selectedDate, setSelectedDate, handleTaskToggle, handleDeleteTask, playSound, setNewItemType, setNewItemDate, setIsModalOpen, getDayGrade
}: CalendarPageProps) {
    
    const prevMonth = () => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); playSound('click'); };
    const nextMonth = () => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); playSound('click'); };
    
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-10"></div>);
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayTasks = tasks.filter((t: any) => t.date === dateStr);
            const isComplete = dayTasks.length > 0 && dayTasks.every((t: any) => t.status === 'Complete');
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === getTodayString();
            days.push(
                <button key={d} onClick={() => { setSelectedDate(dateStr); playSound('click'); }} className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition-all active-squish ${isSelected ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                    <span className={`text-xs font-bold ${isToday && !isSelected ? 'text-blue-400' : ''}`}>{d}</span>
                    {dayTasks.length > 0 && (<div className={`w-1 h-1 rounded-full mt-1 ${isComplete ? 'bg-emerald-400' : 'bg-white/50'}`}></div>)}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-32">
            <div className="flex justify-between items-center px-2">
            <h2 className={`text-xl font-bold flex items-center gap-2 text-white`}>Calendar</h2>
            <button onClick={() => { playSound('click'); setNewItemType('task'); setNewItemDate(selectedDate); setIsModalOpen(true); }} className={`text-xs bg-white text-black px-4 py-2 rounded-full font-bold active-squish`}>+ Task</button>
            </div>
            <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full active-squish"><ChevronLeft size={16} className="text-white"/></button>
                <span className="text-sm font-bold text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full active-squish"><ChevronRight size={16} className="text-white"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">{['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[10px] text-white/40 font-bold">{d}</span>)}</div>
            <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
            </div>
            
            <div className="glass-panel rounded-[2rem] p-6 min-h-[200px]">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <span className={`text-lg font-black text-white/80`}>{getDayGrade(selectedDate).grade}</span>
            </div>
            <div className="space-y-3">
                {tasks.filter((t:any) => t.date === selectedDate).length === 0 ? <p className="text-xs text-white/40 text-center py-8 italic">Silence is golden.</p> : 
                tasks.filter((t:any) => t.date === selectedDate).map((task: any) => {
                    const isPast = task.date < getTodayString();
                    return (
                    <div key={task.id} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${task.status === 'Complete' ? 'bg-white/5 border-transparent opacity-60' : `bg-white/10 border-white/5 hover:bg-white/15`} ${task.isSystem ? 'opacity-80' : ''}`}>
                    <button onClick={() => handleTaskToggle(task.id)} className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${task.status === 'Complete' ? `bg-white border-white` : 'border-white/40'} ${isPast || task.isSystem ? 'cursor-not-allowed opacity-50' : ''} active-squish`}>
                        {isPast || task.isSystem ? <Lock size={10} className="text-black"/> : (task.status === 'Complete' && <CheckCircle size={12} className="text-black" />)}
                    </button>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <span className={`text-sm block font-medium ${task.status === 'Complete' ? 'text-white/40 line-through' : 'text-white'}`}>{task.name}</span>
                            <div className="flex items-center gap-2">
                                {task.recurrence && task.recurrence !== 'none' && <RefreshCw size={10} className="text-white/40" />}
                                {!isPast && !task.isSystem && <button onClick={() => handleDeleteTask(task.id)} className="text-white/40 hover:text-rose-400 transition-colors active-squish"><Trash2 size={12} /></button>}
                            </div>
                        </div>
                    </div>
                    </div>
                )})}
            </div>
            </div>
        </div>
    );
}