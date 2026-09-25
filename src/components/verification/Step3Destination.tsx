import React, { useState, useEffect } from 'react';
import { ExternalLink, Check, ArrowRight, Loader2 } from 'lucide-react';
import { ShortLink } from '../../types';

interface Step3DestinationProps {
  link: ShortLink;
  onRedirectSuccess: () => void;
}

export const Step3Destination: React.FC<Step3DestinationProps> = ({ 
  link, 
  onRedirectSuccess 
}) => {
  const [decrypting, setDecrypting] = useState(true);
  const [skipTimer, setSkipTimer] = useState(3);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDecrypting(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (decrypting) return;
    if (skipTimer <= 0) {
      setCanSkip(true);
      return;
    }
    const interval = setInterval(() => {
      setSkipTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [decrypting, skipTimer]);

  const handleFinalRedirect = () => {
    onRedirectSuccess();
    try {
      const win = window.open(link.originalUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.href = link.originalUrl;
      }
    } catch {
      window.location.href = link.originalUrl;
    }
  };

  return (
    <div className="space-y-4">
      {/* AdFly Classic Top Bar with Countdown */}
      <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Skip Ad Status:</span>
          {skipTimer > 0 ? (
            <span className="font-mono font-bold text-amber-600 bg-white px-2 py-0.5 rounded border border-amber-300 text-sm">
              {skipTimer}s
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Skip Ad Ready
            </span>
          )}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Step 3: Skip Ad
        </span>
      </div>

      {decrypting ? (
        <div className="py-6 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
          <p className="text-xs text-slate-500 font-mono">
            Unlocking destination URL...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-1">
            <h3 className="text-base font-bold text-slate-900">Destination Link Ready</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm mx-auto font-mono">
              {link.originalUrl}
            </p>
          </div>

          {/* AdFly Iconic "SKIP AD" Button */}
          <button
            onClick={handleFinalRedirect}
            disabled={!canSkip}
            className={`w-full py-3.5 px-5 rounded-lg font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              canSkip
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{canSkip ? 'SKIP AD » PROCEED TO DESTINATION' : `SKIP AD IN ${skipTimer}s...`}</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <div className="text-center">
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noreferrer"
              onClick={onRedirectSuccess}
              className="text-xs text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1 font-mono"
            >
              Direct Link Backup
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      <div className="text-center text-[10px] text-slate-400">
        Adf.ly Minimal Verification Completed
      </div>
    </div>
  );
};
