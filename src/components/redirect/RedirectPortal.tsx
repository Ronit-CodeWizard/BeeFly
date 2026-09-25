import React, { useState, useEffect, useRef } from 'react';
import { LinkRecord, SystemConfig } from '../../types';
import { Check, ShieldCheck, ExternalLink, FastForward } from 'lucide-react';
import { BeeLogo } from '../common/BeeLogo';

interface RedirectPortalProps {
  link: LinkRecord;
  systemConfig: SystemConfig;
  onDestinationReached: (linkId: string) => void;
  onGoHome: () => void;
}

export const RedirectPortal: React.FC<RedirectPortalProps> = ({
  link,
  systemConfig,
  onDestinationReached,
  onGoHome
}) => {
  const totalSteps = link.redirectSteps || 1;
  const stepTimerDuration = link.timerSeconds || 5;

  // Retrieve or initialize session step from sessionStorage
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(`redirect_step_${link.shortCode}`);
      if (saved) {
        const stepNum = parseInt(saved, 10);
        if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= totalSteps + 1) {
          return stepNum;
        }
      }
    } catch {
      // ignore
    }
    return 1;
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(stepTimerDuration);
  const [isFinalPage, setIsFinalPage] = useState<boolean>(currentStep > totalSteps);
  const startTimeRef = useRef<number>(Date.now());

  // Save session step so refreshing keeps user on current step without skipping
  useEffect(() => {
    try {
      sessionStorage.setItem(`redirect_step_${link.shortCode}`, currentStep.toString());
    } catch {
      // ignore
    }
  }, [currentStep, link.shortCode]);

  // Reset timer on step change
  useEffect(() => {
    if (currentStep <= totalSteps) {
      setSecondsRemaining(stepTimerDuration);
      startTimeRef.current = Date.now();
      setIsFinalPage(false);
    } else {
      setIsFinalPage(true);
    }
  }, [currentStep, totalSteps, stepTimerDuration]);

  // Countdown timer loop
  useEffect(() => {
    if (isFinalPage) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, stepTimerDuration - elapsedSeconds);
      setSecondsRemaining(remaining);
    }, 200);

    return () => clearInterval(interval);
  }, [isFinalPage, stepTimerDuration]);

  // Step texts
  const getStepHeadline = () => {
    if (currentStep === 1) return 'Preparing your link';
    if (currentStep === 2) return 'Almost there';
    if (currentStep === 3) return 'Checking security';
    if (currentStep === 4) return 'Validating destination';
    return 'Finalizing link';
  };

  const isTimerDone = secondsRemaining === 0;

  const handleContinue = () => {
    if (!isTimerDone) return;

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(totalSteps + 1);
      setIsFinalPage(true);
    }
  };

  const safeDestinationUrl = (() => {
    let raw = (link.destinationUrl || '').trim();
    if (!raw) return '#';
    if (!/^https?:\/\//i.test(raw)) {
      raw = 'https://' + raw;
    }
    return raw;
  })();

  const handleFinalGetLink = () => {
    onDestinationReached(link.id);

    try {
      sessionStorage.removeItem(`redirect_step_${link.shortCode}`);
    } catch {
      // ignore
    }

    try {
      const win = window.open(safeDestinationUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        // If popup was blocked or in iframe, navigate safely or let the anchor handle it
        window.location.assign(safeDestinationUrl);
      }
    } catch {
      window.location.assign(safeDestinationUrl);
    }
  };

  let domain = 'destination.com';
  try {
    domain = new URL(safeDestinationUrl).hostname;
  } catch {
    domain = link.destinationUrl;
  }

  const progressPercent = Math.min(
    100,
    Math.round(((stepTimerDuration - secondsRemaining) / stepTimerDuration) * 100)
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Minimal Top Bar with subtle tactile rim */}
      <header className="border-b border-gray-200 bg-white/95 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer select-none text-gray-600 hover:text-black transition-colors"
          >
            <div className="w-7 h-7 rounded-md skeuo-inset flex items-center justify-center bg-amber-50/40">
              <BeeLogo size={18} />
            </div>
            <span className="font-bold text-xs tracking-wider text-gray-900">
              BEEFLY
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 px-2 py-0.5 rounded skeuo-inset font-semibold">
            <span>Link:</span>
            <span className="text-gray-900 font-bold">/{link.shortCode}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-xl mx-auto w-full my-6">
        
        {/* Tactile Skeuomorphic Interstitial Card */}
        <div className="w-full rounded-xl skeuo-card p-6 sm:p-8 space-y-6 text-center shadow-xl">
          
          {!isFinalPage ? (
            <>
              {/* Step Title & Progress Counter */}
              <div className="space-y-1">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full skeuo-inset text-xs uppercase tracking-wide text-gray-600 mb-2 font-medium">
                  <span>Step {currentStep} of {totalSteps}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                  {getStepHeadline()}
                </h1>
                <p className="text-xs text-gray-500">
                  Please wait while we prepare your destination link.
                </p>
              </div>

              {/* Step indicator visual dots: ● ━━━ ○ ━━━ ○ */}
              <div className="flex items-center justify-center gap-2 py-1">
                {Array.from({ length: totalSteps }).map((_, idx) => {
                  const stepNum = idx + 1;
                  const isDone = stepNum < currentStep;
                  const isCurrent = stepNum === currentStep;

                  return (
                    <React.Fragment key={idx}>
                      <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                        isDone 
                          ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' 
                          : isCurrent 
                          ? 'bg-gray-900 shadow-sm' 
                          : 'bg-gray-200 border border-gray-300'
                      }`} />
                      {idx < totalSteps - 1 && (
                        <div className={`w-8 h-0.5 transition-colors ${
                          isDone ? 'bg-yellow-400' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Countdown Section with Tactile Inset Well */}
              <div className="p-4 rounded-xl skeuo-inset space-y-3">
                <div className="text-xs text-gray-500 font-medium">
                  {secondsRemaining > 0 ? 'Please wait' : 'Step ready'}
                </div>

                {/* Large Countdown */}
                <div className="text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900 tabular-nums">
                  {secondsRemaining > 0 ? secondsRemaining : <Check className="w-12 h-12 text-yellow-600 mx-auto" />}
                </div>

                {/* Sunken Progress bar well */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden border border-gray-300 p-[1px]">
                  <div
                    className="bg-gradient-to-r from-gray-700 to-gray-900 h-full transition-all duration-200 ease-linear rounded-full shadow-xs"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {secondsRemaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setSecondsRemaining(0)}
                    className="text-[11px] text-gray-400 hover:text-gray-800 inline-flex items-center gap-1 font-medium cursor-pointer transition-colors pt-1"
                    title="Skip waiting"
                  >
                    <FastForward className="w-3 h-3 text-amber-500" />
                    <span>Skip wait</span>
                  </button>
                )}
              </div>

              {/* Tactile Continue Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!isTimerDone}
                  className={`w-full py-3.5 px-6 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    isTimerDone
                      ? 'skeuo-btn-green cursor-pointer'
                      : 'skeuo-btn opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>{isTimerDone ? 'Continue →' : 'Continue'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Final "Get Link" Page */
            <>
              <div className="space-y-1">
                <div className="w-12 h-12 rounded-xl skeuo-inset text-yellow-600 flex items-center justify-center mx-auto mb-2 border border-yellow-300 bg-yellow-50/50 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  Your link is ready
                </h1>
                <p className="text-xs text-gray-500">
                  Click below to open your destination securely.
                </p>
              </div>

              {/* Destination preview box inside sunken tray */}
              <div className="p-4 rounded-lg skeuo-inset text-left font-mono space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-bold">
                  Destination domain
                </span>
                <div className="text-xs text-gray-900 font-bold truncate">
                  {domain}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {safeDestinationUrl}
                </div>
              </div>

              {/* Main Positive Light Yellow CTA: GET LINK → */}
              <div className="space-y-3 pt-2">
                <a
                  href={safeDestinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onDestinationReached(link.id);
                    try {
                      sessionStorage.removeItem(`redirect_step_${link.shortCode}`);
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-full py-4 px-6 rounded-lg skeuo-btn-green font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg no-underline transition-all hover:scale-[1.01]"
                >
                  <span>GET LINK →</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="space-y-1 text-center font-mono">
                  <p className="text-[11px] text-gray-500">
                    Forwarding to <span className="text-gray-900 font-bold">{domain}</span>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Direct link: <a href={safeDestinationUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-700 hover:underline font-semibold">{safeDestinationUrl}</a>
                  </p>
                </div>
              </div>
            </>
          )}

        </div>

      </main>

    </div>
  );
};
