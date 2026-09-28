import React from 'react';
import { HeroSection } from './components/landing/HeroSection';
import { AuthCard } from './components/landing/AuthCard';
import { Footer } from './components/landing/Footer';
import { InstagramLogo } from './components/icons/InstagramLogo';
import './App.css';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#0095f6]/30">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-center py-6 px-4 border-b border-neutral-900 bg-black">
        <InstagramLogo size={42} />
      </header>

      {/* Main Two-Column Container */}
      <main className="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-130px)]">
        <section className="hidden md:flex flex-[1.3] bg-black items-stretch justify-center border-r border-[#1f1f1f] relative overflow-hidden">
          <HeroSection />
        </section>

        <section className="flex-1 md:flex-[1.0] lg:flex-[0.95] bg-[#121212] flex items-center justify-center p-6 sm:p-10">
          <AuthCard />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
