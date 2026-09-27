import React, { useState } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Sliders,
  Camera,
  Mic,
  Activity,
  Layers,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Info,
  Check,
  X,
} from 'lucide-react';
import { VisualPattern, AcousticPattern, AiLibraryConfig, VisualPatternCategory, AcousticPatternCategory } from '../types/aiInspection';
import { DEFAULT_AI_LIBRARY_CONFIG, DEFAULT_VISUAL_PATTERNS, DEFAULT_ACOUSTIC_PATTERNS } from '../data/defaultAiInspectionLibrary';

interface AiLibraryManagerSectionProps {
  config: AiLibraryConfig;
  onUpdateConfig: (newConfig: AiLibraryConfig) => void;
  onResetConfig?: () => void;
}

export const AiLibraryManagerSection: React.FC<AiLibraryManagerSectionProps> = ({
  config,
  onUpdateConfig,
  onResetConfig,
}) => {
  const [activeSection, setActiveSection] = useState<'visual' | 'acoustic' | 'calibration'>('visual');
  const [saveToast, setSaveToast] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // New Visual Pattern Modal State
  const [isAddingVisual, setIsAddingVisual] = useState(false);
  const [newVisName, setNewVisName] = useState('');
  const [newVisCategory, setNewVisCategory] = useState<VisualPatternCategory>('VAPOR_LEAK');
  const [newVisComponent, setNewVisComponent] = useState('');
  const [newVisThreshold, setNewVisThreshold] = useState('');
  const [newVisSeverity, setNewVisSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const [newVisImmediate, setNewVisImmediate] = useState('');
  const [newVisPreventive, setNewVisPreventive] = useState('');
  const [newVisImage, setNewVisImage] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  );

  // New Acoustic Pattern Modal State
  const [isAddingAcoustic, setIsAddingAcoustic] = useState(false);
  const [newAcName, setNewAcName] = useState('');
  const [newAcCategory, setNewAcCategory] = useState<AcousticPatternCategory>('GAS_HISS');
  const [newAcMinHz, setNewAcMinHz] = useState(14000);
  const [newAcMaxHz, setNewAcMaxHz] = useState(22000);
  const [newAcDb, setNewAcDb] = useState(65);
  const [newAcComponent, setNewAcComponent] = useState('');
  const [newAcDiagnosis, setNewAcDiagnosis] = useState('');
  const [newAcImmediate, setNewAcImmediate] = useState('');
  const [newAcPreventive, setNewAcPreventive] = useState('');

  // Handle Training Simulation
  const handleTrainModels = () => {
    setIsTraining(true);
    setTrainingProgress(15);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          const updated = {
            ...config,
            lastCalibratedAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
          };
          onUpdateConfig(updated);
          setSaveToast(true);
          setTimeout(() => setSaveToast(false), 2500);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Add Visual Pattern
  const handleSaveNewVisual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisName.trim() || !newVisComponent.trim()) return;

    const newPattern: VisualPattern = {
      id: `vis-custom-${Date.now()}`,
      category: newVisCategory,
      nameAr: newVisName.trim(),
      nameEn: newVisName.trim(),
      descriptionAr: `نمط بصري مضاف لـ ${newVisComponent}`,
      descriptionEn: `Custom visual model for ${newVisComponent}`,
      targetComponent: newVisComponent.trim(),
      thresholdParam: newVisThreshold.trim() || 'معيار مخصص محدد بواسطة مدير النظام',
      baselineImageUrl: newVisImage.trim(),
      defaultSeverity: newVisSeverity,
      immediateActionAr: newVisImmediate.trim() || 'إيقاف المعدة وعزل منطقة العمل فوراً.',
      preventiveActionAr: newVisPreventive.trim() || 'إجراء فحص فني شامل وإصلاح العطل.',
      sampleCount: 5000,
      confidenceScore: 97.2,
      isTrained: true,
    };

    const updated = {
      ...config,
      visualPatterns: [newPattern, ...config.visualPatterns],
    };
    onUpdateConfig(updated);
    setIsAddingVisual(false);
    resetVisualForm();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const resetVisualForm = () => {
    setNewVisName('');
    setNewVisComponent('');
    setNewVisThreshold('');
    setNewVisImmediate('');
    setNewVisPreventive('');
  };

  // Delete Visual Pattern
  const handleDeleteVisual = (id: string) => {
    const updated = {
      ...config,
      visualPatterns: config.visualPatterns.filter((p) => p.id !== id),
    };
    onUpdateConfig(updated);
  };

  // Add Acoustic Pattern
  const handleSaveNewAcoustic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcName.trim() || !newAcComponent.trim()) return;

    const newPattern: AcousticPattern = {
      id: `ac-custom-${Date.now()}`,
      category: newAcCategory,
      nameAr: newAcName.trim(),
      nameEn: newAcName.trim(),
      descriptionAr: `بصمة صوتية ترددية لـ ${newAcComponent}`,
      descriptionEn: `Acoustic signature for ${newAcComponent}`,
      frequencyRangeHz: { min: Number(newAcMinHz), max: Number(newAcMaxHz) },
      decibelThreshold: Number(newAcDb),
      targetMechanicalComponent: newAcComponent.trim(),
      faultDiagnosisAr: newAcDiagnosis.trim() || 'عطل صوتي ميكانيكي تم رصده بالميكروفون.',
      immediateActionAr: newAcImmediate.trim() || 'تخفيض حمل الماكينة وفحص التزييت فوراً.',
      preventiveActionAr: newAcPreventive.trim() || 'جدولة الصيانة الوقائية واستبدال القطع المتآكلة.',
      sampleCount: 4500,
      confidenceScore: 96.5,
      isTrained: true,
    };

    const updated = {
      ...config,
      acousticPatterns: [newPattern, ...config.acousticPatterns],
    };
    onUpdateConfig(updated);
    setIsAddingAcoustic(false);
    resetAcousticForm();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const resetAcousticForm = () => {
    setNewAcName('');
    setNewAcComponent('');
    setNewAcDiagnosis('');
    setNewAcImmediate('');
    setNewAcPreventive('');
  };

  // Delete Acoustic Pattern
  const handleDeleteAcoustic = (id: string) => {
    const updated = {
      ...config,
      acousticPatterns: config.acousticPatterns.filter((p) => p.id !== id),
    };
    onUpdateConfig(updated);
  };

  // Export AI Library as JSON
  const handleExportLibrary = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `minhaj_ai_inspection_library_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                تغذية والتحكم في مكتبة الذكاء الاصطناعي (Computer Vision & Hearing Library)
              </h3>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                تحكم مدير التطبيق
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تتيح لك إضافة نماذج تسريب الغاز، ضبط ترددات اهتزاز المواسير والضواغط، وبصمات هسهسة الغاز واحتكاك المحامل
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTrainModels}
            disabled={isTraining}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isTraining ? `جاري المعايرة (${trainingProgress}%)` : 'معايرة وإعادة تدريب النماذج'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportLibrary}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            title="تصدير مكتبة الذكاء الاصطناعي كنسخة احتياطية"
          >
            <Download className="w-3.5 h-3.5" />
            <span>نسخ احتياطي JSON</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تم تحديث وحفظ بيانات مكتبة الذكاء الاصطناعي بنجاح وتفعيلها في كافة أنحاء التطبيق!</span>
        </div>
      )}

      {/* Tabs Switcher: الرصد البصري | الرصد الصوتي | حساسية القياس */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSection('visual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 cursor-pointer ${
            activeSection === 'visual'
              ? 'bg-blue-600 text-white shadow font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. مكتبة النماذج البصرية ({config.visualPatterns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('acoustic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 cursor-pointer ${
            activeSection === 'acoustic'
              ? 'bg-purple-600 text-white shadow font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>2. مكتبة البصمات الصوتية ({config.acousticPatterns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('calibration')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 cursor-pointer ${
            activeSection === 'calibration'
              ? 'bg-amber-500 text-slate-950 shadow font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. حساسية القياس والمعايرة العامة</span>
        </button>
      </div>

      {/* SECTION 1: Visual Inspection Models Library */}
      {activeSection === 'visual' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-400" />
                نماذج الرصد البصري بالكاميرا (Computer Vision Models)
              </h4>
              <p className="text-[11px] text-slate-400">
                تسريبات الغاز المرئية (Vapor Leaks) • اهتزازات المواسير والضواغط • التآكل والصدأ • فحص مهمات الوقاية PPE
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingVisual(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة نموذج فحص بصري جديد</span>
            </button>
          </div>

          {/* Add Visual Modal / Form */}
          {isAddingVisual && (
            <form
              onSubmit={handleSaveNewVisual}
              className="bg-slate-950 p-5 rounded-2xl border-2 border-blue-500/50 space-y-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-blue-300">
                  تغذية نموذج بصري جديد إلى مكتبة الذكاء الاصطناعي:
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingVisual(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">اسم النمط / العطل:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تسريب بخار غاز بفلنجة الضاغط"
                    value={newVisName}
                    onChange={(e) => setNewVisName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">فئة الرصد البصري:</label>
                  <select
                    value={newVisCategory}
                    onChange={(e) => setNewVisCategory(e.target.value as VisualPatternCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  >
                    <option value="VAPOR_LEAK">تسريبات الغاز المرئية (Visible Vapor Leaks)</option>
                    <option value="VIBRATION_MONITORING">اهتزازات المواسير والضواغط (Vibration Monitoring)</option>
                    <option value="CORROSION_DETECTION">التآكل والصدأ (Corrosion Detection)</option>
                    <option value="PPE_COMPLIANCE">تحقق الأمان ومهمات الوقاية (PPE Compliance)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">المعدّة أو الموضع المستهدف:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فلنجات خطوط الضغط العالي 250 Bar"
                    value={newVisComponent}
                    onChange={(e) => setNewVisComponent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">المعيار المرجعي للقياس (Threshold):</label>
                  <input
                    type="text"
                    placeholder="مثال: كثافة السحابة > 15% أو اهتزاز > 4.5 mm/s"
                    value={newVisThreshold}
                    onChange={(e) => setNewVisThreshold(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">درجة الخطورة الافتراضية:</label>
                  <select
                    value={newVisSeverity}
                    onChange={(e) => setNewVisSeverity(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  >
                    <option value="high">حرجة ووشيكة (High Severity)</option>
                    <option value="medium">متوسطة (Medium)</option>
                    <option value="low">منخفضة (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">رابط صورة مرجعية للتدريب:</label>
                  <input
                    type="text"
                    value={newVisImage}
                    onChange={(e) => setNewVisImage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-blue-400 font-mono text-[10px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">الإجراء الفوري التلقائي المقترح:</label>
                  <input
                    type="text"
                    placeholder="مثال: إيقاف خط الضغط وعزل الصمام الفرعي فوراً"
                    value={newVisImmediate}
                    onChange={(e) => setNewVisImmediate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">الإجراء الوقائي طويل المدى:</label>
                  <input
                    type="text"
                    placeholder="مثال: استبدال الجوانات الحلقية وإعادة الربط بالعزم المحدد"
                    value={newVisPreventive}
                    onChange={(e) => setNewVisPreventive(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingVisual(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow"
                >
                  حفظ وتغذية النموذج بالمكتبة
                </button>
              </div>
            </form>
          )}

          {/* Existing Visual Patterns List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.visualPatterns.map((pat) => (
              <div
                key={pat.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
                      {pat.category}
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-white mt-1">{pat.nameAr}</h5>
                    <p className="text-[11px] text-slate-400">{pat.descriptionAr}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteVisual(pat.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg bg-slate-900 transition"
                    title="حذف هذا النموذج من المكتبة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <div>
                    <span className="text-slate-500 font-bold">المعدّة المستهدفة:</span>{' '}
                    <strong className="text-slate-200">{pat.targetComponent}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">المعيار المرجعي للقياس:</span>{' '}
                    <span className="text-amber-400 font-mono">{pat.thresholdParam}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>عدد الصور التدريبية: {pat.sampleCount.toLocaleString()}</span>
                    <span className="text-emerald-400 font-bold">دقة النموذج: {pat.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Acoustic Machine Hearing Models Library */}
      {activeSection === 'acoustic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-purple-400" />
                نماذج الرصد الصوتي للماكينات (Machine Hearing Library)
              </h4>
              <p className="text-[11px] text-slate-400">
                هسهسة تسريب الغاز عالي التردد (14-22 kHz) • احتكاك المحامل وصرير نقص التزييت (2.5-5.5 kHz) • صدم البستون
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingAcoustic(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة بصمة صوتية جديدة</span>
            </button>
          </div>

          {/* Add Acoustic Modal / Form */}
          {isAddingAcoustic && (
            <form
              onSubmit={handleSaveNewAcoustic}
              className="bg-slate-950 p-5 rounded-2xl border-2 border-purple-500/50 space-y-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-purple-300">
                  تغذية بصمة صوتية ترددية جديدة إلى مكتبة الماكينات:
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingAcoustic(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">اسم البصمة الصوتية:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: هسهسة تسريب صمام التنفيس"
                    value={newAcName}
                    onChange={(e) => setNewAcName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">نوع العطل الصوتي:</label>
                  <select
                    value={newAcCategory}
                    onChange={(e) => setNewAcCategory(e.target.value as AcousticPatternCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  >
                    <option value="GAS_HISS">هسهسة تسريب غاز عالي التردد (Gas Hissing)</option>
                    <option value="MECHANICAL_GRINDING">احتكاك ميكانيكي وتلف محامل (Mechanical Grinding)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">العضو الميكانيكي المستهدف:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محامل عمود الضاغط الرئيسي"
                    value={newAcComponent}
                    onChange={(e) => setNewAcComponent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">نطاق التردد المستهدف (Hz):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min Hz"
                      value={newAcMinHz}
                      onChange={(e) => setNewAcMinHz(Number(e.target.value))}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-center font-mono"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max Hz"
                      value={newAcMaxHz}
                      onChange={(e) => setNewAcMaxHz(Number(e.target.value))}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-center font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">حد الديسيبل (dB Threshold):</label>
                  <input
                    type="number"
                    value={newAcDb}
                    onChange={(e) => setNewAcDb(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">التشخيص الصوتي الدقيق:</label>
                  <input
                    type="text"
                    placeholder="مثال: تآكل في قفص المحامل أو انهيار طبقة التزييت"
                    value={newAcDiagnosis}
                    onChange={(e) => setNewAcDiagnosis(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">الإجراء الفوري التلقائي:</label>
                  <input
                    type="text"
                    placeholder="مثال: إيقاف الضاغط لمنع قفش العمود"
                    value={newAcImmediate}
                    onChange={(e) => setNewAcImmediate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">الإجراء الوقائي طويل المدى:</label>
                  <input
                    type="text"
                    placeholder="مثال: استبدال طقم المحامل وفحص خلوص العمود"
                    value={newAcPreventive}
                    onChange={(e) => setNewAcPreventive(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAcoustic(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow"
                >
                  حفظ وتغذية البصمة الصوتية بالمكتبة
                </button>
              </div>
            </form>
          )}

          {/* Existing Acoustic Patterns List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.acousticPatterns.map((pat) => (
              <div
                key={pat.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                      {pat.category} • {pat.frequencyRangeHz.min / 1000}k-{pat.frequencyRangeHz.max / 1000}k Hz
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-white mt-1">{pat.nameAr}</h5>
                    <p className="text-[11px] text-slate-400">{pat.descriptionAr}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAcoustic(pat.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg bg-slate-900 transition"
                    title="حذف هذه البصمة من المكتبة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <div>
                    <span className="text-slate-500 font-bold">العضو الميكانيكي:</span>{' '}
                    <strong className="text-slate-200">{pat.targetMechanicalComponent}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">التشخيص المعياري:</span>{' '}
                    <span className="text-pink-300">{pat.faultDiagnosisAr}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>حد الصوت: &gt; {pat.decibelThreshold} dB</span>
                    <span className="text-purple-300 font-bold">دقة النموذج: {pat.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Global Calibration & Sensitivity */}
      {activeSection === 'calibration' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                معايرة حساسية الذكاء الاصطناعي العامة في الميدان
              </h4>
              <p className="text-[11px] text-slate-400">
                التحكم في حساسية الفحص البصري وحساسية ميكروفون الموبايل للتسريبات والأعطال
              </p>
            </div>

            {onResetConfig && (
              <button
                type="button"
                onClick={onResetConfig}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة المكتبة الأصلية</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Sensitivity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">حساسية الرصد البصري (Computer Vision Sensitivity):</span>
                <span className="font-mono text-blue-400 font-bold">{config.visualSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={config.visualSensitivity}
                onChange={(e) =>
                  onUpdateConfig({ ...config, visualSensitivity: Number(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                زيادة الحساسية ترصد أصغر سحب البخار (Vapor Plume) والتآكل الأولي ولكن قد تزيد الإنذارات الكاذبة.
              </p>
            </div>

            {/* Acoustic Sensitivity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">حساسية الرصد الصوتي (Machine Hearing Sensitivity):</span>
                <span className="font-mono text-purple-400 font-bold">{config.acousticSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={config.acousticSensitivity}
                onChange={(e) =>
                  onUpdateConfig({ ...config, acousticSensitivity: Number(e.target.value) })
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                تحديد مدى حساسية التقاط هسهسة الغاز الترددية واحتكاك المحامل وسط الضجيج الميداني.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoAlertOnCritical}
                onChange={(e) =>
                  onUpdateConfig({ ...config, autoAlertOnCritical: e.target.checked })
                }
                className="accent-amber-500 w-4 h-4 rounded"
              />
              <span className="text-slate-200 font-bold">
                إطلاق صافرة إنذار صوتية فور رصد تسريب غاز نشط أو عطل حرج
              </span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoCreateObservationCard}
                onChange={(e) =>
                  onUpdateConfig({ ...config, autoCreateObservationCard: e.target.checked })
                }
                className="accent-amber-500 w-4 h-4 rounded"
              />
              <span className="text-slate-200 font-bold">
                توليد بطاقة ملاحظة STOP تلقائية عند تجاوز عتبة الخطر
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
