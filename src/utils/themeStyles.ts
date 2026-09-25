import { ColorPalette, ThemeMode } from '../types';

export interface PaletteDefinition {
  id: ColorPalette;
  nameAr: string;
  nameEn: string;
  bgHex: string;
  badgeHex: string;
  dark: {
    primaryBtn: string;
    secondaryBtn: string;
    textAccent: string;
    bgAccentSubtle: string;
    borderAccent: string;
    ringAccent: string;
    badgeBg: string;
    headerGlow: string;
  };
  light: {
    primaryBtn: string;
    secondaryBtn: string;
    textAccent: string;
    bgAccentSubtle: string;
    borderAccent: string;
    ringAccent: string;
    badgeBg: string;
    headerGlow: string;
  };
}

export const PALETTE_DEFINITIONS: PaletteDefinition[] = [
  {
    id: 'amber',
    nameAr: 'منهاج STOP الذهبي (DuPont Gold)',
    nameEn: 'DuPont Safety Gold',
    bgHex: '#f59e0b',
    badgeHex: '#d97706',
    dark: {
      primaryBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-950/40',
      secondaryBtn: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40',
      textAccent: 'text-amber-400',
      bgAccentSubtle: 'bg-amber-500/15',
      borderAccent: 'border-amber-500/40',
      ringAccent: 'ring-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      headerGlow: 'from-amber-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white font-black shadow-md shadow-amber-600/30',
      secondaryBtn: 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300',
      textAccent: 'text-amber-700',
      bgAccentSubtle: 'bg-amber-50/80',
      borderAccent: 'border-amber-300',
      ringAccent: 'ring-amber-400/30',
      badgeBg: 'bg-amber-100 text-amber-800 border border-amber-300',
      headerGlow: 'from-amber-200/40 to-transparent',
    },
  },
  {
    id: 'emerald',
    nameAr: 'زمرد السلامة والبيئة (Safety Green)',
    nameEn: 'Emerald Safety Green',
    bgHex: '#10b981',
    badgeHex: '#059669',
    dark: {
      primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-950/40',
      secondaryBtn: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      textAccent: 'text-emerald-400',
      bgAccentSubtle: 'bg-emerald-500/15',
      borderAccent: 'border-emerald-500/40',
      ringAccent: 'ring-emerald-500/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      headerGlow: 'from-emerald-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md shadow-emerald-600/30',
      secondaryBtn: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300',
      textAccent: 'text-emerald-700',
      bgAccentSubtle: 'bg-emerald-50/80',
      borderAccent: 'border-emerald-300',
      ringAccent: 'ring-emerald-400/30',
      badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      headerGlow: 'from-emerald-200/40 to-transparent',
    },
  },
  {
    id: 'blue',
    nameAr: 'أزرق محيطي تقني (Ocean Blue)',
    nameEn: 'Industrial Ocean Blue',
    bgHex: '#3b82f6',
    badgeHex: '#2563eb',
    dark: {
      primaryBtn: 'bg-blue-500 hover:bg-blue-400 text-slate-950 font-black shadow-lg shadow-blue-950/40',
      secondaryBtn: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/40',
      textAccent: 'text-blue-400',
      bgAccentSubtle: 'bg-blue-500/15',
      borderAccent: 'border-blue-500/40',
      ringAccent: 'ring-blue-500/30',
      badgeBg: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
      headerGlow: 'from-blue-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white font-black shadow-md shadow-blue-600/30',
      secondaryBtn: 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300',
      textAccent: 'text-blue-700',
      bgAccentSubtle: 'bg-blue-50/80',
      borderAccent: 'border-blue-300',
      ringAccent: 'ring-blue-400/30',
      badgeBg: 'bg-blue-100 text-blue-800 border border-blue-300',
      headerGlow: 'from-blue-200/40 to-transparent',
    },
  },
  {
    id: 'purple',
    nameAr: 'بنفسجي ملكي تقني (Royal Purple)',
    nameEn: 'Royal Tech Purple',
    bgHex: '#a855f7',
    badgeHex: '#9333ea',
    dark: {
      primaryBtn: 'bg-purple-500 hover:bg-purple-400 text-slate-950 font-black shadow-lg shadow-purple-950/40',
      secondaryBtn: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/40',
      textAccent: 'text-purple-400',
      bgAccentSubtle: 'bg-purple-500/15',
      borderAccent: 'border-purple-500/40',
      ringAccent: 'ring-purple-500/30',
      badgeBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
      headerGlow: 'from-purple-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-purple-600 hover:bg-purple-500 text-white font-black shadow-md shadow-purple-600/30',
      secondaryBtn: 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300',
      textAccent: 'text-purple-700',
      bgAccentSubtle: 'bg-purple-50/80',
      borderAccent: 'border-purple-300',
      ringAccent: 'ring-purple-400/30',
      badgeBg: 'bg-purple-100 text-purple-800 border border-purple-300',
      headerGlow: 'from-purple-200/40 to-transparent',
    },
  },
  {
    id: 'teal',
    nameAr: 'تركواز بترولي حديث (Petroleum Teal)',
    nameEn: 'Petroleum Teal',
    bgHex: '#14b8a6',
    badgeHex: '#0d9488',
    dark: {
      primaryBtn: 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-950/40',
      secondaryBtn: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/40',
      textAccent: 'text-teal-400',
      bgAccentSubtle: 'bg-teal-500/15',
      borderAccent: 'border-teal-500/40',
      ringAccent: 'ring-teal-500/30',
      badgeBg: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
      headerGlow: 'from-teal-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-teal-600 hover:bg-teal-500 text-white font-black shadow-md shadow-teal-600/30',
      secondaryBtn: 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300',
      textAccent: 'text-teal-700',
      bgAccentSubtle: 'bg-teal-50/80',
      borderAccent: 'border-teal-300',
      ringAccent: 'ring-teal-400/30',
      badgeBg: 'bg-teal-100 text-teal-800 border border-teal-300',
      headerGlow: 'from-teal-200/40 to-transparent',
    },
  },
  {
    id: 'orange',
    nameAr: 'برتقالي التحذير الصناعي (Safety Blaze)',
    nameEn: 'Safety Blaze Orange',
    bgHex: '#f97316',
    badgeHex: '#ea580c',
    dark: {
      primaryBtn: 'bg-orange-500 hover:bg-orange-400 text-slate-950 font-black shadow-lg shadow-orange-950/40',
      secondaryBtn: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/40',
      textAccent: 'text-orange-400',
      bgAccentSubtle: 'bg-orange-500/15',
      borderAccent: 'border-orange-500/40',
      ringAccent: 'ring-orange-500/30',
      badgeBg: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
      headerGlow: 'from-orange-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-orange-600 hover:bg-orange-500 text-white font-black shadow-md shadow-orange-600/30',
      secondaryBtn: 'bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300',
      textAccent: 'text-orange-700',
      bgAccentSubtle: 'bg-orange-50/80',
      borderAccent: 'border-orange-300',
      ringAccent: 'ring-orange-400/30',
      badgeBg: 'bg-orange-100 text-orange-800 border border-orange-300',
      headerGlow: 'from-orange-200/40 to-transparent',
    },
  },
  {
    id: 'cyan',
    nameAr: 'سيان الرادار السيبراني (Cyber Cyan)',
    nameEn: 'Cyber Radar Cyan',
    bgHex: '#06b6d4',
    badgeHex: '#0891b2',
    dark: {
      primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-950/40',
      secondaryBtn: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
      textAccent: 'text-cyan-400',
      bgAccentSubtle: 'bg-cyan-500/15',
      borderAccent: 'border-cyan-500/40',
      ringAccent: 'ring-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
      headerGlow: 'from-cyan-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white font-black shadow-md shadow-cyan-600/30',
      secondaryBtn: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300',
      textAccent: 'text-cyan-700',
      bgAccentSubtle: 'bg-cyan-50/80',
      borderAccent: 'border-cyan-300',
      ringAccent: 'ring-cyan-400/30',
      badgeBg: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
      headerGlow: 'from-cyan-200/40 to-transparent',
    },
  },
  {
    id: 'rose',
    nameAr: 'ياقوتي وقائي للطوارئ (Safety Crimson)',
    nameEn: 'Safety Crimson Red',
    bgHex: '#f43f5e',
    badgeHex: '#e11d48',
    dark: {
      primaryBtn: 'bg-rose-500 hover:bg-rose-400 text-slate-950 font-black shadow-lg shadow-rose-950/40',
      secondaryBtn: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40',
      textAccent: 'text-rose-400',
      bgAccentSubtle: 'bg-rose-500/15',
      borderAccent: 'border-rose-500/40',
      ringAccent: 'ring-rose-500/30',
      badgeBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
      headerGlow: 'from-rose-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-md shadow-rose-600/30',
      secondaryBtn: 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300',
      textAccent: 'text-rose-700',
      bgAccentSubtle: 'bg-rose-50/80',
      borderAccent: 'border-rose-300',
      ringAccent: 'ring-rose-400/30',
      badgeBg: 'bg-rose-100 text-rose-800 border border-rose-300',
      headerGlow: 'from-rose-200/40 to-transparent',
    },
  },
  {
    id: 'indigo',
    nameAr: 'نيلي استراتيجي مهني (Strategic Indigo)',
    nameEn: 'Strategic Indigo',
    bgHex: '#6366f1',
    badgeHex: '#4f46e5',
    dark: {
      primaryBtn: 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black shadow-lg shadow-indigo-950/40',
      secondaryBtn: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
      textAccent: 'text-indigo-400',
      bgAccentSubtle: 'bg-indigo-500/15',
      borderAccent: 'border-indigo-500/40',
      ringAccent: 'ring-indigo-500/30',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
      headerGlow: 'from-indigo-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-md shadow-indigo-600/30',
      secondaryBtn: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300',
      textAccent: 'text-indigo-700',
      bgAccentSubtle: 'bg-indigo-50/80',
      borderAccent: 'border-indigo-300',
      ringAccent: 'ring-indigo-400/30',
      badgeBg: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
      headerGlow: 'from-indigo-200/40 to-transparent',
    },
  },
  {
    id: 'bronze',
    nameAr: 'برونزي صناعي عريق (Desert Bronze)',
    nameEn: 'Desert Industrial Bronze',
    bgHex: '#b45309',
    badgeHex: '#92400e',
    dark: {
      primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white font-black shadow-lg shadow-amber-950/40',
      secondaryBtn: 'bg-amber-600/15 hover:bg-amber-600/25 text-amber-200 border border-amber-600/50',
      textAccent: 'text-amber-500',
      bgAccentSubtle: 'bg-amber-600/20',
      borderAccent: 'border-amber-600/40',
      ringAccent: 'ring-amber-600/30',
      badgeBg: 'bg-amber-600/20 text-amber-300 border border-amber-600/40',
      headerGlow: 'from-amber-600/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-amber-800 hover:bg-amber-700 text-white font-black shadow-md shadow-amber-900/30',
      secondaryBtn: 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-400',
      textAccent: 'text-amber-800',
      bgAccentSubtle: 'bg-amber-100/70',
      borderAccent: 'border-amber-400',
      ringAccent: 'ring-amber-500/30',
      badgeBg: 'bg-amber-200 text-amber-900 border border-amber-400',
      headerGlow: 'from-amber-300/40 to-transparent',
    },
  },
  {
    id: 'slate',
    nameAr: 'كربوني تيتانيوم صلب (Titanium Slate)',
    nameEn: 'Titanium Carbon Slate',
    bgHex: '#64748b',
    badgeHex: '#475569',
    dark: {
      primaryBtn: 'bg-slate-300 hover:bg-white text-slate-950 font-black shadow-lg shadow-slate-950/40',
      secondaryBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
      textAccent: 'text-slate-300',
      bgAccentSubtle: 'bg-slate-800/60',
      borderAccent: 'border-slate-700',
      ringAccent: 'ring-slate-500/30',
      badgeBg: 'bg-slate-800 text-slate-200 border border-slate-700',
      headerGlow: 'from-slate-500/20 to-transparent',
    },
    light: {
      primaryBtn: 'bg-slate-800 hover:bg-slate-700 text-white font-black shadow-md shadow-slate-800/30',
      secondaryBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300',
      textAccent: 'text-slate-800',
      bgAccentSubtle: 'bg-slate-200/70',
      borderAccent: 'border-slate-300',
      ringAccent: 'ring-slate-400/30',
      badgeBg: 'bg-slate-200 text-slate-800 border border-slate-300',
      headerGlow: 'from-slate-300/40 to-transparent',
    },
  },
];

export function getPaletteDefinition(palette: ColorPalette): PaletteDefinition {
  return PALETTE_DEFINITIONS.find((p) => p.id === palette) || PALETTE_DEFINITIONS[0];
}

export function getActiveThemeStyles(palette: ColorPalette, mode: ThemeMode) {
  const def = getPaletteDefinition(palette);
  return mode === 'dark' ? def.dark : def.light;
}

export interface PaletteColorMap {
  primary: string;
  primaryHover: string;
  primaryText: string;
  accentText: string;
  bgSubtle: string;
  borderAccent: string;
  ringAccent: string;
  gradientFrom: string;
  gradientTo: string;
  badgeBg: string;
  badgeText: string;
}

export const PALETTE_HEX_MAP: Record<ColorPalette, { dark: PaletteColorMap; light: PaletteColorMap }> = {
  amber: {
    dark: {
      primary: '#f59e0b',
      primaryHover: '#fbbf24',
      primaryText: '#020617',
      accentText: '#fbbf24',
      bgSubtle: 'rgba(245, 158, 11, 0.15)',
      borderAccent: 'rgba(245, 158, 11, 0.45)',
      ringAccent: 'rgba(245, 158, 11, 0.4)',
      gradientFrom: '#d97706',
      gradientTo: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      badgeText: '#fde68a',
    },
    light: {
      primary: '#d97706',
      primaryHover: '#b45309',
      primaryText: '#ffffff',
      accentText: '#b45309',
      bgSubtle: 'rgba(245, 158, 11, 0.12)',
      borderAccent: '#f59e0b',
      ringAccent: 'rgba(217, 119, 6, 0.3)',
      gradientFrom: '#b45309',
      gradientTo: '#d97706',
      badgeBg: '#fef3c7',
      badgeText: '#92400e',
    },
  },
  emerald: {
    dark: {
      primary: '#10b981',
      primaryHover: '#34d399',
      primaryText: '#020617',
      accentText: '#34d399',
      bgSubtle: 'rgba(16, 185, 129, 0.15)',
      borderAccent: 'rgba(16, 185, 129, 0.45)',
      ringAccent: 'rgba(16, 185, 129, 0.4)',
      gradientFrom: '#059669',
      gradientTo: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeText: '#a7f3d0',
    },
    light: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryText: '#ffffff',
      accentText: '#047857',
      bgSubtle: 'rgba(16, 185, 129, 0.12)',
      borderAccent: '#10b981',
      ringAccent: 'rgba(5, 150, 105, 0.3)',
      gradientFrom: '#047857',
      gradientTo: '#059669',
      badgeBg: '#d1fae5',
      badgeText: '#065f46',
    },
  },
  blue: {
    dark: {
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      primaryText: '#020617',
      accentText: '#60a5fa',
      bgSubtle: 'rgba(59, 130, 246, 0.15)',
      borderAccent: 'rgba(59, 130, 246, 0.45)',
      ringAccent: 'rgba(59, 130, 246, 0.4)',
      gradientFrom: '#2563eb',
      gradientTo: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.2)',
      badgeText: '#bfdbfe',
    },
    light: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      primaryText: '#ffffff',
      accentText: '#1d4ed8',
      bgSubtle: 'rgba(59, 130, 246, 0.12)',
      borderAccent: '#3b82f6',
      ringAccent: 'rgba(37, 99, 235, 0.3)',
      gradientFrom: '#1d4ed8',
      gradientTo: '#2563eb',
      badgeBg: '#dbeafe',
      badgeText: '#1e40af',
    },
  },
  purple: {
    dark: {
      primary: '#a855f7',
      primaryHover: '#c084fc',
      primaryText: '#020617',
      accentText: '#c084fc',
      bgSubtle: 'rgba(168, 85, 247, 0.15)',
      borderAccent: 'rgba(168, 85, 247, 0.45)',
      ringAccent: 'rgba(168, 85, 247, 0.4)',
      gradientFrom: '#9333ea',
      gradientTo: '#a855f7',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
      badgeText: '#e9d5ff',
    },
    light: {
      primary: '#9333ea',
      primaryHover: '#7e22ce',
      primaryText: '#ffffff',
      accentText: '#7e22ce',
      bgSubtle: 'rgba(168, 85, 247, 0.12)',
      borderAccent: '#a855f7',
      ringAccent: 'rgba(147, 51, 234, 0.3)',
      gradientFrom: '#7e22ce',
      gradientTo: '#9333ea',
      badgeBg: '#f3e8ff',
      badgeText: '#6b21a8',
    },
  },
  teal: {
    dark: {
      primary: '#14b8a6',
      primaryHover: '#2dd4bf',
      primaryText: '#020617',
      accentText: '#2dd4bf',
      bgSubtle: 'rgba(20, 184, 166, 0.15)',
      borderAccent: 'rgba(20, 184, 166, 0.45)',
      ringAccent: 'rgba(20, 184, 166, 0.4)',
      gradientFrom: '#0d9488',
      gradientTo: '#14b8a6',
      badgeBg: 'rgba(20, 184, 166, 0.2)',
      badgeText: '#99f6e4',
    },
    light: {
      primary: '#0d9488',
      primaryHover: '#0f766e',
      primaryText: '#ffffff',
      accentText: '#0f766e',
      bgSubtle: 'rgba(20, 184, 166, 0.12)',
      borderAccent: '#14b8a6',
      ringAccent: 'rgba(13, 148, 136, 0.3)',
      gradientFrom: '#0f766e',
      gradientTo: '#0d9488',
      badgeBg: '#ccfbf1',
      badgeText: '#115e59',
    },
  },
  orange: {
    dark: {
      primary: '#f97316',
      primaryHover: '#fb923c',
      primaryText: '#020617',
      accentText: '#fb923c',
      bgSubtle: 'rgba(249, 115, 22, 0.15)',
      borderAccent: 'rgba(249, 115, 22, 0.45)',
      ringAccent: 'rgba(249, 115, 22, 0.4)',
      gradientFrom: '#ea580c',
      gradientTo: '#f97316',
      badgeBg: 'rgba(249, 115, 22, 0.2)',
      badgeText: '#fed7aa',
    },
    light: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      primaryText: '#ffffff',
      accentText: '#c2410c',
      bgSubtle: 'rgba(249, 115, 22, 0.12)',
      borderAccent: '#f97316',
      ringAccent: 'rgba(234, 88, 12, 0.3)',
      gradientFrom: '#c2410c',
      gradientTo: '#ea580c',
      badgeBg: '#ffedd5',
      badgeText: '#9a3412',
    },
  },
  cyan: {
    dark: {
      primary: '#06b6d4',
      primaryHover: '#22d3ee',
      primaryText: '#020617',
      accentText: '#22d3ee',
      bgSubtle: 'rgba(6, 182, 212, 0.15)',
      borderAccent: 'rgba(6, 182, 212, 0.45)',
      ringAccent: 'rgba(6, 182, 212, 0.4)',
      gradientFrom: '#0891b2',
      gradientTo: '#06b6d4',
      badgeBg: 'rgba(6, 182, 212, 0.2)',
      badgeText: '#a5f3fc',
    },
    light: {
      primary: '#0891b2',
      primaryHover: '#0e7490',
      primaryText: '#ffffff',
      accentText: '#0e7490',
      bgSubtle: 'rgba(6, 182, 212, 0.12)',
      borderAccent: '#06b6d4',
      ringAccent: 'rgba(8, 145, 178, 0.3)',
      gradientFrom: '#0e7490',
      gradientTo: '#0891b2',
      badgeBg: '#cffafe',
      badgeText: '#155e75',
    },
  },
  rose: {
    dark: {
      primary: '#f43f5e',
      primaryHover: '#fb7185',
      primaryText: '#020617',
      accentText: '#fb7185',
      bgSubtle: 'rgba(244, 63, 94, 0.15)',
      borderAccent: 'rgba(244, 63, 94, 0.45)',
      ringAccent: 'rgba(244, 63, 94, 0.4)',
      gradientFrom: '#e11d48',
      gradientTo: '#f43f5e',
      badgeBg: 'rgba(244, 63, 94, 0.2)',
      badgeText: '#fecdd3',
    },
    light: {
      primary: '#e11d48',
      primaryHover: '#be123c',
      primaryText: '#ffffff',
      accentText: '#be123c',
      bgSubtle: 'rgba(244, 63, 94, 0.12)',
      borderAccent: '#f43f5e',
      ringAccent: 'rgba(225, 29, 72, 0.3)',
      gradientFrom: '#be123c',
      gradientTo: '#e11d48',
      badgeBg: '#ffe4e6',
      badgeText: '#9f1239',
    },
  },
  indigo: {
    dark: {
      primary: '#6366f1',
      primaryHover: '#818cf8',
      primaryText: '#020617',
      accentText: '#818cf8',
      bgSubtle: 'rgba(99, 102, 241, 0.15)',
      borderAccent: 'rgba(99, 102, 241, 0.45)',
      ringAccent: 'rgba(99, 102, 241, 0.4)',
      gradientFrom: '#4f46e5',
      gradientTo: '#6366f1',
      badgeBg: 'rgba(99, 102, 241, 0.2)',
      badgeText: '#c7d2fe',
    },
    light: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      primaryText: '#ffffff',
      accentText: '#4338ca',
      bgSubtle: 'rgba(99, 102, 241, 0.12)',
      borderAccent: '#6366f1',
      ringAccent: 'rgba(79, 70, 229, 0.3)',
      gradientFrom: '#4338ca',
      gradientTo: '#4f46e5',
      badgeBg: '#e0e7ff',
      badgeText: '#3730a3',
    },
  },
  bronze: {
    dark: {
      primary: '#d97706',
      primaryHover: '#f59e0b',
      primaryText: '#020617',
      accentText: '#f59e0b',
      bgSubtle: 'rgba(217, 119, 6, 0.15)',
      borderAccent: 'rgba(217, 119, 6, 0.45)',
      ringAccent: 'rgba(217, 119, 6, 0.4)',
      gradientFrom: '#b45309',
      gradientTo: '#d97706',
      badgeBg: 'rgba(217, 119, 6, 0.2)',
      badgeText: '#fde68a',
    },
    light: {
      primary: '#b45309',
      primaryHover: '#92400e',
      primaryText: '#ffffff',
      accentText: '#92400e',
      bgSubtle: 'rgba(217, 119, 6, 0.12)',
      borderAccent: '#d97706',
      ringAccent: 'rgba(180, 83, 9, 0.3)',
      gradientFrom: '#92400e',
      gradientTo: '#b45309',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
  },
  slate: {
    dark: {
      primary: '#94a3b8',
      primaryHover: '#cbd5e1',
      primaryText: '#020617',
      accentText: '#cbd5e1',
      bgSubtle: 'rgba(148, 163, 184, 0.15)',
      borderAccent: 'rgba(148, 163, 184, 0.45)',
      ringAccent: 'rgba(148, 163, 184, 0.4)',
      gradientFrom: '#64748b',
      gradientTo: '#94a3b8',
      badgeBg: 'rgba(148, 163, 184, 0.2)',
      badgeText: '#f1f5f9',
    },
    light: {
      primary: '#475569',
      primaryHover: '#334155',
      primaryText: '#ffffff',
      accentText: '#334155',
      bgSubtle: 'rgba(148, 163, 184, 0.15)',
      borderAccent: '#64748b',
      ringAccent: 'rgba(71, 85, 105, 0.3)',
      gradientFrom: '#334155',
      gradientTo: '#475569',
      badgeBg: '#e2e8f0',
      badgeText: '#1e293b',
    },
  },
};

export function generatePaletteCSS(palette: ColorPalette, mode: ThemeMode): string {
  const map = PALETTE_HEX_MAP[palette] || PALETTE_HEX_MAP.amber;
  const c = mode === 'dark' ? map.dark : map.light;

  return `
    :root {
      --palette-primary: ${c.primary};
      --palette-primary-hover: ${c.primaryHover};
      --palette-primary-text: ${c.primaryText};
      --palette-accent-text: ${c.accentText};
      --palette-accent-bg: ${c.bgSubtle};
      --palette-accent-border: ${c.borderAccent};
      --palette-ring: ${c.ringAccent};
      --palette-grad-from: ${c.gradientFrom};
      --palette-grad-to: ${c.gradientTo};
      --palette-badge-bg: ${c.badgeBg};
      --palette-badge-text: ${c.badgeText};
    }

    /* Live Overrides across entire App */
    .bg-amber-500, .bg-amber-600 {
      background-color: var(--palette-primary) !important;
      color: var(--palette-primary-text) !important;
    }
    .hover\\:bg-amber-400:hover, .hover\\:bg-amber-500:hover, .hover\\:bg-amber-300:hover {
      background-color: var(--palette-primary-hover) !important;
    }
    .text-amber-400, .text-amber-300, .text-amber-500 {
      color: var(--palette-accent-text) !important;
    }
    .border-amber-500,
    .border-amber-400,
    .border-amber-500\\/40,
    .border-amber-500\\/50,
    .border-amber-500\\/30,
    .border-amber-500\\/20,
    .border-amber-500\\/60 {
      border-color: var(--palette-accent-border) !important;
    }
    .bg-amber-500\\/10,
    .bg-amber-500\\/15,
    .bg-amber-500\\/20,
    .bg-amber-500\\/25,
    .bg-amber-500\\/30,
    .bg-amber-500\\/40 {
      background-color: var(--palette-accent-bg) !important;
    }
    .from-amber-600, .from-amber-500 {
      --tw-gradient-from: var(--palette-grad-from) var(--tw-gradient-from-position, ) !important;
    }
    .to-amber-500, .to-amber-400 {
      --tw-gradient-to: var(--palette-grad-to) var(--tw-gradient-to-position, ) !important;
    }
    .ring-amber-500, .ring-amber-400, .ring-amber-500\\/30, .ring-amber-400\\/30 {
      --tw-ring-color: var(--palette-ring) !important;
    }
    .accent-amber-400, .accent-amber-500 {
      accent-color: var(--palette-primary) !important;
    }

    ${
      mode === 'light'
        ? `
      /* Light Mode Crisp Styling */
      body, #root {
        background-color: #f8fafc !important;
        color: #0f172a !important;
      }
      .bg-slate-950 {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
      }
      .bg-slate-900, .bg-slate-900\\/90 {
        background-color: #ffffff !important;
        color: #0f172a !important;
        border-color: #e2e8f0 !important;
      }
      .bg-slate-800, .bg-slate-800\\/80, .bg-slate-800\\/90 {
        background-color: #f8fafc !important;
        color: #1e293b !important;
        border-color: #cbd5e1 !important;
      }
      .border-slate-800, .border-slate-700 {
        border-color: #e2e8f0 !important;
      }
      .text-slate-100, .text-white {
        color: #0f172a !important;
      }
      .text-slate-200, .text-slate-300 {
        color: #334155 !important;
      }
      .text-slate-400 {
        color: #64748b !important;
      }
    `
        : `
      /* Dark Mode Deep Contrast */
      body, #root {
        background-color: #020617 !important;
        color: #f8fafc !important;
      }
    `
    }
  `;
}
