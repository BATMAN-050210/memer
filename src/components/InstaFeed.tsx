import React, { useState } from 'react';
import { Meme } from '../types';
import { InstaMemePost } from './InstaMemePost';
import { StoriesBar } from './StoriesBar';
import { Flame, Sparkles, RefreshCw, PlusCircle } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface InstaFeedProps {
  memes: Meme[];
  likedMemeIds: string[];
  savedMemeIds: string[];
  onToggleLike: (meme: Meme) => void;
  onToggleSave: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
  activeStoryId: string;
  onSelectStory: (storyId: string) => void;
  onOpenCreator: () => void;
}

export const InstaFeed: React.FC<InstaFeedProps> = ({
  memes,
  likedMemeIds,
  savedMemeIds,
  onToggleLike,
  onToggleSave,
  onShare,
  activeStoryId,
  onSelectStory,
  onOpenCreator,
}) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const displayed = memes.slice(0, visibleCount);
  const hasMore = visibleCount < memes.length;

  return (
    <div className="w-full max-w-lg mx-auto pb-24">
      
      {/* 1. Instagram Stories Carousel at Top */}
      <StoriesBar
        activeStoryId={activeStoryId}
        onSelectStory={onSelectStory}
      />

      {/* 2. Top Banner / Vibe Check */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-limeBright animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            For You Feed
          </span>
          <span className="text-[10px] text-brand-yellow font-bold bg-brand-yellow/15 px-2 py-0.2 rounded-full border border-brand-yellow/30">
            🔥 {memes.length} memes
          </span>
        </div>

        <button
          onClick={onOpenCreator}
          className="text-xs font-bold text-brand-yellow hover:text-brand-yellowLight flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Meme</span>
        </button>
      </div>

      {/* 3. The Endless Scroll Stream */}
      <div className="px-2 sm:px-0">
        {displayed.map((meme) => (
          <InstaMemePost
            key={meme.id}
            meme={meme}
            isLiked={likedMemeIds.includes(meme.id)}
            isSaved={savedMemeIds.includes(meme.id)}
            onToggleLike={onToggleLike}
            onToggleSave={onToggleSave}
            onShare={onShare}
          />
        ))}

        {/* Load More Trigger */}
        {hasMore ? (
          <div className="py-6 text-center">
            <button
              onClick={() => {
                playPopSound();
                setVisibleCount((prev) => prev + 8);
              }}
              className="py-3 px-6 rounded-2xl bg-surface-elevated hover:bg-surface text-brand-limeBright font-extrabold text-xs sm:text-sm border border-brand-lime/30 shadow-glow-lime active:scale-95 transition-all"
            >
              Scroll More Memes (↓)
            </button>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            <span className="text-2xl block mb-1">🎉</span>
            <span className="font-bold text-white">You're all caught up!</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              You scrolled through all {memes.length} fresh memes. Switch stories or check Dark Diwali!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
