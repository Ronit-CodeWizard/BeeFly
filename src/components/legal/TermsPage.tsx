import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { AppView } from '../../types';

interface TermsPageProps {
  onNavigate: (view: AppView) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500 font-mono">
            Last Updated: February 2026 • Version 2.0
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the BEEFLY URL shortening platform ("Service"), available at beefly-urls.vercel.app, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, you must immediately discontinue using this Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              2. Permitted Use & Destination URLs
            </h2>
            <p>
              BEEFLY provides quick, minimalist URL shortening and verification routing. You agree that all destination URLs you submit:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs sm:text-sm text-gray-600">
              <li>Must point to legitimate, lawful content accessible via standard HTTP or HTTPS protocols.</li>
              <li>Must not contain malware, spyware, phishing scams, or unauthorized tracking software.</li>
              <li>Must not promote illegal activities, hate speech, or non-consensual material.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              3. Verification Sequence & Redirects
            </h2>
            <p>
              To protect recipient users from malicious redirects and abusive automation, short links processed through BEEFLY may utilize intermediate integrity checks and countdown verification sequences before safely redirecting to the final destination.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              4. Link Expiration & Removal
            </h2>
            <p>
              BEEFLY reserves the right to disable, deactivate, or delete any short link at any time without prior notice if it is suspected of violating these terms, causing service interruptions, or being reported by our automated integrity systems.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              5. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. BEEFLY does not guarantee uninterrupted uptime, zero-downtime DNS resolution, or permanent availability of shortened links.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              6. Contact & Support
            </h2>
            <p>
              For inquiries, terms clarifications, or abuse reports, please contact our support team at <span className="font-mono font-semibold text-gray-900">support@beefly-urls.vercel.app</span>.
            </p>
          </section>

        </div>

      </div>

    </div>
  );
};
