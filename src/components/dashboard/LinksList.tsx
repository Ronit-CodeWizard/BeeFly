import React, { useState } from 'react';
import { ShortLink } from '../../types';
import { 
  PlayCircle, 
  Copy, 
  Check, 
  QrCode, 
  Trash2, 
  Search, 
  ShieldCheck, 
  DollarSign
} from 'lucide-react';

interface LinksListProps {
  links: ShortLink[];
  onOpenTestFlow: (link: ShortLink) => void;
  onOpenQrModal: (link: ShortLink) => void;
  onDeleteLink: (linkId: string) => void;
  baseUrl: string;
}

export const LinksList: React.FC<LinksListProps> = ({
  links,
  onOpenTestFlow,
  onOpenQrModal,
  onDeleteLink,
  baseUrl
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getFullShortUrl = (slug: string) => {
    return `${baseUrl}?s=${slug}`;
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter((link) => {
    const q = searchQuery.toLowerCase();
    return (
      link.slug.toLowerCase().includes(q) ||
      link.originalUrl.toLowerCase().includes(q) ||
      link.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Your Active Links
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
            {links.length}
          </span>
        </div>

        {/* Minimal Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter links..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 text-xs rounded-md border border-slate-200 focus:border-amber-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Links Listing */}
      {filteredLinks.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No links matching your filter.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLinks.map((link) => {
            const shortUrl = getFullShortUrl(link.slug);
            const isCopied = copiedId === link.id;

            return (
              <div
                key={link.id}
                className="p-3 rounded-lg border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      /s/{link.slug}
                    </span>
                    <span className="text-slate-400 text-[11px] truncate max-w-xs font-mono">
                      → {link.originalUrl}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span><strong>{link.clicks}</strong> views</span>
                    <span>•</span>
                    <span className="text-emerald-700"><strong>{link.verifiedRedirects}</strong> passed</span>
                    <span>•</span>
                    <span className="text-slate-700 font-mono"><strong>${link.earnings.toFixed(2)}</strong></span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => onOpenTestFlow(link)}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1"
                    title="Test 3-step interstitial redirection"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Test Flow</span>
                  </button>

                  <button
                    onClick={() => handleCopy(link.id, shortUrl)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                    title="Copy short link"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onOpenQrModal(link)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                    title="QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteLink(link.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    title="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
