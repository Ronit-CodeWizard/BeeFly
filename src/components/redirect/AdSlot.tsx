import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

export const ADSENSE_CLIENT_ID = 'ca-pub-9267601428341390';

interface AdSlotProps {
  className?: string;
  label?: string;
  compact?: boolean;
  minHeight?: string;
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  children?: React.ReactNode;
}

// Fallback high-performance sponsored creative if AdSense is still loading or unfilled
const SPONSOR_PREVIEWS = [
  {
    title: 'CloudScale VPS Hosting',
    desc: 'High-performance NVMe cloud servers starting at $3.50/mo. 99.99% uptime SLA.',
    tag: 'SPONSORED',
    cta: 'Learn More'
  },
  {
    title: 'DevVault API Gateway',
    desc: 'Low-latency serverless edge functions and URL routing for modern web apps.',
    tag: 'ADVERTISEMENT',
    cta: 'Try Free'
  },
  {
    title: 'ShieldVPN Global Privacy',
    desc: 'Military-grade encryption with zero logs. Fast streaming worldwide.',
    tag: 'SPONSORED',
    cta: 'Get 70% Off'
  }
];

/**
 * Responsive Google AdSense Ad Unit
 * 
 * Configured with Publisher Client ID: ca-pub-9267601428341390
 * - Dynamically renders <ins className="adsbygoogle" ... />
 * - Triggers window.adsbygoogle.push({})
 * - Uses MutationObserver to detect when AdSense injects and renders live ad creatives
 * - Gracefully displays a clean AdSense-branded card if ads are pending approval or unfilled
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  className = '',
  label = 'AD',
  compact = false,
  minHeight,
  slotId,
  format = 'auto',
  children
}) => {
  const adInsRef = useRef<HTMLModElement | null>(null);
  const [isAdFilled, setIsAdFilled] = useState<boolean>(false);
  const hasRequestedRef = useRef<boolean>(false);

  // Deterministic fallback sponsor selection based on label
  const sponsorIndex = (label.charCodeAt(0) || 0) % SPONSOR_PREVIEWS.length;
  const sponsor = SPONSOR_PREVIEWS[sponsorIndex];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Trigger Google AdSense fetch
    if (!hasRequestedRef.current && adInsRef.current) {
      hasRequestedRef.current = true;
      try {
        const adsWindow = window as unknown as {
          adsbygoogle?: Array<Record<string, unknown>>;
        };
        adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
        adsWindow.adsbygoogle.push({});
      } catch (err) {
        // Safe catch for duplicate requests or ad blocker suppression
        console.warn('Google AdSense initialization notice:', err);
      }
    }

    // Monitor for AdSense iframe injection or data-ad-status update
    const checkStatus = () => {
      if (adInsRef.current) {
        const iframe = adInsRef.current.querySelector('iframe');
        const adStatus = adInsRef.current.getAttribute('data-ad-status');
        if (iframe !== null || adStatus === 'filled') {
          setIsAdFilled(true);
        }
      }
    };

    checkStatus();

    const observer = new MutationObserver(() => {
      checkStatus();
    });

    if (adInsRef.current) {
      observer.observe(adInsRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-ad-status', 'data-adsbygoogle-status']
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`w-full rounded-xl flex flex-col items-center justify-center select-none relative bg-white border border-gray-200/90 shadow-2xs transition-all hover:border-gray-300 h-auto overflow-hidden ${
        children
          ? 'p-0'
          : compact
          ? 'py-2 px-3 min-h-[60px]'
          : 'py-3 px-4 min-h-[84px]'
      } ${className}`}
      style={minHeight ? { minHeight } : undefined}
      role="region"
      aria-label="Google AdSense Advertisement"
      data-ad-slot="true"
    >
      {/* Bait elements to detect browser ad blockers without breaking layout */}
      <div 
        aria-hidden="true"
        className="adsbox ad-placement pub_300x250 banner-ad text-ad textAd pointer-events-none" 
        style={{ width: '1px', height: '1px', position: 'absolute', opacity: 0.01, left: '-9999px' }}
      >
        &nbsp;
      </div>

      {children ? (
        <div className="w-full h-auto flex items-center justify-center overflow-auto">
          {children}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center relative">
          
          {/* Live Google AdSense <ins> Unit */}
          <ins
            ref={adInsRef}
            className="adsbygoogle w-full block text-center transition-opacity duration-300"
            style={{
              display: 'block',
              minHeight: compact ? '60px' : '90px',
              width: '100%'
            }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slotId || undefined}
            data-ad-format={format}
            data-full-width-responsive="true"
          />

          {/* Clean Fallback Display: Visible when AdSense is initializing, unfilled, or testing */}
          {!isAdFilled && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 py-1.5 px-2 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                </div>

                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200/80">
                      AdSense &bull; {sponsor.tag}
                    </span>
                    <span className="text-xs font-bold text-gray-900 truncate">
                      {sponsor.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate max-w-sm mt-0.5">
                    {sponsor.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <span className="text-[10px] font-mono text-gray-400">
                  ca-pub-9267601428341390
                </span>
                <span className="text-[11px] font-semibold text-gray-700 hover:text-gray-950 flex items-center gap-1 cursor-pointer bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md transition-colors">
                  <span>{sponsor.cta}</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </span>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
