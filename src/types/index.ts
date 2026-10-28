export type HumorLevel = 1 | 2 | 3 | 4 | 5;

export interface HumorLevelInfo {
  level: HumorLevel;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  emoji: string;
}

export interface MemeCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface MemeCreatorInfo {
  name: string;
  handle: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface MemeStats {
  likes: number;
  shares: number;
  views: number;
  saves: number;
}

export interface Meme {
  id: string;
  title: string;
  caption: string;
  topText?: string;
  bottomText?: string;
  imageUrl: string;
  category: string;
  humorLevel: HumorLevel;
  tags: string[];
  situation: string; // Used for conversational & natural-language search
  language: 'English' | 'Hinglish' | 'Hindi';
  creator: MemeCreatorInfo;
  stats: MemeStats;
  createdAt: string;
  isTrending?: boolean;
  isFestival?: boolean;
  festivalType?: 'diwali' | 'holi' | 'newyear' | 'exams' | 'birthday' | 'cricket';
  moderationStatus: 'approved' | 'pending' | 'rejected';
  isOriginal?: boolean;
}

export interface FestivalGreetingTemplate {
  id: string;
  occasion: 'diwali' | 'holi' | 'newyear' | 'exams' | 'birthday' | 'cricket';
  humorStyle: 'wholesome' | 'savage' | 'chaotic' | 'relatable' | 'dark';
  language: 'English' | 'Hinglish' | 'Hindi';
  recipient: 'friend' | 'bestie' | 'sibling' | 'family' | 'crush' | 'colleague';
  greeting: string;
  subtext: string;
  theme: string;
  badge: string;
}

export interface CommunitySubmission {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  humorLevel: HumorLevel;
  tags: string[];
  creatorName: string;
  creatorHandle: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ContentReport {
  id: string;
  memeId: string;
  memeTitle: string;
  reason: 'hateful' | 'harassment' | 'copyright' | 'spam' | 'other';
  comment?: string;
  timestamp: string;
  status: 'open' | 'resolved';
}
