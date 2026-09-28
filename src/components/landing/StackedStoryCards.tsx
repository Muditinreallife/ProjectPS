import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';

interface FloatingParticle {
  id: number;
  emoji?: string;
  isHeart?: boolean;
  x: number;
  y: number;
}

export const StackedStoryCards: React.FC = () => {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isCenterLiked, setIsCenterLiked] = useState<boolean>(false);

  const triggerReaction = (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles: FloatingParticle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      emoji,
      x: rect.left + rect.width / 2 + (Math.random() * 50 - 25),
      y: rect.top - 10 - Math.random() * 40,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);
  };

  const triggerHeartBurst = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCenterLiked(!isCenterLiked);

    const rect = e.currentTarget.getBoundingClientRect();
    const newHearts: FloatingParticle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      isHeart: true,
      x: rect.left + rect.width / 2 + (Math.random() * 50 - 25),
      y: rect.top - 20 - Math.random() * 50,
    }));

    setParticles((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newHearts.some((np) => np.id === p.id)));
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-[460px] h-[450px] mx-auto flex items-center justify-center select-none">
      {/* Floating Particles Overlay */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 animate-float-badge transition-all"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: p.isHeart ? '24px' : '22px',
            animationDuration: '1.2s',
          }}
        >
          {p.isHeart ? (
            <span className="text-[#ff3040] drop-shadow-[0_4px_12px_rgba(255,48,64,0.6)]">❤️</span>
          ) : (
            <span>{p.emoji}</span>
          )}
        </div>
      ))}

      {/* Story Stack Frame */}
      <div className="relative w-[360px] h-[420px] flex items-center justify-center">

        {/* 1. LEFT CARD (Layer behind, tilted -8 deg) */}
        <div
          className="absolute left-[-12px] top-6 w-[205px] h-[350px] rounded-[28px] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.95)] border border-white/10 transform -rotate-8 -translate-x-12 hover:rotate-[-6deg] hover:-translate-x-14 transition-transform duration-300 ease-out z-10 bg-neutral-900 group"
          title="Daily Story"
        >
          <img
            src="/assets/card-left.jpg"
            alt="Friend moment outdoors"
            className="w-full h-full object-cover brightness-[0.92] group-hover:scale-105 transition-transform duration-500"
          />

          {/* Left card bottom story bar */}
          <div className="absolute bottom-4 left-3.5 right-3.5 h-1 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white rounded-full" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* 3D FLOATING GRADIENT HEART BADGE (Bottom-Left) */}
        <div
          onClick={triggerHeartBurst}
          className="absolute -left-7 bottom-12 z-30 cursor-pointer transform hover:scale-115 active:scale-95 transition-transform duration-200"
          title="React with Love ❤️"
        >
          <div className="relative filter drop-shadow-[0_10px_22px_rgba(255,48,64,0.65)] animate-float-slow">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <defs>
                <radialGradient id="heart3DGradLeft" cx="30%" cy="25%" r="75%">
                  <stop offset="0%" stopColor="#ff758c" />
                  <stop offset="40%" stopColor="#ff3366" />
                  <stop offset="75%" stopColor="#c13584" />
                  <stop offset="100%" stopColor="#833ab4" />
                </radialGradient>
              </defs>
              <path
                d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.4 6 26.2 6 18C6 11.4 11.1 6.5 17.5 6.5C20.6 6.5 23.5 7.7 24 9.1C24.5 7.7 27.4 6.5 30.5 6.5C36.9 6.5 42 11.4 42 18C42 26.2 35.2 32.4 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z"
                fill="url(#heart3DGradLeft)"
              />
              <ellipse cx="16" cy="14" rx="4.5" ry="2.5" transform="rotate(-30 16 14)" fill="white" fillOpacity="0.45" />
            </svg>
          </div>
        </div>

        {/* 2. RIGHT CARD (Behind, tilted +8 deg) */}
        <div
          className="absolute right-[-12px] top-6 w-[205px] h-[350px] rounded-[28px] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.95)] border border-white/10 transform rotate-8 translate-x-12 hover:rotate-[6deg] hover:translate-x-14 transition-transform duration-300 ease-out z-10 bg-neutral-900 group"
          title="Close Friends Activity"
        >
          <img
            src="/assets/card-right.jpg"
            alt="Outdoor moments"
            className="w-full h-full object-cover brightness-[0.92] group-hover:scale-105 transition-transform duration-500"
          />

          {/* Right card bottom indicators */}
          <div className="absolute bottom-4 left-3.5 right-3.5 flex items-center justify-between">
            <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden mr-2">
              <div className="w-3/4 h-full bg-white rounded-full" />
            </div>
            <Heart className="w-4 h-4 text-white" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* FLOATING GREEN CLOSE FRIENDS STAR BADGE (Top-Right) */}
        <div
          className="absolute -right-5 top-14 z-30 cursor-pointer transform hover:scale-110 transition-transform duration-200"
          title="Close Friends Only ⭐"
        >
          <div className="w-11 h-11 rounded-full bg-[#00D659] border-2 border-[#121212] shadow-[0_4px_18px_rgba(0,214,89,0.55)] flex items-center justify-center animate-float-slow">
            <Star className="w-5 h-5 fill-white text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
          </div>
        </div>

        {/* FLOATING CLOSE FRIEND AVATAR (Bottom-Right) */}
        <div
          className="absolute -right-7 bottom-14 z-30 cursor-pointer transform hover:scale-110 transition-transform duration-200"
          title="Story by Maya"
        >
          <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-[#00D659] via-[#00ff6a] to-[#26e37b] shadow-[0_4px_16px_rgba(0,214,89,0.45)]">
            <div className="p-0.5 bg-black rounded-full">
              <img
                src="/assets/avatar-user.jpg"
                alt="Story author"
                className="w-11 h-11 rounded-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00D659] border border-black rounded-full flex items-center justify-center text-[9px] text-white font-bold">
              ★
            </span>
          </div>
        </div>

        {/* 3. CENTER CARD (Front & Center) */}
        <div
          className="relative w-[240px] h-[382px] rounded-[32px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/20 z-20 bg-neutral-900 group transform hover:scale-[1.02] transition-all duration-300"
        >
          {/* Main Story Image */}
          <img
            src="/assets/card-center-selfie.jpg"
            alt="Close friends everyday moment"
            className="w-full h-full object-cover brightness-[0.96] group-hover:scale-105 transition-transform duration-700"
          />

          {/* Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60 pointer-events-none" />

          {/* Story Progress Bar */}
          <div className="absolute top-3 left-4 right-4 h-0.5 bg-white/40 rounded-full overflow-hidden z-20">
            <div className="w-4/5 h-full bg-white rounded-full" />
          </div>

          {/* Bottom Story Outline Pill + Heart (Matching Reference Image) */}
          <div className="absolute bottom-4 left-3.5 right-3.5 flex items-center gap-2.5 z-20">
            {/* White outline rounded pill bar */}
            <div className="flex-1 h-9 rounded-full border border-white/90 bg-black/20 backdrop-blur-sm px-4 flex items-center cursor-pointer hover:border-white transition-colors" />

            {/* Heart Icon Button */}
            <button
              onClick={triggerHeartBurst}
              type="button"
              className={`p-1.5 transition-transform active:scale-125 cursor-pointer ${
                isCenterLiked ? 'text-[#ff3040]' : 'text-white hover:text-white/80'
              }`}
              title="Like Story"
            >
              <Heart
                className={`w-6 h-6 ${isCenterLiked ? 'fill-[#ff3040]' : ''}`}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* FLOATING EMOJI PILL BADGE (Hovering above Center Card) */}
        <div
          className="absolute top-1 z-30 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/60 transform hover:scale-105 transition-transform duration-200 cursor-pointer animate-float-badge"
          title="Click to react!"
        >
          {['🔮', '👀', '🤪'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={(e) => triggerReaction(emoji, e)}
              className="text-base sm:text-lg hover:scale-130 active:scale-95 transition-transform px-0.5 leading-none"
            >
              {emoji}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
