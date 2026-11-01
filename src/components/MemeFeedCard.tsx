import React, { useState, useRef, useEffect } from 'react';
import { Meme } from '../types';
import { Heart, Share2, Check, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound, playFlameSound } from '../utils/audio';

interface MemeFeedCardProps {
  meme: Meme;
  isLiked: boolean;
  onToggleLike: (meme: Meme) => void;
}

export const MemeFeedCard: React.FC<MemeFeedCardProps> = ({
  meme,
  isLiked,
  onToggleLike,
}) => {
  const [likeCount, setLikeCount] = useState(meme.stats.likes + (isLiked ? 1 : 0));
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Audio MP3 state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // HTML5 Video state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();

    if (!audioRef.current && meme.audioUrl) {
      const audio = new Audio(meme.audioUrl);
      audio.loop = true;
      audio.onended = () => setIsPlayingAudio(false);
      audioRef.current = audio;
    }

    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlayingAudio(true))
          .catch(() => setIsPlayingAudio(false));
      }
    }
  };

  const toggleVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const triggerLike = () => {
    playPopSound();
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 600);
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { y: 0.65 },
        colors: ['#F43F5E', '#FB7185', '#FDA4AF'],
      });
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1));
    }
    onToggleLike(meme);
  };

  const handleDoubleTap = () => {
    triggerLike();
  };

  const handleShare = async () => {
    playFlameSound();
    const shareUrl = window.location.origin + window.location.pathname + `?meme=${meme.id}`;
    const shareData = {
      title: meme.title,
      text: `${meme.title}\n\n"${meme.caption}"\n\n— via memer`,
      url: shareUrl,
    };

    // Native mobile share drawer (Instagram, WhatsApp, Messages, etc.)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User dismissed share dialog
      }
    }

    // Fallback: Copy link & show toast + WhatsApp redirect if clicked
    try {
      await navigator.clipboard.writeText(`${meme.title} - ${meme.caption}\n${shareUrl}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    } catch {
      const waText = encodeURIComponent(`😂 *${meme.title}*\n\n"${meme.caption}"\n\n${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
    }
  };

  const formatLikes = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  // Badge label & colors
  const getSourceBadge = () => {
    if (meme.category === 'tanmay-reacts' || meme.youtubeId) {
      return { text: '🎬 Tanmay Reacts', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    }
    if (meme.sourceSubreddit === 'r/IndianDankMemes') {
      return { text: '🇮🇳 r/IndianDankMemes', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
    }
    if (meme.sourceSubreddit) {
      return { text: meme.sourceSubreddit, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    }
    if (meme.sourcePlatform === 'instagram') {
      return { text: '📸 Insta Meme', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' };
    }
    return { text: '🔥 Indian Dank', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
  };

  const badge = getSourceBadge();

  return (
    <article className="w-full bg-[#121215] rounded-2xl sm:rounded-3xl border border-zinc-800/80 overflow-hidden shadow-card mb-5 select-none transition-all hover:border-zinc-700/70">
      
      {/* 1. Card Header: Creator & Source Badge */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800/40 bg-zinc-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center font-bold text-xs text-zinc-100">
            {meme.creator.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-semibold text-xs sm:text-sm text-zinc-200 tracking-tight">
                {meme.creator.handle}
              </span>
              {meme.creator.isVerified && (
                <span className="text-zinc-400 text-[10px]">✓</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">{meme.creator.name}</span>
          </div>
        </div>

        {/* Channel / Source indicator */}
        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}>
          {badge.text}
        </span>
      </div>

      {/* 2. Meme Media Area (YouTube Video, HTML5 Video, or Image) */}
      <div className="relative w-full bg-black/60 overflow-hidden flex items-center justify-center">
        
        {/* Case A: YouTube Video (Tanmay Bhat Meme Reviews & Shorts) */}
        {meme.youtubeId ? (
          <div className="w-full aspect-[9/16] sm:aspect-[4/3] max-h-[580px] bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${meme.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
              title={meme.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : meme.videoUrl ? (
          /* Case B: HTML5 Video Post */
          <div
            className="relative w-full aspect-square sm:aspect-[4/3] max-h-[560px] bg-black cursor-pointer group"
            onClick={toggleVideoPlay}
            onDoubleClick={handleDoubleTap}
          >
            <video
              ref={videoRef}
              src={meme.videoUrl}
              className="w-full h-full object-contain"
              loop
              playsInline
              autoPlay
              muted={isMuted}
            />

            {/* Video Control Overlays */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={toggleVideoMute}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {!isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white">
                  <Play className="w-6 h-6 ml-0.5" />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Case C: Standard Image Meme */
          <div
            onDoubleClick={handleDoubleTap}
            className="relative w-full bg-black/40 flex items-center justify-center overflow-hidden cursor-pointer"
            style={{ minHeight: '280px', maxHeight: '560px' }}
          >
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="w-full h-auto max-h-[560px] object-contain transition-transform duration-200"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://i.imgflip.com/26am.jpg';
              }}
            />
          </div>
        )}

        {/* Double-tap Heart Burst */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 animate-heart-burst drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* 3. Audio / MP3 Bar if meme has soundbite */}
      {meme.audioUrl && (
        <div className="px-4 py-2.5 bg-zinc-900/70 border-b border-zinc-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              onClick={toggleAudio}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              }`}
              title={isPlayingAudio ? 'Pause MP3' : 'Play MP3 audio'}
            >
              {isPlayingAudio ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-zinc-200 truncate block">
                {meme.audioTitle || '🎵 Funny Audio MP3'}
              </span>
              <span className="text-[9px] text-zinc-500 block">
                {isPlayingAudio ? 'Now playing soundbite' : 'Tap to play background audio'}
              </span>
            </div>
          </div>

          {/* Equalizer animation when playing */}
          <div className="flex items-end gap-0.5 h-4 px-2">
            <span className={`w-0.5 bg-rose-400 rounded-full transition-all ${isPlayingAudio ? 'h-4 animate-pulse' : 'h-1.5'}`}></span>
            <span className={`w-0.5 bg-rose-500 rounded-full transition-all ${isPlayingAudio ? 'h-3 animate-pulse delay-75' : 'h-1'}`}></span>
            <span className={`w-0.5 bg-rose-400 rounded-full transition-all ${isPlayingAudio ? 'h-4 animate-pulse delay-150' : 'h-2'}`}></span>
            <span className={`w-0.5 bg-rose-500 rounded-full transition-all ${isPlayingAudio ? 'h-2 animate-pulse delay-100' : 'h-1.5'}`}></span>
          </div>
        </div>
      )}

      {/* 4. Controls: Clean & Clear ONLY SCROLL, LIKE, AND SHARE */}
      <div className="p-3.5 sm:p-4 bg-[#121215]">
        
        <div className="flex items-center justify-between pb-2.5">
          {/* Like Button */}
          <button
            onClick={triggerLike}
            className="flex items-center gap-2 group text-zinc-300 hover:text-white transition-colors"
            title="Like"
          >
            <div className={`p-1.5 rounded-full transition-all ${
              isLiked ? 'bg-rose-500/10 scale-110' : 'group-hover:bg-zinc-800'
            }`}>
              <Heart
                className={`w-6 h-6 transition-all ${
                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-zinc-300'
                }`}
              />
            </div>
            <span className={`text-xs font-semibold ${isLiked ? 'text-rose-400' : 'text-zinc-400'}`}>
              {formatLikes(likeCount)}
            </span>
          </button>

          {/* Share Button (triggers native mobile share or copy link) */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/50 transition-all active:scale-95"
            title="Share"
          >
            {shareToast ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* 5. Meme Content: Title & Caption */}
        <div className="space-y-1">
          <h4 className="font-bold text-sm sm:text-base text-zinc-100 leading-snug">
            {meme.title}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            {meme.caption}
          </p>
        </div>

        {/* Minimal clean tags */}
        {meme.tags && meme.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {meme.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>

    </article>
  );
};
