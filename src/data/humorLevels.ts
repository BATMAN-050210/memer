import { HumorLevel, HumorLevelInfo } from '../types';

export const HUMOR_LEVELS: Record<HumorLevel, HumorLevelInfo> = {
  1: {
    level: 1,
    name: 'Wholesome',
    tagline: 'Feel-good & Harmless',
    description: 'Friendly jokes, cute moments, uplifting giggles, and safe-for-family laughs.',
    accentColor: '#10B981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/60',
    emoji: '🌱',
  },
  2: {
    level: 2,
    name: 'Relatable',
    tagline: 'Everyday Struggles & Awkward Truths',
    description: 'School panics, adulting fails, group chat silence, and observational life comedy.',
    accentColor: '#06B6D4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-400',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500/60',
    emoji: '🫠',
  },
  3: {
    level: 3,
    name: 'Savage',
    tagline: 'Playful Roasts & Sharp Comebacks',
    description: 'Spicy sarcasm, friendship roasts, reality checks, and emotional damage.',
    accentColor: '#F59E0B', // Amber
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    borderClass: 'border-amber-500/30 hover:border-amber-500/60',
    emoji: '🔥',
  },
  4: {
    level: 4,
    name: 'Chaotic',
    tagline: 'Absurd & Intentionally Unhinged',
    description: 'Surreal brainrot, sudden plot twists, midnight energy, and zero-context humor.',
    accentColor: '#EC4899', // Hot Pink
    glowColor: 'rgba(236, 72, 153, 0.4)',
    badgeBg: 'bg-pink-500/15',
    badgeText: 'text-pink-400',
    borderClass: 'border-pink-500/30 hover:border-pink-500/60',
    emoji: '🌀',
  },
  5: {
    level: 5,
    name: 'Dark Humor',
    tagline: 'Morbid Irony & Bleak Satire',
    description: 'Existential dread, cynical truths, edgy wit, and morbid giggles for twisted minds.',
    accentColor: '#8B5CF6', // Electric Purple
    glowColor: 'rgba(139, 92, 246, 0.4)',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    borderClass: 'border-purple-500/40 hover:border-purple-500/70',
    emoji: '💀',
  },
};
