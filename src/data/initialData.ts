import { LinkRecord, ClickRecord, SystemConfig, UserProfile } from '../types';

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  maxRedirectSteps: 5,
  defaultRedirectSteps: 3,
  defaultTimerSeconds: 5,
  minTimerSeconds: 3,
  maxTimerSeconds: 30,
  defaultExpirationDays: null,
  maxLinksPerUser: 100,
  interstitialsEnabled: true,
  adSlotTopEnabled: true,
  adSlotMiddleEnabled: true,
  adSlotBottomEnabled: true,
  adSensePublisherId: 'ca-pub-9267601428341390'
};

export const INITIAL_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@shortly.io',
  name: 'Admin',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z'
};

export const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr-demo-01',
  email: 'user@example.com',
  name: 'Alex Rivera',
  role: 'user',
  createdAt: '2026-02-15T00:00:00.000Z'
};

export const INITIAL_LINKS: LinkRecord[] = [
  {
    id: 'link-000',
    userId: 'usr-demo-01',
    shortCode: 'AbCdEfGh',
    destinationUrl: 'https://mooncraft.org',
    customAlias: 'AbCdEfGh',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    isActive: true,
    redirectSteps: 2,
    timerSeconds: 15,
    clicks: 420
  },
  {
    id: 'link-001',
    userId: 'usr-demo-01',
    shortCode: 'aK7mQxP2',
    destinationUrl: 'https://mooncraft.org',
    customAlias: 'aK7mQxP2',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    expiresAt: null,
    isActive: true,
    redirectSteps: 2,
    timerSeconds: 15,
    clicks: 1248
  },
  {
    id: 'link-002',
    userId: 'usr-demo-01',
    shortCode: 'B8nR4tYq',
    destinationUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    customAlias: 'B8nR4tYq',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: null,
    isActive: true,
    redirectSteps: 2,
    timerSeconds: 5,
    clicks: 89
  },
  {
    id: 'link-003',
    userId: 'usr-demo-01',
    shortCode: 'xP2Lm9Qa',
    destinationUrl: 'https://en.wikipedia.org/wiki/Minimalism',
    customAlias: 'xP2Lm9Qa',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    expiresAt: null,
    isActive: true,
    redirectSteps: 1,
    timerSeconds: 5,
    clicks: 34
  },
  {
    id: 'link-004',
    userId: 'usr-demo-01',
    shortCode: '7HdKp3Ws',
    destinationUrl: 'https://news.ycombinator.com',
    customAlias: '7HdKp3Ws',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 2).toISOString(), // Expired
    isActive: true,
    redirectSteps: 3,
    timerSeconds: 5,
    clicks: 12
  }
];

export const INITIAL_CLICKS: ClickRecord[] = [
  {
    id: 'clk-01',
    linkId: 'link-001',
    shortCode: 'aK7mQxP2',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    device: 'desktop',
    browser: 'Chrome',
    country: 'United States',
    referrer: 'direct'
  },
  {
    id: 'clk-02',
    linkId: 'link-001',
    shortCode: 'aK7mQxP2',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    device: 'mobile',
    browser: 'Safari',
    country: 'United Kingdom',
    referrer: 'twitter.com'
  },
  {
    id: 'clk-03',
    linkId: 'link-002',
    shortCode: 'B8nR4tYq',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    device: 'desktop',
    browser: 'Firefox',
    country: 'Germany',
    referrer: 'github.com'
  },
  {
    id: 'clk-04',
    linkId: 'link-003',
    shortCode: 'xP2Lm9Qa',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    device: 'tablet',
    browser: 'Safari',
    country: 'Canada',
    referrer: 'google.com'
  }
];
