import React, { useState } from 'react';
import { Meme, ContentReport } from '../types';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  meme: Meme | null;
  onClose: () => void;
  onSubmitReport: (report: Omit<ContentReport, 'id' | 'timestamp' | 'status'>) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  meme,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ContentReport['reason']>('offensive' as any);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!meme) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      memeId: meme.id,
      memeTitle: meme.title,
      reason,
      comment,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-elevated border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-neon-lime mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-display">Report Submitted</h3>
            <p className="text-xs text-slate-400 mt-1">
              Thank you for keeping Memeverse safe. Our moderation team has queued this item for priority review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Report Content</h3>
                <p className="text-xs text-slate-400">Help maintain our humor &amp; safety standards</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 bg-surface p-2.5 rounded-xl border border-white/5 truncate">
              Reporting: <span className="font-semibold text-white">"{meme.title}"</span>
            </p>

            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-300 block">Select Reason:</label>
              {[
                { id: 'harassment', label: 'Targeted Bullying or Harassment' },
                { id: 'hateful', label: 'Hate Speech, Abuse or Real-World Harm' },
                { id: 'copyright', label: 'Copyright or Impersonation' },
                { id: 'spam', label: 'Spam, Scams or Bot Activity' },
                { id: 'other', label: 'Other Content Violation' },
              ].map((r) => (
                <label
                  key={r.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-surface hover:bg-white/5 border border-white/5 cursor-pointer text-xs text-slate-300"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="accent-primary"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Additional Context (Optional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Briefly describe what violates our guidelines..."
                rows={2}
                className="w-full bg-surface border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-surface text-slate-400 hover:text-white text-xs rounded-xl border border-white/5"
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
