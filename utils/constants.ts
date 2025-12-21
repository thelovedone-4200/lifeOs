import { 
    Brain, Coffee, Hexagon, Briefcase, Moon, Zap, GitBranch, Dna, UserCircle, Snowflake, Trophy, CheckCircle, Activity, Flame, Eye, Gift, Repeat, Sun, Star, Radio, Feather, FlipVertical, Divide, Shuffle, Skull, Shield, Calculator, Binary, CalendarDays, Hash, Move, EyeOff, Music, Mic, Palette as PaletteIcon, Lock, Code, Book, Layers, PenTool, Dumbbell, Users, Lightbulb, ShoppingBag, Database, LogOut, Watch, Upload, DownloadCloud
} from 'lucide-react';

export const APP_VERSION = "7.7.0-MODULAR"; 

export const KEYS = {
    SKILLS: 'hb_store_skills',
    TASKS: 'hb_store_tasks',
    HABITS: 'hb_store_habits',
    HISTORY: 'hb_store_history',
    USERNAME: 'hb_store_username',
    PROTOCOL: 'hb_store_protocol',
    STREAK: 'hb_store_streak',
    RIVALS: 'hb_store_rivals',
    INVENTORY: 'hb_store_inventory',
    CURRENCY: 'hb_store_currency',
    DAILY_CHALLENGE: 'hb_store_daily_challenge',
    THEME: 'hb_store_theme',
    FONT: 'hb_store_font',
    SLEEP_STATE: 'hb_store_sleep_state',
    SLEEP_CONFIG: 'hb_store_sleep_config',
    NEXUS: 'hb_store_nexus',
    NOTES: 'hb_store_notes',
    FLASHCARDS: 'hb_store_flashcards',
    READING: 'hb_store_reading',
    PRESS_DRAFTS: 'hb_store_press_drafts',
};

export const THEMES: Record<string, any> = {
    'Snow': { name: 'Snow', blobs: ['#e2e8f0', '#cbd5e1', '#94a3b8'], primary: 'bg-slate-200', text: 'text-slate-800', accent: 'text-slate-600', chart: '#e2e8f0' },
    'Nature': { name: 'Nature', blobs: ['#059669', '#10b981', '#34d399'], primary: 'bg-emerald-500', text: 'text-emerald-100', accent: 'text-emerald-400', chart: '#34d399' },
    'Ocean': { name: 'Ocean', blobs: ['#2563eb', '#3b82f6', '#60a5fa'], primary: 'bg-blue-500', text: 'text-blue-100', accent: 'text-blue-400', chart: '#60a5fa' },
    'Sunset': { name: 'Sunset', blobs: ['#e11d48', '#f43f5e', '#fb7185'], primary: 'bg-rose-500', text: 'text-rose-100', accent: 'text-rose-400', chart: '#f43f5e' },
    'Night': { name: 'Night', blobs: ['#0f172a', '#1e293b', '#334155'], primary: 'bg-slate-900', text: 'text-slate-200', accent: 'text-slate-400', chart: '#94a3b8' }
};

export const FONTS: Record<string, string> = {
    'Modern': 'font-sans', // Inter
    'Typewriter': 'font-mono', // JetBrains Mono
    'Classic': 'font-serif', // Playfair
    'Bold': 'font-space', // Space Grotesk
};

export const PILLAR_KEYS = ['Learn', 'Create', 'Mind', 'Health', 'Social'];

export const POLYMATH_KEYWORDS = [
        ['learn', 'read', 'study', 'research', 'explore', 'analyze', 'math', 'logic', 'book', 'course', 'class'],
        ['make', 'build', 'write', 'code', 'art', 'design', 'ship', 'project', 'draw', 'paint', 'craft'],
        ['connect', 'synthesize', 'solve', 'system', 'optimize', 'meditate', 'plan', 'think', 'reflect', 'journal'],
        ['sport', 'train', 'dance', 'move', 'eat', 'sleep', 'fast', 'run', 'gym', 'walk', 'yoga'],
        ['speak', 'lead', 'teach', 'share', 'debate', 'network', 'social', 'friend', 'family', 'call']
];

export const CHART_COLORS = ['#3b82f6', '#10b981', '#eab308', '#a855f7', '#f43f5e'];

export const TIERS = [
  { name: 'Beginner', limit: 20 },
  { name: 'Intermediate', limit: 45 },
  { name: 'Advanced', limit: 70 },
  { name: 'Expert', limit: 100 }
];

export const SHOP_ITEMS = [
    { id: 'freeze', name: 'Streak Freeze', cost: 500, icon: 'Snowflake', desc: 'Miss a day without losing your streak.', type: 'consumable' },
    { id: 'neuro_stim', name: 'Score Boost', cost: 1500, icon: 'Zap', desc: '+10 Score to your lowest area.', type: 'consumable' },
];

export const ACHIEVEMENTS = [
    { id: 'streak_7', name: 'On Fire', desc: '7 day streak', icon: 'Flame', condition: (data: any) => data.streak >= 7 },
    { id: 'xp_1000', name: 'High Flyer', desc: 'Earn 1,000 Total XP', icon: 'Zap', condition: (data: any) => data.xp >= 1000 },
    { id: 'tasks_50', name: 'Doer', desc: 'Complete 50 Tasks', icon: 'CheckCircle', condition: (data: any) => data.tasks >= 50 },
    { id: 'balance_50', name: 'Balanced', desc: 'All areas above 50%', icon: 'Activity', condition: (data: any) => data.minScore >= 50 }
];