import React, { useEffect, useRef } from 'react';

/**
 * SUNSET THEME VISUALS
 * Features:
 * - Reddish/Orange burning sky
 * - Setting sun with penetrating "God Rays" (Conic Gradients)
 * - Darker, warmer mountain silhouettes
 * - Canvas birds & embers
 */
export const SunsetVisuals = ({ isNight }: { isNight: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId: number;

        // --- BIRDS SYSTEM ---
        const birds: any[] = [];
        const maxBirds = isNight ? 5 : 45; // Increased birds for more activity
        
        const createBird = (x: number) => {
            const depth = Math.random(); // 0 to 1, where 1 is closer/larger
            return {
                x: x,
                y: Math.random() * (height * 0.6) + 20, // Spread across top 60% of screen
                speed: (Math.random() * 1.5 + 0.8) * (depth * 0.5 + 0.5), // Closer birds move slightly faster
                wingSpan: (Math.random() * 8 + 6) * (depth * 0.6 + 0.4), // Size varies by depth
                flapSpeed: Math.random() * 0.2 + 0.15,
                flapOffset: Math.random() * Math.PI,
                drift: (Math.random() - 0.5) * 0.5 // Slight vertical drift
            };
        };

        for(let i=0; i<maxBirds; i++) birds.push(createBird(Math.random() * width));

        // --- EMBERS SYSTEM ---
        const particles: any[] = [];
        const maxParticles = 40;
        
        const createParticle = (reset = false) => ({
            x: Math.random() * width,
            y: reset ? height + 10 : Math.random() * height,
            size: Math.random() * 2 + 1,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.3
        });
        
        for(let i=0; i<maxParticles; i++) particles.push(createParticle());

        let time = 0;

        const render = () => {
            time += 0.02;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Birds (High Contrast)
            ctx.lineWidth = 2.5; // Thicker lines
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#1a0505'; // Almost black, very dark brown
            
            birds.forEach(bird => {
                bird.x += bird.speed;
                bird.y += bird.drift; // Slight vertical movement
                
                // Wrap around
                if (bird.x > width + 40) {
                    bird.x = -40;
                    bird.y = Math.random() * (height * 0.6) + 20;
                }

                const flap = Math.sin(time * 8 * bird.flapSpeed + bird.flapOffset) * 5; // Amplified flap
                
                ctx.beginPath();
                // Simple V shape with curve
                const yPos = bird.y + flap;
                
                ctx.moveTo(bird.x, bird.y);
                ctx.quadraticCurveTo(
                    bird.x - bird.wingSpan, bird.y - 10 + flap, // Control point higher
                    bird.x - bird.wingSpan * 1.5, bird.y + flap // Wing tip
                );
                
                ctx.moveTo(bird.x, bird.y);
                ctx.quadraticCurveTo(
                    bird.x + bird.wingSpan, bird.y - 10 + flap,
                    bird.x + bird.wingSpan * 1.5, bird.y + flap
                );
                
                ctx.stroke();
            });

            // 2. Draw Particles (Embers)
            particles.forEach(p => {
                p.y -= p.speedY;
                p.x += Math.sin(time + p.y * 0.01) * 0.3;
                if (p.y < -10) Object.assign(p, createParticle(true));
                
                ctx.fillStyle = `rgba(255, 200, 50, ${p.opacity})`; // Gold embers
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId = requestAnimationFrame(render);
        };

        render();
        const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationId); };
    }, [isNight]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>{`
                @keyframes sun-glow {
                    0%, 100% { box-shadow: 0 0 60px 30px rgba(255, 140, 0, 0.6); }
                    50% { box-shadow: 0 0 100px 50px rgba(255, 100, 0, 0.8); }
                }
                @keyframes ray-spin-1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes ray-spin-2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                @keyframes parallax-1 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-10px); } }
                @keyframes parallax-2 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-20px); } }
                @keyframes parallax-3 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-40px); } }
            `}</style>

            {/* 1. SKY GRADIENT - STRICTLY ORANGE/RED/YELLOW */}
            <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-[5000ms]
                ${isNight 
                    ? 'from-black via-[#450a0a] to-[#7f1d1d]' // Deep Night Red
                    : 'from-[#7f1d1d] via-[#ea580c] to-[#f59e0b]' // Deep Red -> Orange -> Amber
                } opacity-100`}></div>

            {/* 2. THE SUN (Bottom Center) */}
            <div className={`absolute bottom-[-15vh] left-1/2 -translate-x-1/2 w-[60vh] h-[60vh] rounded-full blur-[4px] z-[0]
                ${isNight 
                    ? 'bg-orange-900/50' 
                    : 'bg-gradient-to-t from-yellow-300 via-orange-500 to-red-600'
                }`}
                style={{ animation: isNight ? 'none' : 'sun-glow 8s infinite alternate' }}
            ></div>

            {/* 3. GOD RAYS (Beaming from Sun to Top) */}
            {!isNight && (
                <div className="absolute bottom-[-15vh] left-1/2 -translate-x-1/2 w-[200vh] h-[200vh] z-[1] pointer-events-none mix-blend-overlay opacity-60">
                    {/* Layer 1: Slow Rotate Clockwise */}
                    <div className="absolute inset-0 animate-[ray-spin-1_120s_linear_infinite]">
                        <div className="w-full h-full" style={{
                            background: `repeating-conic-gradient(
                                from 0deg at 50% 50%,
                                rgba(255, 200, 0, 0.1) 0deg,
                                rgba(255, 200, 0, 0.1) 5deg,
                                transparent 5deg,
                                transparent 25deg
                            )`
                        }}></div>
                    </div>
                    {/* Layer 2: Slow Rotate Counter-Clockwise */}
                    <div className="absolute inset-0 animate-[ray-spin-2_180s_linear_infinite]">
                        <div className="w-full h-full" style={{
                            background: `repeating-conic-gradient(
                                from 180deg at 50% 50%,
                                rgba(255, 220, 100, 0.15) 0deg,
                                rgba(255, 220, 100, 0.15) 3deg,
                                transparent 3deg,
                                transparent 35deg
                            )`
                        }}></div>
                    </div>
                    {/* Layer 3: Central Beam Glow */}
                    <div className="absolute inset-0" style={{
                        background: `radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.3) 0%, transparent 60%)`
                    }}></div>
                </div>
            )}

            {/* 4. MOUNTAINS */}
            <div className="absolute bottom-0 w-[120%] left-[-10%] opacity-80 z-[2]" style={{ animation: 'parallax-1 20s infinite ease-in-out' }}>
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[60vh]">
                    <path fill={isNight ? '#2a0a0a' : '#9a3412'} d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            {/* 6. VIGNETTE OVERLAY (Reduced opacity, Z-5, BELOW birds) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30 z-[5] pointer-events-none"></div>
            
            {/* 7. CANVAS EFFECTS (Birds - Z-Index 6, ABOVE Vignette) */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[6]" />
        </div>
    );
};