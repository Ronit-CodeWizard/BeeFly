import React from 'react';
import { AlertCircle, Clock, ArrowLeft } from 'lucide-react';

interface ErrorViewProps {
  type: 'expired' | 'not-found' | 'disabled' | 'general';
  message?: string;
  onGoHome: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  type,
  message,
  onGoHome
}) => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-xl skeuo-card space-y-4 shadow-xl">
        
        <div className="w-14 h-14 rounded-xl skeuo-inset text-gray-700 flex items-center justify-center mx-auto">
          {type === 'expired' ? (
            <Clock className="w-7 h-7 text-gray-600" />
          ) : (
            <AlertCircle className="w-7 h-7 text-gray-600" />
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-tight text-gray-900">
            {type === 'expired' 
              ? 'Link expired' 
              : type === 'disabled'
              ? 'Link disabled'
              : type === 'not-found' 
              ? 'Link not found' 
              : 'Error'}
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed font-mono">
            {message || (type === 'expired'
              ? 'This short link is no longer available.'
              : type === 'disabled'
              ? 'This short link has been disabled by its owner or an administrator.'
              : 'The short link you\'re trying to access doesn\'t exist.')}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-3 px-4 rounded-lg skeuo-btn-dark text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{type === 'expired' || type === 'disabled' ? 'GO HOME' : 'BACK TO HOME'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
