import React, { useState } from 'react';
import { LinkRecord, ClickRecord } from '../../types';
import { ArrowUpRight, Plus, Copy, Check, ExternalLink, BarChart2 } from 'lucide-react';

interface DashboardPageProps {
  links: LinkRecord[];
  clicks: ClickRecord[];
  onNavigateToCreate: () => void;
  onNavigateToLinks: () => void;
  onNavigateToAnalytics: (linkId: string) => void;
  onOpenShortLink: (code: string) => void;
  baseUrl: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  links,
  clicks,
  onNavigateToCreate,
  onNavigateToLinks,
  onNavigateToAnalytics,
  onOpenShortLink,
  baseUrl
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Computations
  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const clicksToday = clicks.filter(c => new Date(c.createdAt).getTime() >= startOfToday).length;

  const activeLinks = links.filter(l => {
    if (!l.isActive) return false;
    if (l.expiresAt && new Date(l.expiresAt).getTime() < Date.now()) return false;
    return true;
  }).length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${baseUrl}${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Overview of link performance, activity, and redirection statistics.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg skeuo-btn-green text-xs font-medium cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Short Link</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* TOTAL LINKS */}
        <div className="p-4 sm:p-5 rounded-xl skeuo-card">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Total Links
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
            {totalLinks}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            All created URLs
          </div>
        </div>

        {/* TOTAL CLICKS */}
        <div className="p-4 sm:p-5 rounded-xl skeuo-card">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Total Clicks
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
            {totalClicks.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Redirect engagements
          </div>
        </div>

        {/* TODAY */}
        <div className="p-4 sm:p-5 rounded-xl skeuo-card">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Today
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 flex items-baseline gap-2">
            <span>{clicksToday.toLocaleString()}</span>
            <span className="text-xs text-emerald-700 font-medium flex items-center px-1.5 py-0.2 rounded skeuo-inset">
              Active
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Past 24 hours
          </div>
        </div>

        {/* ACTIVE LINKS */}
        <div className="p-4 sm:p-5 rounded-xl skeuo-card">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Active Links
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
            {activeLinks}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Ready to redirect
          </div>
        </div>

      </div>

      {/* Activity Chart Card */}
      <div className="p-5 rounded-xl skeuo-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Traffic Activity
            </h2>
            <p className="text-xs text-gray-500">
              Activity visualization for the last 7 days.
            </p>
          </div>
          <span className="text-xs text-gray-600 px-2.5 py-0.5 rounded skeuo-inset font-medium">
            Total {totalClicks} events
          </span>
        </div>

        {/* Inset tray chart */}
        <div className="p-4 rounded-lg skeuo-inset">
          <div className="h-40 w-full flex items-end gap-2 sm:gap-4 border-b border-gray-300 border-dashed pb-2">
            {[
              { day: 'Mon', count: 18 },
              { day: 'Tue', count: 32 },
              { day: 'Wed', count: 45 },
              { day: 'Thu', count: 28 },
              { day: 'Fri', count: 64 },
              { day: 'Sat', count: 52 },
              { day: 'Sun', count: 70 }
            ].map((bar, i) => {
              const max = 80;
              const pct = Math.round((bar.count / max) * 100);
              const isToday = i === 6;

              return (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    {bar.count}
                  </span>
                  <div className="w-full max-w-[26px] bg-gray-200 rounded-xs overflow-hidden flex flex-col justify-end h-full p-0.5 border border-gray-300">
                    <div 
                      className={`w-full rounded-xs transition-all duration-300 ${
                        isToday 
                          ? 'bg-gradient-to-t from-gray-700 to-gray-900 shadow-xs' 
                          : 'bg-gradient-to-t from-gray-400 to-gray-300 hover:from-gray-500 hover:to-gray-400'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                    {bar.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Links Table / Stack */}
      <div className="p-5 rounded-xl skeuo-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Links
          </h2>
          <button
            onClick={onNavigateToLinks}
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors px-2 py-1 rounded skeuo-btn cursor-pointer font-medium"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-400">
            No links created yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {links.slice(0, 4).map((link) => {
              const isCopied = copiedCode === link.shortCode;
              const isExpired = link.expiresAt && new Date(link.expiresAt).getTime() < Date.now();

              return (
                <div 
                  key={link.id} 
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCopy(link.shortCode)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-all border ${
                          isCopied
                            ? 'bg-yellow-100 text-yellow-900 border-yellow-300 ring-1 ring-yellow-200'
                            : 'skeuo-inset text-gray-900 hover:border-gray-400'
                        }`}
                        title="Click to copy shortened link"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-yellow-700" /> : <Copy className="w-3 h-3 text-gray-400" />}
                        <span className="font-semibold font-mono">{`${baseUrl}${link.shortCode}`}</span>
                        <span className="text-[10px] text-gray-600">{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      {isExpired ? (
                        <span className="text-[11px] uppercase px-2 py-0.5 rounded skeuo-inset text-gray-400 font-medium">
                          Expired
                        </span>
                      ) : (
                        <span className="text-[11px] uppercase px-2 py-0.5 rounded skeuo-inset text-yellow-800 font-medium bg-yellow-50/50">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-xs truncate">
                      → {link.destinationUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <span className="text-gray-500 text-xs">
                      <strong className="text-gray-900 font-semibold">{link.clicks}</strong> clicks
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(link.shortCode)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          isCopied ? 'skeuo-btn-green' : 'skeuo-btn text-gray-600 hover:text-gray-900'
                        }`}
                        title="Copy link"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onOpenShortLink(link.shortCode)}
                        className="p-1.5 rounded skeuo-btn text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                        title="Test redirect"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onNavigateToAnalytics(link.id)}
                        className="p-1.5 rounded skeuo-btn text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                        title="View analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
