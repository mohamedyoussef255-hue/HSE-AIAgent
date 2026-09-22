import React, { useState } from 'react';
import { AuthUser, DropdownOptionsMap, Language } from '../types';
import {
  ListFilter,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Layers,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Users,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { INITIAL_DROPDOWN_OPTIONS } from '../data/emergencyBotConfig';

interface DropdownManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  dropdownOptions: DropdownOptionsMap;
  onSaveDropdownOptions: (updated: DropdownOptionsMap) => void;
  language: Language;
}

export const DropdownManagerModal: React.FC<DropdownManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  dropdownOptions,
  onSaveDropdownOptions,
  language,
}) => {
  const [activeCategory, setActiveCategory] = useState<keyof DropdownOptionsMap>('technicalCategories');
  const [localOptions, setLocalOptions] = useState<DropdownOptionsMap>(dropdownOptions);
  const [newItemText, setNewItemText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const trimmed = newItemText.trim();
    if ((localOptions[activeCategory] as string[]).includes(trimmed)) {
      alert(language === 'ar' ? 'هذا الخيار موجود بالفعل في القائمة!' : 'Item already exists in this list!');
      return;
    }

    const updated = {
      ...localOptions,
      [activeCategory]: [...(localOptions[activeCategory] as any[]), trimmed],
    };

    setLocalOptions(updated);
    onSaveDropdownOptions(updated);
    setNewItemText('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemoveItem = (index: number) => {
    const currentList = localOptions[activeCategory] as any[];
    if (currentList.length <= 1) {
      alert(language === 'ar' ? 'يجب أن تحتوي القائمة على عنصر واحد على الأقل!' : 'List must contain at least one item!');
      return;
    }

    const updatedList = currentList.filter((_, i) => i !== index);
    const updated = {
      ...localOptions,
      [activeCategory]: updatedList,
    };

    setLocalOptions(updated);
    onSaveDropdownOptions(updated);
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        language === 'ar'
          ? 'هل تريد استعادة جميع القوائم المنسدلة إلى القيم الافتراضية المعتمدة؟'
          : 'Reset all dropdown options to system defaults?'
      )
    ) {
      setLocalOptions(INITIAL_DROPDOWN_OPTIONS);
      onSaveDropdownOptions(INITIAL_DROPDOWN_OPTIONS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const tabs: { key: keyof DropdownOptionsMap; labelAr: string; labelEn: string; icon: any }[] = [
    { key: 'technicalCategories', labelAr: 'المجالات الفنية للمخاطر', labelEn: 'Technical Categories', icon: Layers },
    { key: 'stations', labelAr: 'المحطات والمنشآت المعتمدة', labelEn: 'Stations & Sites', icon: Building2 },
    { key: 'rootCauses', labelAr: 'الأسباب الجذرية للبلاغات', labelEn: 'Root Causes', icon: AlertTriangle },
    { key: 'assignedTeams', labelAr: 'فرق التوجيه والمتابعة', labelEn: 'Assigned Teams', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100">
                {language === 'ar' ? 'إدارة وتخصيص القوائم المنسدلة' : 'Dropdown Lists Manager'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'صلاحيات المدير العام ومدير النظام لإضافة وحذف وتعديل الخيارات التي تظهر للمستخدمين'
                  : 'System Administrator privileges to customize options across the entire platform'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                  {(localOptions[tab.key] as any[]).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Add New Item Form */}
          <form onSubmit={handleAddItem} className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {language === 'ar'
                ? `إضافة خيار جديد إلى "${tabs.find((t) => t.key === activeCategory)?.labelAr}":`
                : `Add new option to "${tabs.find((t) => t.key === activeCategory)?.labelEn}":`}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'اكتب اسم الخيار الجديد هنا...'
                    : 'Type new dropdown value here...'
                }
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة للقائمة' : 'Add Option'}</span>
              </button>
            </div>
          </form>

          {/* Success Indicator */}
          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {language === 'ar'
                  ? 'تم تحديث القائمة بنجاح وحفظ التغييرات في النظام بالكامل!'
                  : 'Dropdown list updated and persisted system-wide!'}
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>{language === 'ar' ? 'الخيارات الحالية المفعلة:' : 'Current Active Options:'}</span>
              <span className="text-[11px] font-mono">
                {language === 'ar' ? 'العدد الكلي:' : 'Total:'}{' '}
                {(localOptions[activeCategory] as any[]).length}
              </span>
            </div>

            <div className="space-y-1.5 max-h-[35vh] overflow-y-auto pr-1">
              {(localOptions[activeCategory] as string[]).map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-lg bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200">{item}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    title={language === 'ar' ? 'حذف من القائمة' : 'Remove option'}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow"
          >
            {language === 'ar' ? 'إغلاق وحفظ' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
