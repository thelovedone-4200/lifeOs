import React, { useEffect, useRef } from 'react';
import { Quote, Lightbulb, RotateCcw, Moon, CheckCircle, Lock } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { getTodayString } from '../utils/helpers';

// LIQUID WAVE VISUALIZER
const LiquidWave = ({ theme }: { theme: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let t = 0;
        let animationFrameId: number;
        
        const render = () => {
            t += 0.015;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const w = canvas.width;
            const h = canvas.height;
            
            ctx.clearRect(0, 0, w, h);
            
            // Draw Sine Waves
            const drawWave = (offset: number, amplitude: number, color: string) => {
                ctx.beginPath();
                ctx.moveTo(0, h/2);
                for(let x=0; x<w; x+=5) {
                    const y = Math.sin(x * 0.01 + t + offset) * amplitude + (h/2);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(w, h);
                ctx.lineTo(0, h);
                ctx.fillStyle = color;
                ctx.fill();
            };
            
            drawWave(0, 20, 'rgba(255, 255, 255, 0.05)');
            drawWave(2, 15, 'rgba(255, 255, 255, 0.1)');
            
            animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60 rounded-[2rem]" />;
};

interface HomePageProps {
    tasks: any[];
    skills: any;
    protocol: string;
    sleepConfig: any;
    timeLeft: number;
    timerDuration: number;
    isTimerRunning: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    setTimer: (mins: number) => void;
    handleSleep: () => void;
    handleTaskToggle: (id: string) => void;
    getOracleCommand: () => string;
    theme: any;
    playSound: (type: any) => void;
    setNewItemType: (t: string) => void;
    setNewItemDate: (d: string) => void;
    setIsModalOpen: (o: boolean) => void;
    radarData: any[];
    formatTime: (s: number) => string;
}

export default function HomePage({
    tasks, skills, protocol, sleepConfig, timeLeft, timerDuration, isTimerRunning,
    toggleTimer, resetTimer, setTimer, handleSleep, handleTaskToggle, getOracleCommand,
    theme, playSound, setNewItemType, setNewItemDate, setIsModalOpen, radarData, formatTime
}: HomePageProps) {
    const homeTasks = tasks.filter((t: any) => t.date === getTodayString());

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out relative pb-32">
            {/* 1. Quote & Oracle */}
            <div className="flex gap-2 relative z-10">
                <div className="flex-1 glass-panel p-5 rounded-[2rem] flex flex-col justify-between relative overflow-hidden h-auto min-h-[10rem] animate-float group">
                    <LiquidWave theme={theme} />
                    <div className={`absolute top-0 right-0 p-4 opacity-50 z-10`}><Quote size={16} className="text-white" /></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 block">Protocol</span>
                        <p className="text-sm font-medium text-white italic leading-relaxed">"{protocol}"</p>
                    </div>
                </div>

                <div className={`flex-1 glass-panel p-5 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-auto min-h-[10rem] animate-float-delayed`}>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-[10px] font-bold text-white/50 uppercase tracking-widest`}>Insight</h3>
                            <div className={`text-white animate-pulse`}><Lightbulb size={14} /></div>
                        </div>
                        <p className="text-sm text-white font-medium leading-relaxed font-mono mt-2">{getOracleCommand()}</p>
                    </div>
                </div>
            </div>

            {/* 2. Controls: Timer & Sleep */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
                    {/* Timer */}
                    <div className="glass-panel p-4 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden h-40">
                        <div className="flex justify-between w-full items-center mb-1 z-10 absolute top-3 left-0 px-4">
                            <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Focus</span>
                            <button onClick={resetTimer} className="text-white/50 hover:text-white transition-colors active:rotate-180 duration-300"><RotateCcw size={12} /></button>
                        </div>
                        <div className="relative w-20 h-20 flex items-center justify-center cursor-pointer active-squish mt-2" onClick={toggleTimer}>
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                            <circle cx="50%" cy="50%" r="36" stroke="white" strokeWidth="4" fill="transparent" className={`transition-all duration-500 ease-out`} strokeDasharray={226} strokeDashoffset={226 * (1 - timeLeft / timerDuration)} strokeLinecap="round" />
                        </svg>
                        <span className="text-lg font-mono font-bold text-white">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="flex gap-1 mt-3 z-10">
                        <button onClick={() => setTimer(25)} className={`text-[9px] font-bold px-3 py-1 rounded-full border transition-all active-squish ${timerDuration === 1500 ? 'bg-white text-black border-transparent' : 'border-white/20 text-white/50'}`}>25m</button>
                        <button onClick={() => setTimer(90)} className={`text-[9px] font-bold px-3 py-1 rounded-full border transition-all active-squish ${timerDuration === 5400 ? 'bg-white text-black border-transparent' : 'border-white/20 text-white/50'}`}>90m</button>
                        </div>
                    </div>

                    {/* Sleep */}
                    <div className="glass-panel p-4 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden h-40">
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest absolute top-3 left-4">Sleep</span>
                        <button onClick={handleSleep} className={`w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-2 active-squish transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group`}>
                            <Moon size={24} className={`text-white group-hover:scale-110 transition-transform`} />
                        </button>
                        <div className="text-center">
                            <span className="text-[10px] text-white/60 block mb-1">Target: <span className="text-white font-mono">{sleepConfig.sleep}</span></span>
                        </div>
                    </div>
            </div>

            {/* 3. Radar Chart */}
            <div className="glass-panel rounded-[2rem] p-4 relative overflow-hidden">
                <div className="flex justify-between items-center mb-2 px-2">
                    <h2 className="text-sm font-bold text-white">Balance</h2>
                    <span className={`text-[10px] font-bold text-white/70 bg-white/10 px-2 py-1 rounded-full`}>Score</span>
                </div>
                <div className="h-[200px] w-full relative -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Balance" dataKey="A" stroke="white" fill="white" fillOpacity={0.2} />
                    </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Daily Ops */}
            <div className="glass-panel rounded-[2rem] p-6 mb-20">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-white">Today's Flow</h2>
                <span className="text-[10px] text-white/50">{getTodayString()}</span>
                </div>
                <div className="space-y-3">
                {homeTasks.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-xs text-white/40">No flow yet.</p>
                        <button onClick={() => { playSound('click'); setNewItemType('task'); setNewItemDate(getTodayString()); setIsModalOpen(true); }} className={`mt-4 text-xs bg-white text-black px-4 py-2 rounded-full font-bold active-squish`}>+ Add Task</button>
                    </div>
                ) : (
                    homeTasks.slice(0, 3).map((task: any) => {
                        const isPast = task.date < getTodayString();
                        return (
                        <div key={task.id} onClick={() => handleTaskToggle(task.id)} className="flex items-center gap-4 py-3 px-3 cursor-pointer group hover:bg-white/5 rounded-xl transition-colors">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-500 ${task.status === 'Complete' ? `bg-white border-white` : 'border-white/30 group-hover:border-white'} ${isPast ? 'opacity-50' : ''}`}>
                            {task.status === 'Complete' && <CheckCircle size={12} className="text-black" />}
                            {isPast && !task.status && <Lock size={10} className="text-white/50" />}
                        </div>
                        <div className="flex-1">
                            <span className={`text-sm font-medium block transition-all ${task.status === 'Complete' ? 'text-white/30 line-through' : 'text-white'}`}>
                            {task.name}
                            </span>
                            <span className={`text-[10px] text-white/40`}>{task.category}</span>
                        </div>
                        </div>
                    )})
                )}
                </div>
            </div>
        </div>
    );
}