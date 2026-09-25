import React, { useEffect, useRef } from 'react';

// Declare adsbygoogle on window
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseContainerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
  label?: string;
  type?: 'leaderboard' | 'skyscraper' | 'rectangle' | 'in-feed' | 'banner';
  minHeight?: string;
}

export const AdSenseContainer: React.FC<AdSenseContainerProps> = ({
  adSlot = '1234567890',
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  label = 'Google AdSense Space',
  type = 'rectangle',
  minHeight = '90px'
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !adInitialized.current) {
        // Push to adsbygoogle array
        ((window.adsbygoogle = window.adsbygoogle || []).push({}));
        adInitialized.current = true;
      }
    } catch (e) {
      // In sandbox/preview/ad-blocker environments adsbygoogle might throw or fail gracefully
      console.debug('AdSense unit initialized or fallback active:', e);
    }
  }, []);

  return (
    <div className={`ad-container-wrapper relative flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 hover:bg-slate-50 transition-colors rounded-lg overflow-hidden ${className}`}>
      {/* Top clean AdSense label bar */}
      <div className="w-full flex items-center justify-between px-3 py-1 bg-slate-100/80 border-b border-slate-200 text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          ADS BY GOOGLE • {label}
        </span>
        <span className="text-[9px] text-slate-400 font-mono">ca-pub-9267601428341390</span>
      </div>

      {/* Ad slot element for Google AdSense */}
      <div className="w-full flex items-center justify-center p-2 min-h-[60px]" style={{ minHeight }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center' }}
          data-ad-client="ca-pub-9267601428341390"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        ></ins>

        {/* Visual minimalist fallback/placeholder when AdSense script is in review/dev mode */}
        <div className="adsense-dev-placeholder py-3 px-4 text-center pointer-events-none select-none">
          <div className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold mb-1">
            Google AdSense Ad Slot ({type})
          </div>
          <p className="text-[11px] text-slate-400">
            Publisher ID: <code className="text-slate-600">ca-pub-9267601428341390</code>
          </p>
        </div>
      </div>
    </div>
  );
};
