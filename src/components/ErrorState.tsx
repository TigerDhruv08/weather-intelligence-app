import React from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onSearchFallback?: (city: string) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onSearchFallback,
}) => {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-white border border-rose-200 text-center shadow-md space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-[#0D0D0D]">Unable to Fetch Weather Data</h3>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">{message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-[#F58E1D] hover:bg-[#e07d12] text-white font-bold text-sm flex items-center gap-2 shadow transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {onSearchFallback && (
          <button
            type="button"
            onClick={() => onSearchFallback('London')}
            className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#0D0D0D] border border-neutral-300 font-bold text-sm flex items-center gap-2 transition"
          >
            <Search className="w-4 h-4 text-[#F58E1D]" />
            Search London Instead
          </button>
        )}
      </div>
    </div>
  );
};
