import React from 'react';
import { Meme } from '../types';
import { HUMOR_LEVELS } from '../data/humorLevels';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  Flag, 
  Download, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemeDetailModalProps {
  meme: Meme | null;
  onClose: () => void;
  isSaved: boolean;
  isLiked: boolean;
  onToggleSave: (meme: Meme) => void;
  onToggleLike: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
  onReport: (meme: Meme) => void;
  relatedMemes: Meme[];
  onSelectRelated: (meme: Meme) => void;
}

export const MemeDetailModal: React.FC<MemeDetailModalProps> = ({
  meme,
  onClose,
  isSaved,
  isLiked,
  onToggleSave,
  onToggleLike,
  onShare,
  onReport,
  relatedMemes,
  onSelectRelated,
}) => {
  if (!meme) return null;

  const humorInfo = HUMOR_LEVELS[meme.humorLevel];

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = meme.imageUrl;
    a.download = `memeverse-${meme.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 25, spread: 50 });
  };

  const handleQuickWhatsApp = () => {
    const shareUrl = window.location.href.split('?')[0] + `?meme=${meme.id}`;
    const text = `😂 *${meme.title}*\n\n"${meme.caption}"\n\nDiscovered on Memeverse: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-surface-elevated border border-white/10 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Creator & Level Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center font-black text-white text-sm">
              {meme.creator.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-white">{meme.creator.name}</span>
                {meme.creator.isVerified && (
                  <span className="text-neon-lime text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-xs text-slate-400">{meme.creator.handle}</span>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${humorInfo.badgeBg} ${humorInfo.badgeText} border border-current/20`}
          >
            <span>{humorInfo.emoji}</span>
            <span>Lvl {meme.humorLevel}: {humorInfo.name}</span>
          </span>
        </div>

        {/* Full Image Container */}
        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-white/10 aspect-[4/3] flex items-center justify-center mb-4">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Caption & Title */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-black text-white font-display">
            {meme.title}
          </h2>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            {meme.caption}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meme.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-surface text-slate-300 px-2 py-0.5 rounded-lg border border-white/5"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike(meme)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-surface hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{(meme.stats.likes / 1000).toFixed(1)}k</span>
            </button>

            <button
              onClick={() => onToggleSave(meme)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isSaved
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'bg-surface hover:bg-pink-500/10 text-slate-300 hover:text-pink-400 border border-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-neon-pink text-neon-pink' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send to Chat</span>
            </button>

            <button
              onClick={() => onShare(meme)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-colors shadow-glow-primary"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-surface hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onReport(meme)}
              className="p-2 rounded-xl bg-surface hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 border border-white/10"
              title="Report content"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Related Memes Carousel / Recommendations */}
        {relatedMemes.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Related Humor in this Universe</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {relatedMemes.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group cursor-pointer bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
                >
                  <div className="aspect-[4/3] bg-black overflow-hidden">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2">
                    <h5 className="text-[11px] font-bold text-white truncate group-hover:text-primary-light">
                      {rel.title}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
