import React from 'react';
import { NatureVisuals } from './NatureVisuals';
import { SunsetVisuals } from './SunsetVisuals';
import { OceanVisuals } from './OceanVisuals';
import { NightVisuals } from './NightVisuals';
import { SnowVisuals } from './SnowVisuals';
import { DefaultAtmosphere } from './DefaultAtmosphere';

/**
 * MAIN BACKGROUND MANAGER
 */
export const BackgroundVisuals = ({ theme, isNight }: { theme: any, isNight: boolean }) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-black transition-colors duration-1000">
            {theme.name === 'Nature' ? (
                <NatureVisuals isNight={isNight} />
            ) : theme.name === 'Sunset' ? (
                <SunsetVisuals isNight={isNight} />
            ) : theme.name === 'Ocean' ? (
                <OceanVisuals isNight={isNight} />
            ) : theme.name === 'Night' ? (
                <NightVisuals isNight={isNight} />
            ) : theme.name === 'Snow' ? (
                <SnowVisuals isNight={isNight} />
            ) : (
                <DefaultAtmosphere theme={theme} isNight={isNight} />
            )}
            
            {/* Universal Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
        </div>
    );
};