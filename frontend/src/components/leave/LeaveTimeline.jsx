import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const LeaveTimeline = ({ leave }) => {
  if (!leave) return null;

  const isPending = leave.status === 'PENDING';
  const isApproved = leave.status === 'APPROVED';
  const isRejected = leave.status === 'REJECTED';

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between max-w-md mx-auto">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />
        <div
          className={`absolute top-1/2 left-4 -translate-y-1/2 h-0.5 -z-0 transition-all duration-500 ${
            isApproved
              ? 'right-4 bg-emerald-500'
              : isRejected
              ? 'right-4 bg-rose-500'
              : 'right-1/2 bg-amber-500'
          }`}
        />

        {/* Step 1: Application Submitted */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-900 mt-2">Submitted</span>
          <span className="text-[10px] text-gray-400">
            {new Date(leave.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Step 2: Warden Review */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              isPending
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-900 mt-2">Warden Review</span>
          <span className="text-[10px] text-gray-400">
            {isPending ? 'In Progress' : 'Reviewed'}
          </span>
        </div>

        {/* Step 3: Decision */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              isApproved
                ? 'bg-emerald-600 text-white'
                : isRejected
                ? 'bg-rose-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isRejected ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
          </div>
          <span
            className={`text-[11px] font-bold mt-2 ${
              isApproved
                ? 'text-emerald-700'
                : isRejected
                ? 'text-rose-700'
                : 'text-gray-400'
            }`}
          >
            {leave.status}
          </span>
          <span className="text-[10px] text-gray-400">
            {leave.reviewedAt
              ? new Date(leave.reviewedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
              : 'Pending'}
          </span>
        </div>
      </div>

      {leave.wardenRemarks && (
        <div className="mt-5 p-3.5 rounded-xl bg-surface-100 border border-gray-200/60 text-xs text-gray-700 max-w-md mx-auto">
          <span className="font-bold text-gray-900 block mb-0.5">Warden Remarks:</span>
          {leave.wardenRemarks}
        </div>
      )}
    </div>
  );
};

export default LeaveTimeline;
