import React from 'react';
import { THEMES } from '../utils/constants';

/**
 * DEFAULT LIQUID ATMOSPHERE
 * The original moving blob background
 */
export const DefaultAtmosphere = ({ theme, isNight }: { theme: any, isNight: boolean }) => {
    // Fallback to Sunset if theme.blobs is missing, as 'Clean' might not exist in THEMES
    const blobs = theme.blobs || THEMES['Sunset'].blobs;
    return (
        <>
            <div className={`absolute inset-0 transition-opacity duration-[5000ms] ${isNight ? 'opacity-40' : 'opacity-80'}`} style={{background: `radial-gradient(circle at bottom, ${blobs[2]}22 0%, #000000 70%)`}}></div>
            <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[80px] animate-aurora opacity-30" style={{background: blobs[0]}}></div>
            <div className="absolute top-[60%] right-[10%] w-80 h-80 rounded-full mix-blend-screen filter blur-[100px] animate-aurora opacity-30" style={{background: blobs[1], animationDelay: '-5s'}}></div>
            <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[120px] animate-aurora opacity-20" style={{background: blobs[2], animationDelay: '-2s'}}></div>
        </>
    );
};