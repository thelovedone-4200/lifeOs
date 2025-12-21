import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Zap, GitBranch, Dna, Trophy, Activity, Flame, Eye, Gift, Repeat, Sun, Star, Radio, Feather, FlipVertical, Divide, Shuffle, Skull, Shield, Calculator, Binary, CalendarDays, Hash, Move, EyeOff, Music, Mic, Palette as PaletteIcon, Lock, Code, Book, Layers, PenTool, Dumbbell, Users, Lightbulb, FileText, ArrowLeft, HelpCircle, Delete, CheckCircle, XCircle
} from 'lucide-react';

/**
 * =================================================================================
 * ⚙️ TOOLS CONSTANTS & HELPERS
 * =================================================================================
 */

const PILLAR_KEYS = ['Learn', 'Create', 'Mind', 'Health', 'Social'];

const MORSE_CODE: Record<string, string> = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----' };
const NATO_PHONETIC: Record<string, string> = { 'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet', 'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee', 'Z': 'Zulu' };
const OBLIQUE_STRATEGIES = [
    "Take a break.", "Try it a different way.", "Ask for help.", "Simplify it.", "Just start.", "What would a friend do?", "Work backwards.", "Focus on the easy part first.", "Don't break the silence.", "What to increase? What to reduce?", "Use an old idea.", "Discard an axiom."
];

const MORSE_TO_TEXT: Record<string, string> = Object.entries(MORSE_CODE).reduce((acc, [char, code]) => {
    acc[code] = char;
    return acc;
}, {} as Record<string, string>);

const MICRO_ACTIONS = [
    "Drink a glass of water.", "Do 5 jumping jacks.", "Read one page.", "Write one sentence.", "Take 3 deep breaths.", "Clear your desk.", "Send a nice message.", "Stretch for 1 minute."
];
const VIRTUES = [
    "Patience", "Honesty", "Discipline", "Kindness", "Focus", "Gratitude", "Courage", "Humility", "Temperance", "Justice", "Wisdom", "Hope", "Love"
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dist = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);

const getTodayString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

/**
 * =================================================================================
 * 🧩 VISUALIZATION COMPONENTS
 * =================================================================================
 */

const KnowledgeGraph = ({ notes, tasks, theme }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodes = useRef<any[]>([]);
    
    useEffect(() => {
        // Create nodes from Notes + Tasks
        const noteNodes = notes.map((n: any) => ({ id: n.id, type: 'note', text: n.title || n.content.substring(0,10), color: '#34d399' }));
        const taskNodes = tasks.filter((t:any) => t.status === 'To Do').slice(0, 10).map((t: any) => ({ id: t.id, type: 'task', text: t.name, color: '#60a5fa' }));
        
        nodes.current = [...noteNodes, ...taskNodes].map(n => ({
            ...n,
            x: Math.random() * 300,
            y: Math.random() * 300,
            vx: 0, vy: 0
        }));

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let frame = 0;
        const runPhysics = () => {
            if (!ctx) return;
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;
            const REPULSION = 500;
            const CENTER_PULL = 0.02;

            ctx.clearRect(0,0,width,height);
            
            nodes.current.forEach((node, i) => {
                // Repulsion
                nodes.current.forEach((other, j) => {
                    if (i === j) return;
                    const d = dist(node.x, node.y, other.x, other.y) + 1;
                    const force = REPULSION / (d * d);
                    const dx = (node.x - other.x) / d;
                    const dy = (node.y - other.y) / d;
                    node.vx += dx * force;
                    node.vy += dy * force;
                });
                
                // Gravity to center
                node.vx += (width/2 - node.x) * CENTER_PULL;
                node.vy += (height/2 - node.y) * CENTER_PULL;
                
                // Friction
                node.vx *= 0.9;
                node.vy *= 0.9;
                node.x += node.vx;
                node.y += node.vy;

                // Draw Link (if close)
                nodes.current.forEach((other, j) => {
                     if (i>=j) return;
                     const d = dist(node.x, node.y, other.x, other.y);
                     if (d < 100) {
                         ctx.beginPath();
                         ctx.moveTo(node.x, node.y);
                         ctx.lineTo(other.x, other.y);
                         ctx.strokeStyle = "rgba(255,255,255,0.1)";
                         ctx.globalAlpha = 1 - (d/100);
                         ctx.stroke();
                         ctx.globalAlpha = 1;
                     }
                });

                // Draw Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.type === 'note' ? 4 : 3, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.font = '9px monospace';
                ctx.fillText(node.text.substring(0, 15), node.x + 6, node.y + 3);
            });
            frame = requestAnimationFrame(runPhysics);
        };
        runPhysics();
        return () => cancelAnimationFrame(frame);
    }, [notes, tasks, theme]);

    return <canvas ref={canvasRef} className="w-full h-[300px] cursor-crosshair bg-black/20 rounded-2xl border border-white/5" />;
};

const ConceptMap = ({ tasks, theme }: any) => {
    const activeTasks = tasks.filter((t:any) => t.status === 'To Do').slice(0, 8);
    const cx = 150; 
    const cy = 150;
    const r = 100;

    return (
        <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Center User Node */}
            <circle cx={cx} cy={cy} r="20" fill="#ffffff" fillOpacity="0.1" stroke="white" strokeWidth="1" />
            <text x={cx} y={cy} dy="4" textAnchor="middle" fill="white" fontSize="8" className="font-mono">ME</text>

            {/* Pillar Nodes */}
            {PILLAR_KEYS.map((p, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI/2;
                const px = cx + Math.cos(angle) * 60;
                const py = cy + Math.sin(angle) * 60;
                return (
                    <g key={p}>
                        <line x1={cx} y1={cy} x2={px} y2={py} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <circle cx={px} cy={py} r="12" fill="black" stroke="white" strokeWidth="1" />
                        <text x={px} y={py} dy="3" textAnchor="middle" fill="white" fontSize="5" className="font-bold uppercase">{p.substring(0,4)}</text>
                    </g>
                );
            })}

            {/* Task Leaf Nodes */}
            {activeTasks.map((t:any, i:number) => {
                const angle = (i / activeTasks.length) * Math.PI * 2;
                const tx = cx + Math.cos(angle) * r;
                const ty = cy + Math.sin(angle) * r;
                // Find pillar index
                const pIdx = PILLAR_KEYS.indexOf(t.category);
                const pAngle = (pIdx / 5) * Math.PI * 2 - Math.PI/2;
                const px = cx + Math.cos(pAngle) * 60;
                const py = cy + Math.sin(pAngle) * 60;

                return (
                    <g key={t.id}>
                        <line x1={px} y1={py} x2={tx} y2={ty} stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                        <circle cx={tx} cy={ty} r="4" fill="#3b82f6" />
                        <text x={tx} y={ty + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6" className="font-mono">{t.name.substring(0,8)}..</text>
                    </g>
                );
            })}
        </svg>
    );
};

const MementoMoriView = ({ dob, theme, onReset }: { dob: string, theme: any, onReset: () => void }) => {
    const totalWeeks = 4680; // 90 years
    const weeksLived = React.useMemo(() => {
        const birth = new Date(dob);
        const now = new Date();
        const diff = now.getTime() - birth.getTime();
        return Math.floor(diff / (1000 * 3600 * 24 * 7));
    }, [dob]);

    const [renderedWeeks, setRenderedWeeks] = useState(0);

    useEffect(() => {
        let current = 0;
        const step = Math.max(1, Math.ceil(weeksLived / 60)); // Animate over ~1 second
        const interval = setInterval(() => {
            current += step;
            if (current >= weeksLived) {
                current = weeksLived;
                clearInterval(interval);
            }
            setRenderedWeeks(current);
        }, 16);
        return () => clearInterval(interval);
    }, [weeksLived]);

    const percentage = ((renderedWeeks / totalWeeks) * 100).toFixed(4);

    return (
        <div className="space-y-6 h-full flex flex-col">
             <div className="flex justify-between items-end border-b border-white/10 pb-4 shrink-0">
                <div onDoubleClick={onReset} className="cursor-pointer">
                    <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">My Life</h3>
                    <div className="text-3xl font-serif font-bold text-white tracking-tighter tabular-nums">
                        {percentage}%
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest block">Weeks</span>
                    <span className={`text-xl font-mono font-bold text-white tabular-nums`}>{renderedWeeks.toLocaleString()}</span>
                    <span className="text-xs text-white/60"> / 4,680</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-[300px] flex justify-center">
                 <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[2px] content-start w-full max-w-[400px]">
                    {Array.from({length: 90}).map((_, yearIdx) => (
                         <React.Fragment key={yearIdx}>
                            {Array.from({length: 52}).map((_, weekIdx) => {
                                const absWeek = (yearIdx * 52) + weekIdx;
                                const isLived = absWeek < renderedWeeks;
                                const isCurrent = absWeek === weeksLived;
                                
                                return (
                                    <div 
                                        key={absWeek} 
                                        className={`
                                            h-1 w-1 rounded-full transition-colors duration-75
                                            ${isLived ? 'bg-white shadow-[0_0_2px_rgba(255,255,255,0.3)]' : 'bg-white/5'}
                                            ${isCurrent ? `bg-white animate-pulse scale-150 z-10 shadow-[0_0_8px_currentColor]` : ''}
                                        `}
                                    />
                                );
                            })}
                         </React.Fragment>
                    ))}
                 </div>
            </div>
            <p className="text-center font-serif italic text-white/50 text-xs shrink-0 pt-4">"Make every week count."</p>
        </div>
    );
};

/**
 * =================================================================================
 * 🛠️ TOOLS PAGE COMPONENT
 * =================================================================================
 */

interface ToolsPageProps {
  theme: any;
  tasks: any[];
  notes: any[];
  setNotes: (n: any[]) => void;
  flashcards: any[];
  setFlashcards: (f: any[]) => void;
  readingList: any[];
  setReadingList: (r: any[]) => void;
  nexusState: any;
  setNexusState: (s: any) => void;
  playSound: (type: 'click' | 'success' | 'hover' | 'toggle' | 'delete' | 'tap' | 'beat' | 'tone') => void;
  showToast: (msg: string) => void;
  onAddNote: (title: string, content: string) => void; 
  onExperienceGain: (amount: number, reason: string) => void;
}

export default function ToolsPage({
  theme,
  tasks,
  notes,
  setNotes,
  flashcards,
  setFlashcards,
  readingList,
  setReadingList,
  nexusState,
  setNexusState,
  playSound,
  showToast,
  onAddNote, 
  onExperienceGain
}: ToolsPageProps) {

  // Local State
  const [nexusActiveTool, setNexusActiveTool] = useState<string | null>(null);
  const [showGameHelp, setShowGameHelp] = useState(false);
  const [nexusInput, setNexusInput] = useState('');
  const [nexusOutput, setNexusOutput] = useState('');
  const [cipherMode, setCipherMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
  const [tempDob, setTempDob] = useState('');
  const [gameState, setGameState] = useState<any>({ score: 0, status: 'idle', question: null, answer: '' });
  const [metronomeInterval, setMetronomeInterval] = useState<any>(null);

  // Effects
  useEffect(() => {
      return () => { if (metronomeInterval) clearInterval(metronomeInterval); };
  }, [metronomeInterval]);

  useEffect(() => {
    // Reset tool state on tool switch
    setNexusInput('');
    setNexusOutput('');
    setGameState({ score: 0, status: 'idle', question: null, answer: '' });
    setShowGameHelp(false);
  }, [nexusActiveTool]);

  // Game/Tool Logic Handlers
  const textToMorse = (text: string) => text.toUpperCase().split('').map(c => MORSE_CODE[c] || c).join(' ');
  const textToNATO = (text: string) => text.toUpperCase().split('').map(c => NATO_PHONETIC[c] || c).join(' ');

  const handleCipher = () => {
      if (!nexusInput) return;
      if (nexusActiveTool === 'Caesar Cipher') {
           const shift = parseInt(nexusOutput) || 3; 
           const res = nexusInput.split('').map(char => {
              if (char.match(/[a-z]/i)) {
                  const code = char.charCodeAt(0);
                  const isUpper = code >= 65 && code <= 90;
                  const base = isUpper ? 65 : 97;
                  return String.fromCharCode(((code - base + shift) % 26) + base);
              }
              return char;
           }).join('');
           setNexusOutput(res);
      } else {
           const m = textToMorse(nexusInput);
           const n = textToNATO(nexusInput);
           setNexusOutput(`MORSE:\n${m}\n\nNATO:\n${n}`);
      }
      playSound('success');
  };

  const handleMorseInput = (char: string) => {
      playSound('tap');
      setNexusInput(prev => prev + char);
      const code = (nexusInput + char).trim();
      const chars = code.split(' ');
      const decoded = chars.map(c => MORSE_TO_TEXT[c] || '?').join('');
      setNexusOutput(decoded);
  };
  
  const handleMorseBackspace = () => {
      playSound('delete');
      const newVal = nexusInput.slice(0, -1);
      setNexusInput(newVal);
      const code = newVal.trim();
      const chars = code.split(' ');
      const decoded = chars.map(c => MORSE_TO_TEXT[c] || '').join('');
      setNexusOutput(decoded);
  };

  const startMentalMath = () => {
      const ops = ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a = Math.floor(Math.random() * 20) + 2;
      let b = Math.floor(Math.random() * 20) + 2;
      if (op === '*') { a = Math.floor(Math.random() * 12); b = Math.floor(Math.random() * 12); }
      const q = `${a} ${op} ${b}`;
      let ans = 0;
      if (op === '+') ans = a + b;
      if (op === '-') ans = a - b;
      if (op === '*') ans = a * b;
      setGameState({ score: 0, status: 'playing', question: q, answer: ans, input: '' });
      playSound('click');
  };

  const checkMath = () => {
      if (parseInt(gameState.input) === gameState.answer) {
          playSound('success');
          onExperienceGain(20, "Mental Calculation");
          const ops = ['+', '-', '*'];
          const op = ops[Math.floor(Math.random() * ops.length)];
          let a = Math.floor(Math.random() * 50);
          let b = Math.floor(Math.random() * 50);
          if (op === '*') { a = Math.floor(Math.random() * 15); b = Math.floor(Math.random() * 15); }
          const q = `${a} ${op} ${b}`;
          let ans = 0;
          if (op === '+') ans = a + b;
          if (op === '-') ans = a - b;
          if (op === '*') ans = a * b;
          setGameState((prev: any) => ({ ...prev, score: prev.score + 1, question: q, answer: ans, input: '' }));
      } else {
          playSound('delete');
          showToast("Incorrect");
          setGameState((prev: any) => ({ ...prev, input: '' }));
      }
  };

  const startBinary = () => {
      const num = Math.floor(Math.random() * 63) + 1;
      setGameState({ score: 0, status: 'playing', question: num, answer: num.toString(2), input: '' });
      playSound('click');
  };

  const checkBinary = () => {
      if (gameState.input === gameState.answer) {
          playSound('success');
          onExperienceGain(20, "Binary Decoded");
          const num = Math.floor(Math.random() * 255) + 1;
          setGameState((prev: any) => ({ ...prev, score: prev.score + 1, question: num, answer: num.toString(2), input: '' }));
      } else {
          playSound('delete');
          setGameState((prev: any) => ({ ...prev, input: '' }));
      }
  };

  const startDoomsday = () => {
      const start = new Date(new Date().getFullYear(), 0, 1);
      const end = new Date(new Date().getFullYear(), 11, 31);
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const day = date.getDay(); 
      setGameState({ score: 0, status: 'playing', question: date.toDateString(), answer: day });
      playSound('click');
  };
  
  const checkDoomsday = (dayIdx: number) => {
      if (dayIdx === gameState.answer) {
          playSound('success');
          onExperienceGain(20, "Day Found");
          const start = new Date(1900, 0, 1);
          const end = new Date(2100, 11, 31);
          const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
          setGameState((prev: any) => ({ ...prev, score: prev.score + 1, question: date.toDateString(), answer: date.getDay() }));
      } else {
          playSound('delete');
          showToast("Incorrect");
      }
  };

  const startDigitSpan = () => {
      const len = 3;
      const digits = Array.from({length: len}, () => Math.floor(Math.random() * 10)).join('');
      setGameState({ status: 'memorize', question: digits, answer: digits, input: '', level: len });
      playSound('click');
      setTimeout(() => setGameState((prev: any) => ({ ...prev, status: 'recall' })), 2000);
  };

  const checkDigitSpan = () => {
      if (gameState.input === gameState.answer) {
          playSound('success');
          onExperienceGain(25, "Memory Strengthened");
          const newLen = gameState.level + 1;
          const digits = Array.from({length: newLen}, () => Math.floor(Math.random() * 10)).join('');
          setGameState((prev: any) => ({ ...prev, status: 'memorize', question: digits, answer: digits, input: '', level: newLen }));
          setTimeout(() => setGameState((prev: any) => ({ ...prev, status: 'recall' })), 2000);
      } else {
          playSound('delete');
          setGameState((prev: any) => ({ ...prev, status: 'fail' }));
      }
  };

  const handleFeynman = () => {
      const words = nexusInput.split(' ');
      const jargon = words.filter(w => w.length > 9);
      if (jargon.length > 0) {
          setNexusOutput(`Too complex: ${jargon.join(', ')}. Simplify it.`);
          playSound('delete');
      } else {
          setNexusOutput("Good explanation.");
          playSound('success');
          onAddNote('Simplifier Output', nexusInput);
          onExperienceGain(15, "Insight Simplified");
      }
  };

  const handleRegret = async () => {
      const today = getTodayString();
      if (nexusState.regretProtocol && nexusState.regretProtocol.date === today) {
          setNexusOutput(nexusState.regretProtocol.action); playSound('success'); return;
      }
      setNexusOutput("Generating..."); playSound('click');
      const action = MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)];
      setNexusState((prev: any) => ({ ...prev, regretProtocol: { date: today, action: action } }));
      setNexusOutput(action); 
      playSound('success');
      onExperienceGain(15, "Decision Made");
  };

  const handleMementoSetup = () => { if(!tempDob) return; playSound('success'); setNexusState((prev: any) => ({ ...prev, dob: tempDob })); };
  const handleMementoReset = () => { playSound('delete'); setNexusState((prev: any) => ({ ...prev, dob: null })); }

  const toggleVirtue = (index: number) => {
      playSound('click');
      const today = getTodayString();
      setNexusState((prev: any) => {
          const currentVirtues = prev.virtues[today] || Array(VIRTUES.length).fill(false);
          const newVirtues = [...currentVirtues];
          newVirtues[index] = !newVirtues[index];
          if (!currentVirtues[index]) {
              onExperienceGain(10, "Virtue Practiced");
          }
          return { ...prev, virtues: { ...prev.virtues, [today]: newVirtues } };
      });
  };

  const getObliqueStrategy = () => {
      const s = OBLIQUE_STRATEGIES[Math.floor(Math.random() * OBLIQUE_STRATEGIES.length)];
      setNexusOutput(s);
      playSound('success');
  };

  const renderGameHelp = () => {
      let content = null;
      switch(nexusActiveTool) {
          case 'Doomsday Algorithm': content = <p className="text-xs text-slate-300">Find the day of the week for any date.</p>; break;
          case 'Binary Practice': content = <p className="text-xs text-slate-300">Convert decimal numbers to binary.</p>; break;
          case 'Memory Test': content = <p className="text-xs text-slate-300">Remember the digits displayed.</p>; break;
          default: content = <p className="text-xs text-slate-300">Follow the instructions on screen.</p>;
      }
      return (
          <div className="mb-4 bg-white/5 p-4 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2"><Brain size={12}/> Help</h4>
              {content}
          </div>
      );
  };

  if (nexusActiveTool === 'Graph') {
    return (
         <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-32">
            <div className="flex items-center gap-4 px-2 mb-4">
                <button onClick={() => { playSound('click'); setNexusActiveTool(null); }} className="p-2 bg-white/10 rounded-full active-squish"><ArrowLeft size={20} className="text-white"/></button>
                <h2 className="text-xl font-bold text-white">Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="glass-panel p-6 rounded-[2rem]">
                     <h3 className="text-xs font-bold text-white/50 uppercase mb-2">Graph</h3>
                     <KnowledgeGraph notes={notes} tasks={tasks} theme={theme} />
                 </div>
                 <div className="glass-panel p-6 rounded-[2rem]">
                     <h3 className="text-xs font-bold text-white/50 uppercase mb-2">Map</h3>
                     <div className="h-[300px] bg-black/20 rounded-2xl border border-white/5 p-2">
                         <ConceptMap tasks={tasks} theme={theme} />
                     </div>
                 </div>
            </div>
         </div>
    );
  }

  if (nexusActiveTool) {
     return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-32">
          <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center gap-4">
                  <button onClick={() => { playSound('click'); setNexusActiveTool(null); }} className="p-2 bg-white/10 rounded-full active-squish"><ArrowLeft size={20} className="text-white"/></button>
                  <h2 className="text-xl font-bold text-white">{nexusActiveTool}</h2>
              </div>
              <button onClick={() => setShowGameHelp(!showGameHelp)} className="p-2 text-white/50 hover:text-white transition-colors"><HelpCircle size={20}/></button>
          </div>
          
          {showGameHelp && renderGameHelp()}

          <div className="glass-panel p-6 rounded-[2rem] min-h-[50vh]">
              {/* --- KNOWLEDGE TOOLS --- */}
              {nexusActiveTool === 'Quick Notes' && (
                  <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                          <input type="text" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none" placeholder="Write something..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} onKeyDown={(e) => {
                              if (e.key === 'Enter' && nexusInput.trim()) {
                                  const newNote = { id: `n${Date.now()}`, title: nexusInput, content: '', date: new Date().toISOString() };
                                  setNotes([newNote, ...notes]);
                                  setNexusInput('');
                                  playSound('success');
                                  onExperienceGain(10, "Note Added");
                              }
                          }} />
                          <button onClick={() => { if(nexusInput.trim()) { setNotes([{ id: `n${Date.now()}`, title: nexusInput, content: '', date: new Date().toISOString() }, ...notes]); setNexusInput(''); playSound('success'); onExperienceGain(10, "Note Added"); } }} className="w-full py-3 bg-emerald-500 rounded-full text-white font-bold text-xs active-squish">ADD</button>
                      </div>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                          {notes.length === 0 && <p className="text-white/40 text-xs italic text-center py-4">No notes yet.</p>}
                          {notes.map((note: any) => (
                              <div key={note.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center group">
                                  <span className="text-sm text-white">{note.title}</span>
                                  <button onClick={() => { setNotes(notes.filter((n:any) => n.id !== note.id)); playSound('delete'); }} className="text-white/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><Delete size={16}/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {nexusActiveTool === 'Flashcards' && (
                   <div className="space-y-6 text-center">
                       {gameState.status === 'idle' ? (
                           <>
                              <p className="text-white/40 text-xs mb-4">Add questions and answers to memorize.</p>
                              <div className="flex flex-col gap-3 mb-6">
                                  <input className="w-full bg-black/20 p-4 rounded-2xl text-sm text-white border border-white/10" placeholder="Question" id="srs-q" />
                                  <input className="w-full bg-black/20 p-4 rounded-2xl text-sm text-white border border-white/10" placeholder="Answer" id="srs-a" />
                                  <button onClick={() => {
                                      const q = (document.getElementById('srs-q') as HTMLInputElement).value;
                                      const a = (document.getElementById('srs-a') as HTMLInputElement).value;
                                      if (q && a) {
                                          setFlashcards([...flashcards, { id: Date.now(), q, a, box: 0, nextReview: Date.now() }]);
                                          playSound('success');
                                          onExperienceGain(10, "Card Created");
                                          (document.getElementById('srs-q') as HTMLInputElement).value = '';
                                          (document.getElementById('srs-a') as HTMLInputElement).value = '';
                                      }
                                  }} className="w-full py-3 bg-emerald-500 rounded-full text-white font-bold text-xs active-squish">Add Card</button>
                              </div>
                              <button onClick={() => {
                                  const due = flashcards.filter((f:any) => f.nextReview <= Date.now());
                                  if (due.length > 0) {
                                      setGameState({ status: 'review', queue: due, currentIdx: 0, showAnswer: false });
                                      playSound('click');
                                  } else {
                                      showToast("No cards due for review.");
                                  }
                              }} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold uppercase tracking-widest active-squish">Start Review ({flashcards.filter((f:any) => f.nextReview <= Date.now()).length})</button>
                           </>
                       ) : gameState.status === 'review' ? (
                           <div className="py-8">
                               <div className="min-h-[200px] flex items-center justify-center bg-black/30 rounded-[2rem] p-8 mb-6 border border-white/5" onClick={() => setGameState({...gameState, showAnswer: !gameState.showAnswer})}>
                                   <h3 className="text-2xl font-bold text-white text-center break-words">
                                       {gameState.showAnswer ? gameState.queue[gameState.currentIdx].a : gameState.queue[gameState.currentIdx].q}
                                   </h3>
                               </div>
                               {!gameState.showAnswer ? (
                                   <button onClick={() => setGameState({...gameState, showAnswer: true})} className="w-full py-4 bg-white/10 rounded-2xl text-white font-bold active-squish">Show Answer</button>
                               ) : (
                                   <div className="grid grid-cols-2 gap-4">
                                       <button onClick={() => {
                                           playSound('delete');
                                           const card = gameState.queue[gameState.currentIdx];
                                           const updated = flashcards.map((f:any) => f.id === card.id ? { ...f, box: 0, nextReview: Date.now() + 60000 } : f); // Review in 1 min
                                           setFlashcards(updated);
                                           if (gameState.currentIdx < gameState.queue.length - 1) {
                                               setGameState({...gameState, currentIdx: gameState.currentIdx + 1, showAnswer: false});
                                           } else {
                                               setGameState({ status: 'idle', score: 0 });
                                           }
                                       }} className="py-4 bg-rose-500/20 text-rose-200 rounded-2xl font-bold active-squish">Forgot</button>
                                       <button onClick={() => {
                                           playSound('success');
                                           onExperienceGain(5, "Card Reviewed");
                                           const card = gameState.queue[gameState.currentIdx];
                                           const nextBox = card.box + 1;
                                           const interval = [1, 3, 7, 14, 30][Math.min(nextBox, 4)] * 24 * 60 * 60 * 1000;
                                           const updated = flashcards.map((f:any) => f.id === card.id ? { ...f, box: nextBox, nextReview: Date.now() + interval } : f);
                                           setFlashcards(updated);
                                           if (gameState.currentIdx < gameState.queue.length - 1) {
                                               setGameState({...gameState, currentIdx: gameState.currentIdx + 1, showAnswer: false});
                                           } else {
                                               setGameState({ status: 'idle', score: 0 });
                                           }
                                       }} className="py-4 bg-emerald-500/20 text-emerald-200 rounded-2xl font-bold active-squish">Remembered</button>
                                   </div>
                               )}
                           </div>
                       ) : null}
                   </div>
              )}

              {nexusActiveTool === 'Reading List' && (
                   <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                          <input type="text" className="w-full bg-black/20 border border-white/10 rounded-full px-6 py-4 text-sm text-white focus:outline-none" placeholder="Book Title..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} />
                          <button onClick={() => { if(nexusInput.trim()) { setReadingList([...readingList, { id: Date.now(), title: nexusInput, progress: 0 }]); setNexusInput(''); playSound('success'); onExperienceGain(10, "Book Added"); } }} className="w-full py-3 bg-blue-500 rounded-full text-white font-bold text-xs active-squish">ADD</button>
                      </div>
                      <div className="space-y-3">
                          {readingList.map((item: any) => (
                              <div key={item.id} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                  <div className="flex justify-between mb-3">
                                      <span className="text-sm font-bold text-white">{item.title}</span>
                                      <button onClick={() => { setReadingList(readingList.filter((r:any) => r.id !== item.id)); playSound('delete'); }}><Delete size={14} className="text-white/40 hover:text-rose-400"/></button>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <input type="range" min="0" max="100" value={item.progress} onChange={(e) => {
                                          const val = parseInt(e.target.value);
                                          setReadingList(readingList.map((r:any) => r.id === item.id ? { ...r, progress: val } : r));
                                          if (val === 100 && item.progress !== 100) onExperienceGain(100, "Book Finished");
                                      }} className="flex-1 accent-blue-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                                      <span className="text-xs font-mono text-blue-300 w-8">{item.progress}%</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                   </div>
              )}

              {nexusActiveTool === 'Encryption Tool' && (
                  <div className="space-y-6">
                      <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/10 mb-4">
                          <button onClick={() => setCipherMode('ENCODE')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${cipherMode === 'ENCODE' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}>Encode</button>
                          <button onClick={() => setCipherMode('DECODE')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${cipherMode === 'DECODE' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}>Practice</button>
                      </div>
                      {cipherMode === 'ENCODE' ? (<><textarea className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30 h-32 font-mono" placeholder="Input text..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} /><button onClick={handleCipher} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold text-xs uppercase tracking-widest active-squish">Encrypt</button>{nexusOutput && <pre className="bg-black/40 p-6 rounded-2xl text-emerald-400 text-xs font-mono whitespace-pre-wrap border border-white/5 break-all">{nexusOutput}</pre>}</>) : (<><div className="bg-black/30 p-8 rounded-3xl border border-white/5 min-h-[100px] flex flex-col justify-center items-center text-center space-y-2"><span className="text-xs text-white/40 uppercase tracking-widest">Decoded Message</span><span className="text-2xl font-bold text-white tracking-widest min-h-[32px] break-all">{nexusOutput || "..."}</span></div><div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center"><span className="text-xl font-mono text-emerald-300 tracking-[0.5em] break-all">{nexusInput || "Signal..."}</span></div><div className="grid grid-cols-2 gap-3 mt-4"><button onClick={() => handleMorseInput('.')} className="h-24 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex items-center justify-center active-squish transition-all"><div className="w-4 h-4 rounded-full bg-white"></div></button><button onClick={() => handleMorseInput('-')} className="h-24 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex items-center justify-center active-squish transition-all"><div className="w-12 h-3 rounded-full bg-white"></div></button><button onClick={() => handleMorseInput(' ')} className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-xs font-bold text-white/50 uppercase active-squish transition-all col-span-1">Space</button><button onClick={handleMorseBackspace} className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-white/50 hover:text-rose-400 active-squish transition-all col-span-1"><Delete size={20} /></button></div></>)}
                  </div>
              )}

              {/* === MATH PRACTICE === */}
              {nexusActiveTool === 'Math Practice' && (
                  <div className="text-center space-y-8">
                      <div className="p-6 bg-black/20 rounded-[2.5rem] border border-white/10">
                          <h3 className="text-4xl sm:text-5xl font-mono font-bold text-white mb-2 break-all">{gameState.question || "READY?"}</h3>
                          <p className="text-xs text-white/40 uppercase tracking-widest">Score: {gameState.score}</p>
                      </div>
                      {gameState.status === 'playing' ? (
                          <div className="flex flex-col gap-3">
                              <input type="number" autoFocus className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-center text-xl text-white outline-none" value={gameState.input} onChange={(e) => setGameState({...gameState, input: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && checkMath()} />
                              <button onClick={checkMath} className="w-full py-4 bg-emerald-500 rounded-2xl text-white font-bold active-squish">Submit</button>
                          </div>
                      ) : (
                          <button onClick={startMentalMath} className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-[2rem] text-white font-bold tracking-widest uppercase active-squish">Start</button>
                      )}
                  </div>
              )}

              {/* === BINARY PRACTICE === */}
              {nexusActiveTool === 'Binary Practice' && (
                  <div className="text-center space-y-8">
                      <div className="p-6 bg-black/20 rounded-[2.5rem] border border-white/10">
                          <h3 className="text-4xl sm:text-5xl font-mono font-bold text-white mb-2 break-all">{gameState.question || "READY?"}</h3>
                          <p className="text-xs text-white/40 uppercase tracking-widest">Convert to Binary</p>
                      </div>
                      {gameState.status === 'playing' ? (
                          <div className="flex flex-col gap-3">
                              <input type="text" autoFocus className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-center text-xl text-white outline-none font-mono" value={gameState.input} onChange={(e) => setGameState({...gameState, input: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && checkBinary()} placeholder="e.g. 1011" />
                              <button onClick={checkBinary} className="w-full py-4 bg-emerald-500 rounded-2xl text-white font-bold active-squish">Check</button>
                          </div>
                      ) : (
                          <button onClick={startBinary} className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-[2rem] text-white font-bold tracking-widest uppercase active-squish">Start</button>
                      )}
                  </div>
              )}

              {/* === DAY FINDER (DOOMSDAY) === */}
              {nexusActiveTool === 'Day Finder' && (
                  <div className="text-center space-y-8">
                      <div className="p-6 bg-black/20 rounded-[2.5rem] border border-white/10">
                          <h3 className="text-3xl font-bold text-white mb-2 break-words">{gameState.question || "Start"}</h3>
                          <p className="text-xs text-white/40 uppercase tracking-widest">Score: {gameState.score}</p>
                      </div>
                      {gameState.status === 'playing' ? (
                          <div className="grid grid-cols-4 gap-2">
                              {DAYS_OF_WEEK.map((day, idx) => (
                                  <button key={day} onClick={() => checkDoomsday(idx)} className="py-4 bg-white/10 rounded-xl text-white font-bold text-xs active-squish hover:bg-white/20">{day.substring(0,3)}</button>
                              ))}
                          </div>
                      ) : (
                          <button onClick={startDoomsday} className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-[2rem] text-white font-bold tracking-widest uppercase active-squish">Start</button>
                      )}
                  </div>
              )}

              {/* === MEMORY TEST === */}
              {nexusActiveTool === 'Memory Test' && (
                  <div className="text-center space-y-8">
                      <div className="p-6 bg-black/20 rounded-[2.5rem] border border-white/10 min-h-[150px] flex flex-col justify-center">
                          {gameState.status === 'memorize' && <h3 className="text-4xl sm:text-6xl font-mono font-bold text-white tracking-[0.2em] break-all">{gameState.question}</h3>}
                          {gameState.status === 'recall' && <h3 className="text-white/40 italic">Enter the digits...</h3>}
                          {gameState.status === 'fail' && <h3 className="text-rose-400 font-bold text-xl">Game Over. Level {gameState.level}</h3>}
                          {gameState.status === 'idle' && <h3 className="text-white font-bold">Memory Span</h3>}
                      </div>
                      {gameState.status === 'recall' ? (
                          <div className="flex flex-col gap-3">
                              <input type="number" autoFocus className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-center text-xl text-white outline-none" value={gameState.input} onChange={(e) => setGameState({...gameState, input: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && checkDigitSpan()} />
                              <button onClick={checkDigitSpan} className="w-full py-4 bg-emerald-500 rounded-2xl text-white font-bold active-squish">Check</button>
                          </div>
                      ) : (
                          <button onClick={startDigitSpan} className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-[2rem] text-white font-bold tracking-widest uppercase active-squish">{gameState.status === 'fail' ? 'Retry' : 'Start'}</button>
                      )}
                  </div>
              )}

              {/* === SIMPLIFIER (FEYNMAN) === */}
              {nexusActiveTool === 'Simplifier' && (
                  <div className="space-y-4">
                      <div className="p-6 bg-black/20 rounded-[2rem] border border-white/10">
                          <p className="text-white/60 text-sm mb-4">Explain a complex concept in simple terms. Avoid jargon (words {'>'} 9 letters).</p>
                          <textarea className="w-full bg-transparent text-white focus:outline-none h-32 resize-none" placeholder="Explain it simply..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} />
                      </div>
                      <div className="flex justify-end gap-2">
                          <button onClick={handleFeynman} className="px-8 py-3 bg-white text-black rounded-full font-bold text-xs active-squish">Analyze</button>
                      </div>
                      {nexusOutput && (
                          <div className={`p-4 rounded-xl border ${nexusOutput.startsWith('Good') ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-rose-500/20 border-rose-500/50 text-rose-200'}`}>
                              {nexusOutput}
                          </div>
                      )}
                  </div>
              )}

              {/* === DAILY VIRTUES === */}
              {nexusActiveTool === 'Daily Virtues' && (
                  <div className="grid grid-cols-2 gap-3">
                      {VIRTUES.map((v, i) => {
                          const today = getTodayString();
                          const isChecked = nexusState.virtues[today]?.[i];
                          return (
                              <button key={v} onClick={() => toggleVirtue(i)} className={`p-4 rounded-2xl border transition-all active-squish flex items-center justify-between ${isChecked ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/50'}`}>
                                  <span className="text-xs font-bold uppercase tracking-wider">{v}</span>
                                  {isChecked ? <CheckCircle size={16}/> : <div className="w-4 h-4 rounded-full border border-white/20"></div>}
                              </button>
                          );
                      })}
                  </div>
              )}

              {/* === CREATIVE CARD === */}
              {nexusActiveTool === 'Creative Card' && (
                  <div className="text-center py-10 space-y-8">
                      <div className="p-10 bg-white text-black rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.2)] min-h-[200px] flex items-center justify-center rotate-1">
                          <h3 className="text-2xl font-serif font-bold italic">{nexusOutput || "Draw a card"}</h3>
                      </div>
                      <button onClick={getObliqueStrategy} className="px-10 py-4 bg-white/10 rounded-full text-white font-bold uppercase tracking-widest active-squish border border-white/20 hover:bg-white/20">Draw Strategy</button>
                  </div>
              )}

              {/* === DECISION HELPER (REGRET PROTOCOL) === */}
              {nexusActiveTool === 'Decision Helper' && (
                  <div className="text-center py-10 space-y-8">
                      <div className="p-8 bg-black/20 rounded-[2rem] border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-2">Micro Action Generator</h3>
                          <p className="text-white/50 text-sm">{nexusOutput || "Press the button to get an action."}</p>
                      </div>
                      <button onClick={handleRegret} className="px-10 py-4 bg-emerald-500 rounded-full text-white font-bold uppercase tracking-widest active-squish shadow-lg">Generate Action</button>
                  </div>
              )}
              
              {/* Keep other tools with similar style updates */}
              {nexusActiveTool === 'Life Progress' && (<div className="h-full flex flex-col">{!nexusState.dob ? (<div className="text-center space-y-6 my-auto animate-in fade-in zoom-in duration-500"><Skull size={48} className="mx-auto text-white/40" /><p className="text-xs text-white/50 uppercase tracking-widest">When were you born?</p><input type="date" className="bg-black/20 border border-white/10 rounded-2xl p-4 text-white scheme-dark mx-auto block text-center w-full max-w-xs text-lg focus:border-white/30 focus:outline-none transition-colors" onChange={(e) => setTempDob(e.target.value)} /><button onClick={handleMementoSetup} disabled={!tempDob} className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all active-squish ${tempDob ? 'bg-white text-black shadow-lg' : 'bg-white/10 text-white/40'}`}>Start</button></div>) : (<MementoMoriView dob={nexusState.dob} theme={theme} onReset={handleMementoReset} />)}</div>)}
              
              {/* Fallback for anything else */}
              {['Problem Solver', 'Deep Analysis'].includes(nexusActiveTool || '') && (
                  <div className="text-center py-20">
                      <p className="text-white/40 italic">This module is under construction.</p>
                  </div>
              )}
          </div>
      </div>
     );
  }

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-32">
           <div className="flex items-center justify-between px-2"><h2 className={`text-xl font-bold flex items-center gap-3 text-white`}><Activity size={24} /> Tools</h2></div>
           
           <div className="space-y-6">
              <h3 className={`text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2 border-b border-white/10 pb-2 mb-4`}>Productivity</h3>
              {/* Bubble Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { playSound('click'); setNexusActiveTool('Graph'); }} className="glass-panel p-6 rounded-[2rem] hover:bg-white/5 transition-all active-squish flex flex-col items-start gap-3 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><GitBranch size={20} /></div><div><h3 className="text-sm font-bold text-white leading-tight">Overview</h3></div></button>
                  {[{ name: 'Simplifier', icon: Feather }, { name: 'Decision Helper', icon: Shuffle }, { name: 'Creative Card', icon: Shuffle }, { name: 'Life Progress', icon: Skull }, { name: 'Daily Virtues', icon: Shield }].map((tool) => (
                      <button key={tool.name} onClick={() => { playSound('click'); setNexusActiveTool(tool.name); setNexusInput(''); setNexusOutput(''); }} className="glass-panel p-6 rounded-[2rem] hover:bg-white/5 transition-all active-squish flex flex-col items-start gap-3 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><tool.icon size={20} /></div><div><h3 className="text-sm font-bold text-white leading-tight">{tool.name}</h3></div></button>
                  ))}
              </div>
              
              {/* Knowledge Section */}
              <h3 className={`text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2 mt-8 border-b border-white/10 pb-2 mb-4`}>Knowledge</h3>
              <div className="grid grid-cols-3 gap-4">
                   <button onClick={() => { playSound('click'); setNexusActiveTool('Quick Notes'); }} className="glass-panel p-4 rounded-[1.5rem] hover:bg-white/5 transition-all active-squish flex flex-col items-center gap-2 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><FileText size={20} /></div><span className="text-xs font-bold text-white">Notes</span></button>
                   <button onClick={() => { playSound('click'); setNexusActiveTool('Flashcards'); setGameState({status: 'idle'}); }} className="glass-panel p-4 rounded-[1.5rem] hover:bg-white/5 transition-all active-squish flex flex-col items-center gap-2 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><Repeat size={20} /></div><span className="text-xs font-bold text-white">Cards</span></button>
                   <button onClick={() => { playSound('click'); setNexusActiveTool('Reading List'); }} className="glass-panel p-4 rounded-[1.5rem] hover:bg-white/5 transition-all active-squish flex flex-col items-center gap-2 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><Book size={20} /></div><span className="text-xs font-bold text-white">Books</span></button>
              </div>

              <h3 className={`text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2 mt-8 border-b border-white/10 pb-2 mb-4`}>Brain Training</h3>
              <div className="grid grid-cols-2 gap-4">
                   {[{ name: 'Math Practice', icon: Calculator }, { name: 'Binary Practice', icon: Binary }, { name: 'Day Finder', icon: CalendarDays }, { name: 'Memory Test', icon: Hash }].map((tool) => (
                      <button key={tool.name} onClick={() => { playSound('click'); setNexusActiveTool(tool.name); setNexusInput(''); setNexusOutput(''); setGameState({ score: 0, status: 'idle', question: null, answer: '' }); }} className="glass-panel p-6 rounded-[2rem] hover:bg-white/5 transition-all active-squish flex flex-col items-start gap-3 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><tool.icon size={20} /></div><div><h3 className="text-sm font-bold text-white leading-tight">{tool.name}</h3></div></button>
                  ))}
              </div>

              <h3 className={`text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2 mt-8 border-b border-white/10 pb-2 mb-4`}>Fun & Audio</h3>
               <div className="grid grid-cols-2 gap-4">
                   {[{ name: 'Encryption Tool', icon: Radio }].map((tool) => (
                      <button key={tool.name} onClick={() => { playSound('click'); setNexusActiveTool(tool.name); setNexusInput(''); setNexusOutput(''); }} className="glass-panel p-6 rounded-[2rem] hover:bg-white/5 transition-all active-squish flex flex-col items-start gap-3 group"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-colors"><tool.icon size={20} /></div><div><h3 className="text-sm font-bold text-white leading-tight">{tool.name}</h3></div></button>
                  ))}
              </div>
           </div>
      </div>
  );
}