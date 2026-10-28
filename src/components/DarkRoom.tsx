import React, { useState } from 'react';
import { Meme } from '../types';
import { 
  Skull, 
  Flame, 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Heart, 
  Sparkles,
  Download,
  AlertOctagon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound } from '../utils/audio';

interface DarkRoomProps {
  darkMemes: Meme[];
  likedMemeIds: string[];
  savedMemeIds: string[];
  onToggleLike: (meme: Meme) => void;
  onToggleSave: (meme: Meme) => void;
  onShare: (meme: Meme) => void;
  onViewDetails: (meme: Meme) => void;
}

export const DarkRoom: React.FC<DarkRoomProps> = ({
  darkMemes,
  likedMemeIds,
  savedMemeIds,
  onToggleLike,
  onToggleSave,
  onShare,
  onViewDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'existential' | 'corporate' | 'savage' | 'festival'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = darkMemes.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'existential') return m.tags.includes('existential') || m.tags.includes('nihilism') || m.tags.includes('darkhumor');
    if (activeFilter === 'corporate') return m.category === 'work-adulting' || m.tags.includes('corporate');
    if (activeFilter === 'savage') return m.category === 'savage-roasts' || m.humorLevel === 3;
    if (activeFilter === 'festival') return m.isFestival || m.category === 'festival-memes';
    return true;
  });

  const handleCopyForInsta = async (meme: Meme) => {
    try {
      const text = `💀 "${meme.topText || meme.title}"\n\n"${meme.bottomText || meme.caption}"\n\n#darkhumor #memeverse #realtalk`;
      await navigator.clipboard.writeText(text);
      setCopiedId(meme.id);
      playPopSound();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#A855F7', '#EC4899', '#EF4444'],
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleQuickWhatsApp = (meme: Meme) => {
    playFlameSound();
    const shareUrl = window.location.href.split('?')[0] + `?meme=${meme.id}`;
    const text = `💀 *${meme.title}*\n\n"${meme.caption}"\n\n_Send the damage: ${shareUrl}_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-4 px-3 sm:px-6 max-w-5xl mx-auto pb-24">
      
      {/* Dark Room Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-slate-950 to-black border border-purple-500/40 shadow-2xl mb-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black uppercase tracking-wider mb-2">
              <Skull className="w-3.5 h-3.5 text-purple-400" />
              <span>The Pitch Black Vault</span>
              <span>⚡</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
              Epic Dark &amp; Unfiltered Memes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Strictly for people with twisted humor. Existential dread, savage truths, and memes that will get you kicked out of polite society.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md px-3 py-2 rounded-2xl border border-purple-500/30 text-xs text-purple-200 font-bold">
            <AlertOctagon className="w-5 h-5 text-purple-400" />
            <div>
              <span className="block text-white">Unfiltered Zone</span>
              <span className="text-[10px] text-purple-300 font-normal">Level 4 &amp; 5 Humor Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Sub-Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 hide-scrollbar">
        {[
          { id: 'all', label: '💀 All Dark Memes' },
          { id: 'existential', label: '🫠 Existential Dread' },
          { id: 'corporate', label: '💼 Toxic Corporate' },
          { id: 'savage', label: '🔥 Emotional Damage' },
          { id: 'festival', label: '🪔 Dark Diwali' },
        ].map((f) => {
          const isSelected = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                playPopSound();
                setActiveFilter(f.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-400 shadow-glow-primary scale-102'
                  : 'bg-surface text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Memes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map((meme) => {
          const isLiked = likedMemeIds.includes(meme.id);
          const isCopied = copiedId === meme.id;

          return (
            <article
              key={meme.id}
              className="bg-surface-card rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl group"
            >
              {/* Top Creator Rail */}
              <div className="p-3 bg-surface/60 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">
                  {meme.creator.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-500/30 font-black uppercase">
                  Level {meme.humorLevel}: Dark
                </span>
              </div>

              {/* Meme Visual */}
              <div
                onClick={() => onViewDetails(meme)}
                className="relative aspect-[4/3] bg-black cursor-pointer overflow-hidden flex items-center justify-center select-none"
              >
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <h3 className="absolute bottom-2 left-3 right-3 text-sm font-bold text-white drop-shadow-md truncate">
                  {meme.title}
                </h3>
              </div>

              {/* Punchline & Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {meme.caption}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {meme.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-surface text-purple-300/80 px-2 py-0.5 rounded-md border border-purple-500/20"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Action Bar: 1-Tap WhatsApp, Copy for Insta, Like */}
                <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => handleQuickWhatsApp(meme)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleCopyForInsta(meme)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-glow-primary"
                    title="Copy for Instagram Story / Caption"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-neon-lime" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? 'Copied!' : 'For Insta'}</span>
                  </button>

                  <button
                    onClick={() => onToggleLike(meme)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isLiked
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-surface text-slate-400 hover:text-rose-400 border-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
