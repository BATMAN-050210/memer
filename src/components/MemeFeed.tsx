import React, { useState } from 'react';
import { Meme } from '../types';
import { MemeCard } from './MemeCard';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  LayoutGrid, 
  Tv2, 
  Plus, 
  SearchX, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

interface MemeFeedProps {
  memes: Meme[];
  savedMemeIds: string[];
  likedMemeIds: string[];
  onToggleSave: (meme: Meme) => void;
  onToggleLike: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
  onReport: (meme: Meme) => void;
  onRelated: (meme: Meme) => void;
  onViewDetails: (meme: Meme) => void;
  onOpenReelMode: () => void;
  onOpenUpload: () => void;
  onOpenCreator: () => void;
  onResetFilters: () => void;
  currentSort: 'popular' | 'trending' | 'newest';
  onSortChange: (sort: 'popular' | 'trending' | 'newest') => void;
  languageFilter: string;
  onLanguageChange: (lang: string) => void;
  activeFilterCount: number;
}

export const MemeFeed: React.FC<MemeFeedProps> = ({
  memes,
  savedMemeIds,
  likedMemeIds,
  onToggleSave,
  onToggleLike,
  onShare,
  onReport,
  onRelated,
  onViewDetails,
  onOpenReelMode,
  onOpenUpload,
  onOpenCreator,
  onResetFilters,
  currentSort,
  onSortChange,
  languageFilter,
  onLanguageChange,
  activeFilterCount,
}) => {
  const [visibleCount, setVisibleCount] = useState(12);

  const displayedMemes = memes.slice(0, visibleCount);
  const hasMore = visibleCount < memes.length;

  return (
    <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Feed Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        {/* Left: Memes Count & Status */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-black font-display text-white flex items-center gap-2">
            <span>Discovery Feed</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-primary-light">
              {memes.length} memes
            </span>
          </h2>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-xs text-primary-light hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Right Controls: Sort, Language & View Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => onSortChange('popular')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                currentSort === 'popular'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Most Popular"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Popular</span>
            </button>

            <button
              onClick={() => onSortChange('trending')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                currentSort === 'trending'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Trending Now"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trending</span>
            </button>

            <button
              onClick={() => onSortChange('newest')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                currentSort === 'newest'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Newest"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Newest</span>
            </button>
          </div>

          {/* Language Selector */}
          <select
            value={languageFilter}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-surface border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Hinglish">Hinglish</option>
            <option value="Hindi">Hindi</option>
          </select>

          {/* Reel Mode Trigger (Viral Vertical Discovery) */}
          <button
            onClick={onOpenReelMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-glow-pink transition-all active:scale-95"
            title="Launch TikTok / Reel Swipe Mode"
          >
            <Tv2 className="w-4 h-4" />
            <span className="hidden md:inline">Reel Swipe Mode</span>
          </button>

          {/* Community Submit Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neon-lime/20 text-neon-limeBright hover:bg-neon-lime/30 border border-neon-lime/40 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Meme</span>
          </button>
        </div>

      </div>

      {/* Main Grid Feed */}
      {memes.length === 0 ? (
        <div className="bg-surface-card rounded-3xl p-12 text-center border border-white/5 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-surface mx-auto flex items-center justify-center text-3xl mb-4 border border-white/5">
            🐒
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            No Memes Found in this Dimension!
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Our humor algorithm searched the universe but came back empty-handed. Try clearing your search, selecting more humor levels, or craft an original meme right now!
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={onResetFilters}
              className="px-4 py-2.5 rounded-xl bg-surface hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              Reset Filters
            </button>

            <button
              onClick={onOpenCreator}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow-primary transition-colors"
            >
              Open Meme Creator
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                isSaved={savedMemeIds.includes(meme.id)}
                isLiked={likedMemeIds.includes(meme.id)}
                onToggleSave={onToggleSave}
                onToggleLike={onToggleLike}
                onShare={onShare}
                onReport={onReport}
                onRelated={onRelated}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-6 py-3 rounded-2xl bg-surface hover:bg-surface-elevated text-white font-bold text-xs sm:text-sm border border-white/10 hover:border-white/20 transition-all shadow-md active:scale-95"
              >
                Load More Humor ({memes.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

    </section>
  );
};
