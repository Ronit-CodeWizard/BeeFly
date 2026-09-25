import React, { useState } from 'react';
import { Info, ExternalLink, ShieldCheck, X } from 'lucide-react';

export const AdChoicesBadge: React.FC<{ label?: string }> = ({ label = 'AdChoices' }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
        className="flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors"
        title="Why this ad? AdChoices info"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
        {label}
        <Info className="w-2.5 h-2.5 ml-0.5 opacity-70" />
      </button>

      {showInfo && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute z-50 right-0 top-6 w-64 p-3 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 text-xs text-left"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
            <span className="font-semibold flex items-center gap-1 text-slate-900">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              About AdLinker Ads
            </span>
            <button 
              onClick={() => setShowInfo(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
            These advertising containers support the free URL shortening and anti-bot verification service.
          </p>
          <div className="flex items-center justify-between text-[10px] text-blue-600 font-medium">
            <span>Verified Safe Ads</span>
            <span className="flex items-center gap-0.5">Privacy Info <ExternalLink className="w-2.5 h-2.5" /></span>
          </div>
        </div>
      )}
    </div>
  );
};
