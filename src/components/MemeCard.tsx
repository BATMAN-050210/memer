import React, { useState } from 'react';
import { Meme } from '../types';
import { HUMOR_LEVELS } from '../data/humorLevels';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Maximize2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound } from '../utils/audio';

interface MemeCardProps {
  meme: Meme;
  isSaved: boolean;
  isLiked: boolean;
  onToggleSave: (meme: Meme) => void;
  onToggleLike: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
  onReport: (meme: Meme) => void;
  onRelated: (meme: Meme) => void;
  onViewDetails: (meme: Meme) => void;
}

export const MemeCard: React.FC<MemeCardProps> = ({
  meme,
  isSaved,
  isLiked,
  onToggleSave,
  onToggleLike,
  onShare,
  onViewDetails,
}) => {
  const humorInfo = HUMOR_LEVELS[meme.humorLevel];
  const [likeCount, setLikeCount] = useState(meme.stats.likes + (isLiked ? 1 : 0));
  const [animatingLike, setAnimatingLike] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
      setAnimatingLike(true);
      setTimeout(() => setAnimatingLike(false), 700);
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { y: 0.7 },
        colors: [humorInfo.accentColor, '#F43F5E', '#A855F7'],
      });
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1));
    }
    onToggleLike(meme);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    onToggleSave(meme);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    playFlameSound();
    const shareUrl = window.location.href.split('?')[0] + `?meme=${meme.id}`;
    const text = `😂 *${meme.title}*\n\n"${meme.caption}"\n\n_Discovered on Memeverse: ${shareUrl}_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyForInsta = async (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    const text = `🔥 "${meme.title}"\n\n"${meme.caption}"\n\n#memeverse #dankmemes #trendingmemes`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedInsta(true);
      setTimeout(() => setCopiedInsta(false), 2000);
    } catch {}
  };

  return (
    <article className="group bg-surface-card rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-lg relative">
      
      {/* Top Header: Creator info & Humor Level badge */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 border-b border-white/5 bg-surface/30">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-700 to-pink-600 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
            {meme.creator.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white truncate block">{meme.creator.name}</span>
            <span className="text-[10px] text-slate-400 truncate block">{meme.creator.handle}</span>
          </div>
        </div>

        {/* Level Badge */}
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${humorInfo.badgeBg} ${humorInfo.badgeText} border border-current/20`}
        >
          <span>{humorInfo.emoji}</span>
          <span>Lvl {meme.humorLevel}</span>
        </span>
      </div>

      {/* Meme Image Preview (Real iconic meme template) */}
      <div 
        onClick={() => onViewDetails(meme)}
        className="relative aspect-[4/3] w-full bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center select-none"
      >
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />

        {/* Double-tap love animation */}
        {animatingLike && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none animate-ping">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500" />
          </div>
        )}

        {/* Festival badge */}
        {meme.isFestival && (
          <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
            <span>🪔</span>
            <span>Diwali Special</span>
          </div>
        )}
      </div>

      {/* Content & Captions */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onViewDetails(meme)}
            className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer line-clamp-1"
          >
            {meme.title}
          </h3>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
            {meme.caption}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {meme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-surface text-slate-400 px-1.5 py-0.5 rounded-md border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls: 1-Tap WhatsApp, 1-Tap Insta, Like, Save */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-1.5">
          
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs font-semibold py-1.5 px-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-rose-400 bg-rose-500/15'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{(likeCount / 1000).toFixed(1)}k</span>
          </button>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {/* WhatsApp Send */}
            <button
              onClick={handleQuickWhatsApp}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
              title="Send to WhatsApp Group"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Copy for Insta */}
            <button
              onClick={handleCopyForInsta}
              className="flex items-center gap-1 py-1.5 px-2 rounded-xl bg-surface hover:bg-white/10 text-slate-200 font-semibold text-[11px] border border-white/10 transition-colors"
              title="Copy Caption for Instagram"
            >
              {copiedInsta ? <Check className="w-3.5 h-3.5 text-neon-lime" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedInsta ? 'Copied!' : 'Insta'}</span>
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-neon-pink bg-pink-500/15' : 'text-slate-400 hover:text-white'
              }`}
              title="Save to Vault"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-neon-pink' : ''}`} />
            </button>

            {/* Share Sheet */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(meme);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              title="More share options"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
