import React, { useState } from 'react';
import { Meme } from '../types';
import { Heart, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound } from '../utils/audio';

interface MemeFeedCardProps {
  meme: Meme;
  isLiked: boolean;
  onToggleLike: (meme: Meme) => void;
}

export const MemeFeedCard: React.FC<MemeFeedCardProps> = ({
  meme,
  isLiked,
  onToggleLike,
}) => {
  const [likeCount, setLikeCount] = useState(meme.stats.likes + (isLiked ? 1 : 0));
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const triggerLike = () => {
    playPopSound();
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 600);
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.65 },
        colors: ['#F43F5E', '#FB7185', '#FDA4AF'],
      });
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1));
    }
    onToggleLike(meme);
  };

  const handleDoubleTap = () => {
    triggerLike();
  };

  const handleShare = async () => {
    playFlameSound();
    const shareUrl = window.location.origin + window.location.pathname + `?meme=${meme.id}`;
    const shareData = {
      title: meme.title,
      text: `${meme.title}\n\n"${meme.caption}"\n\n— via memer`,
      url: shareUrl,
    };

    // Native mobile share drawer (Instagram, WhatsApp, Messages, etc.)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User dismissed share dialog
      }
    }

    // Fallback: Copy link & show toast + WhatsApp redirect if clicked
    try {
      await navigator.clipboard.writeText(`${meme.title} - ${meme.caption}\n${shareUrl}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    } catch {
      // WhatsApp fallback
      const waText = encodeURIComponent(`😂 *${meme.title}*\n\n"${meme.caption}"\n\n${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
    }
  };

  const formatLikes = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <article className="w-full bg-[#121215] rounded-2xl sm:rounded-3xl border border-zinc-800/80 overflow-hidden shadow-card mb-5 select-none transition-all hover:border-zinc-700/70">
      
      {/* 1. Card Header: Clean Minimalist Creator Info */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800/40 bg-zinc-900/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center font-bold text-xs text-zinc-100">
            {meme.creator.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-semibold text-xs sm:text-sm text-zinc-200 tracking-tight">
                {meme.creator.handle}
              </span>
              {meme.creator.isVerified && (
                <span className="text-zinc-400 text-[10px]">✓</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">Original • Just now</span>
          </div>
        </div>

        {/* Minimal Category indicator */}
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800/60 border border-zinc-700/40">
          {meme.category.replace('-', ' ')}
        </span>
      </div>

      {/* 2. Meme Media: Responsive with double-tap heart */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative w-full bg-black/40 flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ minHeight: '300px', maxHeight: '560px' }}
      >
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-auto max-h-[560px] object-contain transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback image if external url breaks
            (e.target as HTMLImageElement).src = 'https://i.imgflip.com/26am.jpg';
          }}
        />

        {/* Double-tap Heart Burst */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 animate-heart-burst drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* 3. Controls: Clean & Clear ONLY SCROLL, LIKE, AND SHARE */}
      <div className="p-3.5 sm:p-4 bg-[#121215]">
        
        <div className="flex items-center justify-between pb-2.5">
          {/* Like Button */}
          <button
            onClick={triggerLike}
            className="flex items-center gap-2 group text-zinc-300 hover:text-white transition-colors"
            title="Like"
          >
            <div className={`p-1.5 rounded-full transition-all ${
              isLiked ? 'bg-rose-500/10 scale-110' : 'group-hover:bg-zinc-800'
            }`}>
              <Heart
                className={`w-6 h-6 transition-all ${
                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-zinc-300'
                }`}
              />
            </div>
            <span className={`text-xs font-semibold ${isLiked ? 'text-rose-400' : 'text-zinc-400'}`}>
              {formatLikes(likeCount)}
            </span>
          </button>

          {/* Share Button (triggers native mobile share or copy link) */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/50 transition-all active:scale-95"
            title="Share"
          >
            {shareToast ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* 4. Meme Content: Title & Caption */}
        <div className="space-y-1">
          <h4 className="font-bold text-sm sm:text-base text-zinc-100 leading-snug">
            {meme.title}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            {meme.caption}
          </p>
        </div>

        {/* Minimal clean tags */}
        {meme.tags && meme.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {meme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>

    </article>
  );
};
