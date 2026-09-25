import React from 'react';
import { AppView } from '../../types';
import { BeeLogo } from '../common/BeeLogo';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  stepNumber?: number;
  totalSteps?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  stepNumber,
  totalSteps
}) => {
  const percent = stepNumber && totalSteps ? Math.min(100, Math.round((stepNumber / totalSteps) * 100)) : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Brand Logo with Bee icon */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <BeeLogo size={30} />
          <span className="font-bold text-sm tracking-wide text-gray-900 uppercase flex items-center gap-1">
            BEEFLY
          </span>
        </div>

        {/* Header Progress Page Number (e.g. Page 1 of 6) */}
        {stepNumber && totalSteps ? (
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-yellow-50/90 border border-yellow-300/80 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500 shadow-[0_0_6px_#eab308]" />
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-yellow-950 font-mono tracking-wide">
              Page {stepNumber} of {totalSteps}
            </span>
            {/* Step indicator dots on sm screens */}
            <div className="hidden md:flex items-center gap-1 pl-1 border-l border-yellow-300/60">
              {Array.from({ length: totalSteps }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 === stepNumber
                      ? 'w-3.5 bg-yellow-600'
                      : i + 1 < stepNumber
                      ? 'w-1.5 bg-yellow-400'
                      : 'w-1.5 bg-yellow-200'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Right domain badge */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider hidden sm:inline-block">
            beefly-urls.vercel.app
          </span>
        </div>

      </div>

      {/* Progress line attached to the bottom edge of the header */}
      {stepNumber && totalSteps && (
        <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gray-100 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(234,179,8,0.5)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
};
