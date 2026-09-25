import React, { useState } from 'react';
import { LinkRecord, SystemConfig } from '../../types';
import { ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';

interface CreateLinkPageProps {
  systemConfig: SystemConfig;
  onCreateLink: (data: {
    destinationUrl: string;
    customAlias?: string;
    expirationDays: number | null;
    redirectSteps: number;
    timerSeconds: number;
  }) => LinkRecord | null;
  onLinkCreatedSuccess: (link: LinkRecord) => void;
  onOpenShortLink: (code: string) => void;
  baseUrl: string;
}

export const CreateLinkPage: React.FC<CreateLinkPageProps> = ({
  systemConfig,
  onCreateLink,
  onLinkCreatedSuccess,
  onOpenShortLink,
  baseUrl
}) => {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiration, setExpiration] = useState<string>('never');
  const [redirectSteps, setRedirectSteps] = useState<number>(systemConfig.defaultRedirectSteps);
  const [timerSeconds, setTimerSeconds] = useState<number>(systemConfig.defaultTimerSeconds);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentlyCreated, setRecentlyCreated] = useState<LinkRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let trimmed = destinationUrl.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a destination URL.');
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Only HTTP/HTTPS URLs allowed');
      }
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        throw new Error('Invalid URL');
      }
    } catch {
      setErrorMessage('Please enter a valid HTTP or HTTPS destination URL.');
      return;
    }

    let expDays: number | null = null;
    if (expiration === '1') expDays = 1;
    else if (expiration === '7') expDays = 7;
    else if (expiration === '30') expDays = 30;

    const res = onCreateLink({
      destinationUrl: trimmed,
      customAlias: customAlias.trim() || undefined,
      expirationDays: expDays,
      redirectSteps,
      timerSeconds
    });

    if (res) {
      setRecentlyCreated(res);
      setDestinationUrl('');
      setCustomAlias('');
    } else {
      setErrorMessage('That custom alias is already in use. Please pick another.');
    }
  };

  const fullShortUrl = recentlyCreated ? `${baseUrl}${recentlyCreated.shortCode}` : '';

  const handleCopy = () => {
    if (!fullShortUrl) return;
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          Create a short link
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure redirect sequence, countdown timer, and custom alias.
        </p>
      </div>

      {/* Instant Success Banner with Click-to-Copy */}
      {recentlyCreated && (
        <div className="p-5 rounded-xl skeuo-card border-emerald-300 bg-emerald-50/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Link successfully created
            </span>
            <button
              onClick={() => onLinkCreatedSuccess(recentlyCreated)}
              className="text-xs text-gray-600 hover:text-gray-900 font-medium underline cursor-pointer"
            >
              Go to all links →
            </button>
          </div>

          <div
            onClick={handleCopy}
            className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg skeuo-inset cursor-pointer transition-all border gap-3 ${
              copied
                ? 'border-yellow-400 bg-yellow-50/70 ring-2 ring-yellow-200/80'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
            title="Click to copy shortened link"
          >
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-mono font-medium">
                Your short link
              </span>
              <div className="text-sm font-semibold text-gray-900 truncate font-mono select-all">
                {fullShortUrl}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  copied
                    ? 'skeuo-btn-green'
                    : 'skeuo-btn text-gray-800 hover:bg-gray-100'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShortLink(recentlyCreated.shortCode);
                }}
                className="px-2.5 py-1.5 rounded skeuo-btn-dark text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Test and open short link redirect"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tactile Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-xl skeuo-card space-y-6">
        
        {/* Destination URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Destination URL <span className="text-gray-400">*</span>
          </label>
          <div className="rounded-lg skeuo-inset p-1">
            <input
              type="text"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://example.com/long-page-address"
              className="w-full px-3 py-2 bg-transparent text-gray-900 text-sm placeholder-gray-400 outline-none font-medium"
            />
          </div>
        </div>

        {/* Custom Alias */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Custom alias <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex items-center rounded-lg skeuo-inset overflow-hidden p-1">
            <span className="px-3 text-xs font-mono text-gray-500 border-r border-gray-300 bg-gray-200/50 py-1.5 rounded-l font-medium">
              {baseUrl.replace(/^https?:\/\//, '')}
            </span>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="my-link"
              className="flex-1 px-3 py-1.5 bg-transparent text-gray-900 text-xs font-medium outline-none"
            />
          </div>
        </div>

        {/* Expiration Settings */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-700">
            Link Expiration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'never', label: 'Never' },
              { id: '1', label: '1 day' },
              { id: '7', label: '7 days' },
              { id: '30', label: '30 days' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setExpiration(opt.id)}
                className={`py-2 px-3 text-xs rounded-lg transition-all cursor-pointer ${
                  expiration === opt.id
                    ? 'skeuo-btn-dark font-medium shadow-xs'
                    : 'skeuo-btn text-gray-600 hover:text-gray-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Redirect Steps Configuration */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700">
              Redirect Steps
            </label>
            <span className="text-xs text-gray-600 px-2 py-0.5 rounded skeuo-inset font-medium">
              {redirectSteps} step{redirectSteps > 1 ? 's' : ''} interstitial
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].slice(0, systemConfig.maxRedirectSteps).map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setRedirectSteps(step)}
                className={`py-2 px-3 text-xs rounded-lg transition-all cursor-pointer ${
                  redirectSteps === step
                    ? 'skeuo-btn-dark font-medium shadow-xs'
                    : 'skeuo-btn text-gray-600 hover:text-gray-900'
                }`}
              >
                {step} Step{step > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Duration Per Step */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700">
              Timer Per Step
            </label>
            <span className="text-xs text-gray-600 px-2 py-0.5 rounded skeuo-inset font-medium">
              {timerSeconds}s countdown
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[5, 10, 15, 20].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimerSeconds(t)}
                className={`py-2 px-3 text-xs rounded-lg transition-all cursor-pointer ${
                  timerSeconds === t
                    ? 'skeuo-btn-dark font-medium shadow-xs'
                    : 'skeuo-btn text-gray-600 hover:text-gray-900'
                }`}
              >
                {t} sec
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {errorMessage}
          </p>
        )}

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors border-0 shadow-none"
          >
            <span>Create Link</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
