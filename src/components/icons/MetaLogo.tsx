import React from 'react';

interface MetaLogoProps {
  className?: string;
  size?: number;
  textColor?: string;
}

export const MetaLogo: React.FC<MetaLogoProps> = ({
  className = '',
  size = 20,
  textColor = 'currentColor',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* Meta Infinity Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M17.18 6.57c-1.89 0-3.32 1.05-4.47 2.37-1.15-1.32-2.58-2.37-4.47-2.37-3.23 0-5.74 2.51-5.74 5.93 0 3.42 2.51 5.93 5.74 5.93 1.89 0 3.32-1.05 4.47-2.37 1.15 1.32 2.58 2.37 4.47 2.37 3.23 0 5.74-2.51 5.74-5.93 0-3.42-2.51-5.93-5.74-5.93zm-8.94 9.68c-2.09 0-3.66-1.63-3.66-3.75 0-2.12 1.57-3.75 3.66-3.75 1.54 0 2.76 1.08 3.52 2.19-.76 1.1-1.98 2.19-3.52 2.19zm8.94 0c-1.54 0-2.76-1.08-3.52-2.19.76-1.1 1.98-2.19 3.52-2.19 2.09 0 3.66 1.63 3.66 3.75 0 2.12-1.57 3.75-3.66 3.75z"
          fill={textColor}
        />
      </svg>
      <span className="text-[13px] font-semibold tracking-tight" style={{ color: textColor }}>
        Meta
      </span>
    </div>
  );
};
