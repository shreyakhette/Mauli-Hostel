import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-surface-50 border border-dashed border-gray-200 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-wine-50 border border-wine-100 flex items-center justify-center text-wine-800 mb-4 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
      {!action && actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
