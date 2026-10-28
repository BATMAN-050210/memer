import React, { useState } from 'react';
import { DIWALI_DARK_GREETINGS, DarkDiwaliGreeting } from '../data/diwaliMemes';
import { 
  Flame, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  Download, 
  Send,
  Skull,
  UserX,
  Zap,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound, playSuccessSound } from '../utils/audio';

export const DiwaliHub: React.FC = () => {
  const [selectedVictim, setSelectedVictim] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Interactive Custom Roast Maker
  const [victimName, setVictimName] = useState('');
  const [victimCrime, setVictimCrime] = useState('kajukatli');
  const [customRoast, setCustomRoast] = useState<string | null>(null);
  const [copiedCustom, setCopiedCustom] = useState(false);

  const victimOptions = [
    'All',
    'Sibling',
    'Rishtedaar',
    'Homies',
    'Corporate Boss',
    'Delhi Bros',
    'Crush',
    'Group Chat',
  ];

  const filteredGreetings = selectedVictim === 'All'
    ? DIWALI_DARK_GREETINGS
    : DIWALI_DARK_GREETINGS.filter((g) => g.targetVictim === selectedVictim);

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      playPopSound();
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#EF4444', '#10B981'],
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleWhatsAppSend = (text: string) => {
    playFlameSound();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleToggleLike = (id: string) => {
    playPopSound();
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerateCustomRoast = (e: React.FormEvent) => {
    e.preventDefault();
    const name = victimName.trim() || 'Bhai';
    playSuccessSound();

    let text = '';
    if (victimCrime === 'kajukatli') {
      text = `🪔 *Happy Diwali ${name}!* 🍬\n\nMay Goddess Lakshmi bless you with enough wealth this year so you don't have to secretly peel off all the silver foil from my Kaju Katli box at 2 AM.\n\n_Watch your sweets, revenge is coming!_`;
    } else if (victimCrime === 'gpay') {
      text = `💸 *Diwali Mubarak ${name}!* 💸\n\nDiwali is the festival of clearing old debts and starting fresh. \n\nBefore you light 100 rockets, please clear the ₹220 you owe me on Google Pay since last year. Mata Lakshmi is judging your payment history!\n\n_UPI ID same hai, jaldi bhejo._`;
    } else if (victimCrime === 'salary') {
      text = `🪔 *Happy Diwali ${name} Ji!* 🪔\n\nWishing you infinite peace! May you find so much happiness in your own life that you forget to interrogate me about my salary, CTC, and wedding dates at dinner.\n\n_Kaju khao, sukoon pao! 🙏_`;
    } else if (victimCrime === 'delhi') {
      text = `🌫️ *Happy Diwali ${name}!* 🌫️\n\nMay your lungs survive the 999 AQI gas chamber tonight. Remember: don't check the air purifier meter, what you can't see won't hurt you (it will, but stay strong).\n\n_Chhota bomb phodo, oxygen cylinder pass karo!_`;
    } else {
      text = `👻 *Happy Diwali to the Ghost King/Queen ${name}!* 👻\n\nSurprised you remember how to type! Left me on read for 8 months but suddenly remembered my contact info for Diwali.\n\n_Same to you, see you in 2027! 🫡_`;
    }

    setCustomRoast(text);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="py-4 px-3 sm:px-6 max-w-5xl mx-auto pb-24">
      
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 border border-amber-500/30 shadow-2xl mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Diwali 2024–2026 Dark Roaster</span>
              <span>🪔</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
              Trending Dark &amp; Funny Diwali Greetings
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Don’t send boring forwarded poems. Send unfiltered, hilarious roasts directly to WhatsApp or Instagram with 1 tap.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs text-amber-300 font-bold">
            <span className="text-xl">🪔</span>
            <div>
              <span className="block text-white">Soan Papdi Shield Active</span>
              <span className="text-[10px] text-slate-400 font-normal">100% Unfiltered Fire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Victim Filter Chips */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            🎯 Pick Your Target Victim:
          </span>
          <span className="text-[11px] text-amber-400 font-semibold">
            {filteredGreetings.length} Greetings Ready
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {victimOptions.map((v) => {
            const isSelected = selectedVictim === v;
            return (
              <button
                key={v}
                onClick={() => {
                  playPopSound();
                  setSelectedVictim(v);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 border ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 shadow-glow-orange scale-102'
                    : 'bg-surface text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{v}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Greetings Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {filteredGreetings.map((item) => {
          const isCopied = copiedId === item.id;
          const isLiked = likedIds.includes(item.id);

          return (
            <article
              key={item.id}
              className="bg-surface-card rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xl group"
            >
              {/* Header Info */}
              <div className="p-3.5 bg-surface/50 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                  <span>🪔</span>
                  <span>For: {item.targetVictim}</span>
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  {item.tone}
                </span>
              </div>

              {/* Meme Image Preview */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <h3 className="absolute bottom-2 left-3 right-3 text-sm font-bold text-white drop-shadow-md truncate">
                  {item.title}
                </h3>
              </div>

              {/* Card Body & WhatsApp Preformatted Text Box */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                  {item.whatsappText}
                </div>

                <p className="text-xs text-amber-300/90 font-medium italic">
                  💡 Reality Check: "{item.punchline}"
                </p>

                {/* 1-Tap Action Bar */}
                <div className="pt-2 flex items-center gap-2">
                  {/* WhatsApp Direct Send Button */}
                  <button
                    onClick={() => handleWhatsAppSend(item.whatsappText)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyText(item.whatsappText, item.id)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/10 active:scale-95 transition-all"
                    title="Copy for WhatsApp / Insta"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-neon-lime" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  {/* Like Button */}
                  <button
                    onClick={() => handleToggleLike(item.id)}
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

      {/* Interactive Custom Diwali Roast Generator */}
      <div className="bg-gradient-to-r from-surface-card via-purple-950/40 to-surface-card rounded-3xl p-5 sm:p-7 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-black font-display text-white">
            Custom Dark Diwali Roast Machine
          </h2>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          Target a specific friend, sibling, or uncle and generate a personalized dark Diwali roast:
        </p>

        <form onSubmit={handleGenerateCustomRoast} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Victim's Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Bunty, Rahul, Sharma Uncle, Priya..."
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Their Crime / Annoyance:
              </label>
              <select
                value={victimCrime}
                onChange={(e) => setVictimCrime(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="kajukatli">Ate all silver foil off Kaju Katli (Sibling)</option>
                <option value="gpay">Still owes money on Google Pay / Splitwise (Friend)</option>
                <option value="salary">Interrogates about salary &amp; marriage (Rishtedaar)</option>
                <option value="delhi">Surviving 999 AQI gas chamber (Delhi Bro)</option>
                <option value="ghost">Ghosted all year, texted on Diwali (Ghost Friend)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-glow-primary active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate &amp; Burn The Victim 🔥</span>
          </button>
        </form>

        {/* Output Box */}
        {customRoast && (
          <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-purple-500/40 animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Generated Weapon Ready to Fire:
              </span>
              <span className="text-[10px] text-slate-400">Direct WhatsApp ready</span>
            </div>

            <div className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
              {customRoast}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleWhatsAppSend(customRoast)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send to Victim on WhatsApp</span>
              </button>

              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(customRoast);
                    setCopiedCustom(true);
                    playPopSound();
                    setTimeout(() => setCopiedCustom(false), 2000);
                  } catch {}
                }}
                className="py-2.5 px-4 bg-surface hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors"
              >
                {copiedCustom ? 'Copied ✓' : 'Copy Text'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
