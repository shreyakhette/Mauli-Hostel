import React from 'react';
import collegeLogoImg from '../../assets/college_logo.png';

/**
 * CollegeLogo - Official crest for Mauli Group of Institutions College of Engineering, Shegaon
 * and Sakhi Girls Hostel branding using the actual institution emblem.
 */
export const CollegeLogo = ({ size = 'md', className = '', variant = 'full', subtitle = true }) => {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const imgSizeClasses = {
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-9 h-9 min-w-[36px]',
    md: 'w-11 h-11 min-w-[44px]',
    lg: 'w-14 h-14 min-w-[56px]',
    xl: 'w-20 h-20 min-w-[80px]'
  };

  const Emblem = () => (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-white p-0.5 shadow-sm ring-1 ring-amber-500/30 overflow-hidden flex-shrink-0 ${imgSizeClasses[size]}`}>
      <img
        src={collegeLogoImg}
        alt="Mauli Group of Institutions Shegaon Official Logo"
        className="w-full h-full object-contain rounded-full select-none"
        loading="eager"
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} title="Mauli Group of Institutions College of Engineering, Shegaon">
        <Emblem />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Emblem />
      <div className="leading-tight min-w-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block truncate">
          Mauli Group of Institutions
        </span>
        <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
          Sakhi Girls Hostel
        </h1>
        {subtitle && (
          <p className="text-[10px] text-slate-500 font-medium truncate">
            College of Engineering, Shegaon
          </p>
        )}
      </div>
    </div>
  );
};

export default CollegeLogo;
