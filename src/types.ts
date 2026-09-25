export interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  title: string;
  createdAt: string;
  clicks: number;
  verifiedRedirects: number;
  earnings: number;
  customAlias?: string;
  tags?: string[];
}

export interface AdCreative {
  id: string;
  title: string;
  tagline: string;
  advertiser: string;
  description: string;
  ctaText: string;
  category: 'cloud' | 'vpn' | 'ai' | 'finance' | 'dev' | 'security';
  badge: string;
  accentColor: string;
  rating?: number;
  url: string;
}

export type VerificationStep = 1 | 2 | 3;

export interface VerificationSession {
  linkId: string;
  step: VerificationStep;
  timerRemaining: number;
  captchaVerified: boolean;
  sponsorVerified: boolean;
  startedAt: number;
}
