import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Meme } from './types';
import { INITIAL_MEMES } from './data/memesData';
import { MemeFeedCard } from './components/MemeFeedCard';
import { DiwaliSidebar } from './components/DiwaliSidebar';
import { Search, X, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { extractFreshDarkMemes } from './services/memeExtractor';
import { playPopSound } from './utils/audio';

export function App() {
  const [memes, setMemes] = useState<Meme[]>(INITIAL_MEMES);
  const [likedMemeIds, setLikedMemeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('memer_liked_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTab, setMobileTab] = useState<'feed' | 'diwali'>('feed');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isFetchingExtra, setIsFetchingExtra] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Background meme extraction (from Reddit / public meme feeds)
  useEffect(() => {
    let isMounted = true;
    const loadFreshMemes = async () => {
      setIsFetchingExtra(true);
      try {
        const fresh = await extractFreshDarkMemes();
        if (isMounted && fresh.length > 0) {
          setMemes((prev) => {
            const existingUrls = new Set(prev.map((m) => m.imageUrl));
            const newUnique = fresh.filter((m) => !existingUrls.has(m.imageUrl));
            return [...prev, ...newUnique];
          });
        }
      } catch (err) {
        console.warn('Could not extract external memes, using built-in vault:', err);
      } finally {
        if (isMounted) setIsFetchingExtra(false);
      }
    };

    loadFreshMemes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save liked meme IDs to local storage
  useEffect(() => {
    try {
      localStorage.setItem('memer_liked_ids', JSON.stringify(likedMemeIds));
    } catch {}
  }, [likedMemeIds]);

  // Infinite scroll observer for seamless mobile scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 8, memes.length));
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [memes.length]);

  // Search filter
  const filteredMemes = useMemo(() => {
    if (!searchQuery.trim()) return memes;
    const q = searchQuery.toLowerCase().trim();
    return memes.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.caption.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [memes, searchQuery]);

  const displayedMemes = filteredMemes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMemes.length;

  const handleToggleLike = (meme: Meme) => {
    setLikedMemeIds((prev) => {
      const isLiked = prev.includes(meme.id);
      const updated = isLiked ? prev.filter((id) => id !== meme.id) : [...prev, meme.id];

      setMemes((prevMemes) =>
        prevMemes.map((m) =>
          m.id === meme.id
            ? { ...m, stats: { ...m.stats, likes: m.stats.likes + (isLiked ? -1 : 1) } }
            : m
        )
      );
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-rose-500/20 selection:text-white">
      
      {/* 1. Sleek Minimal Aesthetic Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand: "memer" and in small "by vedansh" - No logo icon, no '80% dark' badge */}
          <div
            className="flex flex-col cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-zinc-200 transition-colors leading-none">
              memer
            </span>
            <span className="text-[11px] font-serif italic text-zinc-400 tracking-wide mt-0.5">
              by vedansh
            </span>
          </div>

          {/* Search bar: Clean minimal dark pill */}
          <div className="flex-1 max-w-xs sm:max-w-sm relative">
            <div className="relative flex items-center rounded-full bg-zinc-900/90 border border-zinc-800 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 transition-all">
              <Search className="w-4 h-4 text-zinc-500 ml-3.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search dark jokes, corporate, exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-1.5 px-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Tab Switcher in Header for quick access */}
          <div className="lg:hidden flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-0.5">
            <button
              onClick={() => {
                playPopSound();
                setMobileTab('feed');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mobileTab === 'feed'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => {
                playPopSound();
                setMobileTab('diwali');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mobileTab === 'diwali'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🪔 Diwali
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Content Grid: Feed on Left + Diwali Sidebar on Right */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed Column (Clean vertical scroll) */}
          <main className={`lg:col-span-7 xl:col-span-8 max-w-lg mx-auto w-full ${
            mobileTab === 'diwali' ? 'hidden lg:block' : 'block'
          }`}>
            
            {/* Stream Subheader with subtle counter */}
            <div className="flex items-center justify-between mb-4 px-1 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium text-zinc-400">
                  {filteredMemes.length} memes available
                </span>
                {isFetchingExtra && (
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> extracting fresh...
                  </span>
                )}
              </div>

              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                Double tap to heart
              </span>
            </div>

            {/* The Infinite Scroll Stream */}
            <div className="space-y-4">
              {displayedMemes.map((meme) => (
                <div key={meme.id} id={`meme-${meme.id}`}>
                  <MemeFeedCard
                    meme={meme}
                    isLiked={likedMemeIds.includes(meme.id)}
                    onToggleLike={handleToggleLike}
                  />
                </div>
              ))}

              {/* Infinite Scroll Trigger */}
              <div ref={loaderRef} className="py-4 text-center">
                {hasMore ? (
                  <button
                    onClick={() => {
                      playPopSound();
                      setVisibleCount((prev) => Math.min(prev + 8, filteredMemes.length));
                    }}
                    className="py-2.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs border border-zinc-800 transition-all active:scale-95"
                  >
                    Load More Memes (↓)
                  </button>
                ) : (
                  <div className="py-8 text-center text-xs text-zinc-500 bg-[#121215] rounded-2xl p-6 border border-zinc-800/80">
                    <span className="text-2xl block mb-2">✨</span>
                    <span className="font-semibold text-zinc-300 text-sm block">
                      You're all caught up!
                    </span>
                    <p className="mt-1 text-zinc-500">
                      You scrolled through {filteredMemes.length} memes. Check out the Diwali roasts!
                    </p>
                  </div>
                )}
              </div>
            </div>

          </main>

          {/* Right Side Section: Diwali Roasts (Kept as requested, aesthetic styled) */}
          <div className={`lg:col-span-5 xl:col-span-4 max-w-lg mx-auto w-full ${
            mobileTab === 'feed' ? 'hidden lg:block' : 'block'
          }`}>
            <DiwaliSidebar />
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
