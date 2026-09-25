import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ShortLink } from '../../types';

interface Step2SponsorProps {
  link: ShortLink;
  onComplete: () => void;
}

export const Step2Sponsor: React.FC<Step2SponsorProps> = ({ link, onComplete }) => {
  const [readSeconds, setReadSeconds] = useState(4);

  useEffect(() => {
    if (readSeconds <= 0) return;
    const timer = setInterval(() => {
      setReadSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [readSeconds]);

  const canProceed = readSeconds === 0;

  return (
    <div className="space-y-4">
      {/* AdFly Classic Top Bar with Countdown */}
      <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Please wait:</span>
          {readSeconds > 0 ? (
            <span className="font-mono font-bold text-amber-600 bg-white px-2 py-0.5 rounded border border-amber-300 text-sm">
              {readSeconds}s
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ad Loaded
            </span>
          )}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Step 2: Ad Confirmation
        </span>
      </div>

      <div className="text-center py-1">
        <h3 className="text-base font-bold text-slate-900">Sponsor Presentation</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          AdLinker is supported by Google AdSense & premium sponsors.
        </p>
      </div>

      {/* Clean Sponsored Notice Box */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 text-center text-slate-600">
        <p className="text-slate-700 leading-relaxed font-medium">
          The sponsor containers around this page help ensure all shortened destination URLs remain free, high-speed, and secure.
        </p>
        <div className="text-[11px] text-slate-400 font-mono">
          AdSense Client: ca-pub-9267601428341390
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onComplete}
        disabled={!canProceed}
        className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
          canProceed
            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer active:scale-98'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <span>
          {readSeconds > 0 
            ? `Please wait ${readSeconds}s...` 
            : 'Proceed to Step 3 (Get Link)'}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      <div className="text-center text-[10px] text-slate-400">
        Step 2 of 3 • Sponsored Gateway
      </div>
    </div>
  );
};
