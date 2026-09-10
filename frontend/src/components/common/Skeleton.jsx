import React from 'react';

export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-gray-200/80 rounded-xl';
  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }
  return <div className={`${base} ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-2/3" />
    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-soft space-y-3">
    <div className="h-10 bg-gray-100/80 rounded-xl animate-pulse" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse flex items-center px-4 justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export default Skeleton;
