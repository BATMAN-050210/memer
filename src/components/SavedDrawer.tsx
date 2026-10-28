import React from 'react';
import { Meme } from '../types';
import { Bookmark, X, Share2, Trash2, ArrowRight } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedMemes: Meme[];
  onRemoveSaved: (memeId: string) => void;
  onShare: (meme: Meme) => void;
  onViewMeme: (meme: Meme) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedMemes,
  onRemoveSaved,
  onShare,
  onViewMeme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-elevated border-l border-white/10 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-neon-pink fill-neon-pink" />
            <h3 className="text-base font-bold text-white font-display">
              Saved Memes ({savedMemes.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedMemes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-surface mx-auto flex items-center justify-center text-3xl mb-3 border border-white/5">
                📭
              </div>
              <h4 className="text-sm font-bold text-white">No saved memes yet!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Tap the bookmark icon on any meme card to save it for quick access when roasting your friends.
              </p>
            </div>
          ) : (
            savedMemes.map((meme) => (
              <div
                key={meme.id}
                className="bg-surface rounded-xl p-3 border border-white/5 hover:border-white/15 transition-all flex gap-3 items-center group"
              >
                <div 
                  onClick={() => {
                    onViewMeme(meme);
                    onClose();
                  }}
                  className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      onViewMeme(meme);
                      onClose();
                    }}
                    className="text-xs font-bold text-white truncate cursor-pointer hover:text-primary-light"
                  >
                    {meme.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {meme.caption}
                  </p>
                  <span className="text-[10px] text-primary-light font-semibold">
                    Lvl {meme.humorLevel} • {meme.creator.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onShare(meme)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveSaved(meme.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-surface/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-surface hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors"
          >
            Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};
