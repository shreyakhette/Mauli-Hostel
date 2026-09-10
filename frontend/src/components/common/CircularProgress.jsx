import React from 'react';

export const CircularProgress = ({
  percentage,
  value,
  size = 120,
  strokeWidth = 10,
  label = 'Attendance',
  sublabel,
  color = 'stroke-wine-800',
  trackColor = 'stroke-wine-100',
  textColor = 'text-wine-950',
}) => {
  const finalPercentage = value !== undefined ? value : (percentage || 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalPercentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${trackColor} transition-all`}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-extrabold tracking-tight ${textColor}`}>
          {finalPercentage}%
        </span>
        {label && <span className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider mt-0.5">{label}</span>}
      </div>
      {sublabel && <p className="text-xs text-gray-500 mt-2 font-medium">{sublabel}</p>}
    </div>
  );
};

export default CircularProgress;
