// Helper to generate crisp, self-contained SVG meme graphics that never fail to load or throw canvas CORS errors

export const createMemeSvgUri = (
  bgColor1: string,
  bgColor2: string,
  iconEmoji: string,
  illustrationType: string,
  topMemeText?: string,
  bottomMemeText?: string
): string => {
  const topText = topMemeText ? topMemeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
  const bottomText = bottomMemeText ? bottomMemeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';

  let visualContent = '';

  switch (illustrationType) {
    case 'panicked-student':
      visualContent = `
        <circle cx="300" cy="240" r="110" fill="#FBBF24" stroke="#D97706" stroke-width="8"/>
        <!-- Sweating drops -->
        <path d="M220 160 Q210 130 220 120 Q230 130 220 160 Z" fill="#38BDF8"/>
        <path d="M380 180 Q390 150 380 140 Q370 150 380 180 Z" fill="#38BDF8"/>
        <!-- Eyes wide open -->
        <circle cx="260" cy="220" r="28" fill="#FFF" stroke="#000" stroke-width="6"/>
        <circle cx="260" cy="220" r="10" fill="#000"/>
        <circle cx="340" cy="220" r="28" fill="#FFF" stroke="#000" stroke-width="6"/>
        <circle cx="340" cy="220" r="10" fill="#000"/>
        <!-- Screaming squiggly mouth -->
        <path d="M250 290 Q300 350 350 290 Q300 310 250 290 Z" fill="#EF4444" stroke="#991B1B" stroke-width="6"/>
        <!-- Exam paper -->
        <rect x="230" y="340" width="140" height="90" rx="8" fill="#FFF" stroke="#64748B" stroke-width="4"/>
        <line x1="250" y1="365" x2="350" y2="365" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
        <line x1="250" y1="385" x2="330" y2="385" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
        <text x="330" y="415" font-family="Arial Black" font-size="28" fill="#EF4444" font-weight="bold">F-</text>
      `;
      break;

    case 'soan-papdi':
      visualContent = `
        <!-- Festive Box -->
        <rect x="180" y="160" width="240" height="190" rx="16" fill="#F59E0B" stroke="#B45309" stroke-width="8"/>
        <rect x="200" y="180" width="200" height="150" rx="8" fill="#FEF3C7"/>
        <rect x="280" y="160" width="40" height="190" fill="#DC2626"/>
        <rect x="180" y="235" width="240" height="40" fill="#DC2626"/>
        <!-- Sparkle Ribbon Bow -->
        <circle cx="300" cy="255" r="30" fill="#FACC15" stroke="#B45309" stroke-width="4"/>
        <text x="300" y="265" font-family="Impact" font-size="28" fill="#78350F" text-anchor="middle">SOAN PAPDI</text>
        <!-- Relatives passing box loop arrows -->
        <path d="M140 240 C100 120 220 80 300 90" fill="none" stroke="#A855F7" stroke-width="8" stroke-dasharray="12 8" marker-end="url(#arrow)"/>
        <path d="M460 240 C500 360 380 400 300 390" fill="none" stroke="#A855F7" stroke-width="8" stroke-dasharray="12 8"/>
        <text x="300" y="70" font-family="Arial Black" font-size="22" fill="#E2E8F0" text-anchor="middle">🔁 Passed to 9 Different Relatives</text>
      `;
      break;

    case 'savage-skull':
      visualContent = `
        <circle cx="300" cy="230" r="100" fill="#1E293B" stroke="#A855F7" stroke-width="8"/>
        <!-- Skull face -->
        <path d="M260 210 Q260 170 300 170 Q340 170 340 210 Q340 250 300 250 Q260 250 260 210 Z" fill="#F8FAFC"/>
        <rect x="280" y="240" width="40" height="35" fill="#F8FAFC"/>
        <ellipse cx="285" cy="210" rx="14" ry="18" fill="#0F172A"/>
        <ellipse cx="315" cy="210" rx="14" ry="18" fill="#0F172A"/>
        <polygon points="300,225 294,238 306,238" fill="#0F172A"/>
        <line x1="290" y1="265" x2="290" y2="275" stroke="#0F172A" stroke-width="4"/>
        <line x1="300" y1="265" x2="300" y2="275" stroke="#0F172A" stroke-width="4"/>
        <line x1="310" y1="265" x2="310" y2="275" stroke="#0F172A" stroke-width="4"/>
        <!-- Glowing smoke / damage rays -->
        <circle cx="300" cy="230" r="140" fill="none" stroke="#C084FC" stroke-width="4" stroke-opacity="0.4"/>
        <text x="300" y="380" font-family="Arial Black" font-size="26" fill="#F43F5E" text-anchor="middle">💥 EMOTIONAL DAMAGE</text>
      `;
      break;

    case 'doge-cheems':
      visualContent = `
        <!-- Buff Doge vs Crying Doge -->
        <rect x="80" y="120" width="200" height="260" rx="20" fill="#1E293B" stroke="#10B981" stroke-width="6"/>
        <text x="180" y="160" font-family="Arial Black" font-size="36" fill="#FBBF24" text-anchor="middle">💪🐶</text>
        <text x="180" y="210" font-family="Impact" font-size="24" fill="#34D399" text-anchor="middle">ME AT 2 AM</text>
        <text x="180" y="245" font-family="sans-serif" font-size="16" fill="#CBD5E1" text-anchor="middle">Planning to build a</text>
        <text x="180" y="270" font-family="sans-serif" font-size="16" fill="#CBD5E1" text-anchor="middle">billion dollar startup</text>
        <text x="180" y="295" font-family="sans-serif" font-size="16" fill="#CBD5E1" text-anchor="middle">&amp; run 10 kilometers</text>

        <rect x="320" y="120" width="200" height="260" rx="20" fill="#1E293B" stroke="#F43F5E" stroke-width="6"/>
        <text x="420" y="160" font-family="Arial Black" font-size="36" fill="#FBBF24" text-anchor="middle">🥺🐕</text>
        <text x="420" y="210" font-family="Impact" font-size="24" fill="#F43F5E" text-anchor="middle">ME AT 8 AM</text>
        <text x="420" y="245" font-family="sans-serif" font-size="16" fill="#CBD5E1" text-anchor="middle">Can't even open eyes</text>
        <text x="420" y="270" font-family="sans-serif" font-size="16" fill="#CBD5E1" text-anchor="middle">without regretting</text>
        <text x="420" y="295" font-family="sans-serif" font-size="16" fill="#CBD5E1" text-anchor="middle">entire life choices</text>
      `;
      break;

    case 'group-chat-silence':
      visualContent = `
        <rect x="120" y="120" width="360" height="260" rx="16" fill="#111827" stroke="#374151" stroke-width="4"/>
        <!-- Sent message bubble -->
        <rect x="220" y="150" width="230" height="60" rx="12" fill="#059669"/>
        <text x="240" y="185" font-family="sans-serif" font-size="17" fill="#FFF">Guys Goa trip this weekend?</text>
        <text x="420" y="200" font-family="sans-serif" font-size="12" fill="#D1FAE5">✓✓</text>
        
        <!-- Tumbleweed / silence indicator -->
        <circle cx="300" cy="270" r="35" fill="none" stroke="#FBBF24" stroke-width="3" stroke-dasharray="6 6"/>
        <text x="300" y="278" font-family="Arial Black" font-size="24" text-anchor="middle">🦗</text>
        <text x="300" y="340" font-family="Arial Black" font-size="20" fill="#9CA3AF" text-anchor="middle">Seen by 14 people (4 hours ago)</text>
      `;
      break;

    case 'cricket-heartbreak':
      visualContent = `
        <circle cx="300" cy="220" r="100" fill="#0284C7" stroke="#38BDF8" stroke-width="8"/>
        <!-- Cricket ball hitting wickets or fan holding head -->
        <circle cx="300" cy="200" r="50" fill="#F87171" stroke="#DC2626" stroke-width="6"/>
        <path d="M265 190 Q300 215 335 190" stroke="#FFF" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Hands on head silhouette -->
        <path d="M220 220 Q200 170 240 150 Q260 180 250 220 Z" fill="#FCD34D"/>
        <path d="M380 220 Q400 170 360 150 Q340 180 350 220 Z" fill="#FCD34D"/>
        <!-- Wickets -->
        <rect x="275" y="270" width="8" height="60" fill="#FDE047"/>
        <rect x="295" y="270" width="8" height="60" fill="#FDE047"/>
        <rect x="315" y="270" width="8" height="60" fill="#FDE047"/>
        <line x1="270" y1="270" x2="330" y2="260" stroke="#EF4444" stroke-width="6"/>
        <text x="300" y="370" font-family="Impact" font-size="32" fill="#F87171" text-anchor="middle">NEEDS 2 RUNS FROM 1 BALL</text>
      `;
      break;

    case 'wholesome-cat':
      visualContent = `
        <circle cx="300" cy="240" r="110" fill="#FDE68A" stroke="#F59E0B" stroke-width="6"/>
        <!-- Cat ears -->
        <polygon points="210,160 240,90 280,150" fill="#F59E0B"/>
        <polygon points="225,150 245,105 270,145" fill="#F472B6"/>
        <polygon points="390,160 360,90 320,150" fill="#F59E0B"/>
        <polygon points="375,150 355,105 330,145" fill="#F472B6"/>
        <!-- Happy closed smiling eyes -->
        <path d="M240 220 Q260 200 280 220" fill="none" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
        <path d="M320 220 Q340 200 360 220" fill="none" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
        <!-- Nose and mouth -->
        <polygon points="295,235 305,235 300,243" fill="#EC4899"/>
        <path d="M300 243 Q290 260 280 250" fill="none" stroke="#78350F" stroke-width="5"/>
        <path d="M300 243 Q310 260 320 250" fill="none" stroke="#78350F" stroke-width="5"/>
        <!-- Hearts floating -->
        <text x="210" y="190" font-size="30">💖</text>
        <text x="370" y="190" font-size="30">💖</text>
        <text x="300" y="380" font-family="Arial Black" font-size="22" fill="#10B981" text-anchor="middle">You did great today. I am proud of you!</text>
      `;
      break;

    default:
      // Generic high-impact illustration
      visualContent = `
        <circle cx="300" cy="230" r="100" fill="#1E293B" stroke="#6366F1" stroke-width="6"/>
        <text x="300" y="270" font-size="90" text-anchor="middle">${iconEmoji}</text>
      `;
      break;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor1}" />
          <stop offset="100%" stop-color="${bgColor2}" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.8"/>
        </filter>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#A855F7"/>
        </marker>
      </defs>

      <!-- Background -->
      <rect width="600" height="480" fill="url(#bg)" rx="16"/>

      <!-- Subtle Grid Pattern -->
      <g opacity="0.07" stroke="#FFF" stroke-width="1">
        <line x1="0" y1="80" x2="600" y2="80"/>
        <line x1="0" y1="160" x2="600" y2="160"/>
        <line x1="0" y1="240" x2="600" y2="240"/>
        <line x1="0" y1="320" x2="600" y2="320"/>
        <line x1="0" y1="400" x2="600" y2="400"/>
        <line x1="120" y1="0" x2="120" y2="480"/>
        <line x1="240" y1="0" x2="240" y2="480"/>
        <line x1="360" y1="0" x2="360" y2="480"/>
        <line x1="480" y1="0" x2="480" y2="480"/>
      </g>

      <!-- Visual Graphic Center -->
      ${visualContent}

      <!-- Top Meme Impact Text -->
      ${topText ? `
      <g filter="url(#shadow)">
        <text x="300" y="58" 
          font-family="Impact, Arial Black, sans-serif" 
          font-size="34" 
          font-weight="900" 
          fill="#FFFFFF" 
          stroke="#000000" 
          stroke-width="5" 
          paint-order="stroke fill" 
          text-anchor="middle" 
          letter-spacing="1.5">${topText}</text>
      </g>` : ''}

      <!-- Bottom Meme Impact Text -->
      ${bottomText ? `
      <g filter="url(#shadow)">
        <text x="300" y="445" 
          font-family="Impact, Arial Black, sans-serif" 
          font-size="34" 
          font-weight="900" 
          fill="#FFFFFF" 
          stroke="#000000" 
          stroke-width="5" 
          paint-order="stroke fill" 
          text-anchor="middle" 
          letter-spacing="1.5">${bottomText}</text>
      </g>` : ''}

      <!-- Small Memeverse watermark tag in corner -->
      <g opacity="0.5">
        <rect x="470" y="16" width="114" height="24" rx="12" fill="#000000" opacity="0.4"/>
        <text x="527" y="32" font-family="Space Grotesk, sans-serif" font-size="11" fill="#FFFFFF" font-weight="700" text-anchor="middle">MEMEVERSE</text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};
