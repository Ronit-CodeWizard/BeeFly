// Central configuration value for the Beefly URL shortener domain
export const BASE_URL = 'https://beefly-urls.vercel.app';

// Helper to format full short URL
export function getShortUrl(shortCode: string): string {
  const cleanCode = (shortCode || '').replace(/^\/+/, '');
  return `${BASE_URL}/${cleanCode}`;
}

// Generate cryptographically secure random 8-character alphanumeric code
// Allowed characters: A-Z, a-z, 0-9
// Exactly 8 characters, no spaces, no special characters, no slashes.
export function generate8CharShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  const result: string[] = [];

  // Use crypto.getRandomValues if available (browser / node crypto)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const randomValues = new Uint32Array(8);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 8; i++) {
      result.push(chars[randomValues[i] % charsLength]);
    }
    return result.join('');
  }

  // Math.random fallback
  for (let i = 0; i < 8; i++) {
    const index = Math.floor(Math.random() * charsLength);
    result.push(chars[index]);
  }
  return result.join('');
}
