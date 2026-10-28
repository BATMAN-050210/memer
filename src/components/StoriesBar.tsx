import React from 'react';
import { playPopSound } from '../utils/audio';

export interface StoryCategory {
  id: string;
  name: string;
  avatar: string;
  ringClass: string;
  badge?: string;
}

export const STORIES: StoryCategory[] = [
  { id: 'diwali', name: '🪔 Diwali 2024', avatar: 'https://i.imgflip.com/1g8my4.jpg', ringClass: 'story-ring-diwali', badge: 'HOT' },
  { id: 'dark', name: '💀 Dark Room', avatar: 'https://i.imgflip.com/2gnnjh.jpg', ringClass: 'story-ring-dark', badge: 'DEGEN' },
  { id: 'all', name: '🔥 All Viral', avatar: 'https://i.imgflip.com/2fm6x0.jpg', ringClass: 'story-ring-active' },
  { id: 'school-exams', name: '📚 Exams PTSD', avatar: 'https://i.imgflip.com/9ehk.jpg', ringClass: 'story-ring-active' },
  { id: 'cricket-sports', name: '🏏 Cricket Pain', avatar: 'https://i.imgflip.com/1c1uej.jpg', ringClass: 'story-ring-active' },
  { id: 'work-adulting', name: '💼 Corporate', avatar: 'https://i.imgflip.com/43a45p.png', ringClass: 'story-ring-active' },
  { id: 'savage-roasts', name: '💥 Savage Roasts', avatar: 'https://i.imgflip.com/26am.jpg', ringClass: 'story-ring-active' },
  { id: 'friends-chat', name: '💬 Group Chat', avatar: 'https://i.imgflip.com/1otk96.jpg', ringClass: 'story-ring-active' },
];

interface StoriesBarProps {
  activeStoryId: string;
  onSelectStory: (storyId: string) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  activeStoryId,
  onSelectStory,
}) => {
  return (
    <div className="w-full bg-surface/70 border-b border-white/5 py-3 px-3 sm:px-4">
      <div className="max-w-lg mx-auto flex items-center gap-3 overflow-x-auto hide-scrollbar">
        {STORIES.map((s) => {
          const isSelected = activeStoryId === s.id;

          return (
            <button
              key={s.id}
              onClick={() => {
                playPopSound();
                onSelectStory(s.id);
              }}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
            >
              {/* Outer Ring */}
              <div
                className={`relative rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  s.ringClass
                } ${isSelected ? 'ring-2 ring-brand-yellow ring-offset-2 ring-offset-background' : ''}`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background p-0.5 overflow-hidden flex items-center justify-center">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {s.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand-yellow text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-sm">
                    {s.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <span
                className={`text-[11px] mt-1.5 font-bold truncate max-w-[70px] ${
                  isSelected ? 'text-brand-yellow font-extrabold' : 'text-slate-300 group-hover:text-white'
                }`}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
