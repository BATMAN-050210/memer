export interface FestivalGreetingFormula {
  occasion: string;
  humorStyle: string;
  language: string;
  recipient: string;
  title: string;
  greeting: string;
  subtext: string;
  theme: string;
  badge: string;
}

export const FESTIVAL_OPTIONS = {
  occasions: [
    { id: 'diwali', label: 'Diwali Chaos', emoji: '🪔', color: 'from-amber-500 to-orange-600' },
    { id: 'birthday', label: 'Birthday Roast', emoji: '🎂', color: 'from-pink-500 to-rose-600' },
    { id: 'exams', label: 'Exam Survival', emoji: '📚', color: 'from-blue-500 to-indigo-600' },
    { id: 'newyear', label: 'New Year Delusions', emoji: '🎉', color: 'from-purple-500 to-violet-600' },
    { id: 'cricket', label: 'Match Day Fever', emoji: '🏏', color: 'from-cyan-500 to-blue-600' },
    { id: 'holi', label: 'Holi Shenanigans', emoji: '🎨', color: 'from-emerald-500 to-teal-600' },
  ],
  humorStyles: [
    { id: 'savage', label: 'Savage & Spicy', emoji: '🔥', desc: 'Emotional damage wrapped in festive lights' },
    { id: 'relatable', label: 'Relatable Desi', emoji: '🫠', desc: 'Soan papdi recycling, rishtedaar audits & cleaning' },
    { id: 'wholesome', label: 'Sweet & Wholesome', emoji: '🌱', desc: 'Genuinely nice, safe for family groups' },
    { id: 'chaotic', label: 'Unhinged Chaos', emoji: '🌀', desc: 'Absurd energy and midnight brainrot' },
    { id: 'dark', label: 'Dark Satire', emoji: '💀', desc: 'Existential greetings for the nihilist squad' },
  ],
  languages: [
    { id: 'Hinglish', label: 'Hinglish (Chat Native)', badge: '🔥 Popular' },
    { id: 'English', label: 'English', badge: 'Global' },
    { id: 'Hindi', label: 'Hindi (शुद्ध देसी)', badge: 'Classic' },
  ],
  recipients: [
    { id: 'bestie', label: 'Best Friend / Chaddi Buddy', emoji: '🫂' },
    { id: 'sibling', label: 'Sibling (Mithai Thief)', emoji: '🥊' },
    { id: 'family', label: 'Family WhatsApp Group', emoji: '👨‍👩‍👧‍👦' },
    { id: 'colleague', label: 'Work Colleague / Boss', emoji: '💼' },
    { id: 'crush', label: 'Crush / Partner', emoji: '💘' },
    { id: 'general', label: 'General Internet / Status', emoji: '🌐' },
  ],
  cardThemes: [
    { id: 'midnight-gold', name: 'Royal Gold & Charcoal', bgGradient: 'linear-gradient(135deg, #18181B 0%, #2E1065 50%, #78350F 100%)', textColor: '#FDE68A', accent: '#F59E0B' },
    { id: 'neon-cyber', name: 'Cyber Diwali Glow', bgGradient: 'linear-gradient(135deg, #090D16 0%, #3B0764 50%, #064E3B 100%)', textColor: '#A7F3D0', accent: '#10B981' },
    { id: 'spicy-pataka', name: 'Spicy Pataka Red', bgGradient: 'linear-gradient(135deg, #450A0A 0%, #881337 50%, #7F1D1D 100%)', textColor: '#FECDD3', accent: '#F43F5E' },
    { id: 'cosmic-purple', name: 'Cosmic Electric', bgGradient: 'linear-gradient(135deg, #0F172A 0%, #4C1D95 50%, #1E1B4B 100%)', textColor: '#E9D5FF', accent: '#A855F7' },
  ]
};

// Generator rules that dynamically craft hilarious, contextual greetings based on choices
export function generateFestivalGreetings(
  occasion: string,
  humorStyle: string,
  language: string,
  recipient: string,
  recipientName?: string
): Array<{ id: string; greeting: string; subtext: string; badge: string }> {
  const nameStr = recipientName && recipientName.trim() ? recipientName.trim() : recipient === 'sibling' ? 'Bhai/Behen' : recipient === 'bestie' ? 'Yaar' : recipient === 'colleague' ? 'Team' : recipient === 'family' ? 'Family' : 'Friend';

  const bank: Record<string, Record<string, Array<{ greeting: string; subtext: string; badge: string }>>> = {
    diwali: {
      savage: [
        {
          greeting: `Happy Diwali ${nameStr}! May your life be as bright as the phone screen you stare at for 16 hours a day.`,
          subtext: "Remember: Don't open the Soan Papdi box, you'll need to pass it to Sharma Ji tomorrow.",
          badge: "🔥 Maximum Burn"
        },
        {
          greeting: `Wishing you a Diwali full of lights, sweets, and zero relatives interrogating your career choices!`,
          subtext: "If someone asks for your package, tell them it's under NDA just like your common sense.",
          badge: "💥 Rishtedaar Shield"
        },
        {
          greeting: `Happy Diwali ${nameStr}! May your problems disappear faster than the Kaju Katli in our house.`,
          subtext: "Sending you virtual mithai because real dry fruits cost more than my monthly stipend.",
          badge: "🍬 Sweet Roast"
        },
        {
          greeting: `Diwali Mubarak! May the goddess of wealth bless you so you finally clear your Google Pay split bill.`,
          subtext: "I haven't forgotten that ₹240 from March 2023. Laxmi ji is watching.",
          badge: "💸 Splitwise Alert"
        }
      ],
      relatable: [
        {
          greeting: `Happy Diwali ${nameStr}! In the grand tradition of Indian festivals, here is my annual pre-packaged greeting.`,
          subtext: "Safai done, lights tangled, Soan Papdi circulating, and 45 duplicate WhatsApp stickers received.",
          badge: "🪔 Desi Classic"
        },
        {
          greeting: `May your Diwali be full of sparklers, peaceful group chats, and untangled fairy lights!`,
          subtext: "May mom never inspect the microscopic dust behind your almirah ever again.",
          badge: "🧹 Safai PTSD"
        },
        {
          greeting: `Happy Diwali! May this festival bring you good health, happiness, and zero unwanted forward messages.`,
          subtext: "And if you receive a yellow tin box, accept your fate and pass it to the neighbors.",
          badge: "🔁 The Papdi Protocol"
        }
      ],
      wholesome: [
        {
          greeting: `Wishing you and your lovely family a very Happy & Blessed Diwali, ${nameStr}!`,
          subtext: "May the divine lights illuminate your path with infinite success, laughter, and warm memories.",
          badge: "✨ Pure Warmth"
        },
        {
          greeting: `Happy Diwali! May your home be filled with glowing diyas, sweet laughter, and cherished moments.`,
          subtext: "Grateful to have someone as genuine and supportive as you in my life. Have a wonderful celebration!",
          badge: "💖 Heartfelt"
        }
      ],
      chaotic: [
        {
          greeting: `HAPPY DIWALI! BLAST OFF LIKE A ROCKET THAT LOST ITS TRAJECTORY AND HIT THE NEIGHBOR'S BALCONY!`,
          subtext: "Consume 4 kilograms of laddoos with zero remorse. Calorie count starts next century.",
          badge: "🚀 Orbit Mode"
        },
        {
          greeting: `Happy Diwali! May your energy remain high and your battery stay at 100% while dodging family conversations!`,
          subtext: "Wear your shiny kurta, eat every sweet within arm reach, and vanish into your room.",
          badge: "🌀 Phantom Move"
        }
      ],
      dark: [
        {
          greeting: `Happy Diwali! May the festival of lights momentarily distract you from the eternal darkness of adulting.`,
          subtext: "Enjoy the 2-day holiday before the corporate machine reminds you that deadlines wait for no one.",
          badge: "💀 Reality Check"
        },
        {
          greeting: `Wishing you a festive season where the fireworks are loud enough to drown out your internal monologue.`,
          subtext: "At least the sweets are real even if our five-year plans are completely imaginary.",
          badge: "☕ Existential Glow"
        }
      ]
    },
    birthday: {
      savage: [
        {
          greeting: `Happy Birthday ${nameStr}! Congratulations on surviving another 365 days without making national news.`,
          subtext: "You are now one year closer to complaining about lower back pain and grocery prices.",
          badge: "🎂 Age Burn"
        },
        {
          greeting: `Happy Birthday! I was going to buy you an expensive gift, but being friends with me is already a blessing.`,
          subtext: "You're welcome. Treat me to cake immediately.",
          badge: "🎁 Ego Gift"
        },
        {
          greeting: `Happy Birthday to someone who is smart, funny, and attractive... from someone with all three!`,
          subtext: "Age is just a number, but in your case, it is a surprisingly high number.",
          badge: "🔥 Classic Roast"
        }
      ],
      wholesome: [
        {
          greeting: `Happy Birthday ${nameStr}! Wishing you a year ahead filled with magic, breakthroughs, and pure joy.`,
          subtext: "Thank you for being such an incredible human being. The world is brighter with you in it!",
          badge: "🌟 Pure Sunshine"
        }
      ],
      relatable: [
        {
          greeting: `Happy Birthday! May your day be filled with cake and not an avalanche of awkward phone calls from distant relatives.`,
          subtext: "May you successfully reply to 80 WhatsApp messages with 'Thank you so much! 🙏' without losing your mind.",
          badge: "📱 Phone Call Panic"
        }
      ]
    },
    exams: {
      savage: [
        {
          greeting: `Best of luck for exams ${nameStr}! May your guessing skills on MCQ questions defy the laws of probability.`,
          subtext: "Remember: When in doubt, option 'C' has historically carried humanity on its back.",
          badge: "📝 MCQ Gamble"
        },
        {
          greeting: `Sending thoughts and prayers to your brain cells trying to digest 6 months of syllabus in 4 hours.`,
          subtext: "If you don't know the answer, write the question in 3 different handwriting styles.",
          badge: "📚 All-Nighter Panic"
        }
      ],
      relatable: [
        {
          greeting: `Hang in there ${nameStr}! The exam is just 3 hours, but freedom and sleep last... until the results come out.`,
          subtext: "Eat chocolate, drink chai, and trust the 3 AM YouTube tutorial guy with the Indian accent.",
          badge: "☕ Chai Power"
        }
      ]
    },
    newyear: {
      savage: [
        {
          greeting: `Happy New Year ${nameStr}! May your gym membership last longer than your 2024 resolutions.`,
          subtext: "New Year, Same Us making the exact same questionable decisions in higher definition.",
          badge: "🎉 Resolution Roast"
        }
      ],
      relatable: [
        {
          greeting: `Happy New Year! Excited to write the wrong year on all my documents for the next 4 months.`,
          subtext: "May this year bring more answered prayers and fewer awkward Zoom meetings.",
          badge: "🗓️ Calendar Glitch"
        }
      ]
    }
  };

  const styleMap = bank[occasion] || bank['diwali'];
  const items = styleMap[humorStyle] || styleMap['savage'] || bank['diwali']['savage'];

  // Add Hinglish / Hindi touch if selected
  return items.map((item, idx) => {
    let modifiedGreeting = item.greeting;
    let modifiedSubtext = item.subtext;

    if (language === 'Hinglish') {
      if (occasion === 'diwali') {
        modifiedGreeting = modifiedGreeting.replace('Happy Diwali', 'Diwali ki hardik shubhkamnayein aur full maza');
      } else if (occasion === 'birthday') {
        modifiedGreeting = modifiedGreeting.replace('Happy Birthday', 'Janamdin Mubarak mere bhai');
      }
    } else if (language === 'Hindi') {
      if (occasion === 'diwali') {
        modifiedGreeting = `दीपावली की हार्दिक शुभकामनाएँ ${nameStr}! आपके जीवन में सुख, शांति और ढेर सारी मिठाइयाँ हमेशा बनी रहें।`;
        modifiedSubtext = "रिश्तेदारों के अजीब सवालों और सोन पापड़ी के चक्कर से दूर, मस्त त्यौहार मनाओ!";
      }
    }

    return {
      id: `gen-${occasion}-${humorStyle}-${idx}`,
      greeting: modifiedGreeting,
      subtext: modifiedSubtext,
      badge: item.badge
    };
  });
}
