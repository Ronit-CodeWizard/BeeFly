import React from 'react';

interface CircularClockProps {
  secondsLeft: number;
  totalSeconds?: number;
}

/**
 * Circular Timer Clock with tactile depth effect:
 * - Recessed dial well with smooth inner inset shadow
 * - Subtle radial ambient reflection
 * - Depth-shadowed progress arc in vibrant yellow
 * - Elevated center disc casting a soft ambient drop-shadow
 * - High-contrast countdown digits (15 -> 0)
 */
export const AnalogClock: React.FC<CircularClockProps> = ({
  secondsLeft,
  totalSeconds = 15
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div 
      className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200 select-none py-2"
      aria-label={`Timer countdown: ${secondsLeft} seconds`}
    >
      {/* Sunken circular dial well with deep inset shadow for authentic depth */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-2 bg-gradient-to-b from-[#e9ecf0] to-[#f4f6f8] shadow-[inset_0_4px_10px_rgba(0,0,0,0.12),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center overflow-hidden">
        
        {/* Soft radial reflection sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_70%)] pointer-events-none" />

        {/* SVG Progress Circle with drop shadow filter */}
        <svg className="w-full h-full -rotate-90 p-1" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="clockYellowDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ca8a04" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Recessed track groove */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-gray-300/60"
            strokeWidth="6"
            fill="transparent"
          />

          {/* Active timer stroke with shadow glow */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#clockYellowDepth)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            filter="url(#arcGlow)"
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        {/* Elevated center disc creating physical layering and depth */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-white via-white to-[#f9fafb] shadow-[0_4px_10px_rgba(0,0,0,0.1),_0_1px_3px_rgba(0,0,0,0.06),_inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center">
            <span 
              key={secondsLeft}
              className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight animate-in fade-in duration-150"
            >
              {secondsLeft}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
