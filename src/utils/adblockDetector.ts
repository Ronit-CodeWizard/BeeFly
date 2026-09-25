/**
 * Multi-layer AdBlocker and DNS Ad-Blocking Detector
 * 
 * Accurately detects:
 * 1. Network-level DNS ad blockers (Pi-hole, NextDNS, AdGuard DNS, Brave Shields)
 * 2. Extension ad blockers (uBlock Origin, Adblock Plus, AdBlock, Ghostery)
 * 3. Element-hiding cosmetic CSS filters
 */

export interface AdBlockDetectionResult {
  isBlocked: boolean;
  blockType?: 'network' | 'cosmetic' | 'script' | 'none';
}

/**
 * 1. Network / DNS Probe:
 * Attempts to contact well-known ad domains.
 * DNS blockers (Pi-hole, NextDNS, AdGuard DNS) return NXDOMAIN or 0.0.0.0,
 * causing fetch to reject immediately with a network error.
 */
export async function detectNetworkBlock(): Promise<boolean> {
  const probeUrls = [
    'https://pagead2.googlesyndicationv2.com/pagead/js/adsbygoogle.js',
    'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
    'https://adservice.google.com/adsid/integrator.js'
  ];

  for (const url of probeUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch {
      // Network/DNS error or blocked by client extension
      return true;
    }
  }

  return false;
}

/**
 * 2. Cosmetic Filter Bait Probe:
 * Injects DOM elements with known ad classes and checks whether
 * ad blocker CSS hides, collapses, or removes them.
 */
export function detectCosmeticBlock(): boolean {
  if (typeof document === 'undefined') return false;

  const bait = document.createElement('div');
  bait.setAttribute(
    'class',
    'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links banner-ad ad-placement ad-banner adsbox'
  );
  bait.setAttribute('id', 'bottom-ad-container');
  bait.style.position = 'absolute';
  bait.style.left = '-9999px';
  bait.style.top = '-9999px';
  bait.style.width = '1px';
  bait.style.height = '1px';
  bait.innerHTML = '&nbsp;';

  try {
    document.body.appendChild(bait);

    const isHidden =
      bait.offsetParent === null ||
      bait.offsetHeight === 0 ||
      bait.offsetLeft === 0 ||
      bait.clientHeight === 0 ||
      window.getComputedStyle(bait).display === 'none' ||
      window.getComputedStyle(bait).visibility === 'hidden';

    document.body.removeChild(bait);
    return isHidden;
  } catch {
    return false;
  }
}

/**
 * 3. Script Injection Probe:
 * Injects a dummy script targeting an ad network path.
 */
export function detectScriptBlock(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(false);

    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndicationv2.com/pagead/js/adsbygoogle.js';
    script.async = true;

    let resolved = false;
    const cleanup = () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    script.onload = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(false);
      }
    };

    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(true);
      }
    };

    // Timeout safety
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(false);
      }
    }, 1500);

    try {
      document.body.appendChild(script);
    } catch {
      resolve(true);
    }
  });
}

/**
 * Comprehensive check combining Network/DNS, Cosmetic, and Script probes
 */
export async function checkAdBlocker(): Promise<AdBlockDetectionResult> {
  // Check cosmetic first (instant)
  if (detectCosmeticBlock()) {
    return { isBlocked: true, blockType: 'cosmetic' };
  }

  // Check network/DNS and script concurrently
  const [networkBlocked, scriptBlocked] = await Promise.all([
    detectNetworkBlock(),
    detectScriptBlock()
  ]);

  if (networkBlocked) {
    return { isBlocked: true, blockType: 'network' };
  }

  if (scriptBlocked) {
    return { isBlocked: true, blockType: 'script' };
  }

  return { isBlocked: false, blockType: 'none' };
}
