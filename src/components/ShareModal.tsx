import React, { useState } from 'react';
import { Meme } from '../types';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  MessageCircle, 
  Send, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  meme: Meme | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ meme, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!meme) return null;

  const currentUrl = window.location.href.split('?')[0] + `?meme=${meme.id}`;
  const shareText = `😂 *${meme.title}*\n\n"${meme.caption}"\n\nDiscovered on Memeverse: ${currentUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(`${meme.caption}\n— Via Memeverse`);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meme.title,
          text: meme.caption,
          url: currentUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = meme.imageUrl;
    a.download = `memeverse-${meme.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-elevated border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Send the Damage
            </h3>
            <p className="text-xs text-slate-400">
              Share to your squad or group chat
            </p>
          </div>
        </div>

        {/* Meme Preview Mini Card */}
        <div className="bg-surface rounded-xl p-3 border border-white/5 flex gap-3 items-center mb-5">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{meme.title}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{meme.caption}</p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct Share Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to WhatsApp / Group Chat</span>
          </a>

          {/* Web Share API (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Native Device Share Sheet</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/10 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-neon-lime" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Meme Link'}</span>
            </button>

            {/* Download Image */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </button>
          </div>

          {/* Copy Caption Only */}
          <button
            onClick={handleCopyCaption}
            className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copiedCaption ? '✓ Caption copied to clipboard' : 'Copy caption text only'}
          </button>
        </div>

      </div>
    </div>
  );
};
