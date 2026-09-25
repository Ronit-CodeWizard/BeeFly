import React, { useEffect } from 'react';
import { LinkRecord } from '../../types';
import { AdSlot } from './AdSlot';
import { TapScroll } from './TapScroll';
import { BlogWikiCard } from './BlogWikiCard';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

interface Page1InterstitialProps {
  link: LinkRecord;
  isAdBlockDetected?: boolean;
  onRequestAdBlockResolution?: () => void;
  onContinueToPage2: () => void;
  onGoHome: () => void;
}

export const Page1Interstitial: React.FC<Page1InterstitialProps> = ({
  isAdBlockDetected = false,
  onRequestAdBlockResolution,
  onContinueToPage2,
  onGoHome
}) => {
  // Always spawn on the top of the page immediately
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleContinue = () => {
    if (isAdBlockDetected) {
      if (onRequestAdBlockResolution) onRequestAdBlockResolution();
      return;
    }
    onContinueToPage2();
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900 flex flex-col font-sans selection:bg-green-100 selection:text-green-900">
      
      {/* 1. HEADER (Normal page header without step counter) */}
      <Navbar 
        currentView="redirect" 
        onNavigate={onGoHome} 
      />

      {/* Main Content Column: Mobile-first centered container strictly matching Page 1 layout */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        
        {/* 2. AD */}
        <AdSlot label="AD" />

        {/* 3. AD */}
        <AdSlot label="AD" />

        {/* 4. Tap Scroll (scrolls down to the Continue action) */}
        <TapScroll targetId="continue-action-section" />

        {/* 5. Blog / Wiki */}
        <BlogWikiCard />

        {/* 6. AD */}
        <AdSlot label="AD" />

        {/* 7. AD */}
        <AdSlot label="AD" />

        {/* 8. Click here to Continue */}
        <div id="continue-action-section" className="w-full pt-3 pb-1 scroll-mt-20 flex items-center justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center justify-center min-w-[170px] px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 text-xs sm:text-sm font-bold tracking-normal cursor-pointer select-none transition-colors shadow-none border-0"
            aria-label="Click here to Continue to Page 2"
          >
            <span>Click here to Continue</span>
          </button>
        </div>

        {/* 9. AD (As present in the Page 1 PDF structure before footer) */}
        <AdSlot label="AD" compact />

      </main>

      {/* 10. FOOTER */}
      <Footer onNavigate={onGoHome} />

    </div>
  );
};
