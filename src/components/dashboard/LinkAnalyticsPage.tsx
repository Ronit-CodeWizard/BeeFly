import React from 'react';
import { LinkRecord, ClickRecord } from '../../types';
import { ArrowLeft, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';

interface LinkAnalyticsPageProps {
  link: LinkRecord;
  clicks: ClickRecord[];
  onBack: () => void;
  baseUrl: string;
}

export const LinkAnalyticsPage: React.FC<LinkAnalyticsPageProps> = ({
  link,
  clicks,
  onBack,
  baseUrl
}) => {
  const linkClicks = clicks.filter(c => c.linkId === link.id);

  // Device counts
  const desktopCount = linkClicks.filter(c => c.device === 'desktop').length;
  const mobileCount = linkClicks.filter(c => c.device === 'mobile').length;
  const tabletCount = linkClicks.filter(c => c.device === 'tablet').length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Back button & Title */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-black mb-4 transition-colors px-2.5 py-1 rounded skeuo-btn cursor-pointer font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to links</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2 flex-wrap">
              <span>Analytics for</span>
              <span className="font-mono text-amber-600 text-base sm:text-xl font-bold">{`${baseUrl}${link.shortCode}`}</span>
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate max-w-lg">
              → {link.destinationUrl}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-500 font-mono font-medium">Total Clicks</span>
            <div className="text-2xl font-black font-mono text-gray-900">
              {link.clicks.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      {linkClicks.length === 0 ? (
        <div className="py-16 text-center rounded-xl skeuo-card space-y-2">
          <p className="text-sm text-gray-800 font-bold">No data yet</p>
          <p className="text-xs text-gray-400">
            Share this link to begin gathering visit analytics.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Desktop */}
            <div className="p-4 rounded-xl skeuo-card space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-mono uppercase font-bold">Desktop</span>
                <Monitor className="w-4 h-4" />
              </div>
              <div className="text-xl font-black font-mono text-gray-900">
                {desktopCount}
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                {linkClicks.length > 0 ? Math.round((desktopCount / linkClicks.length) * 100) : 0}% of visits
              </div>
            </div>

            {/* Mobile */}
            <div className="p-4 rounded-xl skeuo-card space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-mono uppercase font-bold">Mobile</span>
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xl font-black font-mono text-gray-900">
                {mobileCount}
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                {linkClicks.length > 0 ? Math.round((mobileCount / linkClicks.length) * 100) : 0}% of visits
              </div>
            </div>

            {/* Tablet */}
            <div className="p-4 rounded-xl skeuo-card space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-mono uppercase font-bold">Tablet</span>
                <Tablet className="w-4 h-4" />
              </div>
              <div className="text-xl font-black font-mono text-gray-900">
                {tabletCount}
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                {linkClicks.length > 0 ? Math.round((tabletCount / linkClicks.length) * 100) : 0}% of visits
              </div>
            </div>

          </div>

          {/* Recent Log Table in Inset Tray */}
          <div className="p-5 rounded-xl skeuo-card space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              Recent Visitor Activity Log
            </h3>

            <div className="p-2 rounded-lg skeuo-inset divide-y divide-gray-200 text-xs font-mono">
              {linkClicks.slice(-8).reverse().map((click) => (
                <div key={click.id} className="py-2.5 px-2 flex items-center justify-between text-gray-800">
                  <div className="flex items-center gap-3">
                    <Globe className="w-3.5 h-3.5 text-gray-500" />
                    <span className="font-semibold">{click.country || 'Unknown'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">{click.device}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{click.browser}</span>
                  </div>

                  <span className="text-gray-400 text-[11px]">
                    {new Date(click.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
