import React, { useState } from 'react';
import { DIWALI_DARK_GREETINGS } from '../data/diwaliMemes';
import { MessageCircle, Copy, Check, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound } from '../utils/audio';

export const DiwaliSidebar: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedVictim, setSelectedVictim] = useState<string>('All');

  const victimOptions = ['All', 'Rishtedaar', 'Sibling', 'Corporate Boss', 'Delhi Bros', 'Homies'];

  const filtered = selectedVictim === 'All'
    ? DIWALI_DARK_GREETINGS
    : DIWALI_DARK_GREETINGS.filter((g) => g.targetVictim === selectedVictim);

  const handleWhatsAppSend = (text: string) => {
    playFlameSound();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      playPopSound();
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.7 } });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <aside className="w-full bg-[#121215] rounded-2xl sm:rounded-3xl border border-zinc-800/80 p-4 sm:p-5 shadow-card sticky top-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-900/30 rounded-2xl p-4 border border-amber-500/20 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Upcoming Festival Special</span>
        </div>
        <h3 className="text-lg font-bold font-sans text-white tracking-tight leading-tight">
          🪔 Dark Diwali Roasts
        </h3>
        <p className="text-xs text-zinc-400 font-normal mt-1 leading-relaxed">
          Send unfiltered roasts to relatives, siblings, and bosses. 1-tap WhatsApp ready.
        </p>
      </div>

      {/* Victim Filter Chips */}
      <div className="mb-4">
        <span className="text-[11px] font-medium text-zinc-400 block mb-2">
          Target Victim:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {victimOptions.map((v) => {
            const isSelected = selectedVictim === v;
            return (
              <button
                key={v}
                onClick={() => {
                  playPopSound();
                  setSelectedVictim(v);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 font-semibold shadow-sm'
                    : 'bg-zinc-800/70 text-zinc-300 border-zinc-700/60 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable list of greetings */}
      <div className="space-y-3.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {filtered.map((item) => {
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-zinc-900/70 rounded-2xl border border-zinc-800/80 p-3.5 hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-semibold text-zinc-200 truncate">
                  🪔 {item.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium uppercase flex-shrink-0">
                  {item.targetVictim}
                </span>
              </div>

              <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-zinc-800/70 whitespace-pre-wrap leading-relaxed select-all font-mono text-[11px]">
                {item.whatsappText}
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                <button
                  onClick={() => handleCopy(item.whatsappText, item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleWhatsAppSend(item.whatsappText)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </aside>
  );
};
