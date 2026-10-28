import React, { useState } from 'react';
import { Meme } from '../types';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Share2, 
  Check, 
  Copy,
  Smile,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound } from '../utils/audio';

interface InstaMemePostProps {
  meme: Meme;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (meme: Meme) => void;
  onToggleSave: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
}

export const InstaMemePost: React.FC<InstaMemePostProps> = ({
  meme,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShare,
}) => {
  const [likeCount, setLikeCount] = useState(meme.stats.likes + (isLiked ? 1 : 0));
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<string[]>([
    'Bhai literally me at 3 AM 😭😭',
    'Sending this to the group chat right now 💀',
  ]);
  const [newComment, setNewComment] = useState('');

  const triggerLike = () => {
    playPopSound();
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.65 },
        colors: ['#FF2A85', '#FFE600', '#CCFF00'],
      });
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1));
    }
    onToggleLike(meme);
  };

  const handleDoubleTap = () => {
    triggerLike();
  };

  const handleQuickWhatsApp = () => {
    playFlameSound();
    const shareUrl = window.location.href.split('?')[0] + `?meme=${meme.id}`;
    const text = `😂 *${meme.title}*\n\n"${meme.caption}"\n\n_Watch this on Memeverse: ${shareUrl}_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyCaption = async () => {
    playPopSound();
    const text = `🔥 "${meme.title}"\n\n"${meme.caption}"\n\n#memeverse #dankmemes #humor`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {}
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    playPopSound();
    setComments((prev) => [...prev, newComment.trim()]);
    setNewComment('');
  };

  return (
    <article className="w-full bg-surface-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-5 sm:mb-6 select-none">
      
      {/* 1. Post Header: Avatar, Username, Badges, Options */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between border-b border-white/5 bg-surface/50">
        <div className="flex items-center gap-2.5">
          {/* Story Ring Avatar */}
          <div className="story-ring-active rounded-full p-[2px]">
            <div className="w-8 h-8 rounded-full bg-slate-900 overflow-hidden flex items-center justify-center font-black text-xs text-white">
              {meme.creator.name.charAt(0)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
                {meme.creator.handle.replace('@', '')}
              </span>
              <span className="text-brand-limeBright text-xs font-black" title="Verified Creator">✓</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Original Audio • 2h ago</span>
          </div>
        </div>

        {/* Level Tag (Lime / Yellow / Pink / Purple) */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            meme.humorLevel === 5
              ? 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-sm'
              : meme.humorLevel === 3
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-brand-lime/20 text-brand-limeBright border-brand-lime/40'
          }`}>
            {meme.humorLevel === 5 ? '💀 Pitch Dark' : meme.humorLevel === 3 ? '🔥 Savage' : '⚡ Relatable'}
          </span>

          <button 
            onClick={() => onShare(meme)}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Full Media Card (Double-Tap to Like) */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative aspect-square sm:aspect-[4/3] bg-black overflow-hidden flex items-center justify-center cursor-pointer group"
      >
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
          loading="lazy"
        />

        {/* Big Heart Burst Animation on Double-Tap */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heart-burst drop-shadow-2xl" />
          </div>
        )}

        {/* Festival Badge */}
        {meme.isFestival && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-brand-yellow text-black text-[10px] font-black uppercase flex items-center gap-1 shadow-glow-yellow">
            <span>🪔</span>
            <span>Diwali Special</span>
          </div>
        )}

        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* 3. Action Buttons Row */}
      <div className="p-3 sm:p-4 pb-2">
        <div className="flex items-center justify-between">
          
          {/* Left Actions: Like, Comment, WhatsApp, Share */}
          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={triggerLike}
              className="p-1 text-slate-200 hover:scale-110 active:scale-95 transition-all"
              title="Like"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-100'
                }`}
              />
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-1 text-slate-200 hover:scale-110 active:scale-95 transition-all"
              title="Comments"
            >
              <MessageCircle className="w-6 h-6 text-slate-100" />
            </button>

            {/* 🟢 Direct WhatsApp Send Button */}
            <button
              onClick={handleQuickWhatsApp}
              className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all"
              title="Send to WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Copy for Insta Story / Caption */}
            <button
              onClick={handleCopyCaption}
              className="p-1 text-slate-300 hover:text-brand-yellow transition-colors"
              title="Copy for Instagram Story"
            >
              {copiedCaption ? <Check className="w-5 h-5 text-brand-limeBright" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Right Action: Bookmark / Save */}
          <button
            onClick={() => {
              playPopSound();
              onToggleSave(meme);
            }}
            className="p-1 text-slate-200 hover:scale-110 active:scale-95 transition-all"
            title="Save to Vault"
          >
            <Bookmark
              className={`w-6 h-6 ${
                isSaved ? 'fill-brand-yellow text-brand-yellow' : 'text-slate-100'
              }`}
            />
          </button>
        </div>

        {/* 4. Likes Counter */}
        <div className="mt-2 text-xs font-bold text-white">
          <span>{(likeCount).toLocaleString()} likes</span>
        </div>

        {/* 5. Caption & Title */}
        <div className="mt-1.5 text-xs sm:text-sm text-slate-200 leading-snug">
          <span className="font-extrabold text-white mr-1.5">
            {meme.creator.handle.replace('@', '')}
          </span>
          <span className="font-semibold text-brand-yellow mr-1">
            {meme.title} —
          </span>
          <span>{meme.caption}</span>
        </div>

        {/* Tags */}
        <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-brand-lime font-medium">
          {meme.tags.map((t) => (
            <span key={t} className="hover:underline cursor-pointer">
              #{t}
            </span>
          ))}
        </div>

        {/* 6. Comments Section */}
        <div className="mt-2">
          {comments.length > 0 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              View all {comments.length + 84} comments
            </button>
          )}

          {showComments && (
            <div className="space-y-1.5 mt-2 pt-2 border-t border-white/5 max-h-36 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1">
                  <span className="font-bold text-white text-[11px]">user_{i + 1}:</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add a comment input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
            <input
              type="text"
              placeholder="Add a comment or roast..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {newComment.trim() && (
              <button
                type="submit"
                className="text-xs font-extrabold text-brand-lime hover:text-brand-limeBright flex-shrink-0"
              >
                Post
              </button>
            )}
          </form>
        </div>

      </div>

    </article>
  );
};
