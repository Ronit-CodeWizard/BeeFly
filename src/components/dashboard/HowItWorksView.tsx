import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HowItWorksViewProps {
  onStartCreating: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onStartCreating }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
      
      <div className="border-b border-slate-100 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono mb-2">
          🐝 BeeFly Architecture
        </div>
        <h2 className="text-xl font-black text-slate-900">
          How BeeFly 3-Step Verification & Google AdSense Work
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          A minimalist high-performance URL shrinker designed for maximum click-through rates and AdSense monetization.
        </p>
      </div>

      {/* 3 Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-600">
            STEP 01
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            Bot & Integrity Check
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            The visitor views a 5-second countdown timer and completes a captcha integrity verification, preventing automated bots from abusing your links.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-600">
            STEP 02
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            AdSense Presentation
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            While viewing the interstitial page, designated spaces display Google AdSense ads (Leaderboard, Skyscrapers, In-Article units) registered under your publisher ID.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-600">
            STEP 03
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            Skip Ad & Redirect
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            The iconic "SKIP AD" button activates after 3 seconds, safely forwarding the human user to the target destination URL.
          </p>
        </div>

      </div>

      {/* Google AdSense Code Reference */}
      <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
          <span>Active Google AdSense Integration</span>
          <span className="text-amber-400 font-bold">ca-pub-9267601428341390</span>
        </div>
        <p className="text-[11px] text-slate-300">
          Loaded in the website header and powering all responsive ad containers across BeeFly:
        </p>
        <pre className="bg-slate-950 p-2.5 rounded text-[11px] text-amber-300 overflow-x-auto whitespace-pre">
{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9267601428341390"
     crossorigin="anonymous"></script>`}
        </pre>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onStartCreating}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-all"
        >
          <span>Shrink a URL on BeeFly now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
