import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface BlogWikiCardProps {
  className?: string;
}

export const BlogWikiCard: React.FC<BlogWikiCardProps> = ({
  className = ''
}) => {
  return (
    <article
      className={`w-full rounded-2xl p-5 sm:p-6 text-left transition-all bg-white text-gray-900 border border-gray-200/90 shadow-2xs relative overflow-hidden ${className}`}
      aria-label="Blog and Wiki Knowledge Section"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold tracking-wide uppercase border border-emerald-200/60">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Blog / wiki</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Entry</span>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 leading-snug mb-2">
        Safe Link Resolution & Interstitial Verification Architecture
      </h3>

      <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal mb-4">
        Before routing users to external endpoints, modern URL infrastructure validates SSL/TLS handshake
        validity, checks domain reputation databases, and protects browsing privacy through client-side
        interstitial verification steps.
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-mono">
        <span>Beefly Web Standards • 2 min read</span>
        <span className="flex items-center gap-1 hover:text-gray-600 transition-colors">
          Reference RFC 7231 <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </article>
  );
};
