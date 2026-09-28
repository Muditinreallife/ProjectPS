import React from 'react';

interface FacebookLogoProps {
  className?: string;
  size?: number;
}

export const FacebookLogo: React.FC<FacebookLogoProps> = ({
  className = '',
  size = 20,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M14.5 12.1h-1.8v7.2h-3v-7.2h-1.4v-2.6h1.4v-1.7c0-1.9 1.1-3 2.9-3h1.8v2.6h-1.1c-.9 0-1.1.4-1.1 1.1v1h2.2l-.3 2.6z"
        fill="#FFFFFF"
      />
    </svg>
  );
};
