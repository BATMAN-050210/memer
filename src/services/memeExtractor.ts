import { Meme } from '../types';

interface RedditPostData {
  id: string;
  title: string;
  author: string;
  url: string;
  ups: number;
  num_comments: number;
  permalink: string;
  over_18: boolean;
  is_video: boolean;
  post_hint?: string;
  created_utc: number;
  media?: {
    reddit_video?: {
      fallback_url?: string;
      hls_url?: string;
      is_gif?: boolean;
    };
  };
  preview?: {
    images?: Array<{
      source?: {
        url: string;
      };
    }>;
    reddit_video_preview?: {
      fallback_url?: string;
    };
  };
}

interface MemeApiResponse {
  count: number;
  memes: Array<{
    postLink: string;
    subreddit: string;
    title: string;
    url: string;
    nsfw: boolean;
    spoiler: boolean;
    author: string;
    ups: number;
    preview: string[];
  }>;
}

// Popular iconic audio soundbites to accompany Indian dank memes
const INDIAN_DANK_SOUNDS = [
  {
    title: 'Tanmay Bhat Wheeze Laugh MP3',
    url: 'https://assets.mixkit.co/active_storage/sfx/280/280-preview.mp3',
  },
  {
    title: 'Ashneer: Yeh Sab Doglapan Hai MP3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  },
  {
    title: 'Lord Puneet Screaming Chaos MP3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
  },
  {
    title: 'Vine Boom Bass Drop MP3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  },
  {
    title: 'L Lag Gaye Emotional Violin MP3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3',
  },
  {
    title: 'Arpit Bala: Hum Pe Toh Hai Hi 9 MP3',
    url: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
  },
];

// Check if a URL looks like a direct image
function isImageUrl(url: string): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return (
    cleanUrl.endsWith('.jpg') ||
    cleanUrl.endsWith('.jpeg') ||
    cleanUrl.endsWith('.png') ||
    cleanUrl.endsWith('.webp') ||
    cleanUrl.includes('i.redd.it') ||
    cleanUrl.includes('i.imgur.com')
  );
}

/**
 * Fetch from Indian meme subreddits via Meme-API mirror (CORS-friendly, very reliable in browser)
 */
export async function fetchIndianMemeApi(subreddit: string, count = 25): Promise<Meme[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(`https://meme-api.com/gimme/${subreddit}/${count}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Meme API returned ${res.status}`);
    }

    const data: MemeApiResponse = await res.json();
    if (!data.memes || !Array.isArray(data.memes)) return [];

    return data.memes
      .filter((m) => isImageUrl(m.url))
      .map((m, idx) => {
        const sound = INDIAN_DANK_SOUNDS[(idx + m.title.length) % INDIAN_DANK_SOUNDS.length];
        const isDark = idx % 2 === 0;

        return {
          id: `idm-${m.subreddit.toLowerCase()}-${Date.now()}-${idx}`,
          title: m.title,
          caption: `Sourced from r/${m.subreddit} • Indian Dank Memes stream`,
          imageUrl: m.url,
          category: isDark ? 'indian-dank' : 'desi-relatable',
          humorLevel: (isDark ? 5 : 4) as any,
          tags: [m.subreddit.toLowerCase(), 'indiandankmemes', 'desi', 'dank'],
          situation: m.title,
          language: 'Hinglish' as const,
          sourcePlatform: 'reddit' as const,
          sourceSubreddit: `r/${m.subreddit}`,
          mediaType: idx % 3 === 0 ? 'audio' : 'image',
          audioUrl: idx % 3 === 0 ? sound.url : undefined,
          audioTitle: idx % 3 === 0 ? sound.title : undefined,
          creator: {
            name: `u/${m.author || 'dank_desi'}`,
            handle: `@${m.author || m.subreddit.toLowerCase()}`,
            isVerified: m.ups > 2000,
          },
          stats: {
            likes: Math.max(950, m.ups),
            shares: Math.floor(m.ups * 0.42),
            views: m.ups * 5,
            saves: Math.floor(m.ups * 0.18),
          },
          createdAt: new Date().toISOString(),
          isTrending: m.ups > 3500,
          moderationStatus: 'approved' as const,
          isOriginal: false,
        };
      });
  } catch (error) {
    console.warn(`[MemeExtractor] Meme-API fetch failed for ${subreddit}:`, error);
    return [];
  }
}

/**
 * Fetch direct from Reddit public endpoint (handles images AND videos)
 */
export async function fetchRedditPosts(subreddit = 'IndianDankMemes', limit = 30): Promise<Meme[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Reddit API returned ${res.status}`);

    const data = await res.json();
    const posts: RedditPostData[] = data?.data?.children?.map((c: any) => c.data) || [];

    const validMemes: Meme[] = [];

    posts.forEach((p, idx) => {
      const isVideo = p.is_video && Boolean(p.media?.reddit_video?.fallback_url);
      const videoUrl = p.media?.reddit_video?.fallback_url || p.preview?.reddit_video_preview?.fallback_url;
      const previewImg = p.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') || p.url;

      if (!isImageUrl(p.url) && !isVideo) return;

      const sound = INDIAN_DANK_SOUNDS[(idx + p.title.length) % INDIAN_DANK_SOUNDS.length];

      validMemes.push({
        id: `reddit-${p.id}`,
        title: p.title,
        caption: `Via r/${subreddit} • Shared by u/${p.author}`,
        imageUrl: isImageUrl(p.url) ? p.url : (previewImg || 'https://i.imgflip.com/26am.jpg'),
        videoUrl: isVideo ? videoUrl : undefined,
        mediaType: isVideo ? 'video' : (idx % 4 === 0 ? 'audio' : 'image'),
        audioUrl: idx % 4 === 0 ? sound.url : undefined,
        audioTitle: idx % 4 === 0 ? sound.title : undefined,
        sourcePlatform: 'reddit',
        sourceSubreddit: `r/${subreddit}`,
        category: 'indian-dank',
        humorLevel: 5 as const,
        tags: [subreddit.toLowerCase(), 'indiandankmemes', 'desimemes', 'tanmay_vibe'],
        situation: p.title,
        language: 'Hinglish',
        creator: {
          name: `u/${p.author}`,
          handle: `@${p.author}`,
          isVerified: p.ups > 3000,
        },
        stats: {
          likes: Math.max(1400, p.ups),
          shares: Math.floor(p.ups * 0.38),
          views: p.ups * 4,
          saves: Math.floor(p.ups * 0.16),
        },
        createdAt: new Date(p.created_utc * 1000).toISOString(),
        isTrending: p.ups > 8000,
        moderationStatus: 'approved',
        isOriginal: false,
      });
    });

    return validMemes;
  } catch (error) {
    console.warn(`[MemeExtractor] Reddit fetch failed for r/${subreddit}:`, error);
    return [];
  }
}

/**
 * Composite extractor focusing on Indian Dank Memes channels:
 * - r/IndianDankMemes
 * - r/desimemes
 * - r/dankinindia
 * - r/FingMemes
 */
export async function extractFreshIndianDankMemes(): Promise<Meme[]> {
  const sources = [
    // 1. Direct Reddit JSON if permitted by browser
    fetchRedditPosts('IndianDankMemes', 25),
    fetchRedditPosts('desimemes', 20),

    // 2. Meme API mirror (bypasses CORS restrictions)
    fetchIndianMemeApi('IndianDankMemes', 25),
    fetchIndianMemeApi('desimemes', 20),
    fetchIndianMemeApi('dankinindia', 15),
    fetchIndianMemeApi('FingMemes', 15),
  ];

  const results = await Promise.allSettled(sources);
  let combined: Meme[] = [];

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.length > 0) {
      combined.push(...r.value);
    }
  }

  // Deduplicate by title or media URL
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  return combined.filter((m) => {
    const keyUrl = m.videoUrl || m.imageUrl;
    const cleanTitle = m.title.toLowerCase().trim();

    if (seenUrls.has(keyUrl) || seenTitles.has(cleanTitle)) return false;
    seenUrls.add(keyUrl);
    seenTitles.add(cleanTitle);
    return true;
  });
}
