import React, { useState, useRef, useEffect } from 'react';
import { Meme } from '../types';
import { Heart, Share2, Check, Play, Pause, Volume2, VolumeX, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  playPopSound,
  playFlameSound,
  playVineBoomSound,
  playSadViolinSound,
  playPunchlineSound,
} from '../utils/audio';

interface MemeFeedCardProps {
  meme: Meme;
  isLiked: boolean;
  onToggleLike: (meme: Meme) => void;
  globalSoundEnabled?: boolean;
}

export const MemeFeedCard: React.FC<MemeFeedCardProps> = ({
  meme,
  isLiked,
  onToggleLike,
  globalSoundEnabled = true,
}) => {
  const [likeCount, setLikeCount] = useState(meme.stats.likes + (isLiked ? 1 : 0));
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Audio MP3 state - unmuted by default when globalSoundEnabled is true
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(!globalSoundEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize audio state when user toggles sound mode
  useEffect(() => {
    setIsMuted(!globalSoundEnabled);
    if (!globalSoundEnabled && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [globalSoundEnabled]);

  // HTML5 Video state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // YouTube Shorts Embed state
  const [loadEmbed, setLoadEmbed] = useState(false);

  // Reddit Video Embed state - configured for volume ON by default
  const [redditIframeLoaded, setRedditIframeLoaded] = useState(false);
  const getRedditEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes('reddit.com')) return null;
      let pathname = parsed.pathname;
      pathname = pathname.replace(/\/+$/, '') + '/';
      return `https://www.redditmedia.com${pathname}?ref_source=embed&ref=share&embed=true&theme=dark&showmedia=true&muted=0&mute=false&volume=100`;
    } catch {
      return null;
    }
  };
  const redditEmbedUrl =
    meme.sourcePlatform === 'reddit' && meme.sourceUrl ? getRedditEmbedUrl(meme.sourceUrl) : null;

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
      audio.volume = 1.0;
      audio.muted = false;
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
          .catch((err) => {
            console.warn('Audio element playback blocked, using Web Audio fallback:', err);
            // Instant synthesized Web Audio fallback
            if (meme.audioTitle?.toLowerCase().includes('boom') || meme.audioTitle?.toLowerCase().includes('drop')) {
              playVineBoomSound();
            } else if (meme.audioTitle?.toLowerCase().includes('violin') || meme.audioTitle?.toLowerCase().includes('sad')) {
              playSadViolinSound();
            } else {
              playPunchlineSound();
            }
            setIsPlayingAudio(true);
            setTimeout(() => setIsPlayingAudio(false), 2200);
          });
      }
    } else {
      // Direct Web Audio if no audioRef
      if (meme.audioTitle?.toLowerCase().includes('boom')) {
        playVineBoomSound();
      } else if (meme.audioTitle?.toLowerCase().includes('violin')) {
        playSadViolinSound();
      } else {
        playPunchlineSound();
      }
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2200);
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
    if (meme.category === 'tanmay-reacts' || meme.tags.includes('tanmaybhat')) {
      return { text: '🎬 Tanmay Reacts', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    }
    if (meme.tags.includes('samayraina')) {
      return { text: '👑 Samay Raina', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    }
    if (meme.sourceSubreddit === 'r/IndianDankMemes') {
      return { text: '🇮🇳 r/IndianDankMemes', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
    }
    if (meme.sourceSubreddit) {
      return { text: meme.sourceSubreddit, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    }
    if (meme.sourcePlatform === 'instagram') {
      return { text: '📸 Insta Reel / Meme', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' };
    }
    return { text: '🔥 Indian Dank', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
  };

  const badge = getSourceBadge();
  const ytShortUrl = meme.youtubeId ? `https://www.youtube.com/shorts/${meme.youtubeId}` : null;

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

      {/* 2. Meme Media Area (Reddit Video, YouTube Video/Short, HTML5 Video, or Image) */}
      <div className="relative w-full bg-black/60 overflow-hidden flex items-center justify-center">
        
        {/* Case 0: Reddit Video Post Embed */}
        {redditEmbedUrl ? (
          <div className="w-full bg-[#0a0a0c] flex flex-col items-center">
            {/* Top Reddit Subreddit Bar */}
            <div className="w-full px-4 py-2 bg-gradient-to-r from-orange-950/40 via-zinc-900 to-black flex items-center justify-between border-b border-orange-500/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FF4500] flex items-center justify-center text-white font-black text-[10px] shadow-sm">
                  r/
                </span>
                <span className="font-bold text-xs text-orange-400">
                  {meme.sourceSubreddit || 'Reddit Video Meme'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  {meme.creator.handle}
                </span>
              </div>
              <a
                href={meme.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4500]/20 hover:bg-[#FF4500]/30 text-orange-300 hover:text-white text-[11px] font-semibold border border-orange-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>▶ Watch on Reddit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Reddit Audio & Mobile Unmute guidance bar */}
            <div className="w-full px-4 py-2 bg-gradient-to-r from-zinc-900 via-[#151518] to-zinc-900 border-b border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-zinc-300 text-[11px] font-medium">
                  Phone Mode: <strong className="text-emerald-400 font-semibold">🔊 Volume ON</strong>
                </span>
              </div>
              {meme.audioUrl && (
                <button
                  onClick={toggleAudio}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white border-rose-400 shadow-sm shadow-rose-500/30'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 active:scale-95'
                  }`}
                  title="Play / Pause meme soundbite"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3 h-3 text-white" />
                      <span>Soundbite Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      <span>🔊 Play Soundbite</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Playable Reddit Video Embed Container */}
            <div className="relative w-full min-h-[480px] sm:min-h-[520px] bg-black flex items-center justify-center overflow-hidden">
              {!redditIframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950 pointer-events-none">
                  <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-3"></div>
                  <span className="text-xs font-semibold text-zinc-300">Loading Reddit Video...</span>
                  <span className="text-[10px] text-zinc-500 mt-1">Connecting to {meme.sourceSubreddit || 'Reddit'}</span>
                </div>
              )}

              <iframe
                src={redditEmbedUrl}
                title={meme.title}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                className="w-full h-[520px] border-0 bg-transparent relative z-10"
                scrolling="no"
                allowFullScreen
                onLoad={() => setRedditIframeLoaded(true)}
              />
            </div>
          </div>
        ) : meme.youtubeId ? (
          <div className="w-full bg-black flex flex-col items-center">
            {loadEmbed ? (
              <div className="w-full aspect-[9/16] sm:aspect-[4/3] max-h-[580px] relative bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${meme.youtubeId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
                  title={meme.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* High quality Short Thumbnail with click-to-play & direct link */
              <div
                className="relative w-full aspect-[9/16] sm:aspect-[4/3] max-h-[520px] bg-zinc-950 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
                onClick={() => setLoadEmbed(true)}
              >
                <img
                  src={meme.imageUrl || `https://i.ytimg.com/vi/${meme.youtubeId}/hqdefault.jpg`}
                  alt={meme.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                      ⚡ YouTube Short
                    </span>
                    <span className="text-[11px] text-zinc-300 font-medium bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      Tap to Play
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                      <Play className="w-8 h-8 ml-1 fill-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {meme.title}
                    </span>
                    <a
                      href={ytShortUrl || `https://www.youtube.com/watch?v=${meme.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-800/40 flex-shrink-0"
                    >
                      <span>Open Short</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
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

        {/* Minimal clean tags & source link */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {meme.tags && meme.tags.length > 0 && (
            <>
              {meme.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </>
          )}

          {meme.sourceUrl && (
            <a
              href={meme.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[10px] font-semibold text-orange-400/90 hover:text-orange-300 flex items-center gap-1 bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-800/40 transition-colors"
            >
              <span>{meme.sourceSubreddit || 'Reddit Post'}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

      </div>

    </article>
  );
};
