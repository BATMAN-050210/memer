import React, { useState, useEffect } from 'react';
import { Meme } from '../types';
import { HUMOR_LEVELS } from '../data/humorLevels';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReelDiscoveryModeProps {
  memes: Meme[];
  initialMemeId?: string;
  onClose: () => void;
  savedMemeIds: string[];
  likedMemeIds: string[];
  onToggleSave: (meme: Meme) => void;
  onToggleLike: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
}

export const ReelDiscoveryMode: React.FC<ReelDiscoveryModeProps> = ({
  memes,
  initialMemeId,
  onClose,
  savedMemeIds,
  likedMemeIds,
  onToggleSave,
  onToggleLike,
  onShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialMemeId) {
      const idx = memes.findIndex((m) => m.id === initialMemeId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);

  const currentMeme = memes[currentIndex] || memes[0];

  const handleNext = () => {
    if (currentIndex < memes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop around
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(memes.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, memes.length]);

  if (!currentMeme) return null;

  const isLiked = likedMemeIds.includes(currentMeme.id);
  const isSaved = savedMemeIds.includes(currentMeme.id);
  const humorInfo = HUMOR_LEVELS[currentMeme.humorLevel];

  const handleDoubleTap = () => {
    if (!isLiked) {
      onToggleLike(currentMeme);
    }
    setDoubleTapHeart(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.5 },
      colors: [humorInfo.accentColor, '#F43F5E', '#A855F7'],
    });
    setTimeout(() => setDoubleTapHeart(false), 900);
  };

  const handleQuickWhatsApp = () => {
    const shareUrl = window.location.href.split('?')[0] + `?meme=${currentMeme.id}`;
    const text = `😂 *${currentMeme.title}*\n\n"${currentMeme.caption}"\n\nDiscovered in Memeverse Reel: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between items-center select-none overflow-hidden animate-fade-in">
      
      {/* Top Floating Controls */}
      <div className="w-full max-w-lg px-4 pt-4 pb-2 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></span>
            <span>Meme Reel Mode</span>
          </div>

          <span className="text-xs text-slate-400">
            {currentIndex + 1} / {memes.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white"
            title="Exit Reel Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 w-full max-w-lg flex items-center justify-center relative px-2 sm:px-4">
        
        {/* Meme Card Canvas */}
        <div 
          onDoubleClick={handleDoubleTap}
          className="relative w-full aspect-[4/5] sm:aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center"
        >
          <img
            src={currentMeme.imageUrl}
            alt={currentMeme.title}
            className="w-full h-full object-contain"
          />

          {/* Double-Tap Love Burst */}
          {doubleTapHeart && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none animate-ping">
              <Heart className="w-28 h-28 text-rose-500 fill-rose-500" />
            </div>
          )}

          {/* Bottom Gradient Overlay for Captions */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 text-left pointer-events-none">
            <div className="flex items-center gap-2 mb-2 pointer-events-auto">
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${humorInfo.badgeBg} ${humorInfo.badgeText} border border-current/20`}
              >
                {humorInfo.emoji} Level {currentMeme.humorLevel}: {humorInfo.name}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                by {currentMeme.creator.name}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentMeme.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
              {currentMeme.caption}
            </p>
          </div>

          {/* Floating Right Action Rail */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-10">
            {/* Like */}
            <button
              onClick={() => onToggleLike(currentMeme)}
              className="flex flex-col items-center group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isLiked ? 'bg-rose-500 text-white' : 'bg-black/60 text-slate-200 group-hover:scale-110'
              }`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">
                {((currentMeme.stats.likes + (isLiked ? 1 : 0)) / 1000).toFixed(1)}k
              </span>
            </button>

            {/* Quick WhatsApp */}
            <button
              onClick={handleQuickWhatsApp}
              className="flex flex-col items-center group"
              title="Share to WhatsApp"
            >
              <div className="w-11 h-11 rounded-full bg-emerald-600/90 text-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">Chat</span>
            </button>

            {/* Share Sheet */}
            <button
              onClick={() => onShare(currentMeme)}
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 text-slate-200 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">Share</span>
            </button>

            {/* Save */}
            <button
              onClick={() => onToggleSave(currentMeme)}
              className="flex flex-col items-center group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isSaved ? 'bg-neon-pink text-white' : 'bg-black/60 text-slate-200 group-hover:scale-110'
              }`}>
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">Save</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Up/Down Swipe Indicators */}
      <div className="w-full max-w-lg px-4 pb-4 pt-2 flex items-center justify-between z-20">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Previous Meme (↑)</span>
        </button>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Double-tap to like • Use arrow keys
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-xs font-bold text-white shadow-glow-primary"
        >
          <span>Next Meme (↓)</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
