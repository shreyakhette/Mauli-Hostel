import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 transition-all duration-200 ${
        hover ? 'hover:-translate-y-0.5 cursor-pointer hover:border-slate-300 hover:shadow-card' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
