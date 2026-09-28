import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FOOTER_LINKS = [
  'Meta',
  'About',
  'Blog',
  'Jobs',
  'Help',
  'API',
  'Privacy',
  'Terms',
  'Locations',
  'Popular',
  'Instagram Lite',
  'Meta AI',
  'Muse',
  'Threads',
  'Contact uploading and non-users',
  'Meta Verified',
];

const LANGUAGES = [
  'English (UK)',
  'English (US)',
  'Español',
  'Français',
  'Deutsch',
  'Italiano',
  'Português (Brasil)',
  '日本語',
  '한국어',
  'हिन्दी',
];

export const Footer: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <footer className="w-full py-6 px-4 bg-black text-[#737373] text-xs select-none">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 text-center">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-[1000px]">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[#737373] hover:text-[#a8a8a8] hover:underline transition-colors whitespace-nowrap"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Language selector and copyright */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[#737373] text-xs pt-1">
          {/* Language Selector Dropdown */}
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="inline-flex items-center gap-1 text-[#737373] hover:text-[#a8a8a8] transition-colors cursor-pointer"
            >
              <span>{selectedLanguage}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 rounded-xl bg-[#262626] border border-[#363636] shadow-2xl py-1 z-50 max-h-56 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#333333] transition-colors ${
                        selectedLanguage === lang ? 'text-white font-semibold' : 'text-[#a8a8a8]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Copyright notice */}
          <span>© 2026 Instagram from Meta</span>
        </div>
      </div>
    </footer>
  );
};
