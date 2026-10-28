import React, { useState, useRef, useEffect } from 'react';
import { FESTIVAL_OPTIONS, generateFestivalGreetings } from '../data/festivalData';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  MessageCircle, 
  Share2, 
  RefreshCw, 
  Send,
  Sliders,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FestivalLab: React.FC = () => {
  const [occasion, setOccasion] = useState('diwali');
  const [humorStyle, setHumorStyle] = useState('savage');
  const [language, setLanguage] = useState('Hinglish');
  const [recipient, setRecipient] = useState('bestie');
  const [recipientName, setRecipientName] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('midnight-gold');

  // Generated options
  const [greetings, setGreetings] = useState(() => 
    generateFestivalGreetings('diwali', 'savage', 'Hinglish', 'bestie', '')
  );
  const [selectedGreetingIndex, setSelectedGreetingIndex] = useState(0);

  // Custom edits on selected greeting
  const [customText, setCustomText] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Re-generate greetings when selections change
  const handleGenerate = () => {
    const list = generateFestivalGreetings(occasion, humorStyle, language, recipient, recipientName);
    setGreetings(list);
    setSelectedGreetingIndex(0);
    setCustomText(list[0]?.greeting || '');
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    handleGenerate();
  }, [occasion, humorStyle, language, recipient]);

  const activeGreeting = greetings[selectedGreetingIndex] || greetings[0];
  const activeTheme = FESTIVAL_OPTIONS.cardThemes.find((t) => t.id === selectedThemeId) || FESTIVAL_OPTIONS.cardThemes[0];

  // Draw greeting card on Canvas for high-res PNG download & preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (selectedThemeId === 'midnight-gold') {
      grad.addColorStop(0, '#18181B');
      grad.addColorStop(0.5, '#3B1804');
      grad.addColorStop(1, '#78350F');
    } else if (selectedThemeId === 'neon-cyber') {
      grad.addColorStop(0, '#090D16');
      grad.addColorStop(0.5, '#1E1B4B');
      grad.addColorStop(1, '#064E3B');
    } else if (selectedThemeId === 'spicy-pataka') {
      grad.addColorStop(0, '#450A0A');
      grad.addColorStop(0.5, '#881337');
      grad.addColorStop(1, '#4C0519');
    } else {
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#4C1D95');
      grad.addColorStop(1, '#1E1B4B');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle border glow
    ctx.strokeStyle = activeTheme.accent;
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, width - 50, height - 50);

    // Decorative corner sparkles
    ctx.font = '36px Arial';
    ctx.fillText('🪔', 45, 75);
    ctx.fillText('✨', width - 85, 75);
    ctx.fillText('🎆', 45, height - 45);
    ctx.fillText('🪔', width - 85, height - 45);

    // Header badge
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.fillStyle = activeTheme.accent;
    ctx.textAlign = 'center';
    const occLabel = FESTIVAL_OPTIONS.occasions.find((o) => o.id === occasion)?.label || 'Diwali Chaos';
    ctx.fillText(`MEMEVERSE • ${occLabel.toUpperCase()}`, width / 2, 80);

    // Recipient tag
    if (recipientName.trim()) {
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Special Greeting For: ${recipientName.trim()}`, width / 2, 130);
    }

    // Main Greeting Text (Word wrapped)
    const textToDraw = customText || activeGreeting?.greeting || '';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';

    const words = textToDraw.split(' ');
    let line = '';
    let y = recipientName.trim() ? 220 : 200;
    const maxWidth = 660;
    const lineHeight = 44;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, y);

    // Subtext punchline
    if (activeGreeting?.subtext) {
      y += 50;
      ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = activeTheme.textColor;
      ctx.fillText(`"${activeGreeting.subtext}"`, width / 2, y);
    }

    // Small footer watermark
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Crafted with Memeverse • The Internet’s Humor Destination', width / 2, height - 55);
  }, [occasion, customText, activeGreeting, selectedThemeId, recipientName]);

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `memeverse-${occasion}-greeting.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
  };

  const currentGreetingText = customText || activeGreeting?.greeting || '';
  const currentSubtext = activeGreeting?.subtext ? `\n\n_${activeGreeting.subtext}_` : '';
  const fullShareText = `🪔 *${currentGreetingText}*${currentSubtext}\n\n— Generated with Memeverse Festival Chaos`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Festival Greeting from Memeverse',
          text: fullShareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
          <span>🪔</span>
          <span>SEASONAL FESTIVAL LAB</span>
          <span>✨</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
          Festival Chaos &amp; Diwali Roaster
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Say goodbye to generic forwarded messages. Personalize savage, relatable, or wholesome greetings for your squad, siblings, and family WhatsApp groups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Generator Controls (5 cols) */}
        <div className="lg:col-span-5 bg-surface-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-5">
          
          {/* 1. Occasion Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              1. Select Occasion:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FESTIVAL_OPTIONS.occasions.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setOccasion(occ.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    occasion === occ.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                      : 'bg-surface text-slate-300 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{occ.emoji}</span>
                  <span className="mt-1 text-[11px] truncate w-full text-center">{occ.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Humor Style */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              2. Humor Style:
            </label>
            <div className="space-y-1.5">
              {FESTIVAL_OPTIONS.humorStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setHumorStyle(style.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all text-left ${
                    humorStyle === style.id
                      ? 'bg-primary/20 text-primary-light border-primary/50 font-bold'
                      : 'bg-surface text-slate-300 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{style.emoji}</span>
                    <span className="font-semibold">{style.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Recipient & Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              3. Recipient:
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {FESTIVAL_OPTIONS.recipients.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setRecipient(rec.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition-all ${
                    recipient === rec.id
                      ? 'bg-neon-lime/20 text-neon-limeBright border-neon-lime/40 font-bold'
                      : 'bg-surface text-slate-300 border-white/5 hover:border-white/15'
                  }`}
                >
                  <span>{rec.emoji}</span>
                  <span className="truncate">{rec.label}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Custom Recipient Name (e.g. Bunty, Priya, Bro)..."
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* 4. Language & Theme */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none"
              >
                {FESTIVAL_OPTIONS.languages.map((l) => (
                  <option key={l.id} value={l.id} className="bg-surface-elevated">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Card Theme:
              </label>
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none"
              >
                {FESTIVAL_OPTIONS.cardThemes.map((t) => (
                  <option key={t.id} value={t.id} className="bg-surface-elevated">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Regenerate Fresh Variations button */}
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-glow-orange active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Fresh Variations</span>
          </button>
        </div>

        {/* Right Column: Live Card Canvas Preview & Variations (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card Canvas Preview */}
          <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                Live Greeting Card Preview
              </span>
              <span className="text-[11px] text-amber-400 font-semibold">
                Theme: {activeTheme.name}
              </span>
            </div>

            {/* Canvas Element */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
              />
            </div>

            {/* Quick Action Bar for the Greeting */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={handleDownloadCard}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Save Card PNG</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={handleCopyText}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface hover:bg-white/10 text-slate-200 font-semibold text-xs rounded-xl border border-white/10 transition-colors"
              >
                {copiedText ? <Check className="w-4 h-4 text-neon-lime" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface hover:bg-white/10 text-slate-200 font-semibold text-xs rounded-xl border border-white/10 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Generated Variations List */}
          <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Generated Greeting Variations (Click to select):
            </h4>

            <div className="space-y-2.5">
              {greetings.map((item, idx) => {
                const isSelected = selectedGreetingIndex === idx;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedGreetingIndex(idx);
                      setCustomText(item.greeting);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                        : 'bg-surface hover:bg-surface-elevated border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold uppercase">
                        {item.badge}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active on Card</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-white leading-relaxed">
                      "{item.greeting}"
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 italic">
                      — {item.subtext}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
