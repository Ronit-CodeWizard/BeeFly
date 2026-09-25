import { AdCreative, ShortLink } from '../types';

export const SAMPLE_ADS: AdCreative[] = [
  {
    id: 'ad-cloud-01',
    title: 'CloudVertex Ultra VPS',
    tagline: 'High Performance NVMe Hosting from $2.99/mo',
    advertiser: 'CloudVertex Inc.',
    description: 'Instant root access, 10Gbps unmetered network, 99.99% uptime guarantee with 30-day money back.',
    ctaText: 'Deploy in 60s',
    category: 'cloud',
    badge: 'Special Offer: 65% OFF',
    accentColor: 'indigo',
    rating: 4.9,
    url: 'https://example.com/cloud-vps'
  },
  {
    id: 'ad-vpn-02',
    title: 'AegisVPN Ultra Shield',
    tagline: 'Military-Grade Encryption for All Devices',
    advertiser: 'Aegis Security Labs',
    description: 'Zero log policy, kill-switch protection, bypass geo-blocks with 4,500+ global fast servers.',
    ctaText: 'Claim 3 Months Free',
    category: 'vpn',
    badge: 'Editor\'s Choice 2026',
    accentColor: 'emerald',
    rating: 4.8,
    url: 'https://example.com/aegis-vpn'
  },
  {
    id: 'ad-ai-03',
    title: 'CodePilot AI Suite',
    tagline: 'Write Full-Stack Code 5x Faster with Next-Gen AI',
    advertiser: 'CodePilot Devs',
    description: 'Context-aware completions, real-time bug prevention, instant test generation for VS Code & JetBrains.',
    ctaText: 'Start Free Trial',
    category: 'ai',
    badge: 'Popular with Developers',
    accentColor: 'violet',
    rating: 4.9,
    url: 'https://example.com/codepilot'
  },
  {
    id: 'ad-sec-04',
    title: 'PassGuard Enterprise Vault',
    tagline: 'Next-Gen Zero-Trust Password & Secret Management',
    advertiser: 'PassGuard Security',
    description: 'SOC2 Type II certified, breach alerts, biometric authentication for teams and remote workers.',
    ctaText: 'Get Secure Now',
    category: 'security',
    badge: 'Verified Secure',
    accentColor: 'rose',
    rating: 4.7,
    url: 'https://example.com/passguard'
  },
  {
    id: 'ad-fin-05',
    title: 'FinApex Multi-Currency Card',
    tagline: 'Zero FX Fees across 45 Currencies Worldwide',
    advertiser: 'FinApex Global',
    description: 'Earn 3.5% cashback on software purchases. Built for international nomads and modern companies.',
    ctaText: 'Order Metal Card',
    category: 'finance',
    badge: 'No Annual Fees',
    accentColor: 'amber',
    rating: 4.8,
    url: 'https://example.com/finapex'
  }
];

export const INITIAL_LINKS: ShortLink[] = [
  {
    id: 'link-101',
    slug: 'wiki-quantum',
    originalUrl: 'https://en.wikipedia.org/wiki/Quantum_computing',
    title: 'Wikipedia: Quantum Computing Overview',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    clicks: 1420,
    verifiedRedirects: 1184,
    earnings: 4.74,
    customAlias: 'wiki-quantum',
    tags: ['education', 'tech']
  },
  {
    id: 'link-102',
    slug: 'dev-cheatsheet',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    title: 'MDN Web Docs JavaScript Guide',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    clicks: 865,
    verifiedRedirects: 735,
    earnings: 2.94,
    customAlias: 'dev-cheatsheet',
    tags: ['coding', 'reference']
  },
  {
    id: 'link-103',
    slug: 'tech-news-2026',
    originalUrl: 'https://news.ycombinator.com',
    title: 'Hacker News Frontpage',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    clicks: 310,
    verifiedRedirects: 268,
    earnings: 1.07,
    tags: ['news', 'startups']
  }
];

export const QUICK_PRESETS = [
  {
    label: 'Wikipedia: Quantum Computing',
    url: 'https://en.wikipedia.org/wiki/Quantum_computing',
    title: 'Quantum Computing - Wikipedia'
  },
  {
    label: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web',
    title: 'MDN Web Docs Resource'
  },
  {
    label: 'GitHub Trending',
    url: 'https://github.com/trending',
    title: 'GitHub Trending Repositories'
  },
  {
    label: 'Hacker News',
    url: 'https://news.ycombinator.com',
    title: 'Hacker News Top Stories'
  }
];
