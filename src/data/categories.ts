import { MemeCategory } from '../types';

export const CATEGORIES: MemeCategory[] = [
  { id: 'all', name: 'All Humor', icon: '✨', description: 'Everything across the Memeverse', count: 36 },
  { id: 'relatable', name: 'Relatable Life', icon: '🫠', description: 'Real struggles you pretend you did not do', count: 24 },
  { id: 'school-exams', name: 'School & Exams', icon: '📚', description: 'One night syllabus completion tactics', count: 18 },
  { id: 'friends-chat', name: 'Friends & Group Chats', icon: '💬', description: 'Roasts, ghosting & inside jokes', count: 22 },
  { id: 'relationships', name: 'Relationships', icon: '💘', description: 'Modern dating, crush panics & heartbreaks', count: 15 },
  { id: 'gaming', name: 'Gaming', icon: '🎮', description: 'Lag excuses, rage quits & 3 AM lobbies', count: 16 },
  { id: 'cricket-sports', name: 'Cricket & Sports', icon: '🏏', description: 'Super overs, umpire blind jokes & heart attacks', count: 14 },
  { id: 'indian-internet', name: 'Indian Internet', icon: '🪔', description: 'Desi uncle WhatsApp forwards & relatable quirks', count: 28 },
  { id: 'family-chaos', name: 'Family Chaos', icon: '🏠', description: 'Rishtedaar questions & remote battles', count: 19 },
  { id: 'work-adulting', name: 'Work & Adulting', icon: '💼', description: 'Pretending to work while staring at Excel', count: 21 },
  { id: 'savage-roasts', name: 'Savage Roasts', icon: '🔥', description: 'Pure unadulterated emotional damage', count: 17 },
  { id: 'dark-humor', name: 'Dark Humor', icon: '💀', description: 'Morbid giggles & existential dread', count: 12 },
  { id: 'wholesome', name: 'Wholesome Memes', icon: '🌱', description: 'Warm hugs in pixel format', count: 14 },
  { id: 'reaction-memes', name: 'Reaction Memes', icon: '🎭', description: 'Perfect comebacks to drop in chat', count: 20 },
  { id: 'festival-memes', name: 'Festival Chaos', icon: '🎆', description: 'Diwali sweets drama & soan papdi cycle', count: 15 },
  { id: 'random-chaos', name: 'Random Chaos', icon: '🌀', description: 'Zero context, maximum brain tickle', count: 13 },
];

export const TRENDING_TAGS = [
  { tag: '#SoanPapdiRecycle', label: 'Soan Papdi Season', count: '142k' },
  { tag: '#SurpriseTestPanic', label: 'Syllabus Outside Syllabus', count: '98k' },
  { tag: '#CricketHeartbreak', label: 'Last Ball Drama', count: '87k' },
  { tag: '#WFHReality', label: 'Camera Off Life', count: '74k' },
  { tag: '#GroupChatSilent', label: 'Left On Read', count: '65k' },
  { tag: '#OverthinkingAt3AM', label: '3 AM Brain Radio', count: '110k' },
  { tag: '#DiwaliCleanup', label: 'Ghar Ki Safai PTSD', count: '91k' },
  { tag: '#SalaryCreditAlert', label: 'Broke in 48 Hours', count: '82k' },
];
