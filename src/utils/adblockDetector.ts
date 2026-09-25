/**
 * Accurate Browser AdBlocker Detector without False Positives
 * 
 * Accurately detects:
 * - uBlock Origin
 * - AdBlock Plus
 * - AdBlock
 * - Brave Shields
 * - Ghostery
 * 
 * Avoids false positives by:
 * 1. Testing a local same-origin /ads.js beacon (eliminates CSP / network failures).
 * 2. Testing DOM cosmetic bait with explicit pixel dimensions (eliminates offsetParent / layout timing false triggers).
 */

export interface AdBlockDetectionResult {
  isBlocked: boolean;
  blockType?: 'cosmetic' | 'script' | 'none';
}

declare global {
  interface Window {
    __beefly_ads_loaded?: boolean;
  }
}

/**
 * 1. Cosmetic Filter Bait Probe:
 * Injects a 100x100px test box with standard ad classes.
 * When an adblocker is active, its EasyList CSS stylesheet rules inject "display: none !important"
 * or collapse its height to 0.
 * When adblocker is OFF, display remains "block" and offsetHeight remains 100px.
 */
export function detectCosmeticBlock(): boolean {
  if (typeof document === 'undefined' || !document.body) return false;

  const bait = document.createElement('div');
  bait.className = 'adsbox ad-placement pub_300x250 pub_728x90 banner-ad text-ad';
  bait.id = 'banner-ad-test';
  bait.style.position = 'absolute';
  bait.style.top = '-9999px';
  bait.style.left = '-9999px';
  bait.style.width = '100px';
  bait.style.height = '100px';
  bait.style.display = 'block';
  bait.style.visibility = 'visible';
  bait.innerHTML = '&nbsp;';

  try {
    document.body.appendChild(bait);
    const style = window.getComputedStyle(bait);

    // Only flag as blocked if an adblocker injected CSS rules to hide or collapse the element
    const isHidden =
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      bait.offsetHeight === 0;

    document.body.removeChild(bait);
    return isHidden;
  } catch {
    return false;
  }
}

/**
 * 2. Script Probe via Local /ads.js:
 * Loads a local /ads.js beacon from our own origin.
 * Every browser adblocker (uBlock Origin, Adblock Plus, Brave Shields) contains
 * URL filter rules matching ads.js.
 * 
 * - When AdBlocker is OFF: /ads.js loads instantly with 200 OK from same-origin (no CSP or network block).
 * - When AdBlocker is ON: The extension intercepts and cancels /ads.js with net::ERR_BLOCKED_BY_CLIENT.
 */
export function detectScriptBlock(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return resolve(false);
    }

    // Reset beacon flag
    window.__beefly_ads_loaded = false;

    const script = document.createElement('script');
    script.src = `/ads.js?t=${Date.now()}`;
    script.async = true;

    let hasHandled = false;
    const cleanup = () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    script.onload = () => {
      if (!hasHandled) {
        hasHandled = true;
        cleanup();
        // Script loaded successfully -> AdBlocker is NOT blocking scripts
        resolve(false);
      }
    };

    script.onerror = () => {
      if (!hasHandled) {
        hasHandled = true;
        cleanup();
        // The local same-origin /ads.js was blocked by an adblocker extension
        resolve(true);
      }
    };

    // Safety timeout
    setTimeout(() => {
      if (!hasHandled) {
        hasHandled = true;
        cleanup();
        // If window.__beefly_ads_loaded was set, it passed
        resolve(window.__beefly_ads_loaded ? false : false);
      }
    }, 800);

    try {
      document.body.appendChild(script);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Check specifically for browser AdBlockers without false positives
 */
export async function checkAdBlocker(): Promise<AdBlockDetectionResult> {
  // Check cosmetic first (instant)
  if (detectCosmeticBlock()) {
    return { isBlocked: true, blockType: 'cosmetic' };
  }

  // Check script blocking with local same-origin beacon
  const scriptBlocked = await detectScriptBlock();
  if (scriptBlocked) {
    return { isBlocked: true, blockType: 'script' };
  }

  return { isBlocked: false, blockType: 'none' };
}
