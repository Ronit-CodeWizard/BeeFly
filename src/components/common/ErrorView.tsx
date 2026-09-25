import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface ErrorViewProps {
  type: 'expired' | 'not-found' | 'disabled' | 'general';
  message?: string;
  onGoHome: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message,
  onGoHome
}) => {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-gray-200/90 shadow-xl space-y-6">
        
        {/* Subtle Alert Icon in neutral dark gray */}
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-7 h-7 stroke-[2]" />
        </div>

        {/* Text exactly matching specification */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Link Not Found
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed font-mono">
            {message || 'This shortened link does not exist or may have expired.'}
          </p>
        </div>

        {/* Action Button: Go to Beefly URLs */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-3.5 px-5 rounded-xl bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 text-sm font-bold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 shadow-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Beefly URLs</span>
          </button>
        </div>

      </div>
    </div>
  );
};
