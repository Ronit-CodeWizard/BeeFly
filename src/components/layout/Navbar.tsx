import React from 'react';
import { ShieldCheck, PlayCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'shortener' | 'links' | 'how-it-works';
  setActiveTab: (tab: 'shortener' | 'links' | 'how-it-works') => void;
  onQuickTest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickTest
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* BeeFly Minimalist Brand */}
        <div 
          onClick={() => setActiveTab('shortener')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs text-base">
            🐝
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-xl text-slate-950 tracking-tight">
                Bee<span className="text-amber-500">Fly</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-mono">
                AdSense
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('shortener')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'shortener'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Shrink Link
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'links'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My URLs
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'how-it-works'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            How it Works
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            ca-pub-9267601428341390
          </span>

          <button
            onClick={onQuickTest}
            className="px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Test 3-Step Flow</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-100 bg-slate-50 px-4 py-1.5 justify-around text-xs">
        <button
          onClick={() => setActiveTab('shortener')}
          className={`py-1 px-2 ${activeTab === 'shortener' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}
        >
          Shrink
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`py-1 px-2 ${activeTab === 'links' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}
        >
          My URLs
        </button>
        <button
          onClick={() => setActiveTab('how-it-works')}
          className={`py-1 px-2 ${activeTab === 'how-it-works' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}
        >
          Guide
        </button>
      </div>
    </header>
  );
};
