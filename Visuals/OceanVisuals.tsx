import React, { useEffect, useRef } from 'react';

/**
 * OCEAN THEME VISUALS - REDESIGNED
 * Features:
 * - Horizon view (looking out to sea).
 * - Layered vector waves with parallax.
 * - Celestial body with reflection on water.
 * - Dynamic sparkles/glints.
 */
export const OceanVisuals = ({ isNight }: { isNight: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backRef = useRef<HTMLDivElement>(null);
    const midRef = useRef<HTMLDivElement>(null);
    const frontRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId: number;
        let time = 0;

        // Sparkle System
        interface Sparkle {
            x: number;
            y: number;
            size: number;
            speed: number;
            opacity: number;
            maxOpacity: number;
            phase: number;
        }

        const sparkles: Sparkle[] = [];
        const maxSparkles = 60;

        // Only spawn sparkles on the water (bottom 50% roughly)
        const createSparkle = () => ({
            x: Math.random() * width,
            y: (height * 0.4) + (Math.random() * (height * 0.6)), 
            size: Math.random() * 2,
            speed: Math.random() * 0.2 + 0.05,
            opacity: 0,
            maxOpacity: Math.random() * 0.8 + 0.2,
            phase: Math.random() * Math.PI * 2
        });

        for (let i = 0; i < maxSparkles; i++) sparkles.push(createSparkle());

        const render = () => {
            time += 0.02;
            ctx.clearRect(0, 0, width, height);

            sparkles.forEach(s => {
                // Bobbing with waves
                s.x -= s.speed; 
                if (s.x < 0) s.x = width;
                
                // Twinkle
                s.opacity = (Math.sin(time + s.phase) + 1) / 2 * s.maxOpacity;
                
                ctx.fillStyle = isNight ? `rgba(100, 200, 255, ${s.opacity})` : `rgba(255, 255, 255, ${s.opacity})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        
        // Mouse Parallax
        const handleMouseMove = (e: MouseEvent) => {
            if (!backRef.current || !midRef.current || !frontRef.current) return;
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            // Subtle movement for water layers
            backRef.current.style.transform = `translate(${x * -10}px, ${y * -5}px)`;
            midRef.current.style.transform = `translate(${x * -20}px, ${y * -10}px)`;
            frontRef.current.style.transform = `translate(${x * -40}px, ${y * -15}px)`;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [isNight]);

    // THEME COLORS
    const theme = isNight ? {
        sky: 'from-[#020617] via-[#0f172a] to-[#1e293b]', // Deep Night
        sunColor: 'bg-slate-100',
        sunGlow: 'shadow-[0_0_80px_rgba(255,255,255,0.3)]',
        reflection: 'from-white/20 to-transparent',
        waterBack: '#1e293b',
        waterMid: '#0f172a',
        waterFront: '#020617'
    } : {
        sky: 'from-[#0ea5e9] via-[#38bdf8] to-[#bae6fd]', // Bright Day
        sunColor: 'bg-yellow-100',
        sunGlow: 'shadow-[0_0_100px_rgba(255,200,0,0.4)]',
        reflection: 'from-yellow-200/40 to-transparent',
        waterBack: '#0284c7', // Darker Blue
        waterMid: '#0ea5e9', // Mid Blue
        waterFront: '#38bdf8' // Light Blue
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>{`
                @keyframes wave-flow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes float-y {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>

            {/* 1. SKY */}
            <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-[3000ms] z-0 ${theme.sky}`}></div>

            {/* 2. CELESTIAL BODY (Sun/Moon) */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-[1]">
                 <div className={`w-32 h-32 rounded-full ${theme.sunColor} ${theme.sunGlow} blur-[1px] transition-all duration-1000`}></div>
            </div>

            {/* 3. CLOUDS (Distant) */}
            <div className="absolute top-[20%] left-0 w-full h-[20%] z-[1] opacity-60">
                 <div className="absolute top-0 left-[10%] w-32 h-8 bg-white/10 rounded-full blur-xl animate-[wave-flow_60s_linear_infinite]"></div>
                 <div className="absolute top-[40%] right-[20%] w-48 h-12 bg-white/10 rounded-full blur-xl animate-[wave-flow_80s_linear_infinite]"></div>
            </div>

            {/* 4. WATER REFLECTION (Under Sun) */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-24 h-[60%] z-[1]">
                 <div className={`w-full h-full bg-gradient-to-b ${theme.reflection} blur-xl`}></div>
            </div>

            {/* --- OCEAN LAYERS --- */}
            
            {/* LAYER 1: BACK (Horizon) */}
            <div ref={backRef} className="absolute bottom-[20%] left-[-20%] w-[200%] h-[40%] z-[2] transition-colors duration-1000 ease-out will-change-transform opacity-80">
                <div className="w-full h-full animate-[wave-flow_30s_linear_infinite]">
                    <svg viewBox="0 0 2880 320" preserveAspectRatio="none" className="w-full h-full">
                         <path fill={theme.waterBack} d="M0,160 C360,160 540,120 720,120 C900,120 1080,160 1440,160 C1800,160 1980,120 2160,120 C2340,120 2520,160 2880,160 L2880,320 L0,320 Z" />
                    </svg>
                </div>
            </div>

            {/* LAYER 2: MID */}
            <div ref={midRef} className="absolute bottom-[0%] left-[-20%] w-[200%] h-[45%] z-[3] transition-colors duration-1000 ease-out will-change-transform opacity-90">
                <div className="w-full h-full animate-[wave-flow_20s_linear_infinite]">
                     <svg viewBox="0 0 2880 320" preserveAspectRatio="none" className="w-full h-full">
                         <path fill={theme.waterMid} d="M0,192 C480,192 720,128 960,128 C1200,128 1440,192 1920,192 C2400,192 2640,128 2880,128 L2880,320 L0,320 Z" />
                     </svg>
                </div>
            </div>

            {/* LAYER 3: FRONT */}
            <div ref={frontRef} className="absolute bottom-[-10%] left-[-20%] w-[200%] h-[50%] z-[4] transition-colors duration-1000 ease-out will-change-transform">
                <div className="w-full h-full animate-[wave-flow_10s_linear_infinite]">
                     <svg viewBox="0 0 2880 320" preserveAspectRatio="none" className="w-full h-full">
                         <path fill={theme.waterFront} d="M0,224 C480,224 720,160 960,160 C1200,160 1440,224 1920,224 C2400,224 2640,160 2880,160 L2880,320 L0,320 Z" />
                     </svg>
                </div>
            </div>

            {/* 5. CANVAS (Sparkles) */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[5]" />

            {/* 6. VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.2))] pointer-events-none z-[6]"></div>
        </div>
    );
};
