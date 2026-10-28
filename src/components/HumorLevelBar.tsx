import React, { useState } from 'react';
import { HUMOR_LEVELS } from '../data/humorLevels';
import { HumorLevel } from '../types';
import { ShieldAlert, Info, Sparkles, X } from 'lucide-react';

interface HumorLevelBarProps {
  selectedLevels: HumorLevel[];
  onToggleLevel: (level: HumorLevel) => void;
  onSelectOnly: (level: HumorLevel) => void;
  onClearFilter: () => void;
}

export const HumorLevelBar: React.FC<HumorLevelBarProps> = ({
  selectedLevels,
  onToggleLevel,
  onSelectOnly,
  onClearFilter,
}) => {
  const [showDarkWarning, setShowDarkWarning] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleLevelClick = (lvl: HumorLevel, e: React.MouseEvent) => {
    // If holding shift or alt or clicking directly, toggle
    if (lvl === 5 && !selectedLevels.includes(5)) {
      // Show sensitive boundary explanation for Dark Humor mode
      setShowDarkWarning(true);
    }
    if (e.altKey || e.metaKey) {
      onSelectOnly(lvl);
    } else {
      onToggleLevel(lvl);
    }
  };

  return (
    <div className="w-full bg-surface-card/80 backdrop-blur-md border-y border-white/5 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Label and info */}
        <div className="flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
              Humor Intensity Dial
            </span>
          </div>

          <button
            onClick={() => setShowInfoModal(true)}
            title="What are humor levels?"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
          >
            <Info className="w-4 h-4" />
          </button>

          {selectedLevels.length < 5 && (
            <button
              onClick={onClearFilter}
              className="text-xs text-primary-light hover:underline ml-2"
            >
              Reset to All (5)
            </button>
          )}
        </div>

        {/* Right: Level selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {([1, 2, 3, 4, 5] as HumorLevel[]).map((lvl) => {
            const info = HUMOR_LEVELS[lvl];
            const isSelected = selectedLevels.includes(lvl);

            return (
              <button
                key={lvl}
                onClick={(e) => handleLevelClick(lvl, e)}
                onDoubleClick={() => onSelectOnly(lvl)}
                title={`Level ${lvl}: ${info.name} - Double-click to isolate`}
                className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border ${
                  isSelected
                    ? `${info.badgeBg} ${info.badgeText} ${info.borderClass} shadow-sm shadow-${info.accentColor}/20 scale-105`
                    : 'bg-surface/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200 opacity-60'
                }`}
              >
                <span>{info.emoji}</span>
                <span>Lvl {lvl}</span>
                <span className="hidden sm:inline font-normal opacity-90">{info.name}</span>
                {isSelected && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: info.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-elevated border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white font-display">
                Understanding Humor Levels
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Customize your feed from harmless giggles to unapologetic roasts. Select multiple levels to mix styles, or double-click any level to isolate it.
            </p>

            <div className="space-y-2.5">
              {([1, 2, 3, 4, 5] as HumorLevel[]).map((lvl) => {
                const info = HUMOR_LEVELS[lvl];
                return (
                  <div
                    key={lvl}
                    className="p-3 rounded-xl bg-surface border border-white/5 flex items-start gap-3"
                  >
                    <span className="text-xl">{info.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Level {lvl}: {info.name}</span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${info.accentColor}20`,
                            color: info.accentColor,
                          }}
                        >
                          {info.tagline}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors"
            >
              Got it, let's browse!
            </button>
          </div>
        </div>
      )}

      {/* Dark Humor Boundary Notice Modal */}
      {showDarkWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-surface-elevated border border-purple-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-display mb-1">
              Entering Level 5: Dark Humor
            </h3>
            <p className="text-xs text-purple-300 font-medium mb-3">
              Morbid Irony & Existential Satire Mode
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Level 5 features cynical satire, morbid truths, and dark existential humor. Memeverse strictly enforces community safety boundaries: we do <strong className="text-white">NOT</strong> allow real-world harm, hate speech, targeted harassment, or non-consensual content.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDarkWarning(false)}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-glow-primary"
              >
                I Understand, Enable Level 5
              </button>
              <button
                onClick={() => {
                  setShowDarkWarning(false);
                  onToggleLevel(5); // toggle back off
                }}
                className="px-4 py-2.5 bg-surface text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
