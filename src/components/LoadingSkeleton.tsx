import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Hero Card Skeleton */}
      <div className="h-64 rounded-2xl bg-white border border-neutral-200 p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-32 bg-neutral-200/80 rounded" />
          </div>
          <div className="h-10 w-28 bg-neutral-200 rounded-xl" />
        </div>
        <div className="h-20 w-36 bg-neutral-200 rounded-xl" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={`skel-metric-${i}`}
            className="h-28 rounded-xl bg-white border border-neutral-200 p-4 space-y-3 shadow-sm"
          >
            <div className="h-4 w-24 bg-neutral-200 rounded" />
            <div className="h-8 w-16 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="h-44 rounded-xl bg-white border border-neutral-200 p-4 shadow-sm" />
    </div>
  );
};
