import * as React from 'react';

const SkeletonTask = () => {
  return (
    <div className="p-4 flex items-center gap-4 bg-slate-800">
      {/* Skeleton for checkbox */}
      <div className="w-6 h-6 rounded border border-slate-600 animate-pulse"></div>

      {/* Skeleton for task description */}
      <div className="flex-grow h-4 bg-slate-600 rounded animate-pulse"></div>

      {/* Skeleton for category and priority tags */}
      <div className="flex gap-2">
        <div className="w-16 h-6 bg-slate-600 rounded animate-pulse"></div>
        <div className="w-16 h-6 bg-slate-600 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonTask;