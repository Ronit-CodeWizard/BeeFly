import React from 'react';
import { AdSenseContainer } from './AdSenseContainer';

interface SidebarBannerAdProps {
  position?: 'left' | 'right';
  adIndex?: number;
}

export const SidebarBannerAd: React.FC<SidebarBannerAdProps> = ({ 
  position = 'left',
  adIndex = 1 
}) => {
  const slotNumber = position === 'left' ? '1122334455' : '6677889900';

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 160x600 or 300x600 Skyscraper Google AdSense Unit */}
      <AdSenseContainer
        adSlot={slotNumber}
        adFormat="vertical"
        label={`${position.toUpperCase()} Skyscraper (300x600)`}
        type="skyscraper"
        minHeight="350px"
        className="w-full"
      />

      {/* Secondary Square Ad Unit */}
      <AdSenseContainer
        adSlot={`${slotNumber}-sq`}
        adFormat="rectangle"
        label={`${position.toUpperCase()} Medium Rectangle (300x250)`}
        type="rectangle"
        minHeight="180px"
        className="w-full"
      />
    </div>
  );
};
