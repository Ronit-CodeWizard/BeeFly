import React, { useState } from 'react';
import { LinkRecord } from '../../types';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { BeeLogo } from '../common/BeeLogo';

interface HomePageProps {
  onShortenUrl: (url: string) => LinkRecord | null;
  onOpenShortLink: (code: string) => void;
  baseUrl: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onShortenUrl,
  onOpenShortLink,
  baseUrl
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdLink, setCreatedLink] = useState<LinkRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a valid URL.');
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
        throw new Error('Invalid host');
      }
    } catch {
      setErrorMessage('Please enter a valid HTTP or HTTPS destination URL.');
      return;
    }

    const res = onShortenUrl(trimmed);
    if (res) {
      setCreatedLink(res);
      setUrlInput('');
    }
  };

  const fullShortUrl = createdLink ? `${baseUrl}${createdLink.shortCode}` : '';

  const handleCopy = () => {
    if (!fullShortUrl) return;
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-24 flex flex-col items-center text-center">
      
      {/* Hero Title & Subtext with clean, simple typography */}
      <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-gray-900 max-w-xl">
        Shorten your links
      </h1>

      <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed font-normal">
        Create short, memorable links and track their performance from one simple dashboard.
      </p>

      {/* Main Shorten Input Box with clean tactile styling */}
      <form onSubmit={handleSubmit} className="w-full mt-10 max-w-xl">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-xl skeuo-card">
          <div className="flex-1 flex items-center rounded-lg skeuo-inset px-3 py-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Paste your long URL..."
              className="w-full py-2 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg skeuo-btn-green text-white text-xs sm:text-sm font-medium tracking-normal cursor-pointer shrink-0"
          >
            Shorten URL
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-red-600 text-left mt-2.5 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {errorMessage}
          </p>
        )}
      </form>

      {/* Prominently Displayed Shortened Link with Click-to-Copy */}
      {createdLink && (
        <div className="w-full max-w-xl mt-8 p-5 rounded-xl skeuo-card text-left animate-in fade-in duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              Your short link
            </span>
          </div>

          {/* Interactive URL Bar */}
          <div
            onClick={handleCopy}
            className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg skeuo-inset cursor-pointer transition-all border gap-3 ${
              copied
                ? 'border-yellow-400 bg-yellow-50/70 ring-2 ring-yellow-200/80'
                : 'border-gray-300 hover:border-gray-400 hover:bg-white'
            }`}
            title="Click to copy shortened link"
          >
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-mono font-medium">
                Short URL
              </span>
              <div className="text-base font-semibold text-gray-900 truncate tracking-tight select-all font-mono">
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
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  copied
                    ? 'skeuo-btn-green'
                    : 'skeuo-btn text-gray-800 hover:bg-gray-100'
                }`}
                title="Copy complete URL"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShortLink(createdLink.shortCode);
                }}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold skeuo-btn-dark text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Open short link in redirect sequence"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Destination info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span className="truncate max-w-sm">
              Destination: <span className="text-gray-700 font-mono">{createdLink.destinationUrl}</span>
            </span>
            <span className="shrink-0 text-yellow-800 font-medium">
              {copied ? 'Copied to clipboard' : 'Click to copy'}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
