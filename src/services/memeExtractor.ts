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
 * Fetch fresh dank & dark memes from public Reddit endpoints
 */
export async function fetchRedditMemes(subreddit = 'dankmemes', limit = 40): Promise<Meme[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Reddit API returned ${res.status}`);
    }

    const data = await res.json();
    const posts: RedditPostData[] = data?.data?.children?.map((c: any) => c.data) || [];

    const validMemes: Meme[] = posts
      .filter((p) => !p.is_video && isImageUrl(p.url))
      .map((p) => ({
        id: `reddit-${p.id}`,
        title: p.title,
        caption: `Via r/${subreddit} • Shared by u/${p.author}`,
        imageUrl: p.url,
        category: 'dark-humor',
        humorLevel: 5 as const,
        tags: ['darkhumor', 'dank', subreddit, 'unfiltered'],
        situation: p.title,
        language: 'English' as const,
        creator: {
          name: `u/${p.author}`,
          handle: `@${p.author}`,
          isVerified: p.ups > 5000,
        },
        stats: {
          likes: Math.max(1200, p.ups),
          shares: Math.floor(p.ups * 0.35),
          views: p.ups * 4,
          saves: Math.floor(p.ups * 0.15),
        },
        createdAt: new Date(p.created_utc * 1000).toISOString(),
        isTrending: p.ups > 10000,
        moderationStatus: 'approved' as const,
        isOriginal: false,
      }));

    return validMemes;
  } catch (error) {
    console.warn(`[MemeExtractor] Reddit fetch from r/${subreddit} failed:`, error);
    return [];
  }
}

/**
 * Fetch fresh memes using the public Meme-API (CORS-friendly mirror)
 */
export async function fetchMemeApiMemes(count = 35): Promise<Meme[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://meme-api.com/gimme/dankmemes/${count}`, {
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
      .map((m, idx) => ({
        id: `memeapi-${Date.now()}-${idx}`,
        title: m.title,
        caption: `Sourced from r/${m.subreddit} • curated for memer`,
        imageUrl: m.url,
        category: 'dark-humor',
        humorLevel: 5 as const,
        tags: ['darkhumor', m.subreddit, 'viral', 'fresh'],
        situation: m.title,
        language: 'English' as const,
        creator: {
          name: `u/${m.author || 'memer_anon'}`,
          handle: `@${m.author || 'memer_curated'}`,
          isVerified: true,
        },
        stats: {
          likes: Math.max(850, m.ups),
          shares: Math.floor(m.ups * 0.4),
          views: m.ups * 5,
          saves: Math.floor(m.ups * 0.2),
        },
        createdAt: new Date().toISOString(),
        isTrending: m.ups > 5000,
        moderationStatus: 'approved' as const,
        isOriginal: false,
      }));
  } catch (error) {
    console.warn('[MemeExtractor] Meme-API fetch failed:', error);
    return [];
  }
}

/**
 * Composite extractor: tries Reddit first, then meme-api fallback
 */
export async function extractFreshDarkMemes(): Promise<Meme[]> {
  const redditPromises = [
    fetchRedditMemes('dankmemes', 30),
    fetchRedditMemes('shitposting', 25),
  ];

  const results = await Promise.allSettled(redditPromises);
  let combined: Meme[] = [];

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.length > 0) {
      combined.push(...r.value);
    }
  }

  // If Reddit was blocked by CORS in some browsers, fallback to meme-api.com
  if (combined.length < 15) {
    const apiMemes = await fetchMemeApiMemes(35);
    combined.push(...apiMemes);
  }

  // Deduplicate by imageUrl
  const seenUrls = new Set<string>();
  return combined.filter((m) => {
    if (seenUrls.has(m.imageUrl)) return false;
    seenUrls.add(m.imageUrl);
    return true;
  });
}

