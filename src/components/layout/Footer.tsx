import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-10 py-5 px-4 text-xs text-slate-500 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-950 font-mono text-sm">🐝 BeeFly</span>
          <span>•</span>
          <span>Minimalist 3-Step Verification URL Shrinker</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>AdSense Pub: ca-pub-9267601428341390</span>
          <span>•</span>
          <span>© {new Date().getFullYear()} BeeFly</span>
        </div>
      </div>
    </footer>
  );
};
