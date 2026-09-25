import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdSlotProps {
  className?: string;
  label?: string;
  compact?: boolean;
  minHeight?: string;
  children?: React.ReactNode;
}

// Resilient native sponsored inventory (guaranteed visible even across DNS ad-blockers)
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
 * Responsive Ad Container with Anti-Adblocker Trap & Native DNS-Resistant Inventory:
 * - Contains invisible bait classes (adsbox, pub_300x250) to catch browser ad blockers
 * - Renders native sponsored cards resilient to DNS-level blocking
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  className = '',
  label = 'AD',
  compact = false,
  minHeight,
  children
}) => {
  // Deterministic sponsor selection based on label to prevent hydration mismatches
  const sponsorIndex = (label.charCodeAt(0) || 0) % SPONSOR_PREVIEWS.length;
  const sponsor = SPONSOR_PREVIEWS[sponsorIndex];

  return (
    <div
      className={`w-full rounded-xl flex flex-col items-center justify-center select-none relative bg-white border border-gray-200/90 shadow-2xs transition-all hover:border-gray-300 h-auto overflow-hidden ${
        children
          ? 'p-0'
          : compact
          ? 'py-3 px-4 min-h-[60px]'
          : 'py-4 px-4 min-h-[84px]'
      } ${className}`}
      style={minHeight ? { minHeight } : undefined}
      role="region"
      aria-label="Advertisement container"
      data-ad-slot="true"
    >
      {/* Bait elements with standard ad classes to trap cosmetic adblockers */}
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
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 relative py-0.5">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sponsor Badge / Icon */}
            <div className="w-9 h-9 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-yellow-600" />
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-mono tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200/80">
                  {sponsor.tag}
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

          {/* Action CTA */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-[11px] font-semibold text-gray-700 hover:text-gray-950 flex items-center gap-1 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              <span>{sponsor.cta}</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
