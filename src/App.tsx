import React, { useState, useEffect } from 'react';
import { 
  LinkRecord, 
  ClickRecord, 
  SystemConfig, 
  UserProfile, 
  AppView 
} from './types';
import { 
  DEFAULT_SYSTEM_CONFIG, 
  INITIAL_DEMO_USER, 
  INITIAL_ADMIN_USER, 
  INITIAL_LINKS, 
  INITIAL_CLICKS 
} from './data/initialData';
import { BASE_URL, generate8CharShortCode } from './constants';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CreateLinkPage } from './components/dashboard/CreateLinkPage';
import { MyLinksPage } from './components/dashboard/MyLinksPage';
import { LinkAnalyticsPage } from './components/dashboard/LinkAnalyticsPage';
import { AdminPage } from './components/admin/AdminPage';
import { AuthPage } from './components/auth/AuthPage';
import { RedirectPortal } from './components/redirect/RedirectPortal';
import { ErrorView } from './components/common/ErrorView';
import { TermsPage } from './components/legal/TermsPage';
import { PrivacyPage } from './components/legal/PrivacyPage';

export default function App() {
  // 1. Persistent Links state
  const [links, setLinks] = useState<LinkRecord[]>(() => {
    try {
      const saved = localStorage.getItem('beefly_links') || localStorage.getItem('shortly_links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_LINKS;
  });

  // 2. Persistent Clicks analytics state
  const [clicks, setClicks] = useState<ClickRecord[]>(() => {
    try {
      const saved = localStorage.getItem('beefly_clicks') || localStorage.getItem('shortly_clicks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_CLICKS;
  });

  // 3. Persistent System Configuration state
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem('beefly_system_config') || localStorage.getItem('shortly_system_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SYSTEM_CONFIG;
  });

  // 4. Authenticated user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('beefly_user') || localStorage.getItem('shortly_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_DEMO_USER;
  });

  // 5. App View Navigation state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeRedirectCode, setActiveRedirectCode] = useState<string | null>(null);
  const [selectedAnalyticsLinkId, setSelectedAnalyticsLinkId] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('beefly_links', JSON.stringify(links));
      localStorage.setItem('shortly_links', JSON.stringify(links));
    } catch {
      // ignore
    }
  }, [links]);

  useEffect(() => {
    try {
      localStorage.setItem('beefly_clicks', JSON.stringify(clicks));
      localStorage.setItem('shortly_clicks', JSON.stringify(clicks));
    } catch {
      // ignore
    }
  }, [clicks]);

  useEffect(() => {
    try {
      localStorage.setItem('beefly_system_config', JSON.stringify(systemConfig));
      localStorage.setItem('shortly_system_config', JSON.stringify(systemConfig));
    } catch {
      // ignore
    }
  }, [systemConfig]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('beefly_user', JSON.stringify(currentUser));
        localStorage.setItem('shortly_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('beefly_user');
        localStorage.removeItem('shortly_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // URL Query and Path Handling (e.g., ?code=docs9 or ?s=docs9 or pathname /docs9)
  useEffect(() => {
    const handleUrlRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('s') || params.get('code') || params.get('link');

      if (codeParam) {
        handleTriggerShortLink(codeParam, false);
        return;
      }

      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const firstSegment = path.split('/')[0];
      if (firstSegment && firstSegment.toLowerCase() === 'terms') {
        setCurrentView('terms');
        return;
      }
      if (firstSegment && firstSegment.toLowerCase() === 'privacy') {
        setCurrentView('privacy');
        return;
      }
      if (
        firstSegment &&
        firstSegment !== '' &&
        !['login', 'signup', 'dashboard', 'create', 'links', 'admin', 'terms', 'privacy'].includes(firstSegment.toLowerCase())
      ) {
        handleTriggerShortLink(firstSegment, false);
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [links]);

  const baseUrl = `${BASE_URL}/`;

  // Generator for unique 8-character alphanumeric short codes (A-Z, a-z, 0-9)
  // Ensures collision-free uniqueness against in-memory state and persistent store
  const generateUnique8CharCode = (existingList: LinkRecord[]): string => {
    let candidate = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 500) {
      attempts++;
      candidate = generate8CharShortCode();
      const candidateLower = candidate.toLowerCase();
      
      const inList = existingList.some(l => 
        (l?.shortCode || '').toLowerCase() === candidateLower ||
        (l?.customAlias && l.customAlias.toLowerCase() === candidateLower)
      );

      if (!inList) {
        isUnique = true;
      }
    }

    return candidate;
  };

  // Create Short Link handler
  const handleCreateLink = (data: {
    destinationUrl: string;
    customAlias?: string;
    expirationDays: number | null;
    redirectSteps: number;
    timerSeconds: number;
  }): LinkRecord | null => {
    let code: string;

    if (data.customAlias && data.customAlias.trim()) {
      code = data.customAlias.trim();
      const codeLower = code.toLowerCase();
      // Check alias conflict with safe checks
      const existing = links.find(l => (l?.shortCode || '').toLowerCase() === codeLower);
      if (existing) {
        return null;
      }
    } else {
      code = generateUnique8CharCode(links);
    }

    let expiresAt: string | null = null;
    if (data.expirationDays) {
      expiresAt = new Date(Date.now() + data.expirationDays * 86400000).toISOString();
    }

    const newLink: LinkRecord = {
      id: 'link-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      userId: currentUser ? currentUser.id : null,
      shortCode: code,
      destinationUrl: data.destinationUrl,
      customAlias: data.customAlias,
      createdAt: new Date().toISOString(),
      expiresAt,
      isActive: true,
      redirectSteps: Math.min(systemConfig.maxRedirectSteps, data.redirectSteps),
      timerSeconds: data.timerSeconds,
      clicks: 0
    };

    setLinks(prev => [newLink, ...prev]);
    return newLink;
  };

  // Quick shorten from homepage
  const handleQuickShorten = (url: string): LinkRecord | null => {
    return handleCreateLink({
      destinationUrl: url,
      expirationDays: systemConfig.defaultExpirationDays,
      redirectSteps: systemConfig.defaultRedirectSteps,
      timerSeconds: systemConfig.defaultTimerSeconds
    });
  };

  // Trigger short link routing
  const handleTriggerShortLink = (code: string | null | undefined, pushHistory = true) => {
    if (!code) return;
    const safeCode = String(code).trim();
    if (!safeCode) return;

    if (pushHistory) {
      try {
        window.history.pushState({}, '', `/${safeCode}`);
      } catch {
        // ignore
      }
    }
    setActiveRedirectCode(safeCode);
    setCurrentView('redirect');
  };

  // Delete link handler
  const handleDeleteLink = (linkId: string) => {
    setLinks(prev => prev.filter(l => l.id !== linkId));
    setClicks(prev => prev.filter(c => c.linkId !== linkId));
  };

  // Record completed redirection visit
  const handleDestinationReached = (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    // Increment count on link
    setLinks(prev => prev.map(l => l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l));

    // Record click analytics
    const newClick: ClickRecord = {
      id: 'clk-' + Date.now(),
      linkId: link.id,
      shortCode: link.shortCode,
      createdAt: new Date().toISOString(),
      device: typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobile' : 'desktop',
      browser: 'Chrome / Modern Browser',
      country: 'United States',
      referrer: document.referrer || 'direct'
    };

    setClicks(prev => [...prev, newClick]);
  };

  // Check state if active redirect with robust fallback check
  const activeLink = (() => {
    if (!activeRedirectCode) return null;
    const cleanCode = String(activeRedirectCode).toLowerCase();
    const inMemory = links.find(l => {
      if (!l) return false;
      const sCode = (l.shortCode || '').toLowerCase();
      const cAlias = (l.customAlias || '').toLowerCase();
      return sCode === cleanCode || (Boolean(cAlias) && cAlias === cleanCode);
    });
    if (inMemory) return inMemory;

    // Direct check in localStorage in case link was created in parallel tab
    try {
      const saved = localStorage.getItem('beefly_links') || localStorage.getItem('shortly_links');
      if (saved) {
        const parsed: LinkRecord[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find(l => {
            if (!l) return false;
            const sCode = (l.shortCode || '').toLowerCase();
            const cAlias = (l.customAlias || '').toLowerCase();
            return sCode === cleanCode || (Boolean(cAlias) && cAlias === cleanCode);
          });
          if (found) {
            return found;
          }
        }
      }
    } catch {
      // ignore
    }

    return null;
  })();

  const isLinkExpired = activeLink?.expiresAt && new Date(activeLink.expiresAt).getTime() < Date.now();

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900 flex flex-col font-sans selection:bg-yellow-200 selection:text-yellow-900">
      
      {/* If in Redirect View */}
      {currentView === 'redirect' ? (
        !activeLink ? (
          <ErrorView
            type="not-found"
            onGoHome={() => {
              setActiveRedirectCode(null);
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
          />
        ) : !activeLink.isActive ? (
          <ErrorView
            type="disabled"
            onGoHome={() => {
              setActiveRedirectCode(null);
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
          />
        ) : isLinkExpired ? (
          <ErrorView
            type="expired"
            onGoHome={() => {
              setActiveRedirectCode(null);
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
          />
        ) : (
          <RedirectPortal
            link={activeLink}
            systemConfig={systemConfig}
            onDestinationReached={handleDestinationReached}
            onGoHome={() => {
              setActiveRedirectCode(null);
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
          />
        )
      ) : (
        /* Regular SaaS Layout */
        <>
          <Navbar
            currentView={currentView}
            onNavigate={(v) => {
              setCurrentView(v);
              window.history.pushState({}, '', v === 'home' ? '/' : `/${v}`);
            }}
          />

          <main className="flex-1 flex flex-col">
            {currentView === 'home' && (
              <HomePage
                onShortenUrl={handleQuickShorten}
                onOpenShortLink={(code) => handleTriggerShortLink(code)}
                baseUrl={baseUrl}
              />
            )}

            {currentView === 'dashboard' && (
              <DashboardPage
                links={currentUser ? links.filter(l => l.userId === currentUser.id || !l.userId) : links}
                clicks={clicks}
                onNavigateToCreate={() => setCurrentView('create')}
                onNavigateToLinks={() => setCurrentView('links')}
                onNavigateToAnalytics={(id) => {
                  setSelectedAnalyticsLinkId(id);
                  setCurrentView('analytics');
                }}
                onOpenShortLink={(code) => handleTriggerShortLink(code)}
                baseUrl={baseUrl}
              />
            )}

            {currentView === 'create' && (
              <CreateLinkPage
                systemConfig={systemConfig}
                onCreateLink={handleCreateLink}
                onLinkCreatedSuccess={(link) => {
                  setCurrentView('links');
                }}
                onOpenShortLink={(code) => handleTriggerShortLink(code)}
                baseUrl={baseUrl}
              />
            )}

            {currentView === 'links' && (
              <MyLinksPage
                links={currentUser ? links.filter(l => l.userId === currentUser.id || !l.userId) : links}
                onNavigateToCreate={() => setCurrentView('create')}
                onNavigateToAnalytics={(id) => {
                  setSelectedAnalyticsLinkId(id);
                  setCurrentView('analytics');
                }}
                onOpenShortLink={(code) => handleTriggerShortLink(code)}
                onDeleteLink={handleDeleteLink}
                baseUrl={baseUrl}
              />
            )}

            {currentView === 'analytics' && selectedAnalyticsLinkId && (
              (() => {
                const targetLink = links.find(l => l.id === selectedAnalyticsLinkId);
                if (!targetLink) {
                  return (
                    <ErrorView
                      type="not-found"
                      message="Analytics for this link could not be loaded."
                      onGoHome={() => setCurrentView('links')}
                    />
                  );
                }
                return (
                  <LinkAnalyticsPage
                    link={targetLink}
                    clicks={clicks}
                    onBack={() => setCurrentView('links')}
                    baseUrl={baseUrl}
                  />
                );
              })()
            )}

            {currentView === 'admin' && (
              <AdminPage
                systemConfig={systemConfig}
                onUpdateSystemConfig={(newConfig) => setSystemConfig(newConfig)}
                links={links}
                users={[INITIAL_ADMIN_USER, INITIAL_DEMO_USER]}
              />
            )}

            {(currentView === 'login' || currentView === 'signup') && (
              <AuthPage
                mode={currentView}
                onNavigate={(v) => setCurrentView(v)}
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setCurrentView('dashboard');
                }}
              />
            )}

            {currentView === 'settings' && (
              <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Profile Settings</h1>
                  <p className="text-xs text-gray-500 mt-1">Manage your account credentials and defaults.</p>
                </div>

                <div className="p-6 rounded-xl skeuo-card space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Account Email</label>
                    <div className="rounded-lg skeuo-inset p-1">
                      <input
                        disabled
                        value={currentUser?.email || ''}
                        className="w-full px-2.5 py-1.5 bg-transparent text-gray-500 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Role</label>
                    <div className="rounded-lg skeuo-inset p-1">
                      <input
                        disabled
                        value={currentUser?.role === 'admin' ? 'Superadmin' : 'Standard Member'}
                        className="w-full px-2.5 py-1.5 bg-transparent text-gray-500 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => alert('Profile settings updated.')}
                      className="px-5 py-2.5 rounded-lg skeuo-btn-dark text-white text-xs font-bold cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            {currentView === 'terms' && (
              <TermsPage onNavigate={(v) => {
                setCurrentView(v);
                window.history.pushState({}, '', v === 'home' ? '/' : `/${v}`);
              }} />
            )}

            {currentView === 'privacy' && (
              <PrivacyPage onNavigate={(v) => {
                setCurrentView(v);
                window.history.pushState({}, '', v === 'home' ? '/' : `/${v}`);
              }} />
            )}
          </main>

          {/* Hide footer on shortener creation and links pages */}
          {currentView !== 'create' && currentView !== 'links' && (
            <Footer onNavigate={(v) => setCurrentView(v)} />
          )}
        </>
      )}

    </div>
  );
}
