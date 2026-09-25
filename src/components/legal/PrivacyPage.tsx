import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { AppView } from '../../types';

interface PrivacyPageProps {
  onNavigate: (view: AppView) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-150">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg skeuo-btn text-xs font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="skeuo-card p-6 sm:p-10 rounded-2xl space-y-8">
        
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 font-mono">
            Last Updated: February 2026 • Version 2.0
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              1. Our Privacy Philosophy
            </h2>
            <p>
              BEEFLY is designed around minimalism and data minimization. We believe URL shortening should be fast, private, and secure without invasive tracking of individuals across the web.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              2. Information We Collect
            </h2>
            <p>
              When links are shortened or visited, we collect minimal operational information required to provide aggregate performance statistics:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs sm:text-sm text-gray-600">
              <li><strong>Link Metadata:</strong> The destination URL, timestamp created, custom alias (if any), and configured expiration date.</li>
              <li><strong>Aggregate Click Analytics:</strong> High-level referrer domain, general browser family, device type (Desktop, Mobile, Tablet), and country-level geo-location.</li>
              <li><strong>No Personal Identifiers:</strong> We do NOT sell personal data, store raw IP addresses permanently, or install third-party tracking cookies on visitors.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              3. Cookies and Local Storage
            </h2>
            <p>
              We use ephemeral session storage solely to maintain the active progress of a multi-step verification sequence (to prevent re-prompting on refreshed tabs) and standard local storage for authenticated preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              4. Third-Party Integrations & Advertisements
            </h2>
            <p>
              BEEFLY may present standard ad inventory (such as Google AdSense) on interstitial verification steps. These partners operate under their respective privacy policies and adherence to industry privacy protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              5. Data Security
            </h2>
            <p>
              All traffic between your browser and BEEFLY is encrypted using industry-standard TLS / HTTPS encryption. Short codes are generated using cryptographically random values to prevent predictable link harvesting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              6. Privacy Rights & Contact
            </h2>
            <p>
              If you have any questions regarding your data or wish to request link deletion, contact us at <span className="font-mono font-semibold text-gray-900">privacy@beefly-urls.vercel.app</span>.
            </p>
          </section>

        </div>

      </div>

    </div>
  );
};
