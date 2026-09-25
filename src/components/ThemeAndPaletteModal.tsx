import React from 'react';
import { ColorPalette, Language, ThemeMode } from '../types';
import { getT } from '../utils/translations';
import { PALETTE_DEFINITIONS } from '../utils/themeStyles';
import { Moon, Sun, Palette, Globe, Check, X, Sparkles } from 'lucide-react';

interface ThemeAndPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  colorPalette: ColorPalette;
  onSelectPalette: (palette: ColorPalette) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const ThemeAndPaletteModal: React.FC<ThemeAndPaletteModalProps> = ({
  isOpen,
  onClose,
  themeMode,
  onToggleThemeMode,
  colorPalette,
  onSelectPalette,
  language,
  onToggleLanguage,
}) => {
  const t = getT(language);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 relative max-h-[90vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Palette className="w-4 h-4" />
            <span>{language === 'ar' ? 'تخصيص المظهر الشامل وبنتونة الألوان' : 'Comprehensive Theme & Palette Customizer'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">{t.colorPalette}</h3>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'اختر من بين 11 بنتونة ألوان هندسية معتمدة، ويتم تطبيق الطابع تلقائياً وبانسجام على الوضعين الليلي والنهاري'
              : 'Select from 11 verified engineering palettes, dynamically applied across both Dark and Light modes'}
          </p>
        </div>

        {/* Day / Night Mode & Language Row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Day / Night Toggle */}
          <button
            type="button"
            onClick={onToggleThemeMode}
            className="p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-right transition group"
          >
            <div>
              <div className="text-xs font-bold text-slate-200">
                {language === 'ar' ? 'نمط العرض والسطوع' : 'Display Mode'}
              </div>
              <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                {themeMode === 'dark'
                  ? language === 'ar'
                    ? '🌙 الوضع الليلي (Dark Mode)'
                    : '🌙 Dark Mode'
                  : language === 'ar'
                  ? '☀️ الوضع النهاري (Light Mode)'
                  : '☀️ Light Mode'}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-700/80 group-hover:bg-amber-500/20 text-amber-400 transition">
              {themeMode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
          </button>

          {/* Bilingual Language Toggle */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-right transition group"
          >
            <div>
              <div className="text-xs font-bold text-slate-200">
                {language === 'ar' ? 'لغة الواجهة' : 'App Language'}
              </div>
              <div className="text-[11px] text-sky-400 font-bold mt-0.5">
                {language === 'ar' ? 'العربية (AR)' : 'English (EN)'}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-700/80 group-hover:bg-sky-500/20 text-sky-400 transition">
              <Globe className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Color Palette (11 Brand Palettes) */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>{language === 'ar' ? 'بنتونة ألوان التطبيق (11 طابع متنوع):' : 'Available Brand Palettes (11 Themes):'}</span>
            <span className="text-[11px] text-amber-400 font-mono">
              {PALETTE_DEFINITIONS.find((p) => p.id === colorPalette)?.nameAr}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {PALETTE_DEFINITIONS.map((pal) => {
              const isSelected = colorPalette === pal.id;
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => onSelectPalette(pal.id)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-7 h-7 rounded-xl shadow-md border border-white/20 shrink-0 flex items-center justify-center text-slate-950 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: pal.bgHex }}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3] text-white" />}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-black text-slate-100 truncate">
                        {language === 'ar' ? pal.nameAr : pal.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {pal.id.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.saveTheme}</span>
        </button>
      </div>
    </div>
  );
};
