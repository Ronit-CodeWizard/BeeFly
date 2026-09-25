import React from 'react';
import { AppView } from '../../types';
import { BeeLogo } from '../common/BeeLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8 px-4 sm:px-6 text-xs text-gray-500 mt-auto shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <BeeLogo size={20} />
          <span className="font-bold text-gray-800">BEEFLY</span>
          <span className="text-gray-300">•</span>
          <span>© {new Date().getFullYear()} BEEFLY Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => onNavigate('terms')} 
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Terms
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => onNavigate('privacy')} 
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Privacy
          </button>
        </div>

      </div>
    </footer>
  );
};
