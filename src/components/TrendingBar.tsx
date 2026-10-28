import React from 'react';
import { TRENDING_TAGS } from '../data/categories';
import { TrendingUp, Flame } from 'lucide-react';

interface TrendingBarProps {
  activeTag: string | null;
  onSelectTag: (tag: string) => void;
  onClearTag: () => void;
}

export const TrendingBar: React.FC<TrendingBarProps> = ({
  activeTag,
  onSelectTag,
  onClearTag,
}) => {
  return (
    <div className="w-full bg-surface/40 border-b border-white/5 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0 text-amber-400 font-bold text-xs">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Trending:</span>
        </div>

        {/* Scrollable list */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
          {TRENDING_TAGS.map((item) => {
            const isSelected = activeTag === item.tag;

            return (
              <button
                key={item.tag}
                onClick={() => (isSelected ? onClearTag() : onSelectTag(item.tag))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-orange scale-105'
                    : 'bg-surface-elevated/70 text-slate-300 hover:text-white hover:bg-surface-elevated border border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-amber-400 font-bold">#</span>
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-400 font-normal">({item.count})</span>
              </button>
            );
          })}
        </div>

        {activeTag && (
          <button
            onClick={onClearTag}
            className="flex-shrink-0 text-[11px] text-slate-400 hover:text-white underline ml-auto"
          >
            Clear tag
          </button>
        )}
      </div>
    </div>
  );
};
