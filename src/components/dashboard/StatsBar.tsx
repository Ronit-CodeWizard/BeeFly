import React from 'react';
import { ShortLink } from '../../types';
import { DollarSign, MousePointerClick, ShieldCheck, Link2 } from 'lucide-react';

interface StatsBarProps {
  links: ShortLink[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ links }) => {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const totalVerified = links.reduce((sum, l) => sum + l.verifiedRedirects, 0);
  const totalEarnings = links.reduce((sum, l) => sum + l.earnings, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 my-4 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        
        <div className="sm:px-3 pt-2 sm:pt-0">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Shrunk URLs
          </span>
          <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
            <Link2 className="w-4 h-4 text-amber-500" />
            <span>{totalLinks}</span>
          </div>
        </div>

        <div className="sm:px-3 pt-2 sm:pt-0">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Ad Impressions
          </span>
          <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
            <MousePointerClick className="w-4 h-4 text-blue-500" />
            <span>{totalClicks.toLocaleString()}</span>
          </div>
        </div>

        <div className="sm:px-3 pt-2 sm:pt-0">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            3-Step Completed
          </span>
          <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{totalVerified.toLocaleString()}</span>
          </div>
        </div>

        <div className="sm:px-3 pt-2 sm:pt-0">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            AdSense Earnings
          </span>
          <div className="text-lg font-bold text-emerald-700 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>${totalEarnings.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
