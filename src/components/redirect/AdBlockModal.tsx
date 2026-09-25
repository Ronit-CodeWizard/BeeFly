import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2, ShieldOff } from 'lucide-react';
import { checkAdBlocker } from '../../utils/adblockDetector';

interface AdBlockModalProps {
  isOpen: boolean;
  onResolved: () => void;
}

export const AdBlockModal: React.FC<AdBlockModalProps> = ({ isOpen, onResolved }) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleRecheck = async () => {
    setIsChecking(true);
    setErrorMessage('');

    try {
      const result = await checkAdBlocker();
      if (!result.isBlocked) {
        onResolved();
      } else {
        setErrorMessage(
          result.blockType === 'network'
            ? 'DNS ad-blocking or network adblocker is still active. Please disable your private DNS (AdGuard/NextDNS/Pi-hole) or browser blocker.'
            : 'AdBlocker extension is still enabled. Please pause or whitelist this site to continue.'
        );
      }
    } catch {
      setErrorMessage('Could not verify ad clearance. Please disable your blocker and try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-7 text-center relative overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adblock-title"
      >
        {/* Top warning ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-400" />

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-9 h-9 text-yellow-600" />
        </div>

        {/* Title */}
        <h2 id="adblock-title" className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          AdBlocker / DNS Blocker Detected
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed font-sans">
          We noticed an active <span className="font-semibold text-gray-900">AdBlocker</span>, <span className="font-semibold text-gray-900">Brave Shields</span>, or <span className="font-semibold text-gray-900">Private DNS blocker</span> (such as AdGuard DNS, Pi-hole, or NextDNS).
        </p>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed font-sans">
          This URL shortener service is <span className="font-bold text-gray-800">100% free</span> because it is funded by sponsored ads. To continue to your link, please disable your ad blocker or private DNS.
        </p>

        {/* Action Steps Box */}
        <div className="mt-4 p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl text-left space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Browser extensions:</strong> Click your adblock icon (uBlock, AdBlock, AdGuard) and click <em>Pause on this site</em>.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Brave browser:</strong> Click the lion icon in the address bar and switch <em>Shields OFF</em>.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Private DNS (Android/iOS):</strong> Set Private DNS to <em>Off / Automatic</em> (disable dns.adguard.com or NextDNS).</span>
          </div>
        </div>

        {/* Dynamic Error Feedback */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2 text-left animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Yellow Recheck Button */}
        <div className="mt-6 pt-1">
          <button
            type="button"
            onClick={handleRecheck}
            disabled={isChecking}
            className="w-full py-3.5 px-6 rounded-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 font-bold text-sm tracking-normal flex items-center justify-center gap-2 cursor-pointer transition-colors border-0 shadow-none disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-gray-900" />
                <span>Checking Ad Clearance...</span>
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4 text-gray-900" />
                <span>I've Disabled My AdBlocker — Continue</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-gray-400 font-mono mt-3">
          Verification sequence will automatically resume upon clearance.
        </p>
      </div>
    </div>
  );
};
