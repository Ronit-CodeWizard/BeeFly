import React from 'react';
import { AppView } from '../../types';
import { BeeLogo } from '../common/BeeLogo';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand Logo with Bee icon - clean without depth container */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <BeeLogo size={32} />
          <span className="font-bold text-sm tracking-wide text-gray-900 uppercase flex items-center gap-1">
            BEEFLY
          </span>
        </div>

        {/* Minimal clean header without menu links */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider hidden sm:inline-block">
            beefly-urls.vercel.app
          </span>
        </div>

      </div>
    </header>
  );
};
