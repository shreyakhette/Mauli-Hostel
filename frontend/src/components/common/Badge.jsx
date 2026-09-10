import React from 'react';

export const Badge = ({ children, status, variant, className = '' }) => {
  const getStyles = () => {
    if (variant) {
      switch (variant) {
        case 'wine': return 'bg-wine-100 text-wine-900 border-wine-200';
        case 'rose': return 'bg-rose-100 text-rose-800 border-rose-200';
        case 'emerald': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'amber': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    const key = (status || children || '').toString().toUpperCase();
    switch (key) {
      case 'AVAILABLE':
      case 'RESOLVED':
      case 'APPROVED':
      case 'PRESENT':
      case 'ACTIVE':
      case 'ON_TIME':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';

      case 'PARTIAL':
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'LATE':
      case 'DELAYED':
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';

      case 'FULL':
      case 'REJECTED':
      case 'ABSENT':
      case 'CANCELLED':
      case 'CRITICAL':
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';

      case 'MAINTENANCE':
      case 'ON_LEAVE':
      case 'CHECKED_OUT':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';

      case 'OPEN':
      case 'NORMAL':
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none ${getStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {children || status}
    </span>
  );
};

export default Badge;
