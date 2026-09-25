import React, { useState } from 'react';
import { AppView, UserProfile } from '../../types';
import { BeeLogo } from '../common/BeeLogo';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onNavigate: (view: AppView) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  mode,
  onNavigate,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Authenticate user
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      name: name.trim() || email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(newUser);
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-16 sm:py-24">
      <div className="skeuo-card p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center mx-auto mb-2">
            <BeeLogo size={32} />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-xs text-gray-500">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard.' 
              : 'Start shortening links and tracking traffic.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Full Name
              </label>
              <div className="rounded-lg skeuo-inset p-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-2.5 py-1.5 bg-transparent text-gray-900 text-xs outline-none font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Email
            </label>
            <div className="rounded-lg skeuo-inset p-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-2.5 py-1.5 bg-transparent text-gray-900 text-xs outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to demo inbox.')}
                  className="text-[11px] text-gray-500 hover:text-gray-900"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="rounded-lg skeuo-inset p-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-2.5 py-1.5 bg-transparent text-gray-900 text-xs outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg skeuo-btn-dark text-white text-xs font-bold tracking-wide cursor-pointer mt-2"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center pt-2 text-xs text-gray-500 border-t border-gray-100">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-gray-900 hover:underline font-bold"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-gray-900 hover:underline font-bold"
              >
                Login
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
