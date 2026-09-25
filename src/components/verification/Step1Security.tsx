import React, { useState, useEffect } from 'react';
import { Bot, Check, Loader2, Lock, ArrowRight } from 'lucide-react';
import { ShortLink } from '../../types';

interface Step1SecurityProps {
  link: ShortLink;
  onComplete: () => void;
}

export const Step1Security: React.FC<Step1SecurityProps> = ({ link, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Handle Captcha Click
  const handleCaptchaClick = () => {
    if (captchaPassed || isVerifyingCaptcha) return;
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setCaptchaPassed(true);
    }, 800);
  };

  const isReadyToProceed = secondsLeft === 0 && captchaPassed;

  return (
    <div className="space-y-4">
      {/* AdFly Classic Top Bar with Countdown */}
      <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Please wait:</span>
          {secondsLeft > 0 ? (
            <span className="font-mono font-bold text-amber-600 bg-white px-2 py-0.5 rounded border border-amber-300 text-sm">
              {secondsLeft}s
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <Check className="w-3 h-3" /> Ready
            </span>
          )}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Step 1: Bot Check
        </span>
      </div>

      <div className="text-center py-1">
        <h3 className="text-base font-bold text-slate-900">Security Integrity Verification</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Please confirm you are human to proceed to the sponsor step.
        </p>
      </div>

      {/* Minimal Checkbox Box (Cloudflare / reCAPTCHA style) */}
      <div 
        onClick={handleCaptchaClick}
        className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 flex items-center justify-between cursor-pointer select-none hover:border-amber-500 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
            captchaPassed 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : isVerifyingCaptcha 
              ? 'border-amber-500 bg-white' 
              : 'border-slate-400 bg-white hover:border-amber-600'
          }`}>
            {isVerifyingCaptcha && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />}
            {captchaPassed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <span className="text-xs font-bold text-slate-800">
            I'm not a robot
          </span>
        </div>

        <div className="text-right text-[10px] text-slate-400 font-mono">
          <span>reCAPTCHA</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onComplete}
        disabled={!isReadyToProceed}
        className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
          isReadyToProceed
            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer active:scale-98'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        <span>
          {secondsLeft > 0 
            ? `Wait ${secondsLeft}s...` 
            : !captchaPassed 
            ? 'Check "I\'m not a robot"' 
            : 'Next Step: Sponsor Check'}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      <div className="text-center text-[10px] text-slate-400">
        Destination link secured with SSL • Anti-bot protection
      </div>
    </div>
  );
};
