import React, { useId } from 'react';

interface InstagramLogoProps {
  className?: string;
  size?: number;
}

export const InstagramLogo: React.FC<InstagramLogoProps> = ({
  className = '',
  size = 46,
}) => {
  const gradientId = useId().replace(/:/g, '_');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Instagram"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="30%" stopColor="#e6683c" />
          <stop offset="55%" stopColor="#dc2743" />
          <stop offset="80%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>

      {/* Outer rounded squircle */}
      <rect
        x="3.5"
        y="3.5"
        width="41"
        height="41"
        rx="12"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.6"
      />

      {/* Central lens circle */}
      <circle
        cx="24"
        cy="24"
        r="10.5"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.6"
      />

      {/* Top right flash dot */}
      <circle
        cx="34.5"
        cy="13.5"
        r="2.6"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export const InstagramWordmark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`font-serif tracking-normal text-2xl font-bold select-none text-white ${className}`}>
      Instagram
    </span>
  );
};
