export type Theme = {
  id: string
  label: string
  emoji: string
  bg: string
  light: boolean          // true = 밝은 배경 → 어두운 텍스트 사용
  cardBg: string          // 링크 카드 배경
  cardBorder: string      // 링크 카드 테두리
  textPrimary: string
  textSecondary: string
  textDim: string
}

export const THEMES: Theme[] = [
  // ── 다크 계열 ──────────────────────────────────────────────────
  {
    id: 'dark', label: '다크', emoji: '🌑', light: false,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #1a0f3a 0%, #08080f 60%)',
    cardBg: 'rgba(255,255,255,0.055)', cardBorder: 'rgba(255,255,255,0.09)',
    textPrimary: '#f0f0ff', textSecondary: 'rgba(255,255,255,0.55)', textDim: 'rgba(255,255,255,0.28)',
  },
  {
    id: 'purple', label: '퍼플', emoji: '🔮', light: false,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #3d0080 0%, #0d0020 60%)',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#f5f0ff', textSecondary: 'rgba(255,255,255,0.55)', textDim: 'rgba(255,255,255,0.28)',
  },
  {
    id: 'ocean', label: '오션', emoji: '🌊', light: false,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #003a70 0%, #000d20 60%)',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#f0f8ff', textSecondary: 'rgba(255,255,255,0.55)', textDim: 'rgba(255,255,255,0.28)',
  },
  {
    id: 'midnight', label: '미드나잇', emoji: '🌃', light: false,
    bg: 'linear-gradient(160deg, #0a0a1a 0%, #111130 40%, #0a0a1a 100%)',
    cardBg: 'rgba(255,255,255,0.055)', cardBorder: 'rgba(255,255,255,0.09)',
    textPrimary: '#e8e8ff', textSecondary: 'rgba(255,255,255,0.5)', textDim: 'rgba(255,255,255,0.26)',
  },
  {
    id: 'forest', label: '포레스트', emoji: '🌲', light: false,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #004020 0%, #000d08 60%)',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#f0fff4', textSecondary: 'rgba(255,255,255,0.55)', textDim: 'rgba(255,255,255,0.28)',
  },
  {
    id: 'sunset', label: '선셋', emoji: '🌇', light: false,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #4a1800 0%, #120500 60%)',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#fff5f0', textSecondary: 'rgba(255,255,255,0.55)', textDim: 'rgba(255,255,255,0.28)',
  },

  // ── 라이트 계열 ────────────────────────────────────────────────
  {
    id: 'white', label: '화이트', emoji: '☀️', light: true,
    bg: 'linear-gradient(160deg, #ffffff 0%, #f4f4f8 100%)',
    cardBg: 'rgba(0,0,0,0.04)', cardBorder: 'rgba(0,0,0,0.08)',
    textPrimary: '#1a1a2e', textSecondary: 'rgba(0,0,0,0.5)', textDim: 'rgba(0,0,0,0.28)',
  },
  {
    id: 'blossom', label: '블로썸', emoji: '🌸', light: true,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #ffd6e8 0%, #fff5f8 60%)',
    cardBg: 'rgba(255,255,255,0.7)', cardBorder: 'rgba(236,72,153,0.15)',
    textPrimary: '#3d0a20', textSecondary: 'rgba(60,10,30,0.55)', textDim: 'rgba(60,10,30,0.32)',
  },
  {
    id: 'mint', label: '민트', emoji: '🌿', light: true,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #b8f0d8 0%, #f0fff8 60%)',
    cardBg: 'rgba(255,255,255,0.65)', cardBorder: 'rgba(16,185,129,0.18)',
    textPrimary: '#0a2e1e', textSecondary: 'rgba(10,46,30,0.55)', textDim: 'rgba(10,46,30,0.32)',
  },
  {
    id: 'sky', label: '스카이', emoji: '🌤️', light: true,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #bae0ff 0%, #f0f8ff 60%)',
    cardBg: 'rgba(255,255,255,0.65)', cardBorder: 'rgba(59,130,246,0.18)',
    textPrimary: '#0a1e3d', textSecondary: 'rgba(10,30,61,0.55)', textDim: 'rgba(10,30,61,0.32)',
  },
  {
    id: 'peach', label: '피치', emoji: '🍑', light: true,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #ffd6b0 0%, #fff8f0 60%)',
    cardBg: 'rgba(255,255,255,0.65)', cardBorder: 'rgba(245,158,11,0.18)',
    textPrimary: '#2e1a0a', textSecondary: 'rgba(46,26,10,0.55)', textDim: 'rgba(46,26,10,0.32)',
  },
  {
    id: 'lemon', label: '레몬', emoji: '🌻', light: true,
    bg: 'radial-gradient(ellipse 90% 55% at 50% -5%, #fef08a 0%, #fefce8 60%)',
    cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(202,138,4,0.18)',
    textPrimary: '#1a1500', textSecondary: 'rgba(26,21,0,0.55)', textDim: 'rgba(26,21,0,0.3)',
  },
]

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}
