import React, { useState } from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  Layout,
  Smartphone,
  LayoutDashboard,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Shield,
  Bot,
  ListFilter,
  FileSpreadsheet,
  Printer,
  Table,
  Clock,
  KeyRound,
  Search,
  CloudSun,
  QrCode,
  UserCheck,
  Radio,
  MapPin,
  Mic,
  Cpu,
  Flame,
  Camera,
  Video,
  Award,
  ToggleLeft,
  ToggleRight,
  Save,
  Check,
  Navigation,
} from 'lucide-react';
import { AppUiCustomization, Language } from '../types';
import { DEFAULT_APP_UI_CUSTOMIZATION } from '../data/defaultUiCustomization';

interface AdminUiCustomizationSectionProps {
  uiCustomization: AppUiCustomization;
  onUpdateUiCustomization: (newConfig: AppUiCustomization) => void;
  onResetUiCustomization: () => void;
  language: Language;
}

export const AdminUiCustomizationSection: React.FC<AdminUiCustomizationSectionProps> = ({
  uiCustomization,
  onUpdateUiCustomization,
  onResetUiCustomization,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'director' | 'worker' | 'header'>('director');
  const [savedToast, setSavedToast] = useState(false);

  // Local editable copy
  const [config, setConfig] = useState<AppUiCustomization>(uiCustomization);

  // Keep in sync if prop changes
  React.useEffect(() => {
    setConfig(uiCustomization);
  }, [uiCustomization]);

  const handleToggleDirector = (key: keyof AppUiCustomization['directorPage']) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        directorPage: {
          ...prev.directorPage,
          [key]: !prev.directorPage[key],
        },
      };
      onUpdateUiCustomization(updated);
      showToast();
      return updated;
    });
  };

  const handleToggleWorker = (key: keyof AppUiCustomization['workerPage']) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        workerPage: {
          ...prev.workerPage,
          [key]: !prev.workerPage[key],
        },
      };
      onUpdateUiCustomization(updated);
      showToast();
      return updated;
    });
  };

  const handleToggleHeader = (key: keyof AppUiCustomization['headerBar']) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        headerBar: {
          ...prev.headerBar,
          [key]: !prev.headerBar[key],
        },
      };
      onUpdateUiCustomization(updated);
      showToast();
      return updated;
    });
  };

  const handleDirectorTextChange = (field: 'pageTitle' | 'pageSubtitle', val: string) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        directorPage: {
          ...prev.directorPage,
          [field]: val,
        },
      };
      onUpdateUiCustomization(updated);
      return updated;
    });
  };

  const handleWorkerTextChange = (field: 'pageTitle' | 'pageSubtitle', val: string) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        workerPage: {
          ...prev.workerPage,
          [field]: val,
        },
      };
      onUpdateUiCustomization(updated);
      return updated;
    });
  };

  const showToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm(language === 'ar' ? 'هل تريد استعادة الضبط الافتراضي لجميع الصفحات والمحتويات؟' : 'Reset all UI customizations to system defaults?')) {
      setConfig(DEFAULT_APP_UI_CUSTOMIZATION);
      onResetUiCustomization();
      showToast();
    }
  };

  const handleEnableAllCurrent = () => {
    setConfig((prev) => {
      let updated = { ...prev };
      if (activeTab === 'director') {
        const dp = { ...prev.directorPage };
        Object.keys(dp).forEach((k) => {
          if (typeof dp[k as keyof typeof dp] === 'boolean') {
            (dp[k as keyof typeof dp] as any) = true;
          }
        });
        updated = { ...updated, directorPage: dp };
      } else if (activeTab === 'worker') {
        const wp = { ...prev.workerPage };
        Object.keys(wp).forEach((k) => {
          if (typeof wp[k as keyof typeof wp] === 'boolean') {
            (wp[k as keyof typeof wp] as any) = true;
          }
        });
        updated = { ...updated, workerPage: wp };
      } else {
        const hb = { ...prev.headerBar };
        Object.keys(hb).forEach((k) => {
          (hb[k as keyof typeof hb] as any) = true;
        });
        updated = { ...updated, headerBar: hb };
      }
      onUpdateUiCustomization(updated);
      showToast();
      return updated;
    });
  };

  return (
    <div className="bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-950/50">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-md">
                Admin Exclusive Control • تحكم مدير النظام الكامل
              </span>
              {savedToast && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                  <Check className="w-3 h-3" /> تم تطبيق التعديل وحفظه فوراً
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              التحكم الشامل في ظهور الصفحات، الأيقونات، وتعديل المحتوى (إظهار / إخفاء / تغيير)
            </h3>
            <p className="text-xs text-slate-300">
              يمكنك كمدير نظام إظهار وإخفاء أي عنصر، زر، ويدجت، وتعديل العناوين والنصوص لصفحة المدير العام وصفحة مستخدم الميدان، والتحكم في ظهور الصفحات والأيقونات العلوية.
            </p>
          </div>
        </div>

        {/* Global Reset & Enable All Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleEnableAllCurrent}
            className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5"
            title="إظهار كافة العناصر في هذا التبويب"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>إظهار الكل</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            title="استعادة الإعدادات الأصلية"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>استعادة الافتراضي</span>
          </button>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('director')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'director'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>صفحة مدير عام الإدارة (HSE Management)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('worker')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'worker'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>صفحة المستخدم وتطبيق الميدان (Field Mobile)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'header'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>ظهور الصفحات والأيقونات العلوية (Header & Tabs)</span>
        </button>
      </div>

      {/* TAB 1: DIRECTOR PAGE CONTROLS */}
      {activeTab === 'director' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section: Text Customization (Titles & Subtitles) */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                تعديل وتغيير عناوين ونصوص صفحة المدير العام:
              </h4>
              <span className="text-[11px] text-slate-400">تحديث فوري للمحتوى</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  العنوان الرئيسي لصفحة المدير العام:
                </label>
                <input
                  type="text"
                  value={config.directorPage.pageTitle}
                  onChange={(e) => handleDirectorTextChange('pageTitle', e.target.value)}
                  placeholder="لوحة التحكم والإدارة العليا - STOP"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-semibold focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  العنوان الفرعي والوصف لصفحة المدير العام:
                </label>
                <input
                  type="text"
                  value={config.directorPage.pageSubtitle}
                  onChange={(e) => handleDirectorTextChange('pageSubtitle', e.target.value)}
                  placeholder="متابعة البلاغات، أتمتة التوجيه للورديات..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Director Elements Visibility Toggles */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layout className="w-4 h-4 text-purple-400" />
              مفاتيح إظهار وإخفاء محتويات وأزرار صفحة المدير العام:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Toggle 1: Executive Summary */}
              <ToggleCard
                title="الملخص التنفيذي ومعدل السلامة"
                subtitle="الشريط العلوي الرسمي للترويسة ونسبة السلامة العامة"
                icon={<Shield className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.directorPage.showExecutiveSummary}
                onToggle={() => handleToggleDirector('showExecutiveSummary')}
              />

              {/* Toggle 2: KPI Cards */}
              <ToggleCard
                title="كروت المؤشرات الرقمية (KPIs)"
                subtitle="إجمالي بطاقات STOP، المخاطر الحرجة، نسب التصرفات والحالات"
                icon={<Flame className="w-4 h-4 text-rose-400" />}
                isEnabled={config.directorPage.showKpiCards}
                onToggle={() => handleToggleDirector('showKpiCards')}
              />

              {/* Toggle 3: Observations Table */}
              <ToggleCard
                title="جدول سجل البلاغات والملاحظات"
                subtitle="الجدول التفصيلي لمتابعة وإغلاق بطاقات الرصد وتعيين الفرق"
                icon={<Table className="w-4 h-4 text-amber-400" />}
                isEnabled={config.directorPage.showObservationsTable}
                onToggle={() => handleToggleDirector('showObservationsTable')}
              />

              {/* Toggle 4: Time to Closure Widget */}
              <ToggleCard
                title="مؤشر متوسط زمن إغلاق الملاحظات"
                subtitle="الويدجت التحليلي لمتابعة سرعة معالجة البلاغات حسب الأقسام"
                icon={<Clock className="w-4 h-4 text-cyan-400" />}
                isEnabled={config.directorPage.showTimeToClosureWidget}
                onToggle={() => handleToggleDirector('showTimeToClosureWidget')}
              />

              {/* Toggle 5: Emergency Bot Button */}
              <ToggleCard
                title="زر بوت الطوارئ خارج أوقات العمل"
                subtitle="زر الوصول لبوت الطوارئ للتعامل الآلي خارج ساعات العمل"
                icon={<Bot className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.directorPage.showEmergencyBotBtn}
                onToggle={() => handleToggleDirector('showEmergencyBotBtn')}
              />

              {/* Toggle 6: Dropdown Manager Button */}
              <ToggleCard
                title="زر تعديل القوائم المنسدلة"
                subtitle="إظهار أو إخفاء زر محرر القوائم المنسدلة بالصفحة"
                icon={<ListFilter className="w-4 h-4 text-purple-400" />}
                isEnabled={config.directorPage.showDropdownManagerBtn}
                onToggle={() => handleToggleDirector('showDropdownManagerBtn')}
              />

              {/* Toggle 7: Export Excel Button */}
              <ToggleCard
                title="زر تصدير بيانات Excel (CSV)"
                subtitle="زر تصدير وتنزيل كافة بيانات البلاغات بصيغة إكسيل"
                icon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.directorPage.showExportExcelBtn}
                onToggle={() => handleToggleDirector('showExportExcelBtn')}
              />

              {/* Toggle 8: Print Report Button */}
              <ToggleCard
                title="زر طباعة تقرير الإدارة (PDF)"
                subtitle="زر تجهيز وطباعة تقرير الإدارة الرسمي المعتمد"
                icon={<Printer className="w-4 h-4 text-amber-400" />}
                isEnabled={config.directorPage.showPrintReportBtn}
                onToggle={() => handleToggleDirector('showPrintReportBtn')}
              />

              {/* Toggle 9: Change Password Button */}
              <ToggleCard
                title="زر تغيير كلمة سر المدير العام"
                subtitle="الزر الذي يتيح للمدير العام تعديل كلمة مروره الخاصة به"
                icon={<KeyRound className="w-4 h-4 text-amber-400" />}
                isEnabled={config.directorPage.showChangePasswordBtn}
                onToggle={() => handleToggleDirector('showChangePasswordBtn')}
              />

              {/* Toggle 10: Search Bar */}
              <ToggleCard
                title="شريط البحث السريع في البلاغات"
                subtitle="مربع البحث بالرقم، الوصف، اسم المعدة أو الراصد"
                icon={<Search className="w-4 h-4 text-slate-300" />}
                isEnabled={config.directorPage.showSearchBar}
                onToggle={() => handleToggleDirector('showSearchBar')}
              />

              {/* Toggle 11: Severity Filter */}
              <ToggleCard
                title="فلتر تصنيف مستوى الخطورة"
                subtitle="القائمة المنسدلة لفلترة البلاغات حسب درجة الخطورة"
                icon={<Flame className="w-4 h-4 text-rose-400" />}
                isEnabled={config.directorPage.showSeverityFilter}
                onToggle={() => handleToggleDirector('showSeverityFilter')}
              />

              {/* Toggle 12: Type Filter */}
              <ToggleCard
                title="فلتر نوع بطاقة STOP"
                subtitle="فلترة التصرفات غير الآمنة والحالات والممارسات الآمنة"
                icon={<Shield className="w-4 h-4 text-amber-400" />}
                isEnabled={config.directorPage.showTypeFilter}
                onToggle={() => handleToggleDirector('showTypeFilter')}
              />

              {/* Toggle 13: Status Filter */}
              <ToggleCard
                title="فلتر حالة متابعة البلاغ"
                subtitle="فلترة البلاغات الجديدة، قيد المعالجة، والمغلقة"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.directorPage.showStatusFilter}
                onToggle={() => handleToggleDirector('showStatusFilter')}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKER PAGE CONTROLS */}
      {activeTab === 'worker' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section: Worker Text Customization */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                تعديل وتغيير عناوين ونصوص تطبيق الميدان (Field Mobile):
              </h4>
              <span className="text-[11px] text-slate-400">تحديث فوري للمحتوى</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  اسم وترويسة تطبيق الميدان:
                </label>
                <input
                  type="text"
                  value={config.workerPage.pageTitle}
                  onChange={(e) => handleWorkerTextChange('pageTitle', e.target.value)}
                  placeholder="STOP FIELD APP"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-semibold focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  الشعار والعنوان الفرعي لتطبيق الميدان:
                </label>
                <input
                  type="text"
                  value={config.workerPage.pageSubtitle}
                  onChange={(e) => handleWorkerTextChange('pageSubtitle', e.target.value)}
                  placeholder="Safety Tracking & Observation Platform • منصة تتبع وملاحظة السلامة الميدانية"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Worker Elements Visibility Toggles */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              مفاتيح إظهار وإخفاء محتويات واستمارات صفحة المستخدم / الميدان:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Toggle 1: Simplified Mode Toggle */}
              <ToggleCard
                title="محول وضع العاملين المبسط"
                subtitle="الزر الذي يتيح للعامل التبديل السريع بين الوضع المبسط والفني"
                icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.workerPage.showSimplifiedModeToggle}
                onToggle={() => handleToggleWorker('showSimplifiedModeToggle')}
              />

              {/* Toggle 2: Weather Widget */}
              <ToggleCard
                title="ويدجت نشرة الطقس وإرشادات الملابس"
                subtitle="عرض درجات الحرارة، سرعة الرياح، ومهمات الوقاية الملائمة"
                icon={<CloudSun className="w-4 h-4 text-amber-400" />}
                isEnabled={config.workerPage.showWeatherWidget}
                onToggle={() => handleToggleWorker('showWeatherWidget')}
              />

              {/* Toggle 3: QR Scan Button */}
              <ToggleCard
                title="زر مسح الباركود والمعدات (QR Scan)"
                subtitle="زر تشغيل الكاميرا للتعرف على المعدة والموقع عبر الباركود"
                icon={<QrCode className="w-4 h-4 text-amber-400" />}
                isEnabled={config.workerPage.showQrScanBtn}
                onToggle={() => handleToggleWorker('showQrScanBtn')}
              />

              {/* Toggle 4: Observer Role Toggle */}
              <ToggleCard
                title="محول صفة الراصد (عامل تشغيل / ضابط سلامة)"
                subtitle="تحديد هوية وصلاحية مقدم البلاغ لتوثيق صفة الملاحظة"
                icon={<UserCheck className="w-4 h-4 text-blue-400" />}
                isEnabled={config.workerPage.showObserverRoleToggle}
                onToggle={() => handleToggleWorker('showObserverRoleToggle')}
              />

              {/* Toggle 5: Live Stream Banner */}
              <ToggleCard
                title="شريط التنبيه بالبث المباشر للحوادث الوشيكة"
                subtitle="شريط الطوارئ الأحمر عند رصد حادث وشيك بحاجة لعزل فوري"
                icon={<Radio className="w-4 h-4 text-rose-400" />}
                isEnabled={config.workerPage.showLiveStreamNearMissBanner}
                onToggle={() => handleToggleWorker('showLiveStreamNearMissBanner')}
              />

              {/* Toggle 6: Asset Location Selector */}
              <ToggleCard
                title="حقل اختيار المحطة والموقع والمعدة"
                subtitle="بطاقة تحديد المنشأة والموقع التفصيلي للواقعة المرصودة"
                icon={<MapPin className="w-4 h-4 text-amber-400" />}
                isEnabled={config.workerPage.showAssetLocationSelector}
                onToggle={() => handleToggleWorker('showAssetLocationSelector')}
              />

              {/* Toggle 7: Voice Recorder */}
              <ToggleCard
                title="زر ومسجل الملاحظات الصوتية"
                subtitle="تحويل التسجيل الصوتي الميداني إلى نص تلقائياً باللغة العربية"
                icon={<Mic className="w-4 h-4 text-purple-400" />}
                isEnabled={config.workerPage.showVoiceRecorder}
                onToggle={() => handleToggleWorker('showVoiceRecorder')}
              />

              {/* Toggle 8: Description Field */}
              <ToggleCard
                title="حقل كتابة تفاصيل الملاحظة الميدانية"
                subtitle="مربع النص الإجباري لوصف ما شاهده الموظف في الموقع"
                icon={<FileText className="w-4 h-4 text-slate-300" />}
                isEnabled={config.workerPage.showDescriptionField}
                onToggle={() => handleToggleWorker('showDescriptionField')}
              />

              {/* Toggle 9: AI Gemini Classifier Button */}
              <ToggleCard
                title="زر تصنيف الذكاء الاصطناعي التلقائي"
                subtitle="التحليل الفوري لنص الملاحظة واقتراح نوع الخطر ومسار التوجيه"
                icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
                isEnabled={config.workerPage.showAiGeminiClassifyBtn}
                onToggle={() => handleToggleWorker('showAiGeminiClassifyBtn')}
              />

              {/* Toggle 10: STOP Classification Cards */}
              <ToggleCard
                title="بطاقات تصنيف منهجية STOP"
                subtitle="أزرار الاختيار: تصرف غير آمن، حالة غير آمنة، ممارسة آمنة"
                icon={<Shield className="w-4 h-4 text-amber-400" />}
                isEnabled={config.workerPage.showStopClassificationCards}
                onToggle={() => handleToggleWorker('showStopClassificationCards')}
              />

              {/* Toggle 11: Severity Level Selector */}
              <ToggleCard
                title="محدد مستوى الخطورة والأولوية"
                subtitle="أزرار تحديد درجة الخطورة: حرج جداً، متوسط، أو عادي"
                icon={<Flame className="w-4 h-4 text-rose-400" />}
                isEnabled={config.workerPage.showSeverityLevelSelector}
                onToggle={() => handleToggleWorker('showSeverityLevelSelector')}
              />

              {/* Toggle 12: Technical Category Selector */}
              <ToggleCard
                title="قائمة التصنيف الفني التخصصي"
                subtitle="تحديد مجال الخطر: ميكانيكي، كهربائي، كيميائي، حريق..."
                icon={<Cpu className="w-4 h-4 text-purple-400" />}
                isEnabled={config.workerPage.showTechnicalCategorySelector}
                onToggle={() => handleToggleWorker('showTechnicalCategorySelector')}
              />

              {/* Toggle 13: Root Cause Selector */}
              <ToggleCard
                title="قائمة اختيار السبب الجذري (Root Cause)"
                subtitle="تحديد السبب الأساسي المحتمل للملاحظة لمنع تكرارها"
                icon={<Layers className="w-4 h-4 text-cyan-400" />}
                isEnabled={config.workerPage.showRootCauseSelector}
                onToggle={() => handleToggleWorker('showRootCauseSelector')}
              />

              {/* Toggle 14: Assigned Team Selector */}
              <ToggleCard
                title="قائمة الجهة المكلفة بالمعالجة (Assigned Team)"
                subtitle="توجيه البلاغ لمشرف الوردية أو فرق الصيانة المتخصصة"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.workerPage.showAssignedTeamSelector}
                onToggle={() => handleToggleWorker('showAssignedTeamSelector')}
              />

              {/* Toggle 15: Immediate Action Field */}
              <ToggleCard
                title="حقل الإجراء الفوري المتخذ"
                subtitle="كتابة الإجراء الذي قام به الراصد لحظياً لتأمين الخطر"
                icon={<Check className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.workerPage.showImmediateActionField}
                onToggle={() => handleToggleWorker('showImmediateActionField')}
              />

              {/* Toggle 16: Photo Upload */}
              <ToggleCard
                title="إرفاق والتقاط الصور الفوتوغرافية"
                subtitle="رفع صورة مباشرة للملاحظة أو فتح فحص الرادار الذكي"
                icon={<Camera className="w-4 h-4 text-amber-400" />}
                isEnabled={config.workerPage.showPhotoUpload}
                onToggle={() => handleToggleWorker('showPhotoUpload')}
              />

              {/* Toggle 17: Video Recorder */}
              <ToggleCard
                title="مسجل مقاطع الفيديو الميدانية"
                subtitle="تصوير مقطع فيديو قصير (حتى 30 ثانية) لتوثيق الحركة والخطر"
                icon={<Video className="w-4 h-4 text-rose-400" />}
                isEnabled={config.workerPage.showVideoRecorder}
                onToggle={() => handleToggleWorker('showVideoRecorder')}
              />

              {/* Toggle 18: Points & Rewards Indicator */}
              <ToggleCard
                title="بطاقة احتساب نقاط السلامة والمكافآت"
                subtitle="عرض النقاط التحفيزية الفورية التي يحصل عليها الموظف"
                icon={<Award className="w-4 h-4 text-amber-400" />}
                isEnabled={config.workerPage.showPointsRewardCard}
                onToggle={() => handleToggleWorker('showPointsRewardCard')}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEADER & GLOBAL PAGES VISIBILITY CONTROLS */}
      {activeTab === 'header' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-Section A: Navigation Pages Visibility */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-400" />
              التحكم في ظهور صفحات التطبيق في شريط التنقل (Navigation Tabs):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <ToggleCard
                title="صفحة استمارة الميدان (Field Mobile)"
                subtitle="شاشة تسجيل البلاغات الميدانية وإرسال بطاقات STOP"
                icon={<Smartphone className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showFieldTab}
                onToggle={() => handleToggleHeader('showFieldTab')}
              />

              <ToggleCard
                title="صفحة مركز تحكم الإدارة (Management Board)"
                subtitle="لوحة القيادة والمتابعة لمدير عام الإدارة والمشرفين"
                icon={<LayoutDashboard className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showManagementTab}
                onToggle={() => handleToggleHeader('showManagementTab')}
              />

              <ToggleCard
                title="صفحة خرائط النقاط الساخنة (Hotspot Heatmap)"
                subtitle="الخريطة التفاعلية للتركيز الجغرافي للمخاطر بالمحطات"
                icon={<MapPin className="w-4 h-4 text-rose-400" />}
                isEnabled={config.headerBar.showHeatmapTab}
                onToggle={() => handleToggleHeader('showHeatmapTab')}
              />

              <ToggleCard
                title="صفحة تحليل الأسباب الجذرية (Root Cause)"
                subtitle="تحليلات الذكاء الاصطناعي ومخططات الأسباب المتكررة"
                icon={<Layers className="w-4 h-4 text-cyan-400" />}
                isEnabled={config.headerBar.showRootCauseTab}
                onToggle={() => handleToggleHeader('showRootCauseTab')}
              />

              <ToggleCard
                title="صفحة أبطال السلامة والمكافآت (Safety Heroes)"
                subtitle="لوحة الشرف، تصنيف الموظفين، واستبدال نقاط السلامة"
                icon={<Award className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showHeroesTab}
                onToggle={() => handleToggleHeader('showHeroesTab')}
              />
            </div>
          </div>

          {/* Sub-Section B: Top Header Action Icons */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layout className="w-4 h-4 text-cyan-400" />
              التحكم في ظهور أيقونات وأزرار الشريط العلوي العام (Top Header Icons):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <ToggleCard
                title="أيقونة البث المباشر للحوادث الوشيكة"
                subtitle="زر الكاميرا والبث المباشر مع إطلاق إنذار الطوارئ"
                icon={<Radio className="w-4 h-4 text-rose-400" />}
                isEnabled={config.headerBar.showLiveStreamBtn}
                onToggle={() => handleToggleHeader('showLiveStreamBtn')}
              />

              <ToggleCard
                title="أيقونة رادار الكاميرا والحرارة الذكي"
                subtitle="فحص الصور بالكاميرا الحرارية والذكاء الاصطناعي"
                icon={<Cpu className="w-4 h-4 text-cyan-400" />}
                isEnabled={config.headerBar.showRadarScanBtn}
                onToggle={() => handleToggleHeader('showRadarScanBtn')}
              />

              <ToggleCard
                title="أيقونة تعديل القوائم المنسدلة للتطبيق"
                subtitle="محرر المحطات، التصنيفات، وأسباب الجذور"
                icon={<ListFilter className="w-4 h-4 text-purple-400" />}
                isEnabled={config.headerBar.showDropdownManagerBtn}
                onToggle={() => handleToggleHeader('showDropdownManagerBtn')}
              />

              <ToggleCard
                title="أيقونة تحميل تطبيق الموبايل"
                subtitle="تنزيل وتثبيت التطبيق لأجهزة Android و iPhone"
                icon={<Smartphone className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.headerBar.showMobileAppDownloadBtn}
                onToggle={() => handleToggleHeader('showMobileAppDownloadBtn')}
              />

              <ToggleCard
                title="أيقونة نشرة الطقس ومهمات الوقاية"
                subtitle="عرض النشرة الجوية وتوصيات السلامة بالموقع"
                icon={<CloudSun className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showWeatherAdvisoryBtn}
                onToggle={() => handleToggleHeader('showWeatherAdvisoryBtn')}
              />

              <ToggleCard
                title="أيقونة بنتونة الألوان والوضع النهاري/الليلي"
                subtitle="تخصيص ألوان الهوية البصرية والثيم العام"
                icon={<Sliders className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showThemePaletteBtn}
                onToggle={() => handleToggleHeader('showThemePaletteBtn')}
              />

              <ToggleCard
                title="أيقونة مكتبة سجل رصد الكاميرا والوسائط"
                subtitle="سجل الصور والفيديوهات والوقائع المرصودة ميدانياً"
                icon={<Video className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showCameraLibraryBtn}
                onToggle={() => handleToggleHeader('showCameraLibraryBtn')}
              />

              <ToggleCard
                title="أيقونة شات السلامة الداخلي"
                subtitle="قنوات المراسلة الفورية بين فرق السلامة والتشغيل"
                icon={<Bot className="w-4 h-4 text-amber-400" />}
                isEnabled={config.headerBar.showSafetyChatBtn}
                onToggle={() => handleToggleHeader('showSafetyChatBtn')}
              />

              <ToggleCard
                title="أيقونة بوت الطوارئ التلقائي"
                subtitle="إدارة بلاغات وتوجيهات الطوارئ خارج ساعات العمل"
                icon={<Bot className="w-4 h-4 text-emerald-400" />}
                isEnabled={config.headerBar.showEmergencyBotBtn}
                onToggle={() => handleToggleHeader('showEmergencyBotBtn')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ToggleCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  onToggle: () => void;
}

const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  subtitle,
  icon,
  isEnabled,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
        isEnabled
          ? 'bg-slate-950/80 border-purple-500/40 hover:border-purple-400 shadow-sm'
          : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-90'
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div
          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
            isEnabled ? 'bg-purple-500/15 text-purple-300' : 'bg-slate-900 text-slate-500'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-xs font-bold leading-snug truncate ${
                isEnabled ? 'text-slate-100' : 'text-slate-400 line-through'
              }`}
            >
              {title}
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.2 rounded font-mono ${
                isEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isEnabled ? 'ظاهر' : 'مخفي'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {isEnabled ? (
          <ToggleRight className="w-7 h-7 text-emerald-400" />
        ) : (
          <ToggleLeft className="w-7 h-7 text-slate-600" />
        )}
      </div>
    </div>
  );
};
