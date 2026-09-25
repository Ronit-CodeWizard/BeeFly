import React, { useState } from 'react';
import { AdChoicesBadge } from './AdChoicesBadge';
import { AdSenseContainer } from './AdSenseContainer';
import { Zap, Eye } from 'lucide-react';

interface TopLeaderboardAdProps {
  onAdClick?: () => void;
}

export const TopLeaderboardAd: React.FC<TopLeaderboardAdProps> = () => {
  return (
    <div className="w-full bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col items-center">
        {/* Top 728x90 Google AdSense Leaderboard Unit */}
        <div className="w-full max-w-[728px] my-1">
          <AdSenseContainer
            adSlot="9876543210"
            adFormat="horizontal"
            label="Header 728x90 Leaderboard"
            type="leaderboard"
            minHeight="90px"
          />
        </div>
      </div>
    </div>
  );
};
