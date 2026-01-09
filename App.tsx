
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CheckCircle, Zap, Moon, Plus, Home, List, User, 
  Flame, Calendar as CalendarIcon, Save, Trash2,
  Users, Eye, Repeat, RefreshCw, Dna, ArrowRight, Grid, Newspaper, Droplets, AlertOctagon, Sun
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES, GOODNIGHT_QUOTES } from './quotes';
import SundayPage from './Sunday/SundayPage';
import ToolsPage from './Tools/ToolsPage';
import HomePage from './Home/HomePage';
import CalendarPage from './Calendar/CalendarPage';
import HabitsPage from './Habits/HabitsPage';
import ProfilePage from './Profile/ProfilePage';
import { BackgroundVisuals } from './Visuals/Visuals';
import { 
    APP_VERSION, KEYS, THEMES, FONTS, PILLAR_KEYS, POLYMATH_KEYWORDS, CHART_COLORS, TIERS, SHOP_ITEMS, ACHIEVEMENTS 
} from './utils/constants';
import { 
    getTodayString, parseLocalDate, addDays, getDaysSince, formatDuration, parseTime, playSound, getIcon 
} from './utils/helpers';

/**
 * =================================================================================
 * 🚀 MAIN APPLICATION COMPONENT
 * =================================================================================
 */

// --- INITIAL DATA STATES ---
const generateBaseSkills = () => {
    return PILLAR_KEYS.map((key, i) => ({
        id: `poly_s${i}`,
        name: key, 
        pillar: key, 
        initial_score: 0,
        current_score: 0,
        decay_rate: 0.1, // Easy mode
        last_activity: new Date().toISOString()
    }));
};

const INITIAL_HISTORY = [
  { month: 'Start', score: 0 },
  { month: 'Now', score: 0 }
];

const INITIAL_TASKS: any[] = [];
const INITIAL_CUSTOM_HABITS: any[] = [];
const INITIAL_NOTES: any[] = [];
const INITIAL_FLASHCARDS: any[] = [];
const INITIAL_READING_LIST: any[] = [];

const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex justify-center">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute top-0 w-3 h-3 rounded-full animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: CHART_COLORS[Math.floor(Math.random() * 4)],
            animationDuration: `${Math.random() * 1 + 1.5}s`,
            animationDelay: `${Math.random() * 0.2}s`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

// DUNE STYLE CINEMATIC OVERLAY - REFINED
const CinematicOverlay = ({ type, text, subtext, onComplete, theme, onAction }: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Smooth Enter
        const t1 = setTimeout(() => setIsVisible(true), 100);
        
        // Auto Exit Timer
        let t2: any;
        if (type !== 'sleep-locked') {
           // Allow time for the text animation (3.5s) + reading time
           t2 = setTimeout(() => {
               triggerExit();
           }, 5500); 
        }
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [type]);

    const triggerExit = () => {
        if (isExiting) return;
        setIsExiting(true);
        setIsVisible(false); // Trigger fade out transition on container
        
        // Wait for CSS transition (1.5s) then unmount
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 1500);
    };

    const handleInteraction = () => {
        if (type !== 'sleep-locked') triggerExit();
    };

    // DUNE ICONS
    const renderIcon = () => {
        const iconClass = "text-white opacity-90";
        switch(type) {
            case 'sleep': return <Moon size={48} strokeWidth={1} className={iconClass} />;
            case 'wake': return <Sun size={64} strokeWidth={1} className={iconClass} />;
            case 'fail': return <AlertOctagon size={48} strokeWidth={1} className="text-rose-500 opacity-90" />;
            case 'sleep-locked': return <Moon size={48} strokeWidth={1} className={iconClass} />;
            default: return <Zap size={48} strokeWidth={1} className={iconClass} />;
        }
    };

    return (
        <div 
            onClick={handleInteraction}
            className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 cursor-pointer overflow-hidden transition-all duration-[1500ms] ${isExiting ? 'bg-black/0 pointer-events-none' : 'bg-black'}`}
        >
             {/* Stark Background Fill to cover app during intro */}
             <div className={`absolute inset-0 bg-black transition-opacity duration-[1500ms] ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
             
             {/* Content Container */}
             <div 
                className={`relative z-10 flex flex-col items-center text-center w-full max-w-[90vw] transition-all duration-[1500ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
             >
                 <div className="mb-12 animate-pulse duration-[3000ms]">
                    {renderIcon()}
                 </div>
                 
                 <div className="space-y-12 w-full overflow-hidden flex flex-col items-center">
                     {/* The Cinematic Text - Spreads Apart - Now constrained max width */}
                     <h1 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase leading-tight drop-shadow-2xl animate-cinematic-text text-center max-w-full">
                        {text}
                     </h1>
                     
                     {subtext && (
                         <p className="text-xs md:text-sm font-mono text-white tracking-[0.2em] uppercase leading-relaxed max-w-lg mx-auto animate-cinematic-subtext">
                             {subtext}
                         </p>
                     )}
                 </div>

                 {type === 'sleep-locked' && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); if(onAction) onAction(); }} 
                        className="mt-16 border border-white/20 px-10 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500 animate-cinematic-subtext"
                     >
                         [ ABORT PROTOCOL ]
                     </button>
                 )}
                 
                 {type !== 'sleep-locked' && isVisible && !isExiting && (
                     <div className="absolute bottom-[-150px] text-[9px] font-mono text-white uppercase tracking-[0.3em] animate-pulse animate-cinematic-subtext" style={{animationDelay: '3s'}}>
                         Tap to dismiss
                     </div>
                 )}
             </div>
        </div>
    );
};

// Navigation Bubble
const MobileTab = ({ label, icon, active, onClick, themeColor }: { label: string, icon: React.ReactElement, active: boolean, onClick: () => void, themeColor: string }) => (
  <button 
    onClick={() => { playSound('click'); onClick(); }}
    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-500 relative group active-squish`}
  >
    <div className={`p-2 rounded-full transition-all duration-500 ${active ? 'bg-white text-black translate-y-[-5px] shadow-[0_4px_12px_rgba(255,255,255,0.3)]' : 'text-slate-400 hover:text-white'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: active ? 24 : 22, strokeWidth: 2 })}
    </div>
    {active && <span className="absolute -bottom-2 text-[10px] font-bold text-white opacity-0 animate-in-up">{label}</span>}
  </button>
);

const Modal = ({ isOpen, onClose, title, children, font }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, font: string }) => {
  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in duration-300 ${font}`}>
      <div className="glass-panel w-full max-w-sm rounded-[3rem] p-8 relative max-h-[90vh] overflow-y-auto transform transition-all scale-100 animate-in zoom-in-95 duration-500">
        <button onClick={() => { playSound('click'); onClose(); }} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-white/60 hover:text-white transition-colors active-squish">
          <CheckCircle size={20} className="rotate-45" /> 
        </button>
        <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ message, isVisible, theme }: { message: string, isVisible: boolean, theme: any }) => {
  if (!isVisible) return null;
  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-500 flex items-center gap-3 pointer-events-none`}>
      <CheckCircle size={18} className="text-emerald-400" />
      <span className="text-sm font-medium text-white">{message}</span>
    </div>
  );
};

export default function App() {

  // --- 0. INIT & MIGRATION ---
  useEffect(() => { 
      if (!localStorage.getItem('hb_polymath_migration_v1')) localStorage.setItem('hb_polymath_migration_v1', 'true');
      // Migrate old 'Clean' theme to 'Sunset'
      const savedTheme = localStorage.getItem(KEYS.THEME);
      if (savedTheme === 'Clean') {
          localStorage.setItem(KEYS.THEME, 'Sunset');
          setAppTheme('Sunset');
      }
  }, []);
  
  // --- 1. PERSISTENT STATE MANAGEMENT ---
  const [appTheme, setAppTheme] = useState(() => {
      const stored = localStorage.getItem(KEYS.THEME) || 'Sunset';
      return stored === 'Clean' ? 'Sunset' : stored;
  }); 
  const [appFont, setAppFont] = useState(() => localStorage.getItem(KEYS.FONT) || 'Modern');
  const [sleepConfig, setSleepConfig] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.SLEEP_CONFIG) || 'null') || { sleep: '23:00', wake: '08:00' }; }
      catch { return { sleep: '23:00', wake: '08:00' }; }
  });

  // REFS FOR LATEST STATE ACCESS IN LISTENERS
  const latestSleepConfig = useRef(sleepConfig);
  const latestSleepState = useRef({ isActive: false, startTime: null as number | null });

  const theme = useMemo(() => THEMES[appTheme] || THEMES['Sunset'], [appTheme]);
  const fontClass = useMemo(() => FONTS[appFont] || FONTS['Modern'], [appFont]);

  const [skills, setSkills] = useState<Record<string, any[]>>(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.SKILLS) || 'null') || { 'Polymath': generateBaseSkills() }; } catch { return { 'Polymath': generateBaseSkills() }; }
  });

  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]') || INITIAL_TASKS; } catch { return INITIAL_TASKS; }
  });

  const [customHabits, setCustomHabits] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.HABITS) || '[]') || INITIAL_CUSTOM_HABITS; } catch { return INITIAL_CUSTOM_HABITS; }
  });

  const [pressDrafts, setPressDrafts] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.PRESS_DRAFTS) || '[]') || []; } catch { return []; }
  });
  
  const [isSundayMode, setIsSundayMode] = useState(false);
  const [pressInput, setPressInput] = useState('');
  const [pressType, setPressType] = useState<'text' | 'image' | 'link'>('text');

  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.NOTES) || '[]') || INITIAL_NOTES; } catch { return INITIAL_NOTES; }
  });
  const [flashcards, setFlashcards] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.FLASHCARDS) || '[]') || INITIAL_FLASHCARDS; } catch { return INITIAL_FLASHCARDS; }
  });
  const [readingList, setReadingList] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.READING) || '[]') || INITIAL_READING_LIST; } catch { return INITIAL_READING_LIST; }
  });

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.HISTORY) || 'null') || INITIAL_HISTORY; } catch { return INITIAL_HISTORY; }
  });
  
  const [userName, setUserName] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.USERNAME) || 'null') || null; } catch { return null; }
  });
  const [protocol, setProtocol] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.PROTOCOL) || 'null') || "To live a balanced life."; } catch { return "To live a balanced life."; }
  });
  const [streakData, setStreakData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.STREAK) || 'null') || { count: 0, lastDate: null }; } catch { return { count: 0, lastDate: null }; }
  });
  
  const [dailyChallengeState, setDailyChallengeState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.DAILY_CHALLENGE) || 'null') || { date: null, active: false, completed: false, challenge: null }; } catch { return { date: null, active: false, completed: false, challenge: null }; }
  });
  
  const [sleepState, setSleepState] = useState(() => {
     try { return JSON.parse(localStorage.getItem(KEYS.SLEEP_STATE) || 'null') || { isActive: false, startTime: null }; } catch { return { isActive: false, startTime: null }; }
  });

  const [nexusState, setNexusState] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.NEXUS) || 'null') || { dob: null, virtues: {}, lastOracleWeek: null, regretProtocol: null }; } catch { return { dob: null, virtues: {}, lastOracleWeek: null, regretProtocol: null }; }
  });

  const [inventory, setInventory] = useState(() => {
     try { return JSON.parse(localStorage.getItem(KEYS.INVENTORY) || 'null') || { items: [], badges: [] }; } catch { return { items: [], badges: [] }; }
  });
  const [currencyXP, setCurrencyXP] = useState(() => {
     try { return JSON.parse(localStorage.getItem(KEYS.CURRENCY) || '0') || 0; } catch { return 0; }
  });

  const [activeTab, setActiveTab] = useState('Home');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [cinematic, setCinematic] = useState<{ active: boolean, type: 'startup' | 'sleep' | 'wake' | 'sleep-locked' | 'wake-ready' | 'fail', text: string, subtext?: string } | null>(null);
  const [isShutdown, setIsShutdown] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(!userName); 
  const [onboardingStep, setOnboardingStep] = useState(0); 
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingProtocol, setOnboardingProtocol] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showBioSettings, setShowBioSettings] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Learn');
  const [newItemImpact, setNewItemImpact] = useState('Medium');
  const [newItemDate, setNewItemDate] = useState(getTodayString());
  const [newItemDuration, setNewItemDuration] = useState(30); 
  const [newItemType, setNewItemType] = useState('task');
  const [newItemRecurrence, setNewItemRecurrence] = useState('none');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- HELPER FUNCTIONS ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExperienceGain = (amount: number, reason: string) => {
    setCurrencyXP(prev => prev + amount);
    showToast(`+${amount} XP: ${reason}`);
    if (amount >= 50) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
    }
  };

  const calculateDecay = (skill: any) => { 
      const rate = skill.decay_rate !== undefined ? skill.decay_rate : 0.15; 
      const decayAmount = Math.max(1, Math.round(skill.current_score * rate)); 
      return Math.max(0, skill.current_score - decayAmount); 
  };

  const updateHistory = (currentSkills: any[]) => {
    const totalScore = currentSkills.reduce((acc, s) => acc + s.current_score, 0);
    const averageScore = Math.round(totalScore / currentSkills.length);
    setHistory((prev: any[]) => {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (prev.length > 0 && prev[prev.length - 1].month === today) {
        const newHist = [...prev];
        newHist[newHist.length - 1] = { month: today, score: averageScore };
        return newHist;
      }
      return [...prev, { month: today, score: averageScore }];
    });
  };

  const handleHabitCheck = (habitId: string, dayIndex: number, forceState?: boolean) => {
    playSound('click');
    const habit = customHabits.find((h: any) => h.id === habitId);
    if (!habit) return;
    
    const newCompletions = [...habit.completions];
    const newState = forceState !== undefined ? forceState : !newCompletions[dayIndex];
    
    // Impact on skills
    setSkills(prev => {
        const skillsData = prev['Polymath'] || generateBaseSkills();
        const updatedSkills = skillsData.map((s: any) => {
            if (s.pillar === habit.category) {
                const impact = newState ? 2 : -2;
                return { ...s, current_score: Math.min(100, Math.max(0, s.current_score + impact)), last_activity: new Date().toISOString() };
            }
            return s;
        });
        updateHistory(updatedSkills);
        return { ...prev, 'Polymath': updatedSkills };
    });

    if (newState && !newCompletions[dayIndex] && !forceState) {
         handleExperienceGain(25, "Habit Tick");
         updateDailyStreak();
    }
    
    newCompletions[dayIndex] = newState;
    setCustomHabits(prev => prev.map((h: any) => h.id === habitId ? { ...h, completions: newCompletions } : h));
  };

  const calculateLifeWeeks = (dob: string) => {
      const birth = new Date(dob);
      const now = new Date();
      const diff = now.getTime() - birth.getTime();
      return Math.floor(diff / (1000 * 3600 * 24 * 7));
  };
  
  // Logic Functions... (All retained exactly as they were in functionality)
  const handleExportData = () => {
      const backupData = {
          tasks, skills, history, userName, protocol, streakData, customHabits, inventory, currencyXP, sleepConfig, nexusState, notes, timestamp: Date.now()
      };
      const json = JSON.stringify(backupData);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      navigator.clipboard.writeText(b64);
      playSound('success');
      showToast("Data copied to clipboard.");
  };

  const handleImportData = () => {
      const input = prompt("Paste your backup code:");
      if(!input) return;
      try {
          const json = decodeURIComponent(escape(atob(input)));
          const data = JSON.parse(json);
          if(data.tasks) setTasks(data.tasks);
          if(data.skills) setSkills(data.skills);
          if(data.userName) setUserName(data.userName);
          if(data.currencyXP) setCurrencyXP(data.currencyXP);
          if(data.sleepConfig) setSleepConfig(data.sleepConfig);
          if(data.nexusState) setNexusState(data.nexusState);
          if(data.notes) setNotes(data.notes);
          playSound('success');
          showToast("Data restored. Refreshing...");
          setTimeout(() => window.location.reload(), 1500);
      } catch (e) {
          showToast("Invalid backup code.");
      }
  };

  const getGreeting = () => {
      const hr = new Date().getHours();
      if (hr >= 5 && hr < 12) return "Good Morning";
      if (hr >= 12 && hr < 17) return "Good Afternoon";
      if (hr >= 17 && hr < 22) return "Good Evening";
      return "Good Night";
  };

  const initializeSystemTasks = () => {
      const today = getTodayString();
      const sleepId = `sys_sleep_${today}`;
      const wakeId = `sys_wake_${today}`;
      const habitSleepId = 'sys_habit_sleep';
      const habitWakeId = 'sys_habit_wake';

      setTasks(prev => {
          const newTasks = [...prev];
          if (!newTasks.find(t => t.id === sleepId)) {
              newTasks.unshift({
                  id: sleepId, name: `Go to sleep (<${sleepConfig.sleep})`, status: 'To Do', category: 'Health', 
                  impact: 'High', date: today, ownerArchetype: 'Polymath', isSystem: true
              });
          }
          if (!newTasks.find(t => t.id === wakeId)) {
               newTasks.unshift({
                  id: wakeId, name: `Wake up (<${sleepConfig.wake})`, status: 'To Do', category: 'Health', 
                  impact: 'High', date: today, ownerArchetype: 'Polymath', isSystem: true
              });
          }
          return newTasks;
      });

      setCustomHabits(prev => {
          const newHabits = [...prev];
          if (!newHabits.find(h => h.id === habitSleepId)) {
              newHabits.unshift({
                  id: habitSleepId, name: 'Sleep Schedule', category: 'Health', duration: 31, completions: Array(31).fill(false), ownerArchetype: 'Polymath', isSystem: true
              });
          }
          if (!newHabits.find(h => h.id === habitWakeId)) {
              newHabits.unshift({
                  id: habitWakeId, name: 'Wake Up Time', category: 'Health', duration: 31, completions: Array(31).fill(false), ownerArchetype: 'Polymath', isSystem: true
              });
          }
          return newHabits;
      });
  };

  // RESTORED & ENHANCED: Smart Startup Logic with Greeting
  // Now uses Refs to ensure it always uses the absolute latest config, even if called from a listener
  const handleStartupLogic = (randomQuote: string) => {
      const currentSleepConfig = latestSleepConfig.current; // Use Ref
      const currentSleepState = latestSleepState.current;   // Use Ref
      const isSleeping = currentSleepState.isActive;
      
      if (isSleeping && currentSleepState.startTime) {
          const now = Date.now();
          const asleepDuration = now - currentSleepState.startTime;

          // Helper for robust time diff handling midnight crossing
          const getMinutesDiff = (targetStr: string) => {
             const nowTime = new Date();
             const currentMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();
             const targetMinutes = parseTime(targetStr);
             let diff = targetMinutes - currentMinutes;
             // Normalize to -720 to 720 range for correct "proximity" logic
             if (diff > 720) diff -= 1440;
             if (diff < -720) diff += 1440;
             return diff; // Positive = Minutes remaining until target
          };

          const minsUntilWake = getMinutesDiff(currentSleepConfig.wake);
          
          // 1. TOO EARLY CHECK (More than 2 hours before wake time)
          if (minsUntilWake > 120) {
              // If we are just checking the phone, stay locked in sleep mode
              // Do NOT cancel sleep. Lock screen.
              setCinematic({ 
                  active: true, 
                  type: 'sleep-locked', 
                  text: "TOO EARLY", 
                  subtext: `Target: ${currentSleepConfig.wake}. Go back to sleep.` 
              });
              setIsLoading(false);
              return;
          }

          // 2. TOO SHORT CHECK (If within window but slept < 90 mins? Power nap?)
          // Fail the session but provide context
          if (asleepDuration < 5400000) { // 90 mins
              setCinematic({ active: true, type: 'fail', text: "POWER NAP?", subtext: `Duration: ${formatDuration(asleepDuration)}` });
              setSleepState({ isActive: false, startTime: null });
              setIsLoading(false);
              return;
          }

          // 3. OVERSLEPT CHECK (More than 1 hour past target)
          // minsUntilWake is negative if past target. e.g. -61
          if (minsUntilWake < -60) {
              setCinematic({ active: true, type: 'fail', text: "OVERSLEPT", subtext: `Target was ${currentSleepConfig.wake}` });
              setSleepState({ isActive: false, startTime: null });
              setIsLoading(false);
              return;
          }

          // 4. SUCCESS
          const today = getTodayString();
          const wakeId = `sys_wake_${today}`;
          setTasks(prev => prev.map(t => { if (t.id === wakeId) return { ...t, status: 'Complete' }; return t; }));
          const dayIndex = (new Date().getDate() - 1);
          handleHabitCheck('sys_habit_wake', dayIndex, true);
          setCurrencyXP(prev => prev + 100);

          setCinematic({ active: true, type: 'wake', text: "GOOD MORNING", subtext: `You woke up on time.` });
          setSleepState({ isActive: false, startTime: null });
          setIsLoading(false);

      } else {
          // Returning User Logic
          // RESTORED: Generic greeting for returning users (as requested)
          setCinematic({ active: true, type: 'startup', text: getGreeting(), subtext: randomQuote });
          setIsLoading(false);
      }
  };

  const handleSleep = () => {
      playSound('click');
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const targetMinutes = parseTime(sleepConfig.sleep);
      const today = getTodayString();
      
      // Basic check for "On time" sleep
      // Allow sleeping if within 2 hours of target or after target
      // Or if it's really late (early morning < 4 AM)
      let success = false;
      const minsDiff = targetMinutes - currentMinutes; 
      // If minsDiff is negative, we passed the time (good). 
      // If minsDiff is positive but small (e.g. 30 mins early), also good.
      // If minsDiff is large positive (e.g. 5 hours early), bad.
      
      // Normalized Midnight logic for Sleep Target
      let diff = targetMinutes - currentMinutes;
      if (diff > 720) diff -= 1440;
      if (diff < -720) diff += 1440;
      
      // Success if we are LATE (diff < 0) or slightly EARLY (diff < 120)
      if (diff < 120) success = true;

      const sleepId = `sys_sleep_${today}`;
      setTasks(prev => prev.map(t => { if (t.id === sleepId) return { ...t, status: 'Complete' }; return t; }));

      if (success) {
          const dayIndex = (new Date().getDate() - 1); 
          handleHabitCheck('sys_habit_sleep', dayIndex, true);
      }
      
      const randomGoodnightQuote = GOODNIGHT_QUOTES[Math.floor(Math.random() * GOODNIGHT_QUOTES.length)];

      setSleepState({ isActive: true, startTime: Date.now() });
      setCinematic({ active: true, type: 'sleep', text: "GOODNIGHT", subtext: randomGoodnightQuote });
  };

  const handleEmergencyAbort = () => {
      playSound('delete');
      setSleepState({ isActive: false, startTime: null });
      setCinematic(null);
      showToast("Sleep cancelled.");
  };

  const updateDailyStreak = () => {
    const today = getTodayString();
    const yesterdayDate = new Date();
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    setStreakData((prev: any) => {
      if (prev.lastDate === today) return prev;
      if (prev.lastDate === yesterday) return { count: prev.count + 1, lastDate: today };
      return { count: 1, lastDate: today };
    });
  };

  const buyItem = (item: any) => {
      playSound('click');
      if (currencyXP >= item.cost) {
          if (item.type === 'consumable' && inventory.items.includes(item.id)) { showToast("You already have this."); return; }
          if (item.type === 'permanent' && inventory.items.includes(item.id)) { showToast("Already owned."); return; }
          
          setCurrencyXP(prev => prev - item.cost);
          setInventory(prev => ({ ...prev, items: [...prev.items, item.id] }));
          playSound('success');
          showToast(`Bought: ${item.name}`);
      } else { showToast("Not enough XP."); }
  };

  // --- NEW HANDLERS FOR UI ---
  const handleOnboardingNext = () => {
      playSound('click');
      if (onboardingStep < 2) {
          setOnboardingStep(prev => prev + 1);
      } else {
          setUserName(onboardingName);
          setProtocol(onboardingProtocol);
          setIsOnboarding(false);
          // REMOVED: Specific 'WELCOME' cinematic as requested by user
          // setCinematic({ active: true, type: 'startup', text: "WELCOME", subtext: "Systems Online" });
          playSound('success');
      }
  };

  // RESTORED: Smart Oracle Logic
  const getOracleCommand = () => {
    if (nexusState.dob) {
        const weeks = calculateLifeWeeks(nexusState.dob);
        if (nexusState.lastOracleWeek && weeks > nexusState.lastOracleWeek) {
             return "A new week of life begins.";
        }
    }
    const mySkills = skills['Polymath'] || generateBaseSkills();
    const sorted = [...mySkills].sort((a: any,b: any) => a.current_score - b.current_score);
    const weakest = sorted[0];
    
    if (weakest.current_score > 80) return "Maintain your momentum.";
    if (weakest.pillar === 'Learn') return "Feed your mind something new today.";
    if (weakest.pillar === 'Create') return "Build something, however small.";
    if (weakest.pillar === 'Mind') return "Seek silence and reflection.";
    if (weakest.pillar === 'Health') return "Move your body. Drink water.";
    if (weakest.pillar === 'Social') return "Connect with a fellow human.";
    
    return "Focus on your goals.";
  };

  const resetTimer = () => { setIsTimerRunning(false); setTimeLeft(timerDuration); playSound('click'); };
  const toggleTimer = () => { setIsTimerRunning(!isTimerRunning); playSound(isTimerRunning ? 'click' : 'success'); };
  const formatTime = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  const setTimer = (mins: number) => { setTimerDuration(mins * 60); setTimeLeft(mins * 60); setIsTimerRunning(false); playSound('click'); };

  const radarData = useMemo(() => {
      const skillsData = skills['Polymath'] || [];
      return skillsData.map((s: any) => ({ subject: s.name, A: Math.round(s.current_score), fullMark: 100 }));
  }, [skills]);

  // RESTORED: Recurrence & Impact Logic
  const handleTaskToggle = (taskId: string) => {
      const task = tasks.find((t: any) => t.id === taskId);
      if (!task) return;
      if (task.isSystem) { showToast("Automatic system task."); return; }
      
      playSound('click');
      const isCompleting = task.status === 'To Do';
      const newStatus = isCompleting ? 'Complete' : 'To Do';
      let xpReward = 150; 
      let baseImpact = 5;
      if (task.impact === 'High') { xpReward = 300; baseImpact = 10; }
      const impact = isCompleting ? baseImpact : -(baseImpact + 1);
      
      let nextTaskToAdd: any = null;
      if (isCompleting) {
          handleExperienceGain(xpReward, "Task Complete");
          updateDailyStreak();
          
          if (task.recurrence && task.recurrence !== 'none') {
              let nextDate = task.date;
              if (task.recurrence === 'daily') nextDate = addDays(task.date, 1);
              if (task.recurrence === 'weekly') nextDate = addDays(task.date, 7);
              if (task.recurrence === 'monthly') nextDate = addDays(task.date, 30);
              nextTaskToAdd = { ...task, id: `t_${Date.now()}`, status: 'To Do', date: nextDate };
          }
      }

      // Update Skills
      setSkills(prev => {
          const targetSkills = prev['Polymath'] || generateBaseSkills();
          const newTargetSkills = targetSkills.map((skill: any) => {
              if (skill.pillar === task.category) {
                  let newScore = skill.current_score;
                  if (!isCompleting) newScore = calculateDecay(skill); 
                  newScore = Math.min(100, Math.max(0, newScore + impact));
                  return { ...skill, current_score: newScore, last_activity: new Date().toISOString() };
              }
              return skill;
          });
          updateHistory(newTargetSkills);
          return { ...prev, 'Polymath': newTargetSkills };
      });

      setTasks(prev => {
          let updated = prev.map((t: any) => t.id === taskId ? { ...t, status: newStatus } : t);
          if (nextTaskToAdd) updated = [...updated, nextTaskToAdd];
          return updated;
      });
  };

  const handleDeleteTask = (id: string) => {
      playSound('delete');
      setTasks(prev => prev.filter((t: any) => t.id !== id));
      showToast("Task deleted");
  };

  const getDayGrade = (dateStr: string) => {
      const dayTasks = tasks.filter((t: any) => t.date === dateStr);
      if (dayTasks.length === 0) return { grade: '-', color: 'text-white/20' };
      const completed = dayTasks.filter((t: any) => t.status === 'Complete').length;
      const percent = completed / dayTasks.length;
      if (percent === 1) return { grade: 'A+', color: 'text-emerald-400' };
      if (percent >= 0.8) return { grade: 'A', color: 'text-emerald-300' };
      if (percent >= 0.6) return { grade: 'B', color: 'text-blue-400' };
      if (percent >= 0.4) return { grade: 'C', color: 'text-yellow-400' };
      return { grade: 'F', color: 'text-rose-400' };
  };

  const openHabitEdit = (habit: any) => {
      setEditingHabitId(habit.id);
      setNewItemName(habit.name);
      setNewItemType('habitTracker');
      setNewItemDuration(habit.duration || 30);
      setIsModalOpen(true);
      playSound('click');
  };
  const handleDeleteHabit = () => {
      if (!editingHabitId) return;
      setCustomHabits(prev => prev.filter((h: any) => h.id !== editingHabitId));
      setIsModalOpen(false);
      setEditingHabitId(null);
      playSound('delete');
      showToast("Habit deleted");
  };
  const handleSave = () => {
      if (!newItemName.trim()) return;
      playSound('success');
      if (newItemType === 'task') {
          setTasks(prev => [...prev, { id: `t_${Date.now()}`, name: newItemName, status: 'To Do', category: newItemCategory, impact: newItemImpact, date: newItemDate, recurrence: newItemRecurrence, ownerArchetype: 'Polymath', isSystem: false }]);
          showToast("Task added");
      } else {
          if (editingHabitId) {
              setCustomHabits(prev => prev.map((h: any) => h.id === editingHabitId ? { ...h, name: newItemName, duration: newItemDuration } : h));
              showToast("Habit updated");
          } else {
              setCustomHabits(prev => [...prev, { id: `h_${Date.now()}`, name: newItemName, category: newItemCategory, duration: newItemDuration, completions: Array(newItemDuration).fill(false), ownerArchetype: 'Polymath', isSystem: false }]);
              showToast("Habit created");
          }
      }
      setIsModalOpen(false);
      setNewItemName('');
  };

  const handleAddNote = (title: string, content: string) => {
      setNotes(prev => [{ id: `n${Date.now()}`, title, content, date: new Date().toISOString() }, ...prev]);
      playSound('success');
      showToast("Note added");
  };

  const getStats = () => {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.status === 'Complete').length;
      const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const totalHabitCompletions = customHabits.reduce((acc: number, h: any) => acc + h.completions.filter(Boolean).length, 0);
      const pillarEfficiency = PILLAR_KEYS.map(p => {
          const pTasks = tasks.filter((t: any) => t.category === p);
          const pCompleted = pTasks.filter((t: any) => t.status === 'Complete').length;
          return { name: p, Executed: pTasks.length ? Math.round((pCompleted / pTasks.length) * 100) : 0 };
      });
      return { completionRate, totalHabitCompletions, pillarEfficiency, streak: streakData.count };
  };

  const getTier = (score: number) => { return TIERS.find(t => score <= t.limit) || TIERS[TIERS.length - 1]; };

  // --- DATA MIGRATION EFFECT ---
  useEffect(() => {
    const migrated = localStorage.getItem('hb_category_migration_v1');
    if (!migrated) {
        const MAP: Record<string, string> = { 'Erudition': 'Learn', 'Creation': 'Create', 'Integration': 'Mind', 'Vitality': 'Health', 'Influence': 'Social' };
        
        // Migrate Tasks
        const oldTasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
        const newTasks = oldTasks.map((t:any) => ({...t, category: MAP[t.category] || t.category}));
        setTasks(newTasks);

        // Migrate Habits
        const oldHabits = JSON.parse(localStorage.getItem(KEYS.HABITS) || '[]');
        const newHabits = oldHabits.map((h:any) => ({...h, category: MAP[h.category] || h.category}));
        setCustomHabits(newHabits);

        // Migrate Skills
        const oldSkillsData = JSON.parse(localStorage.getItem(KEYS.SKILLS) || 'null');
        if (oldSkillsData && oldSkillsData['Polymath']) {
            const newSkills = oldSkillsData['Polymath'].map((s:any) => ({...s, pillar: MAP[s.pillar] || s.pillar, name: MAP[s.name] || s.name}));
            setSkills({ 'Polymath': newSkills });
        }

        localStorage.setItem('hb_category_migration_v1', 'true');
        window.location.reload(); 
    }
  }, []);

  // Update Refs whenever state changes
  useEffect(() => { latestSleepConfig.current = sleepConfig; }, [sleepConfig]);
  useEffect(() => { latestSleepState.current = sleepState; }, [sleepState]);

  // Sync Effects
  useEffect(() => { localStorage.setItem(KEYS.SKILLS, JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(KEYS.HISTORY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(KEYS.HABITS, JSON.stringify(customHabits)); }, [customHabits]);
  useEffect(() => { localStorage.setItem(KEYS.NOTES, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(flashcards)); }, [flashcards]);
  useEffect(() => { localStorage.setItem(KEYS.READING, JSON.stringify(readingList)); }, [readingList]);
  useEffect(() => { localStorage.setItem(KEYS.PRESS_DRAFTS, JSON.stringify(pressDrafts)); }, [pressDrafts]);
  useEffect(() => { if (userName) localStorage.setItem(KEYS.USERNAME, JSON.stringify(userName)); }, [userName]);
  useEffect(() => { localStorage.setItem(KEYS.PROTOCOL, JSON.stringify(protocol)); }, [protocol]);
  useEffect(() => { localStorage.setItem(KEYS.STREAK, JSON.stringify(streakData)); }, [streakData]);
  useEffect(() => { localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem(KEYS.CURRENCY, JSON.stringify(currencyXP)); }, [currencyXP]);
  useEffect(() => { localStorage.setItem(KEYS.DAILY_CHALLENGE, JSON.stringify(dailyChallengeState)); }, [dailyChallengeState]);
  useEffect(() => { localStorage.setItem(KEYS.SLEEP_STATE, JSON.stringify(sleepState)); }, [sleepState]);
  useEffect(() => { localStorage.setItem(KEYS.SLEEP_CONFIG, JSON.stringify(sleepConfig)); }, [sleepConfig]);
  useEffect(() => { localStorage.setItem(KEYS.NEXUS, JSON.stringify(nexusState)); }, [nexusState]);
  useEffect(() => { localStorage.setItem(KEYS.THEME, appTheme); }, [appTheme]);
  useEffect(() => { localStorage.setItem(KEYS.FONT, appFont); }, [appFont]);
  
  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
    initializeSystemTasks();
    // Initial Check
    handleStartupLogic(randomQuote);

    // VISIBILITY LISTENER (For PWA/Mobile Backgrounding)
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            handleStartupLogic(randomQuote);
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSound('success');
      showToast("Session Complete.");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setCurrencyXP(prev => prev + 50);
      setTimeLeft(timerDuration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timeLeft, timerDuration]);
  useEffect(() => {
    setShowShop(false);
    setShowBackup(false);
    setShowBioSettings(false);
  }, [activeTab]);
  useEffect(() => {
      if (newItemType === 'task' && newItemName) {
          const lower = newItemName.toLowerCase();
          for (let i = 0; i < 5; i++) {
              if (POLYMATH_KEYWORDS[i] && POLYMATH_KEYWORDS[i].some((k: string) => lower.includes(k))) {
                  setNewItemCategory(PILLAR_KEYS[i]);
                  break;
              }
          }
      }
  }, [newItemName, newItemType]);
  useEffect(() => {
      const allCompletedTasks = tasks.filter((t:any) => t.status === 'Complete').length;
      const allHabits = customHabits.reduce((acc: number, h:any) => acc + h.completions.filter(Boolean).length, 0);
      const currentXP = (allCompletedTasks * 150) + (allHabits * 50);
      const mySkills = skills['Polymath'] || [];
      const minScore = mySkills.length > 0 ? Math.min(...mySkills.map((s:any) => s.current_score)) : 0;
      const data = { streak: streakData.count, xp: currentXP, tasks: allCompletedTasks, habits: allHabits, minScore };
      let newBadge = false;
      const updatedBadges = [...inventory.badges];
      ACHIEVEMENTS.forEach(ach => {
          if (!updatedBadges.includes(ach.id) && ach.condition(data)) {
              updatedBadges.push(ach.id);
              newBadge = true;
              showToast(`Achievement Unlocked: ${ach.name}`);
          }
      });
      if (newBadge) {
          setInventory(prev => ({...prev, badges: updatedBadges}));
          playSound('success');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
      }
  }, [streakData, tasks, customHabits, inventory.badges, skills]);

  // Rendering Helpers
  const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;

  // Onboarding Logic
  if (isShutdown) { return (<div className="h-[100dvh] w-full bg-black flex items-center justify-center"><p className="text-white/50 text-[10px] uppercase tracking-widest animate-pulse">Goodnight</p></div>); }

  if (isLoading) {
    return (<div className={`h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden ${fontClass}`}><BackgroundVisuals theme={theme} isNight={isNight} /><div className="relative z-10 text-center space-y-4 animate-float"><div className="w-16 h-16 mx-auto relative flex items-center justify-center"><div className="absolute inset-0 border-t border-b border-white/20 rounded-full animate-spin"></div><Dna size={32} className="text-white animate-pulse" /></div><p className="text-[10px] text-white/50 uppercase tracking-[0.5em] animate-pulse">Loading Liquid Core...</p></div></div>);
  }

  if (isOnboarding) {
      return (
      <div className={`h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden ${fontClass}`}>
         <BackgroundVisuals theme={theme} isNight={isNight} />
         <div className="glass-panel p-8 rounded-[3rem] w-full max-w-md relative flex flex-col items-center justify-center min-h-[50vh] animate-in-up">
            {onboardingStep === 0 && (<div className="text-center space-y-8 animate-in-up"><div className="relative w-24 h-24 mx-auto flex items-center justify-center animate-float"><div className={`absolute inset-0 bg-gradient-to-t from-white/20 to-transparent blur-xl rounded-full`}></div><Dna size={48} className="text-white relative z-10" /></div><div className="space-y-4"><h1 className="text-5xl font-serif font-bold text-white tracking-tight leading-tight">LIFE OS</h1><p className="text-white/60 text-xs tracking-[0.2em] uppercase">Fluid. Organic. Yours.</p></div><button onClick={handleOnboardingNext} className={`mt-12 px-8 py-3 rounded-full bg-white text-black text-[12px] font-bold uppercase tracking-[0.1em] active-squish`}>Start</button></div>)}
            {onboardingStep === 1 && (<div className="w-full space-y-12 animate-in-up delay-100 px-4"><div className="text-center space-y-2"><h2 className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Who are you?</h2></div><div className="relative group"><input type="text" value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} className="w-full bg-transparent border-b border-white/20 py-4 text-center text-3xl font-serif text-white focus:outline-none focus:border-white transition-all placeholder:text-white/20" placeholder="YOUR NAME" autoFocus /></div><button onClick={handleOnboardingNext} disabled={!onboardingName.trim()} className={`w-full py-4 rounded-full ${onboardingName.trim() ? 'bg-white text-black' : 'bg-white/10 text-white/40'} font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs active-squish`}>Continue <ArrowRight size={14} /></button></div>)}
            {onboardingStep === 2 && (<div className="w-full space-y-8 animate-in-up delay-100 px-4"><div className="text-center"><h2 className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">One Main Goal</h2></div><textarea value={onboardingProtocol} onChange={(e) => setOnboardingProtocol(e.target.value)} placeholder="e.g. Become healthy and wealthy..." className="w-full bg-black/20 rounded-2xl p-6 text-white text-lg font-serif italic focus:outline-none h-40 transition-all resize-none leading-relaxed text-center placeholder:text-white/20 placeholder:not-italic placeholder:font-sans placeholder:uppercase placeholder:text-xs" autoFocus /><button onClick={handleOnboardingNext} disabled={!onboardingProtocol.trim()} className={`w-full py-4 rounded-full ${onboardingProtocol.trim() ? 'bg-white text-black' : 'bg-white/10 text-white/40'} font-bold transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-widest text-xs active-squish`}>Let's Go <Zap size={14} fill="currentColor" /></button></div>)}
         </div>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'Home':
          return (
            <HomePage 
                tasks={tasks}
                skills={skills}
                protocol={protocol}
                sleepConfig={sleepConfig}
                timeLeft={timeLeft}
                timerDuration={timerDuration}
                isTimerRunning={isTimerRunning}
                toggleTimer={toggleTimer}
                resetTimer={resetTimer}
                setTimer={setTimer}
                handleSleep={handleSleep}
                handleTaskToggle={handleTaskToggle}
                getOracleCommand={getOracleCommand}
                theme={theme}
                playSound={playSound}
                setNewItemType={setNewItemType}
                setNewItemDate={setNewItemDate}
                setIsModalOpen={setIsModalOpen}
                radarData={radarData}
                formatTime={formatTime}
            />
          );

      case 'Calendar': 
        return (
           <CalendarPage 
                tasks={tasks}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleTaskToggle={handleTaskToggle}
                handleDeleteTask={handleDeleteTask}
                playSound={playSound}
                setNewItemType={setNewItemType}
                setNewItemDate={setNewItemDate}
                setIsModalOpen={setIsModalOpen}
                getDayGrade={getDayGrade}
           />
        );

      case 'Habits':
          return (
            <HabitsPage 
                customHabits={customHabits}
                handleHabitCheck={handleHabitCheck}
                openHabitEdit={openHabitEdit}
                setNewItemType={setNewItemType}
                setIsModalOpen={setIsModalOpen}
                playSound={playSound}
            />
          );

      case 'Press':
          return (
            <SundayPage 
              isSundayMode={isSundayMode}
              setIsSundayMode={setIsSundayMode}
              pressDrafts={pressDrafts}
              setPressDrafts={setPressDrafts}
              pressInput={pressInput}
              setPressInput={setPressInput}
              pressType={pressType}
              setPressType={setPressType}
              playSound={playSound}
              showToast={showToast}
              userName={userName || 'Traveler'}
              onExperienceGain={handleExperienceGain}
              theme={theme}
            />
          );

      case 'Social': 
        return (
            <ToolsPage
                theme={theme}
                tasks={tasks}
                notes={notes}
                setNotes={setNotes}
                flashcards={flashcards}
                setFlashcards={setFlashcards}
                readingList={readingList}
                setReadingList={setReadingList}
                nexusState={nexusState}
                setNexusState={setNexusState}
                playSound={playSound}
                showToast={showToast}
                onAddNote={handleAddNote}
                onExperienceGain={handleExperienceGain}
            />
        );

      case 'Profile':
             return (
                 <ProfilePage 
                    user={userName}
                    currencyXP={currencyXP}
                    inventory={inventory}
                    stats={getStats()}
                    skills={skills}
                    tier={getTier(skills['Polymath']?.[0]?.current_score || 0)}
                    theme={theme}
                    setAppTheme={setAppTheme}
                    showShop={showShop}
                    setShowShop={setShowShop}
                    showBackup={showBackup}
                    setShowBackup={setShowBackup}
                    showBioSettings={showBioSettings}
                    setShowBioSettings={setShowBioSettings}
                    sleepConfig={sleepConfig}
                    setSleepConfig={setSleepConfig}
                    handleExportData={handleExportData}
                    handleImportData={handleImportData}
                    buyItem={buyItem}
                    setUserName={setUserName}
                    setIsOnboarding={setIsOnboarding}
                    setOnboardingStep={setOnboardingStep}
                    playSound={playSound}
                    radarData={radarData}
                 />
             )
    }
  };

  return (
    <div className={`h-[100dvh] w-full bg-black text-white relative flex flex-col overflow-hidden ${fontClass} transition-colors duration-500`}>
      <BackgroundVisuals theme={theme} isNight={isNight} />
      
      {cinematic && cinematic.active && (<CinematicOverlay type={cinematic.type} text={cinematic.text} subtext={cinematic.subtext} theme={theme} onComplete={() => { if (cinematic?.type === 'sleep') { try { window.close(); } catch(e){} setIsShutdown(true); } else { setCinematic(prev => prev ? { ...prev, active: false } : null); } }} onAction={cinematic.type === 'sleep-locked' ? handleEmergencyAbort : undefined} />)}
      <div className="z-10 relative h-full flex flex-col">
        <Confetti active={showConfetti} />
        {activeTab !== 'Press' && (
            <header className="sticky top-0 z-30 px-6 py-6 flex justify-between items-center transition-colors duration-500 shrink-0"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg animate-float`}><Dna className="w-5 h-5 text-white" /></div><span className="font-bold text-xl tracking-tight text-white drop-shadow-md">Life OS</span></div><div className="flex items-center gap-3"><div className={`flex items-center gap-1 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-white text-xs font-bold backdrop-blur-md`}><Flame size={12} fill="currentColor" /> {streakData.count}</div></div></header>
        )}
        <Toast message={toastMessage} isVisible={!!toastMessage} theme={theme} />
        <Modal font={fontClass} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingHabitId(null); setNewItemName(''); setNewItemRecurrence('none'); }} title={newItemType === 'task' ? 'Add Task' : (editingHabitId ? 'Edit Habit' : 'New Habit')}><div className="space-y-6"><div><label className="text-xs text-white/50 uppercase font-bold pl-1">Name</label><input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className={`w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white mt-2 focus:outline-none focus:border-white/40 transition-colors`} placeholder="What flows next?" /></div>{newItemType === 'task' ? (<><div className="flex gap-4"><div className="flex-1"><label className="text-xs text-white/50 uppercase font-bold pl-1">Date</label><input type="date" value={newItemDate} onChange={(e) => setNewItemDate(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white mt-2 scheme-dark" /></div><div className="flex-1"><label className="text-xs text-white/50 uppercase font-bold pl-1">Repeat?</label><select value={newItemRecurrence} onChange={(e) => setNewItemRecurrence(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white mt-2 appearance-none"><option value="none">No</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div></div><div><label className="text-xs text-white/50 uppercase font-bold pl-1">Priority</label><div className="grid grid-cols-3 gap-3 mt-2">{['Low', 'Medium', 'High'].map(imp => (<button key={imp} onClick={() => setNewItemImpact(imp)} className={`text-[10px] py-3 rounded-xl border transition-all active-squish ${newItemImpact === imp ? 'bg-white text-black border-transparent' : 'bg-white/5 border-white/10 text-white/60'}`}>{imp}</button>))}</div></div></>) : (<div><label className="text-xs text-white/50 uppercase font-bold pl-1">Duration (Days)</label><input type="number" value={newItemDuration} onChange={(e) => setNewItemDuration(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white mt-2" /></div>)}<div><label className="text-xs text-white/50 uppercase font-bold pl-1">Category</label><div className="flex flex-wrap gap-2 mt-2">{PILLAR_KEYS.map((cat, i) => (<button key={cat} onClick={() => setNewItemCategory(cat)} className={`text-[10px] py-2 px-4 rounded-full border transition-all active-squish flex-grow ${newItemCategory === cat ? 'bg-white text-black border-transparent' : 'bg-white/5 border-white/10 text-white/60'}`}>{cat}</button>))}</div></div><div className="flex gap-3 mt-6">{editingHabitId && newItemType !== 'task' && (<button onClick={handleDeleteHabit} className="px-6 py-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-2xl transition-all flex items-center justify-center active-squish"><Trash2 size={20} /></button>)}<button onClick={handleSave} className={`flex-1 bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active-squish shadow-[0_0_20px_rgba(255,255,255,0.3)]`}><Save size={20} /> {editingHabitId ? 'Update' : 'Confirm'}</button></div></div></Modal>
        
        <main className="flex-1 p-6 pb-32 scrollbar-hide overflow-y-auto">{renderContent()}</main>
        
        {activeTab !== 'Press' && (
            <button onClick={() => { setNewItemDate(getTodayString()); setNewItemType(activeTab === 'Habits' ? 'habitTracker' : 'task'); setIsModalOpen(true); setEditingHabitId(null); setNewItemName(''); setNewItemRecurrence('none'); }} className={`fixed bottom-24 right-6 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] z-20 transition-transform active-squish animate-float-delayed`}><Plus size={28} /></button>
        )}
        
        {/* Floating Capsule Navigation */}
        <nav className={`fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-full z-30 max-w-sm mx-auto flex justify-between items-center px-2 animate-float-slow`}>
            <MobileTab label="Home" icon={<Home />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} themeColor={theme.text} />
            <MobileTab label="Calendar" icon={<CalendarIcon />} active={activeTab === 'Calendar'} onClick={() => setActiveTab('Calendar')} themeColor={theme.text} />
            <MobileTab label="Habits" icon={<List />} active={activeTab === 'Habits'} onClick={() => setActiveTab('Habits')} themeColor={theme.text} />
            <MobileTab label="Press" icon={<Newspaper />} active={activeTab === 'Press'} onClick={() => setActiveTab('Press')} themeColor={theme.text} />
            <MobileTab label="Tools" icon={<Grid />} active={activeTab === 'Social'} onClick={() => setActiveTab('Social')} themeColor={theme.text} />
            <MobileTab label="Profile" icon={<User />} active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} themeColor={theme.text} />
        </nav>
      </div>
    </div>
  );
}