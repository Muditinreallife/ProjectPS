import React from 'react';
import { InstagramLogo } from '../icons/InstagramLogo';
import { StackedStoryCards } from './StackedStoryCards';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between py-8 px-6 lg:px-12 select-none">
      {/* Top Left Instagram Camera Logo */}
      <div className="w-full flex justify-start pt-2">
        <a
          href="#"
          className="inline-block transform hover:scale-105 active:scale-95 transition-transform"
          aria-label="Instagram Home"
        >
          <InstagramLogo size={46} />
        </a>
      </div>

      {/* Hero Body: Headline + Stacked Cards */}
      <div className="my-auto py-2 flex flex-col items-center justify-center">
        {/* Headline */}
        <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-white tracking-[-0.015em] leading-[1.25] text-center mb-9 max-w-[640px] mx-auto">
          <span className="block">See everyday moments from your</span>
          <span className="inline-block bg-gradient-to-r from-[#ff455b] via-[#e1306c] to-[#9d29b2] bg-clip-text text-transparent">
            close friends.
          </span>
        </h1>

        {/* 3D Story Cards Stack Graphic */}
        <div className="w-full flex justify-center">
          <StackedStoryCards />
        </div>
      </div>

      {/* Bottom spacing placeholder */}
      <div className="h-6" />
    </div>
  );
};
