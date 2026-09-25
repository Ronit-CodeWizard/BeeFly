import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdSenseContainer } from './AdSenseContainer';

export const BottomAnchorAd: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300">
      {isCollapsed ? (
        <div className="max-w-xs mx-auto mb-2 px-4 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-full shadow-md text-xs hover:bg-slate-800 transition-all font-mono"
          >
            <span>Google AdSense (Expand)</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      ) : (
        <div className="w-full bg-white border-t border-slate-200 shadow-xl py-1.5 px-4 relative">
          <button
            onClick={() => setIsCollapsed(true)}
            title="Minimize anchor ad"
            className="absolute right-3 top-2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <AdSenseContainer
              adSlot="3344556677"
              adFormat="horizontal"
              label="Sticky Bottom Anchor Ad"
              type="banner"
              minHeight="70px"
              className="w-full max-w-[728px] border-none bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};
