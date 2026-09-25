import React from 'react';
import { AdSenseContainer } from './AdSenseContainer';

interface InContentAdProps {
  category?: 'cloud' | 'vpn' | 'ai' | 'finance' | 'dev' | 'security';
  titlePrefix?: string;
}

export const InContentAd: React.FC<InContentAdProps> = ({ 
  titlePrefix = 'In-Article Display'
}) => {
  return (
    <div className="w-full my-4">
      <AdSenseContainer
        adSlot="5544332211"
        adFormat="auto"
        label={`${titlePrefix} (Responsive)`}
        type="banner"
        minHeight="120px"
        className="w-full bg-white shadow-xs"
      />
    </div>
  );
};
