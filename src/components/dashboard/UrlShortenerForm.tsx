import React, { useState } from 'react';
import { ShortLink } from '../../types';
import { QUICK_PRESETS } from '../../data/sampleData';
import { Link2, ArrowRight, Copy, Check, QrCode, PlayCircle, Settings2 } from 'lucide-react';

interface UrlShortenerFormProps {
  onLinkCreated: (newLink: ShortLink) => void;
  onOpenTestFlow: (link: ShortLink) => void;
  onOpenQrModal: (link: ShortLink) => void;
  baseUrl: string;
}

export const UrlShortenerForm: React.FC<UrlShortenerFormProps> = ({
  onLinkCreated,
  onOpenTestFlow,
  onOpenQrModal,
  baseUrl
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [latestCreatedLink, setLatestCreatedLink] = useState<ShortLink | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate random short slug
  const generateSlug = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter or paste a long URL');
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }

    try {
      new URL(trimmed);
    } catch {
      setErrorMessage('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    let slug = customAlias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!slug) {
      slug = generateSlug();
    }

    let defaultTitle = 'Target Destination';
    try {
      const parsed = new URL(trimmed);
      defaultTitle = parsed.hostname;
    } catch {
      defaultTitle = 'Protected URL';
    }

    const newLink: ShortLink = {
      id: 'link-' + Date.now(),
      slug,
      originalUrl: trimmed,
      title: defaultTitle,
      createdAt: new Date().toISOString(),
      clicks: 0,
      verifiedRedirects: 0,
      earnings: 0,
      customAlias: customAlias.trim() || undefined,
    };

    onLinkCreated(newLink);
    setLatestCreatedLink(newLink);
    setUrlInput('');
    setCustomAlias('');
  };

  const getFullShortUrl = (slug: string) => {
    return `${baseUrl}?s=${slug}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-5">
      
      {/* BeeFly minimal headline */}
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
          🐝 BeeFly • Google AdSense Monetized Shortener
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Shrink Any URL & Monetize Clicks
        </h2>
        <p className="text-xs text-slate-500">
          Earn AdSense revenue on every visitor with our fast 3-step interstitial verification system.
        </p>
      </div>

      {/* BeeFly Classic Shrink Bar */}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste long URL to shrink..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wide rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Shrink!</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium">
            ⚠️ {errorMessage}
          </p>
        )}

        {/* Minimalist Alias toggle */}
        <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Simple options' : 'Custom name / alias'}</span>
          </button>

          {/* Quick presets */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">Try:</span>
            {QUICK_PRESETS.slice(0, 3).map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setUrlInput(p.url)}
                className="hover:underline text-amber-600 font-medium"
              >
                {p.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {showAdvanced && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">beefly.app/s/</span>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="custom-name"
              className="w-full px-2.5 py-1.5 bg-white text-xs text-slate-800 rounded border border-slate-300 focus:border-amber-500 outline-none font-mono"
            />
          </div>
        )}
      </form>

      {/* Result Card */}
      {latestCreatedLink && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 max-w-2xl mx-auto space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-ping"></span>
              Your BeeFly Shrunk Link is Ready:
            </span>
            <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">
              3-STEP VERIFICATION ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-amber-300">
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
              {getFullShortUrl(latestCreatedLink.slug)}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(getFullShortUrl(latestCreatedLink.slug))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => onOpenQrModal(latestCreatedLink)}
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                title="QR Code"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 truncate max-w-xs font-mono text-[11px]">
              → {latestCreatedLink.originalUrl}
            </span>
            <button
              onClick={() => onOpenTestFlow(latestCreatedLink)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Interstitial Flow</span>
            </button>
          </div>
        </div>
      )}

      {/* Minimal Footer Note */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
        <span>✓ Google AdSense ca-pub-9267601428341390</span>
        <span>•</span>
        <span>✓ 3-Step Verification</span>
        <span>•</span>
        <span>✓ BeeFly Platform</span>
      </div>

    </div>
  );
};
