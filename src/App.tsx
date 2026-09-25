import React, { useState, useEffect } from 'react';
import { ShortLink } from './types';
import { INITIAL_LINKS } from './data/sampleData';
import { TopLeaderboardAd } from './components/ads/TopLeaderboardAd';
import { BottomAnchorAd } from './components/ads/BottomAnchorAd';
import { SidebarBannerAd } from './components/ads/SidebarBannerAd';
import { InContentAd } from './components/ads/InContentAd';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { UrlShortenerForm } from './components/dashboard/UrlShortenerForm';
import { StatsBar } from './components/dashboard/StatsBar';
import { LinksList } from './components/dashboard/LinksList';
import { HowItWorksView } from './components/dashboard/HowItWorksView';
import { VerificationGateway } from './components/verification/VerificationGateway';
import { QrModal } from './components/dashboard/QrModal';
import { PlayCircle, X } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState<ShortLink[]>(() => {
    try {
      const saved = localStorage.getItem('beefly_links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_LINKS;
  });

  const [activeTab, setActiveTab] = useState<'shortener' | 'links' | 'how-it-works'>('shortener');
  const [activeVerificationLink, setActiveVerificationLink] = useState<ShortLink | null>(null);
  const [qrModalLink, setQrModalLink] = useState<ShortLink | null>(null);
  const [isQuickTestModalOpen, setIsQuickTestModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('beefly_links', JSON.stringify(links));
    } catch {
      // ignore
    }
  }, [links]);

  // Handle URL query parameters (?s=slug) or hash for instant interstitial redirection test
  useEffect(() => {
    const handleUrlRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('s') || params.get('v') || params.get('link');

      if (slug) {
        const found = links.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
        if (found) {
          handleLinkImpression(found.id);
          setActiveVerificationLink(found);
          return;
        } else {
          const tempLink: ShortLink = {
            id: 'temp-' + slug,
            slug: slug,
            originalUrl: 'https://example.com/demo-destination',
            title: `Destination Link (/s/${slug})`,
            createdAt: new Date().toISOString(),
            clicks: 1,
            verifiedRedirects: 0,
            earnings: 0,
          };
          setActiveVerificationLink(tempLink);
          return;
        }
      }

      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash.startsWith('s/')) {
        const hashSlug = hash.replace('s/', '');
        const found = links.find((l) => l.slug.toLowerCase() === hashSlug.toLowerCase());
        if (found) {
          handleLinkImpression(found.id);
          setActiveVerificationLink(found);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://beefly.app/';

  const handleLinkImpression = (linkId: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l))
    );
  };

  const handleLinkCreated = (newLink: ShortLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  const handleOpenTestFlow = (link: ShortLink) => {
    handleLinkImpression(link.id);
    setActiveVerificationLink(link);
    const newUrl = `${baseUrl}?s=${link.slug}`;
    window.history.pushState({ slug: link.slug }, '', newUrl);
  };

  const handleExitToDashboard = () => {
    setActiveVerificationLink(null);
    window.history.pushState({}, '', baseUrl);
  };

  const handleRedirectCompleted = (linkId: string) => {
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === linkId) {
          const newPasses = l.verifiedRedirects + 1;
          const newEarnings = Number((l.earnings + 0.005).toFixed(4));
          return {
            ...l,
            verifiedRedirects: newPasses,
            earnings: newEarnings,
          };
        }
        return l;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      
      {/* 1. TOP 728x90 GOOGLE ADSENSE LEADERBOARD SPACE (Always Visible) */}
      <TopLeaderboardAd />

      {activeVerificationLink ? (
        /* AdFly-style 3-Step Interstitial Verification Gateway */
        <VerificationGateway
          link={activeVerificationLink}
          onRedirectCompleted={handleRedirectCompleted}
          onExitToDashboard={handleExitToDashboard}
        />
      ) : (
        /* Minimalist AdFly-style Dashboard */
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onQuickTest={() => setIsQuickTestModalOpen(true)}
          />

          <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4">
            
            {/* Quick Metrics Bar */}
            <StatsBar links={links} />

            {/* 3-Column Layout: Left Skyscraper Space | Content Center | Right Skyscraper Space */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-2">
              
              {/* 2. LEFT GOOGLE ADSENSE SKYSCRAPER SPACE (300x600) */}
              <div className="hidden lg:block lg:col-span-3 sticky top-18 space-y-3">
                <SidebarBannerAd position="left" adIndex={0} />
              </div>

              {/* Center Content Column */}
              <div className="lg:col-span-6 w-full space-y-4">
                
                {activeTab === 'shortener' && (
                  <div className="space-y-4">
                    <UrlShortenerForm
                      onLinkCreated={handleLinkCreated}
                      onOpenTestFlow={handleOpenTestFlow}
                      onOpenQrModal={(link) => setQrModalLink(link)}
                      baseUrl={baseUrl}
                    />

                    {/* In-Feed Google AdSense Space between Shortener and List */}
                    <InContentAd titlePrefix="AdSense Native Responsive" />

                    <LinksList
                      links={links.slice(0, 4)}
                      onOpenTestFlow={handleOpenTestFlow}
                      onOpenQrModal={(link) => setQrModalLink(link)}
                      onDeleteLink={handleDeleteLink}
                      baseUrl={baseUrl}
                    />
                  </div>
                )}

                {activeTab === 'links' && (
                  <div className="space-y-4">
                    <LinksList
                      links={links}
                      onOpenTestFlow={handleOpenTestFlow}
                      onOpenQrModal={(link) => setQrModalLink(link)}
                      onDeleteLink={handleDeleteLink}
                      baseUrl={baseUrl}
                    />
                    <InContentAd titlePrefix="Mid-List AdSense Banner" />
                  </div>
                )}

                {activeTab === 'how-it-works' && (
                  <HowItWorksView onStartCreating={() => setActiveTab('shortener')} />
                )}

              </div>

              {/* 3. RIGHT GOOGLE ADSENSE SKYSCRAPER SPACE (300x600) */}
              <div className="hidden lg:block lg:col-span-3 sticky top-18 space-y-3">
                <SidebarBannerAd position="right" adIndex={2} />
              </div>

            </div>

          </div>

          <Footer />
        </>
      )}

      {/* 4. BOTTOM GOOGLE ADSENSE STICKY DOCK (Always visible at bottom) */}
      <BottomAnchorAd />

      {/* QR Code Modal */}
      {qrModalLink && (
        <QrModal
          link={qrModalLink}
          fullShortUrl={`${baseUrl}?s=${qrModalLink.slug}`}
          onClose={() => setQrModalLink(null)}
        />
      )}

      {/* Quick Test Modal */}
      {isQuickTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-3 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Test 3-Step Verification
              </h3>
              <button
                onClick={() => setIsQuickTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pick a link to simulate the visitor's 3-step interstitial redirection:
            </p>

            <div className="max-h-56 overflow-y-auto space-y-1.5">
              {links.map((link) => (
                <div
                  key={link.id}
                  onClick={() => {
                    setIsQuickTestModalOpen(false);
                    handleOpenTestFlow(link);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-900 block truncate">
                      /s/{link.slug}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {link.originalUrl}
                    </span>
                  </div>
                  <button className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold shrink-0 flex items-center gap-1">
                    <span>Test</span>
                    <PlayCircle className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setIsQuickTestModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
