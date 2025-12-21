import React, { useEffect, useRef } from 'react';

/**
 * NATURE THEME VISUALS
 * Features:
 * - Falling leaves using Canvas API for performance
 * - Blurred tree silhouettes using SVG background
 * - Ambient lighting
 * - Dynamic swaying grass and tree trunk
 * - Dark Golden Tyndall Effect (God Rays)
 */
export const NatureVisuals = ({ isNight }: { isNight: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationId: number;

        // Leaf Particle System
        const leaves: any[] = [];
        const maxLeaves = 40;

        const createLeaf = (reset = false) => ({
            x: Math.random() * width,
            y: reset ? -10 : Math.random() * height,
            size: Math.random() * 3 + 2, // Size 2-5
            speedY: Math.random() * 0.3 + 0.1, // Slow falling
            speedX: Math.random() * 0.2 - 0.1, // Drift
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.4 + 0.1
        });

        // Init
        for (let i = 0; i < maxLeaves; i++) leaves.push(createLeaf());

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Leaves
            leaves.forEach(leaf => {
                leaf.y += leaf.speedY;
                leaf.x += leaf.speedX + Math.sin(leaf.y * 0.01) * 0.2;
                leaf.rotation += leaf.rotationSpeed;

                if (leaf.y > height) Object.assign(leaf, createLeaf(true));

                ctx.save();
                ctx.translate(leaf.x, leaf.y);
                ctx.rotate(leaf.rotation);
                ctx.globalAlpha = leaf.opacity;
                ctx.fillStyle = isNight ? '#a7f3d0' : '#dcfce7'; // Subtle green/white
                
                // Draw leaf shape (ellipse)
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
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
    }, [isNight]);

    // Colors
    const treeColor = isNight ? '%23022c22' : '%23064e3b'; // dark emeralds for grass
    const trunkColor = '#050505'; // Pure blackish shade for silhouette

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>{`
                @keyframes sway-trunk {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(0.5deg); }
                }
                @keyframes sway-grass-1 {
                    0% { transform: translateX(0) skewX(0deg); }
                    50% { transform: translateX(10px) skewX(-2deg); }
                    100% { transform: translateX(0) skewX(0deg); }
                }
                @keyframes sway-grass-2 {
                    0% { transform: translateX(0) skewX(0deg); }
                    50% { transform: translateX(-15px) skewX(3deg); }
                    100% { transform: translateX(0) skewX(0deg); }
                }
                @keyframes tyndall-pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.02); }
                }
                @keyframes ray-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(5deg); }
                }
            `}</style>

            {/* Deep Atmosphere Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${isNight ? 'from-black via-[#064e3b] to-black' : 'from-[#064e3b] via-[#065f46] to-black'} opacity-40 transition-colors duration-[5000ms] z-0`}></div>

            {/* TYNDALL EFFECT (God Rays) - Increased Opacity */}
            <div className="absolute inset-0 z-[1] overflow-hidden mix-blend-screen">
                {/* Source Glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-yellow-500/20 blur-[100px]" />
                
                {/* Rays Container */}
                <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] flex items-center justify-center" style={{ animation: 'ray-rotate 60s infinite alternate ease-in-out' }}>
                     {/* Conic Gradient for Beams - Stronger colors */}
                     <div 
                        className="w-full h-full" 
                        style={{
                            background: `conic-gradient(from 220deg at 50% 50%, 
                                transparent 0deg, 
                                ${isNight ? 'rgba(184, 134, 11, 0.0)' : 'rgba(218, 165, 32, 0.0)'} 15deg,
                                ${isNight ? 'rgba(184, 134, 11, 0.3)' : 'rgba(255, 215, 0, 0.4)'} 25deg,
                                ${isNight ? 'rgba(184, 134, 11, 0.0)' : 'rgba(218, 165, 32, 0.0)'} 40deg,
                                ${isNight ? 'rgba(139, 69, 19, 0.4)' : 'rgba(255, 223, 0, 0.5)'} 55deg,
                                transparent 70deg,
                                ${isNight ? 'rgba(184, 134, 11, 0.2)' : 'rgba(218, 165, 32, 0.3)'} 80deg,
                                transparent 100deg
                            )`,
                            filter: 'blur(40px)',
                            animation: 'tyndall-pulse 8s infinite ease-in-out'
                        }}
                     />
                </div>
            </div>

            {/* Large Tree Trunk Silhouette (Right Side) */}
            <div 
                className="absolute top-0 right-[-10%] w-[60vh] h-full z-[2] opacity-100 blur-[0.5px]"
                style={{ 
                    animation: 'sway-trunk 15s ease-in-out infinite', 
                    transformOrigin: 'bottom center'
                }}
            >
                <svg viewBox="0 0 200 800" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'blur(0.5px)' }}>
                    {/* Main Trunk */}
                    <path 
                        d="M140,800 C120,700 150,600 130,500 C110,400 160,300 140,200 C130,150 80,100 20,80 L20,60 C80,80 140,120 160,180 C180,240 160,300 170,400 C180,500 160,600 180,700 C190,750 200,800 200,800 L140,800 Z" 
                        fill={trunkColor}
                        fillOpacity="1"
                    />
                    
                    {/* Lower Branch */}
                    <path 
                        d="M140,450 Q90,420 40,460 L35,455 Q90,410 145,440 Z" 
                        fill={trunkColor} 
                        fillOpacity="1"
                    />
                     {/* Mid Branch (New) */}
                    <path 
                        d="M130,350 Q80,300 10,330 L5,325 Q80,290 135,340 Z" 
                        fill={trunkColor} 
                        fillOpacity="1"
                    />
                    {/* Upper Branch */}
                    <path 
                        d="M140,250 Q100,200 40,220 L35,215 Q100,190 145,240 Z" 
                        fill={trunkColor} 
                        fillOpacity="1"
                    />
                    {/* High Branch (New) */}
                    <path 
                        d="M150,150 Q110,100 30,120 L25,115 Q110,90 155,140 Z" 
                        fill={trunkColor} 
                        fillOpacity="1"
                    />
                    {/* Top Top Branch (New) */}
                    <path 
                        d="M80,100 Q40,60 0,70 L0,65 Q40,50 85,90 Z" 
                        fill={trunkColor} 
                        fillOpacity="1"
                    />
                </svg>
            </div>

            {/* Grass Layer 1 (Back, Slower) */}
            <div className="absolute bottom-[-10%] left-[-10%] right-[-10%] h-[30vh] opacity-50 blur-[3px] z-[3]"
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' preserveAspectRatio='none'%3E%3Cpath fill='${treeColor}' d='M0,100 L0,40 Q25,80 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40 T450,40 T500,40 T550,40 T600,40 T650,40 T700,40 T750,40 T800,40 T850,40 T900,40 T950,40 T1000,40 L1000,100 Z'/%3E%3C/svg%3E")`,
                     backgroundSize: '200% 100%',
                     backgroundPosition: 'bottom',
                     animation: 'sway-grass-1 12s infinite ease-in-out'
                 }}
            ></div>

            {/* Grass Layer 2 (Front, Faster, Sharp) */}
            <div className="absolute bottom-[-5%] left-[-10%] right-[-10%] h-[25vh] opacity-70 blur-[1px] z-[4]"
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' preserveAspectRatio='none'%3E%3Cpath fill='${treeColor}' d='M0,100 L0,60 L10,20 L20,60 L30,30 L40,60 L50,10 L60,60 L70,40 L80,60 L90,20 L100,60 L110,30 L120,60 L130,10 L140,60 L150,40 L160,60 L170,20 L180,60 L190,30 L200,60 L210,10 L220,60 L230,40 L240,60 L250,20 L260,60 L270,30 L280,60 L290,10 L300,60 L310,40 L320,60 L330,20 L340,60 L350,30 L360,60 L370,10 L380,60 L390,40 L400,60 L410,20 L420,60 L430,30 L440,60 L450,10 L460,60 L470,40 L480,60 L490,20 L500,60 L510,30 L520,60 L530,10 L540,60 L550,40 L560,60 L570,20 L580,60 L590,30 L600,60 L610,10 L620,60 L630,40 L640,60 L650,20 L660,60 L670,30 L680,60 L690,10 L700,60 L710,40 L720,60 L730,20 L740,60 L750,30 L760,60 L770,10 L780,60 L790,40 L800,60 L810,20 L820,60 L830,30 L840,60 L850,10 L860,60 L870,40 L880,60 L890,20 L900,60 L910,30 L920,60 L930,10 L940,60 L950,40 L960,60 L970,20 L980,60 L990,30 L1000,60 L1000,100 Z'/%3E%3C/svg%3E")`,
                     backgroundSize: '150% 100%',
                     backgroundPosition: 'bottom',
                     animation: 'sway-grass-2 8s infinite ease-in-out'
                 }}
            ></div>

            {/* Leaves Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[5]" />
        </div>
    );
};