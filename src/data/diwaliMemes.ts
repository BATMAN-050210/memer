export interface DarkDiwaliGreeting {
  id: string;
  title: string;
  targetVictim: 'Sibling' | 'Rishtedaar' | 'Homies' | 'Corporate Boss' | 'Delhi Bros' | 'Crush' | 'Group Chat';
  tone: 'Pitch Black' | 'Savage Roast' | 'Desi Relatable' | 'Passive Aggressive' | 'Pure Chaos';
  whatsappText: string;
  punchline: string;
  imageUrl: string;
  tags: string[];
  likes: number;
}

export const DIWALI_DARK_GREETINGS: DarkDiwaliGreeting[] = [
  {
    id: 'diwali-1',
    title: 'The Soan Papdi Biohazard Relay',
    targetVictim: 'Homies',
    tone: 'Savage Roast',
    whatsappText: '🪔 *Bhai Happy Diwali!* 🪔\n\nEk humble request hai: Jo Soan Papdi ka box maine tumhe pichle saal diya tha, please galti se wapas mere ghar mat bhej dena.\n\n_— Tracking your address on GPS so you don’t pull a reverse uno._',
    punchline: 'The same yellow tin box has attended 14 family reunions since 2019.',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg', // Distracted Boyfriend
    tags: ['soanpapdi', 'relatives', 'mithai', 'diwali2024'],
    likes: 42100,
  },
  {
    id: 'diwali-2',
    title: 'Sharma Ji Ka Package Interrogation',
    targetVictim: 'Rishtedaar',
    tone: 'Passive Aggressive',
    whatsappText: '🪔 *Shubh Deepavali Sharma Ji!* 🪔\n\nAapko aur aapki family ko Diwali ki hardik shubhkamnayein! \n\nI hope iss saal Lakshmi Ji aapke ghar itna dhyan dein ki aapko meri salary, CTC aur shaadi ke baare mein sochte rehne ki fursat na mile.\n\n_Kaju Katli khaao, BP control mein rakho! 🙏_',
    punchline: 'Uncle ate 12 kaju katlis and asked why I haven’t bought a 3BHK yet.',
    imageUrl: 'https://i.imgflip.com/1c1uej.jpg', // Sarim Akhtar disappointed fan
    tags: ['rishtedaar', 'salary', 'interrogation', 'familychaos'],
    likes: 56900,
  },
  {
    id: 'diwali-3',
    title: 'Corporate Diwali Bonus Disrespect',
    targetVictim: 'Corporate Boss',
    tone: 'Pitch Black',
    whatsappText: '💼 *Happy Diwali to the Management!* 💼\n\nThank you so much for the world-class Diwali gift: a box with 4 almonds, 2 raisins, and a ₹100 coupon valid on purchases above ₹10,000.\n\n_80-hour work week dedication rewarded in full. May HR find inner peace._',
    punchline: 'The packaging of the gift box cost more than the dry fruits inside.',
    imageUrl: 'https://i.imgflip.com/4acd7j.png', // Trade Offer: You receive 5 almonds, I receive your soul
    tags: ['corporate', 'bonus', 'wfh', 'overtime'],
    likes: 68300,
  },
  {
    id: 'diwali-4',
    title: 'Delhi AQI 999 Breathing Challenge',
    targetVictim: 'Delhi Bros',
    tone: 'Pure Chaos',
    whatsappText: '🌫️ *Happy Diwali to my Delhi Homies!* 🌫️\n\nPatake phodo ya mat phodo, lungs to waise bhi black charcoal ho chuke hain. \n\nStay safe inside, inhale the rich vintage air of 999 AQI, and may your air purifier survive the night!\n\n_Mask up, lungs down._',
    punchline: 'Smoking 40 cigarettes a day is actually cleaner than opening a window in NCR.',
    imageUrl: 'https://i.imgflip.com/26am.jpg', // Disaster Girl
    tags: ['delhi', 'aqi', 'pollution', 'pataka'],
    likes: 71200,
  },
  {
    id: 'diwali-5',
    title: 'The Google Pay Debt Recovery Diwali',
    targetVictim: 'Homies',
    tone: 'Pitch Black',
    whatsappText: '🪔 *Diwali Mubarak Yaar!* 🪔\n\nDiwali is all about spreading wealth, clearing old sins, and bringing prosperity.\n\nSo before you light up diyas, please clear that ₹340 pending on Splitwise from March 2023. Lakshmi Mata is watching you dodge my UPI ID.\n\n_GPay number same hai, sharam karo!_',
    punchline: 'Laxmi ji will enter your home faster once you clear your pending dues.',
    imageUrl: 'https://i.imgflip.com/3lmzyx.jpg', // Bernie: I am once again asking
    tags: ['splitwise', 'gpay', 'broke', 'friends'],
    likes: 38400,
  },
  {
    id: 'diwali-6',
    title: 'Ghar Ki Safai PTSD (Mom Mode)',
    targetVictim: 'Sibling',
    tone: 'Desi Relatable',
    whatsappText: '🧹 *Happy Diwali Partner in Crime!* 🧹\n\nSurviving mom waking us up at 6:00 AM with a broom, Colin bottle, and threatening to disown anyone who leaves dust on the fan.\n\n_You clean the top shelves, I will hide under the blanket and pretend to study._',
    punchline: 'Mom cleaning behind the fridge that hasn’t moved since the Harappan civilization.',
    imageUrl: 'https://i.imgflip.com/9ehk.jpg', // Panicked SpongeBob
    tags: ['safai', 'mom', 'desi', 'cleaning'],
    likes: 49500,
  },
  {
    id: 'diwali-7',
    title: 'Annual Ghost Friend Awakening',
    targetVictim: 'Group Chat',
    tone: 'Savage Roast',
    whatsappText: '👻 *Look who rose from the dead!* 👻\n\nHappy Diwali to the friends who left me on read for 11 months, ignored all Goa plans, but suddenly send a 4K glowing flower sticker today.\n\n_Love you too, see you next Diwali!_',
    punchline: 'Only texts you on Diwali and when they need a referral at your company.',
    imageUrl: 'https://i.imgflip.com/2fm6x0.jpg', // Leonardo DiCaprio Cheers
    tags: ['ghosted', 'groupchat', 'whatsappforwards'],
    likes: 53100,
  },
  {
    id: 'diwali-8',
    title: 'Crush Left On Read (Festive Edition)',
    targetVictim: 'Crush',
    tone: 'Pitch Black',
    whatsappText: '✨ *Happy Diwali to the one who glows bright!* ✨\n\nMay your notifications be as full as your excuses for taking 3 business days to reply to my texts.\n\n_Have a sparkling Diwali with someone else I guess! 🫡_',
    punchline: 'She replied with "Same to you" after 36 hours. Emotional damage 100%.',
    imageUrl: 'https://i.imgflip.com/2gnnjh.jpg', // Crying Cat Thumbs Up
    tags: ['crush', 'leftonread', 'heartbreak', 'singlelife'],
    likes: 62400,
  },
  {
    id: 'diwali-9',
    title: 'The Broke Diwali Reality',
    targetVictim: 'Homies',
    tone: 'Pitch Black',
    whatsappText: '💸 *Happy Diwali Broke Squad!* 💸\n\nOthers are buying iPhone 16 and gold coins for Dhanteras. Meanwhile my bank account balance is looking like a 4-digit OTP.\n\n_Dil jalane ke alawa aur koi pataka afford nahi ho raha._',
    punchline: 'My Diwali bonus was just getting to leave the office at 6:55 PM instead of 7:00 PM.',
    imageUrl: 'https://i.imgflip.com/261o3j.jpg', // Sweating guy two buttons
    tags: ['broke', 'dhanteras', 'salary', 'relatable'],
    likes: 45700,
  },
  {
    id: 'diwali-10',
    title: 'Sibling Kaju Katli Thief Detection',
    targetVictim: 'Sibling',
    tone: 'Savage Roast',
    whatsappText: '🍬 *Happy Diwali Sibling!* 🍬\n\nI know it was you who ate the entire silver-foil layer off the Kaju Katli box and left the Soan Papdi for me.\n\n_Watch your back, your Diwali sweets stash is no longer safe._',
    punchline: 'Silver foil on their teeth while claiming they didn’t touch the sweets.',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg', // Expanding Brain
    tags: ['sibling', 'kajukatli', 'sweets', 'thief'],
    likes: 39800,
  }
];
