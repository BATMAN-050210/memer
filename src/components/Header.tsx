import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  PlusCircle, 
  Shuffle, 
  Skull,
  X,
  Compass,
  Home
} from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: 'feed' | 'dark' | 'diwali' | 'creator' | 'saved';
  onTabChange: (tab: 'feed' | 'dark' | 'diwali' | 'creator' | 'saved') => void;
  savedCount: number;
  onRandomMeme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  savedCount,
  onRandomMeme,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleTabSwitch = (tab: 'feed' | 'dark' | 'diwali' | 'creator' | 'saved') => {
    playPopSound();
    onTabChange(tab);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          
          {/* Logo with Lime & Yellow Vibe */}
          <div 
            onClick={() => handleTabSwitch('feed')}
            className="flex items-center gap-2 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-yellow via-brand-lime to-brand-orange flex items-center justify-center shadow-glow-yellow group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-lg text-black tracking-tighter">M</span>
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                MEME<span className="text-brand-yellow">GRAM</span>
              </span>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="flex-1 relative">
            <div className={`relative flex items-center rounded-full bg-surface border transition-all duration-150 ${
              isSearchFocused ? 'border-brand-yellow ring-2 ring-brand-yellow/30 shadow-glow-yellow' : 'border-white/10'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search memes, Diwali, roasts..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'feed') onTabChange('feed');
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent py-1.5 px-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 mr-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Surprise me */}
            <button
              onClick={onRandomMeme}
              className="p-2 rounded-xl text-slate-300 hover:text-brand-limeBright active:scale-95 transition-all"
              title="Surprise Meme"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Saved Vault */}
            <button
              onClick={() => handleTabSwitch('saved')}
              className="relative p-2 rounded-xl text-slate-300 hover:text-brand-yellow transition-all"
              title="Saved"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-yellow text-black text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Instagram Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-2xl border-t border-white/10 py-1 px-3 safe-area-pb">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Feed */}
          <button
            onClick={() => handleTabSwitch('feed')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'feed' ? 'text-brand-yellow font-black' : 'text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Feed</span>
          </button>

          {/* Dark Room */}
          <button
            onClick={() => handleTabSwitch('dark')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'dark' ? 'text-brand-limeBright font-black' : 'text-slate-400'
            }`}
          >
            <Skull className="w-5 h-5" />
            <span className="text-[10px]">Dark</span>
          </button>

          {/* Diwali Chaos (Center Spotlight) */}
          <button
            onClick={() => handleTabSwitch('diwali')}
            className="flex flex-col items-center -mt-3.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-yellow to-brand-orange text-black flex items-center justify-center shadow-glow-yellow border-2 border-background group-hover:scale-105 transition-transform">
              <span className="text-xl">🪔</span>
            </div>
            <span className="text-[10px] font-black text-brand-yellow mt-0.5">Diwali</span>
          </button>

          {/* Create Meme Studio */}
          <button
            onClick={() => handleTabSwitch('creator')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'creator' ? 'text-brand-lime font-black' : 'text-slate-400'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px]">Create</span>
          </button>

          {/* Saved Vault */}
          <button
            onClick={() => handleTabSwitch('saved')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'saved' ? 'text-brand-yellow font-black' : 'text-slate-400'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px]">Saved</span>
            {savedCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-brand-yellow"></span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
