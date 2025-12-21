import React from 'react';
import { 
  Brain, Coffee, Hexagon, Briefcase, Moon, Zap, GitBranch, Dna, UserCircle, Snowflake, Trophy, CheckCircle, Activity, Flame, Eye, Gift, Repeat, Sun, Star, Radio, Feather, FlipVertical, Divide, Shuffle, Skull, Shield, Calculator, Binary, CalendarDays, Hash, Move, EyeOff, Music, Mic, Palette as PaletteIcon, Lock, Code, Book, Layers, PenTool, Dumbbell, Users, Lightbulb, ShoppingBag, Database, LogOut, Watch, Upload, DownloadCloud
} from 'lucide-react';

export const getTodayString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

export const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

export const addDays = (dateStr: string, days: number): string => {
    const d = parseLocalDate(dateStr);
    d.setDate(d.getDate() + days);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

export const getDaysSince = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
};

export const formatDuration = (ms: number) => {
    const hrs = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
};

export const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

export const playSound = (type: 'click' | 'success' | 'hover' | 'toggle' | 'delete' | 'tap' | 'beat' | 'tone') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    // Softer, liquid-like tones
    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.3);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
  } catch (e) { }
};

export const getIcon = (iconName: string, className?: string) => {
  const size = 18;
  const props = { size, className };
  const iconMap: Record<string, any> = {
    Brain, Coffee, Hexagon, Briefcase, Moon, Zap, GitBranch, 
    Polymath: Dna, Dna, UserCircle, Snowflake, Trophy, CheckCircle, 
    Activity, Flame, Eye, Gift, Repeat, Sun, Star, Radio, Feather, 
    FlipVertical, Divide, Shuffle, Skull, Shield, Calculator, Binary, 
    CalendarDays, Hash, Move, EyeOff, Music, Mic, Palette: PaletteIcon, 
    Lock, Code, Book, Layers, PenTool, Dumbbell, Users, Lightbulb, 
    ShoppingBag, Database, LogOut, Watch, Upload, DownloadCloud
  };

  const IconComponent = iconMap[iconName] || Activity;
  return React.createElement(IconComponent, props);
};