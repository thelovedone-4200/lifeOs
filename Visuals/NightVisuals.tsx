import React, { useEffect, useRef } from 'react';

/**
 * NIGHT THEME VISUALS
 * Features:
 * - Absolute Black Sky
 * - Bright Canvas Stars
 * - Frequent Shooting Stars
 * - Glowing Moon (Top Right)
 * - Silhouette Owl on Branch (Bottom Left)
 */
export const NightVisuals = ({ isNight }: { isNight: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId: number;
        let tick = 0;

        // Star Interface
        interface Star {
            x: number;
            y: number;
            size: number;
            baseAlpha: number;
            twinkleSpeed: number;
            twinkleOffset: number;
        }

        const stars: Star[] = [];
        const numStars = 200; // Increased count for black background contrast

        // Init Stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                baseAlpha: Math.random() * 0.7 + 0.3, // Brighter stars
                twinkleSpeed: Math.random() * 0.03 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        // Shooting Star Interface
        interface ShootingStar {
            x: number;
            y: number;
            length: number;
            speed: number;
            angle: number;
            life: number;
            maxLife: number;
        }
        
        let shootingStar: ShootingStar | null = null;

        const render = () => {
            tick++;
            ctx.clearRect(0, 0, width, height);

            // Draw Static Stars
            stars.forEach(star => {
                const alpha = star.baseAlpha + Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.2;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, alpha))})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Handle Shooting Star
            if (!shootingStar) {
                // Increased chance for shooting stars to make them more frequent
                if (Math.random() < 0.008) { 
                    shootingStar = {
                        x: Math.random() * width,
                        y: Math.random() * (height / 3), // Start in top third
                        length: 0,
                        speed: Math.random() * 15 + 15, // Fast
                        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1), 
                        life: 0,
                        maxLife: 30
                    };
                }
            } else {
                shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
                shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle);
                shootingStar.life++;
                shootingStar.length = Math.min(shootingStar.length + 5, 150);

                if (shootingStar.life > shootingStar.maxLife || shootingStar.x > width || shootingStar.y > height) {
                    shootingStar = null;
                } else {
                    // Draw Tail
                    const tailX = shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle);
                    const tailY = shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle);
                    
                    const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
                    gradient.addColorStop(0, 'rgba(255,255,255,1)');
                    gradient.addColorStop(1, 'rgba(255,255,255,0)');
                    
                    ctx.beginPath();
                    ctx.moveTo(shootingStar.x, shootingStar.y);
                    ctx.lineTo(tailX, tailY);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }

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

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
             {/* Absolute Black Background */}
            <div className="absolute inset-0 bg-black z-0"></div>
            
            {/* Stars Canvas (Behind Moon/Owl) */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1]" />

            {/* Moon (Top Right) */}
            <div className="absolute top-[10%] right-[10%] w-20 h-20 sm:w-32 sm:h-32 rounded-full z-[2]">
                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-slate-100 shadow-[0_0_80px_rgba(255,255,255,0.4)]"></div>
                {/* Surface Texture (Subtle) */}
                <div className="absolute top-4 left-6 w-3 h-3 bg-slate-300/30 rounded-full"></div>
                <div className="absolute bottom-8 right-6 w-6 h-6 bg-slate-300/20 rounded-full"></div>
                <div className="absolute top-1/2 left-4 w-4 h-4 bg-slate-300/20 rounded-full"></div>
            </div>

            {/* Owl on Branch (Bottom Left) */}
            <div className="absolute bottom-[5%] left-0 w-[60vw] max-w-[400px] h-[40vh] z-[3]">
                 <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
                     <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                     </defs>
                     
                     {/* Branch */}
                     <path d="M-10,250 Q100,240 220,260" stroke="#0f0f0f" strokeWidth="12" fill="none" strokeLinecap="round"/>
                     <path d="M150,255 Q180,220 200,200" stroke="#0f0f0f" strokeWidth="6" fill="none" strokeLinecap="round"/>

                     {/* Owl Silhouette */}
                     <g transform="translate(140, 195) scale(0.8)">
                        {/* Body */}
                        <path d="M30,0 Q60,0 60,50 Q60,90 30,90 Q0,90 0,50 Q0,0 30,0 Z" fill="#050505"/>
                        {/* Head/Ears */}
                        <path d="M10,10 L5,-5 L25,5 L35,5 L55,-5 L50,10 Z" fill="#050505"/>
                        {/* Eyes (Yellow & Glowing, Blinking) */}
                        <circle cx="20" cy="20" r="4" fill="#fbbf24" filter="url(#glow)">
                            <animate attributeName="opacity" values="1;0.1;1" dur="4s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <circle cx="40" cy="20" r="4" fill="#fbbf24" filter="url(#glow)">
                             <animate attributeName="opacity" values="1;0.1;1" dur="4s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        {/* Beak */}
                        <path d="M28,28 L32,28 L30,35 Z" fill="#1a1a1a"/>
                        {/* Feet */}
                        <path d="M20,85 L20,95" stroke="#050505" strokeWidth="3"/>
                        <path d="M40,85 L40,95" stroke="#050505" strokeWidth="3"/>
                     </g>
                 </svg>
            </div>
            
            {/* Vignette to blend edges */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent,black)] pointer-events-none z-[4]"></div>
        </div>
    );
};