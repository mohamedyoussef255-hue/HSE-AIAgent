import React, { useState } from 'react';
import {
  ShieldAlert,
  Settings,
  ListFilter,
  Scan,
  Database,
  Users,
  Server,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DropdownOptionsMap, Language } from '../types';

interface SystemAdminControlPanelViewProps {
  dropdownOptions: DropdownOptionsMap;
  onOpenDropdownManager: () => void;
  onOpenRadar: () => void;
  language: Language;
}

export const SystemAdminControlPanelView: React.FC<SystemAdminControlPanelViewProps> = ({
  dropdownOptions,
  onOpenDropdownManager,
  onOpenRadar,
  language,
}) => {
  const [radarSensitivity, setRadarSensitivity] = useState(85);
  const [thermalThreshold, setThermalThreshold] = useState(68);
  const [autoEvacuateThreshold, setAutoEvacuateThreshold] = useState(90);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportSystemBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      dropdownOptions,
      systemConfig: {
        radarSensitivity,
        thermalThreshold,
        autoEvacuateThreshold,
      },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minhaj_system_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100 animate-fadeIn">
      {/* Top Banner: Strictly System Admin Area */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border-2 border-purple-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/50 text-[10px] font-black uppercase tracking-wider">
                  System Admin Only • خاص بمدير التطبيق والنظام
                </span>
                <span className="text-xs text-slate-400">(مستقلة تماماً عن مدير عام الإدارة)</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {language === 'ar' ? 'لوحة تحكم مدير النظام والتطبيق البرمجي' : 'System & Application Admin Control Panel'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'التحكم المركزي في معايير وخوادم التطبيق، وإدارة القوائم المنسدلة، وضبط رادار الكاميرا والذكاء الاصطناعي'
                  : 'Central configuration for dropdowns, server health, AI thermal radar parameters, and system backups'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSystemBackup}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>نسخة احتياطية للنظام (Backup)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Admin Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tool 1: Dropdown Options Manager (Exclusive to App Admin) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-purple-900/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
              <ListFilter className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">إدارة القوائم المنسدلة للتطبيق</h3>
              <p className="text-xs text-slate-400 mt-1">
                تعديل وتخصيص خيارات القوائم المنسدلة للمحطات، التصنيفات الفنية، أسباب الجذور، وفرق التوجيه لبطاقات STOP.
              </p>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>التصنيفات الفنية:</span>
                <span className="font-bold text-purple-300">{dropdownOptions.technicalCategories.length} خيار</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>المحطات والمستودعات:</span>
                <span className="font-bold text-purple-300">{dropdownOptions.stations.length} موقع</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>أسباب الجذور المحتملة:</span>
                <span className="font-bold text-purple-300">{dropdownOptions.rootCauses.length} سبب</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDropdownManager}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
          >
            <ListFilter className="w-4 h-4" />
            <span>فتح محرر القوائم المنسدلة (Admin)</span>
          </button>
        </div>

        {/* Tool 2: AI Camera & Thermal Radar Calibration (Exclusive to App Admin) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-cyan-900/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">معايرة رادار الكاميرا والحرارة الذكي</h3>
              <p className="text-xs text-slate-400 mt-1">
                ضبط خوارزميات الذكاء الاصطناعي لكشف الحوادث الوشيكة والنقاط الحرارية الساخنة بمستشعرات الكاميرا.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">حساسية كشف الحوادث الوشيكة:</span>
                  <span className="font-bold text-cyan-300">{radarSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={radarSensitivity}
                  onChange={(e) => setRadarSensitivity(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">عتبة الإنذار الحراري القصوى:</span>
                  <span className="font-bold text-rose-400">{thermalThreshold} °C</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={thermalThreshold}
                  onChange={(e) => setThermalThreshold(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Settings className="w-4 h-4" />}
              <span>{savedSuccess ? 'تم حفظ المعايرة بنجاح' : 'حفظ إعدادات الرادار'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenRadar}
              className="w-full py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>تشغيل واختبار رادار الكاميرا</span>
            </button>
          </div>
        </div>

        {/* Tool 3: Server Health & Security Audit */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-emerald-900/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">حالة الخادم وتكاملات النظام</h3>
              <p className="text-xs text-slate-400 mt-1">
                مراقبة أداء السيرفر السحابي، حالة الاتصال بالإنترنت، وحالة المزامنة دون اتصال (Offline-First).
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">حالة قاعدة البيانات:</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  متصل ومزامن (Operational)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">محرك الصوت والذكاء الاصطناعي:</span>
                <span className="text-cyan-300 font-bold">نشط ومفعّل (Web Audio & Speech)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">زمن استجابة النظام:</span>
                <span className="font-mono text-amber-300 font-bold">24 ms</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-800/40 text-[11px] text-purple-200 text-center">
            🔐 هذه الصفحة والصلاحيات مشفرة ومحجوبة تماماً عن مديري السلامة والموظفين.
          </div>
        </div>
      </div>
    </div>
  );
};
