import React from 'react';
import { Meme } from '../types';
import { Sparkles, ArrowRight, Flame, Skull, Zap } from 'lucide-react';

interface HeroProps {
  featuredMeme: Meme | null;
  onExploreClick: () => void;
  onOpenDarkHumor: () => void;
  onQuickSearch: (query: string) => void;
  onOpenMeme: (meme: Meme) => void;
}

export const Hero: React.FC<HeroProps> = ({
  featuredMeme,
  onExploreClick,
  onOpenDarkHumor,
  onQuickSearch,
  onOpenMeme,
}) => {
  const quickSituations = [
    'When teacher says surprise test',
    'Diwali wishes for my chaotic friends',
    'Exam tomorrow and I haven’t studied',
    'Savage reply to my friend',
    'Cricket match reaction memes',
  ];

  return (
    <section className="relative overflow-hidden pt-4 pb-6 px-4 sm:px-6">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-neon-lime/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Headlines & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Trending Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-lime"></span>
              </span>
              <span className="font-semibold text-white">Trending Now:</span>
              <span className="text-neon-limeBright font-medium">#SoanPapdiRecycle &amp; #SurpriseTest</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                Your humor. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  Your level.
                </span>{' '}
                Your universe.
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl font-medium">
                From wholesome to unhinged. Discover viral trends, adjust your humor dial, craft festive roasts, and send the damage to the group chat.
              </p>
            </div>

            {/* Quick Situation Pills */}
            <div className="pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                ⚡ Try searching a situation:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickSituations.map((sit, i) => (
                  <button
                    key={i}
                    onClick={() => onQuickSearch(sit)}
                    className="text-xs bg-surface-elevated/90 hover:bg-white/10 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/20 transition-all flex items-center gap-1"
                  >
                    <span>{sit}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-glow-primary transition-all duration-200 active:scale-95"
              >
                <span>Explore Memes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDarkHumor}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-elevated text-purple-300 border border-purple-500/30 hover:border-purple-500/60 font-semibold text-xs sm:text-sm transition-all"
              >
                <Skull className="w-4 h-4 text-purple-400" />
                <span>Level 5: Dark Humor</span>
              </button>
            </div>
          </div>

          {/* Right Column: Featured Meme Spotlight (5 cols) */}
          {featuredMeme && (
            <div className="lg:col-span-5">
              <div 
                onClick={() => onOpenMeme(featuredMeme)}
                className="group relative cursor-pointer bg-surface-card rounded-2xl border border-white/10 hover:border-primary/50 overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-glow-primary"
              >
                {/* Top Spotlight Tag */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Featured Meme Spotlight</span>
                </div>

                {/* Level badge */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/80 backdrop-blur-md border border-purple-400/40 text-[10px] font-extrabold text-purple-200 uppercase">
                  <span>Level {featuredMeme.humorLevel}</span>
                </div>

                {/* Meme Image Preview */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={featuredMeme.imageUrl}
                    alt={featuredMeme.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                </div>

                {/* Caption / Punchline preview */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-primary-light transition-colors line-clamp-1">
                    {featuredMeme.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {featuredMeme.caption}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-2.5">
                    <span className="text-slate-300 font-medium">By {featuredMeme.creator.name}</span>
                    <span className="text-neon-limeBright font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {(featuredMeme.stats.likes / 1000).toFixed(1)}k likes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
