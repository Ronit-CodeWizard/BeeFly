import React, { useState } from 'react';
import { SystemConfig, LinkRecord, UserProfile } from '../../types';
import { Shield, Sliders, Check } from 'lucide-react';

interface AdminPageProps {
  systemConfig: SystemConfig;
  onUpdateSystemConfig: (newConfig: SystemConfig) => void;
  links: LinkRecord[];
  users: UserProfile[];
}

export const AdminPage: React.FC<AdminPageProps> = ({
  systemConfig,
  onUpdateSystemConfig,
  links,
  users
}) => {
  const [config, setConfig] = useState<SystemConfig>(systemConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSystemConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-900" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            System configuration and multi-step interstitial redirect parameters.
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded skeuo-inset text-gray-700 font-bold">
          Superadmin Mode
        </span>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl skeuo-card">
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Platform Links</span>
          <div className="text-2xl font-black font-mono text-gray-900 mt-1">{links.length}</div>
        </div>
        <div className="p-4 rounded-xl skeuo-card">
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Registered Users</span>
          <div className="text-2xl font-black font-mono text-gray-900 mt-1">{users.length}</div>
        </div>
        <div className="p-4 rounded-xl skeuo-card">
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Max Steps Allowed</span>
          <div className="text-2xl font-black font-mono text-gray-900 mt-1">{config.maxRedirectSteps}</div>
        </div>
        <div className="p-4 rounded-xl skeuo-card">
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Default Timer</span>
          <div className="text-2xl font-black font-mono text-gray-900 mt-1">{config.defaultTimerSeconds}s</div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="p-6 rounded-xl skeuo-card space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Sliders className="w-4 h-4 text-gray-900" />
          <h2 className="text-sm font-bold text-gray-900">
            Interstitial & Redirect Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Maximum Redirect Steps (1 to 5)
            </label>
            <div className="rounded-lg skeuo-inset p-1">
              <input
                type="number"
                min={1}
                max={5}
                value={config.maxRedirectSteps}
                onChange={(e) => setConfig({ ...config, maxRedirectSteps: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-transparent text-gray-900 text-xs font-mono outline-none font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Default Steps for New Links
            </label>
            <div className="rounded-lg skeuo-inset p-1">
              <input
                type="number"
                min={1}
                max={config.maxRedirectSteps}
                value={config.defaultRedirectSteps}
                onChange={(e) => setConfig({ ...config, defaultRedirectSteps: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-transparent text-gray-900 text-xs font-mono outline-none font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Default Timer Duration (seconds)
            </label>
            <div className="rounded-lg skeuo-inset p-1">
              <input
                type="number"
                min={3}
                max={30}
                value={config.defaultTimerSeconds}
                onChange={(e) => setConfig({ ...config, defaultTimerSeconds: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-transparent text-gray-900 text-xs font-mono outline-none font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Max Links Per User
            </label>
            <div className="rounded-lg skeuo-inset p-1">
              <input
                type="number"
                min={5}
                max={1000}
                value={config.maxLinksPerUser}
                onChange={(e) => setConfig({ ...config, maxLinksPerUser: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-transparent text-gray-900 text-xs font-mono outline-none font-semibold"
              />
            </div>
          </div>

        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          {saved ? (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Settings saved successfully
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-mono">
              Changes apply instantly across all active link sequences.
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg skeuo-btn-dark text-white font-bold text-xs cursor-pointer"
          >
            Save Settings
          </button>
        </div>

      </form>

    </div>
  );
};
