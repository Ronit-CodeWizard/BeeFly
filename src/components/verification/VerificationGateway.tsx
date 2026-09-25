import React, { useState } from 'react';
import { ShortLink, VerificationStep } from '../../types';
import { Step1Security } from './Step1Security';
import { Step2Sponsor } from './Step2Sponsor';
import { Step3Destination } from './Step3Destination';
import { AdSenseContainer } from '../ads/AdSenseContainer';
import { SidebarBannerAd } from '../ads/SidebarBannerAd';
import { Check, ArrowLeft } from 'lucide-react';

interface VerificationGatewayProps {
  link: ShortLink;
  onRedirectCompleted: (linkId: string) => void;
  onExitToDashboard: () => void;
}

export const VerificationGateway: React.FC<VerificationGatewayProps> = ({
  link,
  onRedirectCompleted,
  onExitToDashboard
}) => {
  const [currentStep, setCurrentStep] = useState<VerificationStep>(1);

  const handleStep1Complete = () => {
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  const handleRedirectSuccess = () => {
    onRedirectCompleted(link.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* BeeFly Classic Top Interstitial Bar */}
      <div className="bg-slate-950 text-white px-4 py-2 sticky top-0 z-30 shadow-md border-b border-amber-500/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitToDashboard}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium bg-slate-800 px-2.5 py-1 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to BeeFly</span>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-amber-400 font-mono tracking-tight text-sm flex items-center gap-1">
                🐝 BeeFly
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">• Gateway Interstitial</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-slate-400 hidden md:inline">
              Destination: <strong className="text-slate-200">/{link.slug}</strong>
            </span>
            <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded text-[11px] font-bold font-mono">
              STEP {currentStep} OF 3
            </div>
          </div>
        </div>
      </div>

      {/* Top 728x90 Google AdSense Header Slot */}
      <div className="w-full max-w-[728px] mx-auto px-4 mt-3">
        <AdSenseContainer
          adSlot="7788990011"
          adFormat="horizontal"
          label="Header AdSense Leaderboard (728x90)"
          type="leaderboard"
          minHeight="90px"
        />
      </div>

      {/* Main 3-Column Grid: Left Skyscraper Space | Center Interstitial Verification Step | Right Skyscraper Space */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Google AdSense Skyscraper Container (300x600 / 160x600) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-16 space-y-3">
            <SidebarBannerAd position="left" adIndex={0} />
          </div>

          {/* Center Column: BeeFly Minimal 3-Step Verification Portal */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto space-y-4">
            
            {/* Minimal Steps Progress Indicators */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                
                {/* Step 1 */}
                <div className={`py-1.5 px-2 rounded border flex items-center justify-center gap-1.5 ${
                  currentStep === 1 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                    : currentStep > 1 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <span>1.</span>}
                  <span>Anti-Bot</span>
                </div>

                {/* Step 2 */}
                <div className={`py-1.5 px-2 rounded border flex items-center justify-center gap-1.5 ${
                  currentStep === 2 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                    : currentStep > 2 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <span>2.</span>}
                  <span>Ad Check</span>
                </div>

                {/* Step 3 */}
                <div className={`py-1.5 px-2 rounded border flex items-center justify-center gap-1.5 ${
                  currentStep === 3 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <span>3.</span>
                  <span>Skip Ad</span>
                </div>

              </div>
            </div>

            {/* In-Between Google AdSense Responsive Unit Above Step */}
            <AdSenseContainer
              adSlot="8811223344"
              adFormat="auto"
              label="In-Article AdSense Banner"
              type="rectangle"
              minHeight="100px"
              className="w-full bg-white shadow-xs"
            />

            {/* Active Verification Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs relative">
              {currentStep === 1 && (
                <Step1Security link={link} onComplete={handleStep1Complete} />
              )}
              {currentStep === 2 && (
                <Step2Sponsor link={link} onComplete={handleStep2Complete} />
              )}
              {currentStep === 3 && (
                <Step3Destination link={link} onRedirectSuccess={handleRedirectSuccess} />
              )}
            </div>

            {/* In-Between Google AdSense Responsive Unit Below Step */}
            <AdSenseContainer
              adSlot="9922334455"
              adFormat="auto"
              label="Footer In-Feed AdSense Space"
              type="banner"
              minHeight="90px"
              className="w-full bg-white shadow-xs"
            />

          </div>

          {/* Right Google AdSense Skyscraper Container (300x600 / 160x600) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-16 space-y-3">
            <SidebarBannerAd position="right" adIndex={2} />
          </div>

        </div>
      </div>

      <div className="text-center py-3 text-xs text-slate-400 border-t border-slate-200 bg-white font-mono">
        BeeFly Minimalist Engine • Google AdSense Approved Spaces (ca-pub-9267601428341390)
      </div>
    </div>
  );
};
