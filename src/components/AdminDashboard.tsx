import React, { useState } from 'react';
import { Meme, CommunitySubmission, ContentReport } from '../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Flame, 
  Trash2, 
  Plus, 
  Eye, 
  AlertTriangle, 
  BarChart3, 
  Sparkles,
  Layers,
  Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  memes: Meme[];
  submissions: CommunitySubmission[];
  reports: ContentReport[];
  onApproveSubmission: (submission: CommunitySubmission) => void;
  onRejectSubmission: (submissionId: string) => void;
  onDeleteMeme: (memeId: string) => void;
  onToggleFeatureMeme: (memeId: string) => void;
  onResolveReport: (reportId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  memes,
  submissions,
  reports,
  onApproveSubmission,
  onRejectSubmission,
  onDeleteMeme,
  onToggleFeatureMeme,
  onResolveReport,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'submissions' | 'memes' | 'reports' | 'stats'>('submissions');

  const totalLikes = memes.reduce((acc, m) => acc + m.stats.likes, 0);
  const totalShares = memes.reduce((acc, m) => acc + m.stats.shares, 0);
  const totalViews = memes.reduce((acc, m) => acc + m.stats.views, 0);

  return (
    <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              Memeverse Admin &amp; Moderation
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Community moderation queue, content rights, feed curation &amp; platform metrics
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('submissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'submissions'
                ? 'bg-primary text-white shadow-glow-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Submissions</span>
            {submissions.length > 0 && (
              <span className="bg-neon-lime text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {submissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('memes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'memes'
                ? 'bg-primary text-white shadow-glow-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Active Feed ({memes.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'reports'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Reports</span>
            {reports.filter(r => r.status === 'open').length > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {reports.filter(r => r.status === 'open').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'stats'
                ? 'bg-primary text-white shadow-glow-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Metrics</span>
          </button>
        </div>
      </div>

      {/* 1. Submissions Tab */}
      {activeAdminTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Community Submissions Waiting for Approval ({submissions.length})
            </h3>
            <span className="text-xs text-slate-400">
              Approved memes immediately go live in the discovery feed
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-surface-card rounded-2xl p-10 text-center border border-white/5">
              <Check className="w-10 h-10 text-neon-lime mx-auto mb-2" />
              <p className="text-sm font-bold text-white">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">
                There are no pending submissions in the moderation queue right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-surface-card rounded-2xl border border-white/10 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-white/5">
                      <img
                        src={sub.imageUrl}
                        alt={sub.title}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 text-[10px] font-bold">
                        Lvl {sub.humorLevel}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{sub.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sub.caption}</p>

                    <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>By {sub.creatorName}</span>
                      <span>{sub.creatorHandle}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => {
                        onApproveSubmission(sub);
                        confetti({ particleCount: 20, spread: 40 });
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve &amp; Publish</span>
                    </button>

                    <button
                      onClick={() => onRejectSubmission(sub.id)}
                      className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Active Memes Management */}
      {activeAdminTab === 'memes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Active Memes on Platform ({memes.length})
            </h3>
            <span className="text-xs text-slate-400">
              Manage featured pins, trending status, and deletions
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-card">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface/80 text-slate-400 uppercase font-bold text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Meme</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Engagement</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {memes.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-4 flex items-center gap-2.5">
                      <img
                        src={m.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate max-w-[200px]">{m.title}</span>
                        <span className="text-[10px] text-slate-400">{m.creator.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-primary-light">
                      Lvl {m.humorLevel}
                    </td>
                    <td className="py-2.5 px-4 capitalize">
                      {m.category.replace('-', ' ')}
                    </td>
                    <td className="py-2.5 px-4">
                      <span>{(m.stats.likes / 1000).toFixed(1)}k likes</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => onToggleFeatureMeme(m.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.isTrending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-surface text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {m.isTrending ? '★ Featured' : 'Feature'}
                      </button>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteMeme(m.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove meme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Reports Queue */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Community Content Reports ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <div className="bg-surface-card rounded-2xl p-10 text-center border border-white/5">
              <Check className="w-10 h-10 text-neon-lime mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Zero Flagged Reports</p>
              <p className="text-xs text-slate-400 mt-1">
                The community is clean and in accordance with guidelines!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    rep.status === 'open'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-surface border-white/5 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Meme: "{rep.memeTitle}"</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase">
                        Reason: {rep.reason}
                      </span>
                    </div>
                    {rep.comment && (
                      <p className="text-xs text-slate-300 mt-1 italic">
                        User note: "{rep.comment}"
                      </p>
                    )}
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Reported on {new Date(rep.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === 'open' ? (
                      <>
                        <button
                          onClick={() => {
                            onDeleteMeme(rep.memeId);
                            onResolveReport(rep.id);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
                        >
                          Remove Meme &amp; Resolve
                        </button>
                        <button
                          onClick={() => onResolveReport(rep.id)}
                          className="px-3 py-1.5 bg-surface text-slate-300 hover:text-white text-xs rounded-xl border border-white/10"
                        >
                          Dismiss Flag
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-neon-lime font-bold">Resolved ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Platform Analytics & Metrics */}
      {activeAdminTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-card p-5 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Memes</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
                {memes.length}
              </span>
              <span className="text-[10px] text-neon-limeBright font-medium mt-1 block">
                +100% active catalog
              </span>
            </div>

            <div className="bg-surface-card p-5 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Impressions</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
                {(totalViews / 1000).toFixed(0)}k
              </span>
              <span className="text-[10px] text-purple-400 font-medium mt-1 block">
                Verified organic views
              </span>
            </div>

            <div className="bg-surface-card p-5 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Likes</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
                {(totalLikes / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-rose-400 font-medium mt-1 block">
                Positive reactions
              </span>
            </div>

            <div className="bg-surface-card p-5 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Shares</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
                {(totalShares / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-amber-400 font-medium mt-1 block">
                WhatsApp &amp; Web Share
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
