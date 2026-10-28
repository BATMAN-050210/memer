import React, { useState } from 'react';
import { Meme, HumorLevel, CommunitySubmission } from '../types';
import { CATEGORIES } from '../data/categories';
import { HUMOR_LEVELS } from '../data/humorLevels';
import { X, Upload, CheckCircle2, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: CommunitySubmission) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('relatable');
  const [humorLevel, setHumorLevel] = useState<HumorLevel>(2);
  const [creatorName, setCreatorName] = useState('');
  const [creatorHandle, setCreatorHandle] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !agreedToGuidelines || !title.trim()) return;

    const newSubmission: CommunitySubmission = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim(),
      imageUrl: imagePreview,
      category,
      humorLevel,
      tags: [category, `lvl${humorLevel}`, 'community'],
      creatorName: creatorName.trim() || 'Anonymous Memer',
      creatorHandle: creatorHandle.trim() || '@memeverse_user',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    onSubmit(newSubmission);
    setSubmitted(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset form
      setTitle('');
      setCaption('');
      setImagePreview(null);
      setAgreedToGuidelines(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-surface-elevated border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-14 h-14 text-neon-lime mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white font-display">Meme Submitted!</h3>
            <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto">
              Your meme has entered the community moderation queue. Once reviewed by our humor moderation team, it will appear on the global discovery feed!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Submit a Meme</h3>
                <p className="text-xs text-slate-400">Share your original humor with the Memeverse</p>
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Meme Image / Artwork:
              </label>

              {imagePreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-lg text-xs hover:bg-rose-600 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-dashed border-white/20 bg-surface hover:bg-surface-elevated cursor-pointer transition-colors text-center">
                  <ImageIcon className="w-8 h-8 text-primary" />
                  <span className="text-xs font-semibold text-slate-200">
                    Click to browse or drop meme image
                  </span>
                  <span className="text-[10px] text-slate-400">
                    PNG, JPG, WebP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>

            {/* Title & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 AM Reality Check"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface-elevated">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Caption / Punchline:
              </label>
              <textarea
                placeholder="Brief description or context behind the joke..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                className="w-full bg-surface border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Humor Level Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Humor Level (1 to 5):
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([1, 2, 3, 4, 5] as HumorLevel[]).map((lvl) => {
                  const info = HUMOR_LEVELS[lvl];
                  return (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setHumorLevel(lvl)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        humorLevel === lvl
                          ? `${info.badgeBg} ${info.badgeText} ${info.borderClass} font-bold scale-102`
                          : 'bg-surface text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <div className="text-sm">{info.emoji}</div>
                      <div className="text-[10px]">Lvl {lvl}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Creator Attribution */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Creator Name (Optional):
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Social Handle (Optional):
                </label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Guidelines Agreement */}
            <div className="p-3 rounded-xl bg-surface border border-white/5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToGuidelines}
                  onChange={(e) => setAgreedToGuidelines(e.target.checked)}
                  required
                  className="mt-0.5 accent-primary"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  I certify that this submission complies with Memeverse Community Guidelines: no hate speech, targeted harassment, exploitation, or non-consensual imagery.
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={!agreedToGuidelines || !imagePreview || !title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-glow-primary"
              >
                Submit to Moderation Queue
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-surface text-slate-400 hover:text-white text-xs rounded-xl border border-white/5"
              >
                Cancel
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
