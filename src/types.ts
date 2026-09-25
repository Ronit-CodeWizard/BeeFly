export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface LinkRecord {
  id: string;
  userId: string | null; // null for anonymous public creations
  shortCode: string;
  destinationUrl: string;
  customAlias?: string;
  createdAt: string;
  expiresAt: string | null; // null for never
  isActive: boolean;
  redirectSteps: number; // 1 to 5
  timerSeconds: number; // 5 to 30
  clicks: number;
}

export interface ClickRecord {
  id: string;
  linkId: string;
  shortCode: string;
  createdAt: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  country: string;
  referrer: string;
}

export interface RedirectSession {
  token: string;
  shortCode: string;
  totalSteps: number;
  currentStep: number;
  stepStartedAt: number; // timestamp ms
  stepDurationSeconds: number;
  completedSteps: number[]; // e.g. [1, 2]
  isReadyForDestination: boolean;
}

export interface SystemConfig {
  maxRedirectSteps: number;
  defaultRedirectSteps: number;
  defaultTimerSeconds: number;
  minTimerSeconds: number;
  maxTimerSeconds: number;
  defaultExpirationDays: number | null; // null = never
  maxLinksPerUser: number;
  interstitialsEnabled: boolean;
  adSlotTopEnabled: boolean;
  adSlotMiddleEnabled: boolean;
  adSlotBottomEnabled: boolean;
  adSensePublisherId: string;
}

export type AppView = 
  | 'home'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'create'
  | 'links'
  | 'analytics'
  | 'settings'
  | 'admin'
  | 'redirect'
  | 'expired'
  | 'not-found'
  | 'terms'
  | 'privacy';
