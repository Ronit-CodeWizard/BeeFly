import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LinkRecord } from '../../types';
import { AdSlot } from './AdSlot';
import { BlogWikiCard } from './BlogWikiCard';
import { AnalogClock } from './AnalogClock';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { 
  ExternalLink, 
  Loader2, 
  MousePointerClick
} from 'lucide-react';

interface Page2WaitingProps {
  link: LinkRecord;
  stepNumber?: number;
  totalSteps?: number;
  isFinalPage?: boolean;
  isAdBlockDetected?: boolean;
  onRequestAdBlockResolution?: () => void;
  onNextStep?: () => void;
  onDestinationReached: (linkId: string) => void;
  onGoHome: () => void;
}

type Page2Stage = 'OVERLAY' | 'PAGE_CLOCK' | 'DUAL_TAP' | 'WAITING_5S' | 'READY';

export const Page2Waiting: React.FC<Page2WaitingProps> = ({
  link,
  stepNumber = 1,
  totalSteps = 3,
  isFinalPage = false,
  isAdBlockDetected = false,
  onRequestAdBlockResolution,
  onNextStep,
  onDestinationReached,
  onGoHome
}) => {
  // Stage flow state
  const [stage, setStage] = useState<Page2Stage>('OVERLAY');

  // Timers
  const [pageClockSecondsLeft, setPageClockSecondsLeft] = useState<number>(15);

  // Dual tap states
  const [dualTapCount, setDualTapCount] = useState<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const tapResetTimerRef = useRef<number | null>(null);

  // Always spawn on the top of the page immediately
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [stepNumber]);

  // Guard against duplicate redirects
  const isRedirectingRef = useRef<boolean>(false);

  // Safe destination URL retrieval & validation (http/https only)
  const safeDestinationUrl = (() => {
    let raw = (link.destinationUrl || '').trim();
    if (!raw) return '#';
    if (!/^https?:\/\//i.test(raw)) {
      raw = 'https://' + raw;
    }
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString();
      }
      return '#';
    } catch {
      return '#';
    }
  })();

  // Final redirect handler
  const executeRedirect = useCallback(() => {
    if (isAdBlockDetected) {
      if (onRequestAdBlockResolution) onRequestAdBlockResolution();
      return;
    }
    if (isRedirectingRef.current) return;
    if (!safeDestinationUrl || safeDestinationUrl === '#') {
      alert('Invalid destination URL.');
      return;
    }

    isRedirectingRef.current = true;
    onDestinationReached(link.id);

    // Dynamic browser redirect to original destination URL
    window.location.href = safeDestinationUrl;
  }, [isAdBlockDetected, link.id, onDestinationReached, onRequestAdBlockResolution, safeDestinationUrl]);

  // 1. OVERLAY STAGE: starts immediately on load, pauses if AdBlocker is detected
  useEffect(() => {
    if (stage !== 'OVERLAY' || isAdBlockDetected) return;

    const timer = setTimeout(() => {
      // Disappear overlay and start the lower clock
      setStage('PAGE_CLOCK');
    }, 10000);

    return () => clearTimeout(timer);
  }, [stage, isAdBlockDetected]);

  // 2. PAGE CLOCK STAGE: starts after overlay ends, counts down 15s -> 0s
  // Completely freezes when adblocker or DNS blocker is detected
  useEffect(() => {
    if (stage !== 'PAGE_CLOCK' || isAdBlockDetected) return;

    const interval = setInterval(() => {
      setPageClockSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage('DUAL_TAP');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isAdBlockDetected]);

  // 3. WAITING 5S STAGE: background 5-second timer after dual tap
  useEffect(() => {
    if (stage !== 'WAITING_5S' || isAdBlockDetected) return;

    const timer = setTimeout(() => {
      setStage('READY');
    }, 5000);

    return () => clearTimeout(timer);
  }, [stage, isAdBlockDetected]);

  // Dual tap interaction handler
  const handleDualTap = () => {
    if (isAdBlockDetected) {
      if (onRequestAdBlockResolution) onRequestAdBlockResolution();
      return;
    }
    if (stage !== 'DUAL_TAP') return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;

    if (dualTapCount === 0 || timeSinceLastTap > 1200) {
      setDualTapCount(1);
      lastTapTimeRef.current = now;

      if (tapResetTimerRef.current) {
        window.clearTimeout(tapResetTimerRef.current);
      }
      tapResetTimerRef.current = window.setTimeout(() => {
        setDualTapCount(0);
      }, 1400);
    } else if (dualTapCount === 1 && timeSinceLastTap <= 1200) {
      // Dual click completed!
      setDualTapCount(2);
      if (tapResetTimerRef.current) {
        window.clearTimeout(tapResetTimerRef.current);
      }

      // Transition to 5s waiting stage
      setStage('WAITING_5S');

      // Move user down to the go to link area
      setTimeout(() => {
        const target = document.getElementById('goto-link-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900 flex flex-col font-sans selection:bg-green-100 selection:text-green-900 relative">
      
      {/* 1. HEADER (Shared Beefly URLs header with progress page number) */}
      <Navbar 
        currentView="redirect" 
        onNavigate={onGoHome} 
        stepNumber={stepNumber}
        totalSteps={totalSteps}
      />

      {/* Main Content Column: Matching Page 2 & Page 3 layout exactly */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        
        {/* 2. AD */}
        <AdSlot label="AD" />

        {/* 3. AD */}
        <AdSlot label="AD" />

        {/* 4. CLOCK / DUAL TAP SLOT */}
        <div className="w-full flex flex-col items-center justify-center min-h-[64px] py-1">
          
          {/* While Clock is active: show the physical ticking 15-second clock */}
          {stage === 'PAGE_CLOCK' && (
            <AnalogClock secondsLeft={pageClockSecondsLeft} totalSeconds={15} />
          )}

          {/* When Clock ends: Clock disappears and Dual Tap button is placed here */}
          {(stage === 'DUAL_TAP' || stage === 'WAITING_5S' || stage === 'READY') && (
            <div className="flex flex-col items-center justify-center gap-1.5 animate-in fade-in zoom-in-95 duration-300">
              <button
                type="button"
                onClick={handleDualTap}
                disabled={stage !== 'DUAL_TAP'}
                className={`inline-flex items-center justify-center min-w-[220px] px-8 py-3 rounded-full font-bold text-sm tracking-normal select-none transition-colors border-0 shadow-none ${
                  stage === 'DUAL_TAP'
                    ? 'bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-default opacity-85'
                }`}
                aria-label="dual tap to go to link"
              >
                <MousePointerClick className="w-4 h-4 mr-2" />
                <span>
                  {stage !== 'DUAL_TAP'
                    ? 'Verified ✓'
                    : 'dual tap to go to link'}
                </span>
              </button>
            </div>
          )}

          {/* Initial state while overlay is visible: clean placeholder */}
          {stage === 'OVERLAY' && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-400 font-mono text-xs border border-gray-200/80">
              <span>Verifying link credentials...</span>
            </div>
          )}

        </div>

        {/* 5. AD */}
        <AdSlot label="AD" />

        {/* 6. AD */}
        <AdSlot label="AD" />

        {/* 7. Blog / wiki */}
        <BlogWikiCard />

        {/* 8. AD */}
        <AdSlot label="AD" />

        {/* 9. AD */}
        <AdSlot label="AD" />

        {/* 10. GO TO LINK AREA (with 5-second background timer and 'please wait' status) */}
        <div id="goto-link-section" className="w-full flex items-center justify-center min-h-[64px] py-1 scroll-mt-24">
          
          {/* While in 5s background timer stage: show 'please wait' */}
          {stage === 'WAITING_5S' && (
            <div className="inline-flex items-center justify-center min-w-[220px] px-8 py-3 rounded-full bg-gray-100 text-gray-600 font-mono text-xs font-semibold border border-gray-200 gap-2 shadow-2xs animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span>please wait...</span>
            </div>
          )}

          {/* When 5s timer completes: 'GO TO LINK' (if final page 6) or 'CONTINUE' (if pages 2, 4) appears */}
          {stage === 'READY' && (
            isFinalPage ? (
              <button
                type="button"
                onClick={executeRedirect}
                className="inline-flex items-center justify-center min-w-[220px] px-8 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 font-bold text-sm tracking-normal cursor-pointer select-none transition-colors border-0 shadow-none gap-2 animate-in fade-in zoom-in-95 duration-300"
                aria-label="GO TO LINK"
              >
                <span>GO TO LINK</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (isAdBlockDetected) {
                    if (onRequestAdBlockResolution) onRequestAdBlockResolution();
                    return;
                  }
                  if (onNextStep) onNextStep();
                }}
                className="inline-flex items-center justify-center min-w-[220px] px-8 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 font-bold text-sm tracking-normal cursor-pointer select-none transition-colors border-0 shadow-none gap-2 animate-in fade-in zoom-in-95 duration-300"
                aria-label="Continue to Next Page"
              >
                <span>CONTINUE</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </button>
            )
          )}

          {/* Before reaching this stage: minimal placeholder */}
          {(stage === 'OVERLAY' || stage === 'PAGE_CLOCK' || stage === 'DUAL_TAP') && (
            <div className="inline-flex items-center justify-center min-w-[220px] px-8 py-3 rounded-full bg-gray-50 text-gray-400 font-mono text-xs border border-dashed border-gray-200 cursor-not-allowed select-none">
              <span>please wait...</span>
            </div>
          )}

        </div>

        {/* 11. AD */}
        <AdSlot label="AD" />

        {/* 12. AD */}
        <AdSlot label="AD" />

      </main>

      {/* 13. FOOTER */}
      <Footer onNavigate={onGoHome} />

      {/* 14. 10-SECOND OVERLAY CONTAINER (Appears FIRST upon Page 2 load) */}
      {stage === 'OVERLAY' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Sponsored Verification Overlay"
        >
          <div className="w-full min-w-[280px] max-w-sm sm:max-w-md h-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-200 flex flex-col gap-3 relative transition-all duration-300">
            {/* AD 1 inside overlay - automatically adjusts to ad size */}
            <AdSlot label="AD" compact />

            {/* Notice text in between the two ads as requested */}
            <div className="py-1 px-2 text-center">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 tracking-wide font-sans">
                click above or below ad and wait for 10sec
              </p>
            </div>

            {/* AD 2 inside overlay - automatically adjusts to ad size */}
            <AdSlot label="AD" compact />
          </div>
        </div>
      )}

    </div>
  );
};
