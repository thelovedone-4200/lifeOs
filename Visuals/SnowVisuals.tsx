import React, { useEffect, useRef } from 'react';

/**
 * SNOW THEME VISUALS - REDESIGNED
 * Features:
 * - Sharp, low-poly vector mountains inspired by reference.
 * - Distinct light/shadow sides (2-tone shading).
 * - Layered depth (Back, Mid, Front).
 * - Gentle falling snow.
 */
export const SnowVisuals = ({ isNight }: { isNight: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId: number;
        let time = 0;

        // Snow Particle System
        interface Snowflake {
            x: number;
            y: number;
            size: number;
            speed: number;
            swaySpeed: number;
            opacity: number;
            rotation: number;
            rotationSpeed: number;
            char: string;
        }

        const snowflakes: Snowflake[] = [];
        const maxSnowflakes = 100;
        const chars = ['❄', '❅', '❆', '•'];

        const createSnowflake = (reset = false) => ({
            x: Math.random() * width,
            y: reset ? -20 : Math.random() * height,
            size: Math.random() * 12 + 8,
            speed: Math.random() * 0.4 + 0.1, // Slow, floaty
            swaySpeed: Math.random() * 0.01 + 0.002,
            opacity: Math.random() * 0.6 + 0.2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            char: chars[Math.floor(Math.random() * chars.length)]
        });

        for (let i = 0; i < maxSnowflakes; i++) snowflakes.push(createSnowflake());

        const render = () => {
            time += 0.005;
            ctx.clearRect(0, 0, width, height);

            snowflakes.forEach(flake => {
                flake.y += flake.speed;
                flake.x += Math.sin(time + flake.swaySpeed) * 0.3; 
                flake.rotation += flake.rotationSpeed;

                if (flake.y > height + 20) Object.assign(flake, createSnowflake(true));
                if (flake.x > width + 20) flake.x = -20;
                if (flake.x < -20) flake.x = width + 20;

                ctx.save();
                ctx.translate(flake.x, flake.y);
                ctx.rotate((flake.rotation * Math.PI) / 180);
                
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.shadowBlur = 2;
                ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

                if (flake.char === '•') {
                     ctx.beginPath();
                     ctx.arc(0, 0, flake.size/6, 0, Math.PI * 2);
                     ctx.fill();
                } else {
                    ctx.font = `${flake.size}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(flake.char, 0, 0);
                }
                
                ctx.restore();
            });

            animationId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    // THEME COLORS (Based on reference style)
    // Day: Crisp Blues (Shadows) and Whites (Highlights)
    // Night: Dark Slates and Greys
    const theme = isNight ? {
        sky: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
        
        // Back Layer (Distant)
        backBase: '#1e293b', 
        backHighlight: '#334155', 
        
        // Mid Layer
        midBase: '#0f172a',
        midHighlight: '#1e293b',
        
        // Front Layer
        frontBase: '#020617',
        frontHighlight: '#1e293b'
    } : {
        sky: 'from-[#dbeafe] via-[#eff6ff] to-[#ffffff]', // Ice Blue Sky
        
        // Back Layer (Lightest Blue)
        backBase: '#93c5fd', // Blue 300
        backHighlight: '#ffffff', // White
        
        // Mid Layer (Medium Blue)
        midBase: '#60a5fa', // Blue 400
        midHighlight: '#dbeafe', // Blue 100
        
        // Front Layer (Darkest Blue)
        frontBase: '#3b82f6', // Blue 500
        frontHighlight: '#bfdbfe' // Blue 200
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 1. Sky Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-[3000ms] z-0 ${theme.sky}`}></div>
            
            {/* 2. Celestial Body (Winter Sun/Moon) */}
            <div className="absolute top-[10%] right-[20%] z-[1]">
                 <div className={`rounded-full blur-xl transition-all duration-[3000ms]
                    ${isNight 
                        ? 'w-24 h-24 bg-white/20 shadow-[0_0_60px_rgba(255,255,255,0.2)]' 
                        : 'w-32 h-32 bg-white/60 shadow-[0_0_80px_rgba(255,255,255,0.6)]'
                    }`}
                 ></div>
            </div>

            {/* LAYER 1: DISTANT MOUNTAINS (Back) */}
            {/* Sharp peaks, smaller relative size */}
            <div className="absolute bottom-[0%] left-0 w-[120%] h-[60%] z-[1] transition-colors duration-1000">
                <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
                    <g transform="translate(0, 50)">
                        {/* Shadow Side (Base) */}
                        <path fill={theme.backBase} d="M0,400 L0,200 L200,50 L450,250 L600,150 L850,350 L1050,100 L1250,250 L1440,150 L1440,400 Z" />
                        
                        {/* Highlight Side (Snowy slopes facing right) */}
                        <path fill={theme.backHighlight} opacity="0.8" d="
                            M200,50 L300,130 L280,180 L200,50 Z
                            M600,150 L700,230 L650,280 L600,150 Z
                            M1050,100 L1150,180 L1120,220 L1050,100 Z
                            M1440,150 L1400,180 L1440,220 Z
                        " />
                    </g>
                </svg>
            </div>

            {/* LAYER 2: MID RANGE (Closer, prominent peaks) */}
            <div className="absolute bottom-[0%] left-[-5%] w-[110%] h-[50%] z-[2] transition-colors duration-1000">
                <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
                     <g transform="translate(0, 50)">
                        {/* Shadow Side - LEFT PEAK RAISED (150 -> 120) */}
                        <path fill={theme.midBase} d="M-100,400 L100,120 L400,350 L700,100 L1000,350 L1300,150 L1540,400 Z" />
                        
                        {/* Highlight Side - LEFT PEAK MATCHED */}
                        <path fill={theme.midHighlight} opacity="0.9" d="
                            M100,120 L200,230 L150,300 L100,120 Z
                            M700,100 L850,220 L780,280 L700,100 Z
                            M1300,150 L1400,250 L1350,300 L1300,150 Z
                        " />
                     </g>
                </svg>
            </div>

            {/* LAYER 3: FOREGROUND (Framing slopes) */}
            <div className="absolute bottom-0 w-full h-[35%] z-[3] transition-colors duration-1000">
                 <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
                    {/* Left Slope Shadow - PEAK RAISED SIGNIFICANTLY (100 -> 40) */}
                    <path fill={theme.frontBase} d="M0,320 L0,40 L650,320 Z" />
                    {/* Left Slope Highlight - MATCHED */}
                    <path fill={theme.frontHighlight} opacity="0.6" d="M0,40 L180,160 L120,250 L0,40 Z" />

                    {/* Right Slope Shadow */}
                    <path fill={theme.frontBase} d="M1440,320 L1440,50 L800,320 Z" />
                    {/* Right Slope Highlight */}
                    <path fill={theme.frontHighlight} opacity="0.6" d="M1440,50 L1200,180 L1300,250 L1440,50 Z" />
                    
                    {/* Valley Floor Connection */}
                    <path fill={theme.frontHighlight} opacity="0.2" d="M400,320 L700,280 L1000,320 Z" />
                 </svg>
            </div>

            {/* 4. Snow Canvas (Foreground) */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[10]" />

            {/* 5. Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.1))] pointer-events-none z-[11]"></div>
        </div>
    );
};