import React, { useState, useEffect, useCallback } from 'react';
import { LinkRecord, SystemConfig } from '../../types';
import { Page1Interstitial } from './Page1Interstitial';
import { Page2Waiting } from './Page2Waiting';
import { AdBlockModal } from './AdBlockModal';
import { checkAdBlocker } from '../../utils/adblockDetector';

interface RedirectPortalProps {
  link: LinkRecord;
  systemConfig: SystemConfig;
  onDestinationReached: (linkId: string) => void;
  onGoHome: () => void;
}

/**
 * Verification Journey:
 * The solo pages having "scroll down and continue" are the normal pages,
 * so they are not counted as the main numbered pages of the short link.
 * 
 * The main shorten link process consists strictly of 3 main verification pages:
 *   - Solo Normal Page -> Main Verification Page (Page 1 of 3)
 *   - Solo Normal Page -> Main Verification Page (Page 2 of 3)
 *   - Solo Normal Page -> Main Verification Page (Page 3 of 3 - Final -> Destination)
 * 
 * Anti-AdBlocker & Anti-DNS Blocker Enforcement:
 * Detects network DNS blockers (Pi-hole, AdGuard DNS, NextDNS, Brave Shields) 
 * and browser ad-blocking extensions. Freezes progression until ads are unblocked.
 */
export const RedirectPortal: React.FC<RedirectPortalProps> = ({
  link,
  onDestinationReached,
  onGoHome
}) => {
  // Current internal step from 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Anti-AdBlocker & Anti-DNS blocker detection state
  const [isAdBlockDetected, setIsAdBlockDetected] = useState<boolean>(false);

  // Perform detection check on mount and step transitions
  const runAdBlockCheck = useCallback(async () => {
    try {
      const res = await checkAdBlocker();
      if (res.isBlocked) {
        setIsAdBlockDetected(true);
      }
    } catch {
      // Ignore network aborts
    }
  }, []);

  useEffect(() => {
    runAdBlockCheck();
    // Continuous polling in case ad blocker or private DNS is activated mid-session
    const timer = setInterval(runAdBlockCheck, 4000);
    return () => clearInterval(timer);
  }, [runAdBlockCheck, currentStep]);

  // Always spawn on the top of the page on mount and on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep]);

  // Steps 1, 3, 5 are the normal solo page (Scroll down and continue)
  // Not counted as the main numbered page
  if (currentStep === 1 || currentStep === 3 || currentStep === 5) {
    return (
      <>
        <Page1Interstitial
          key={`page1-step-${currentStep}`}
          link={link}
          isAdBlockDetected={isAdBlockDetected}
          onRequestAdBlockResolution={() => setIsAdBlockDetected(true)}
          onContinueToPage2={() => {
            if (isAdBlockDetected) {
              setIsAdBlockDetected(true);
              return;
            }
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setCurrentStep(prev => prev + 1);
          }}
          onGoHome={onGoHome}
        />
        <AdBlockModal
          isOpen={isAdBlockDetected}
          onResolved={() => setIsAdBlockDetected(false)}
        />
      </>
    );
  }

  // Steps 2, 4, 6 are the 3 main verification pages:
  //   Step 2 => Page 1 of 3
  //   Step 4 => Page 2 of 3
  //   Step 6 => Page 3 of 3 (Final page: 'GO TO LINK' redirects to destination)
  const mainPageNumber = Math.floor(currentStep / 2); // 1, 2, or 3
  const isFinalPage = mainPageNumber >= 3;

  return (
    <>
      <Page2Waiting
        key={`page2-step-${currentStep}`}
        link={link}
        stepNumber={mainPageNumber}
        totalSteps={3}
        isFinalPage={isFinalPage}
        isAdBlockDetected={isAdBlockDetected}
        onRequestAdBlockResolution={() => setIsAdBlockDetected(true)}
        onNextStep={() => {
          if (isAdBlockDetected) {
            setIsAdBlockDetected(true);
            return;
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          setCurrentStep(prev => prev + 1);
        }}
        onDestinationReached={onDestinationReached}
        onGoHome={onGoHome}
      />
      <AdBlockModal
        isOpen={isAdBlockDetected}
        onResolved={() => setIsAdBlockDetected(false)}
      />
    </>
  );
};
