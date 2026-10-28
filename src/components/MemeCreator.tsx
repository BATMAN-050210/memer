import React, { useState, useRef, useEffect } from 'react';
import { MEME_TEMPLATES, MemeTemplate } from '../data/memeTemplates';
import { Meme } from '../types';
import { 
  Upload, 
  Download, 
  Share2, 
  Sparkles, 
  Type, 
  Sliders, 
  RotateCcw, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemeCreatorProps {
  onMemeCreated?: (newMeme: Partial<Meme>) => void;
}

export const MemeCreator: React.FC<MemeCreatorProps> = ({ onMemeCreated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(MEME_TEMPLATES[0]);
  const [topText, setTopText] = useState(MEME_TEMPLATES[0].defaultTop);
  const [bottomText, setBottomText] = useState(MEME_TEMPLATES[0].defaultBottom);
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Impact');
  const [isUppercase, setIsUppercase] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);

  // Custom uploaded image
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be under 10MB');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Switch template
  const handleSelectTemplate = (tpl: MemeTemplate) => {
    setSelectedTemplate(tpl);
    setUploadedImageSrc(null);
    setTopText(tpl.defaultTop);
    setBottomText(tpl.defaultBottom);
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    const renderText = () => {
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(4, Math.round(fontSize / 7));
      ctx.font = `900 ${fontSize}px ${fontFamily}, Arial Black, sans-serif`;

      const drawWrap = (text: string, yPos: number, isBottom: boolean) => {
        const processed = isUppercase ? text.toUpperCase() : text;
        const words = processed.split(' ');
        let line = '';
        const lines: string[] = [];
        const maxWidth = width - 40;

        for (let i = 0; i < words.length; i++) {
          const test = line + words[i] + ' ';
          if (ctx.measureText(test).width > maxWidth && i > 0) {
            lines.push(line.trim());
            line = words[i] + ' ';
          } else {
            line = test;
          }
        }
        lines.push(line.trim());

        const lineHeight = fontSize * 1.15;
        let startY = isBottom ? yPos - (lines.length - 1) * lineHeight : yPos;

        for (const l of lines) {
          ctx.strokeText(l, width / 2, startY);
          ctx.fillText(l, width / 2, startY);
          startY += lineHeight;
        }
      };

      if (topText.trim()) {
        drawWrap(topText, fontSize + 15, false);
      }

      if (bottomText.trim()) {
        drawWrap(bottomText, height - 25, true);
      }

      // Small Memeverse watermark
      if (showWatermark) {
        ctx.font = 'bold 12px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.textAlign = 'right';
        ctx.strokeText('MEMEVERSE', width - 15, height - 12);
        ctx.fillText('MEMEVERSE', width - 15, height - 12);
      }
    };

    // Draw background image
    const imageToDraw = new Image();
    imageToDraw.crossOrigin = 'anonymous';

    imageToDraw.onload = () => {
      ctx.drawImage(imageToDraw, 0, 0, width, height);
      renderText();
    };

    imageToDraw.onerror = () => {
      // Fallback solid background if image fails
      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(0, 0, width, height);
      renderText();
    };

    imageToDraw.src = uploadedImageSrc || selectedTemplate.thumbnail;
  }, [
    selectedTemplate,
    uploadedImageSrc,
    topText,
    bottomText,
    fontSize,
    textColor,
    strokeColor,
    fontFamily,
    isUppercase,
    showWatermark,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `memeverse-meme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  const handleReset = () => {
    setTopText(selectedTemplate.defaultTop);
    setBottomText(selectedTemplate.defaultBottom);
    setFontSize(36);
    setTextColor('#FFFFFF');
    setStrokeColor('#000000');
    setFontFamily('Impact');
    setIsUppercase(true);
  };

  return (
    <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MEME CREATION STUDIO</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
          Create &amp; Export Your Meme
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Pick a classic format or upload your own image. Customize captions, font styling, and export a high-res image ready for social damage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Studio Controls (5 cols) */}
        <div className="lg:col-span-5 bg-surface-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-5">
          
          {/* Starter Templates Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Choose Template:
              </label>
              {uploadedImageSrc && (
                <button
                  onClick={() => setUploadedImageSrc(null)}
                  className="text-[11px] text-primary-light hover:underline"
                >
                  Use Default Templates
                </button>
              )}
            </div>

            {/* Template Thumbnails Scroll */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {MEME_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`relative rounded-xl overflow-hidden aspect-video border transition-all ${
                    !uploadedImageSrc && selectedTemplate.id === tpl.id
                      ? 'border-primary ring-2 ring-primary/30 scale-102'
                      : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                  title={tpl.name}
                >
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Upload Custom Image Option */}
            <div className="relative">
              <label className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-dashed border-white/20 bg-surface hover:bg-surface-elevated cursor-pointer text-xs font-semibold text-slate-300 transition-colors">
                <Upload className="w-4 h-4 text-primary" />
                <span>Or Upload Custom Image (PNG, JPG)</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="text-[11px] text-rose-400 mt-1">{uploadError}</p>
              )}
            </div>
          </div>

          {/* Captions Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Top Caption:
              </label>
              <input
                type="text"
                placeholder="TOP TEXT..."
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary font-meme tracking-wide"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Bottom Caption:
              </label>
              <input
                type="text"
                placeholder="BOTTOM TEXT..."
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary font-meme tracking-wide"
              />
            </div>
          </div>

          {/* Typography & Styling Controls */}
          <div className="space-y-3 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold uppercase tracking-wider">Font Size: {fontSize}px</span>
              <input
                type="range"
                min="20"
                max="60"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-32 accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Font Family:</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Impact">Impact (Classic)</option>
                  <option value="Space Grotesk">Space Grotesk</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="system-ui">Modern Sans</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Text Color:</label>
                <div className="flex items-center gap-1.5">
                  {['#FFFFFF', '#FACC15', '#10B981', '#EF4444', '#000000'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-6 h-6 rounded-full border ${
                        textColor === color ? 'ring-2 ring-primary scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Checkboxes: Uppercase & Watermark */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUppercase}
                  onChange={(e) => setIsUppercase(e.target.checked)}
                  className="accent-primary"
                />
                <span>ALL CAPS (Classic Meme)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="accent-primary"
                />
                <span>Memeverse Badge</span>
              </label>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Captions &amp; Styles</span>
          </button>
        </div>

        {/* Right Column: Live Meme Preview Canvas & Export (7 cols) */}
        <div className="lg:col-span-7 bg-surface-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-primary" />
              Live Canvas Preview
            </span>
            <span className="text-[11px] text-neon-limeBright font-semibold">
              Ready to Download (PNG)
            </span>
          </div>

          {/* Canvas Wrapper */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-[6/5] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Action Export Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-glow-primary transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Finished Meme (PNG)</span>
            </button>

            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const dataUrl = canvas.toDataURL('image/png');
                if (navigator.share) {
                  navigator.share({
                    title: 'Check out my meme from Memeverse',
                    text: `${topText} — ${bottomText}`,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  handleDownload();
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-surface hover:bg-surface-elevated text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
