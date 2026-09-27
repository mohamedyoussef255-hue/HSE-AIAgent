import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Sliders,
  FileText,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  Download,
  Copy,
  Layers,
  Edit3,
  Eye,
  Check,
  Info,
} from 'lucide-react';
import { StopObservation, Language } from '../types';
import { StopSignLogo } from './StopSignLogo';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: StopObservation[];
  language?: Language;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  observations,
  language = 'ar',
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'customize'>('preview');
  const [copiedToast, setCopiedToast] = useState(false);

  // Editable Report Metadata controlled by the General Director
  const [reportTitle, setReportTitle] = useState(
    'التقرير التنفيذي الشامل للسلامة والصحة المهنية ومراقبة المخاطر (HSE Executive Report)'
  );
  const [reportSubtitle, setReportSubtitle] = useState(
    'منظومة STOP لرصد وتتبع الملاحظات والمخاطر الميدانية - معتمد للإدارة العليا'
  );
  const [directorName, setDirectorName] = useState(
    'م. محمد يوسف (مدير عام الإدارة العامة للسلامة والصحة المهنية)'
  );
  const [organizationName, setOrganizationName] = useState(
    'الإدارة العامة للسلامة والصحة المهنية - شركة عزوتي لتكنولوجيا المعلومات'
  );
  const [selectedStationFilter, setSelectedStationFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');
  const [reportPeriod, setReportPeriod] = useState('التقرير الشهري الشامل (نسخة 2026)');
  const [reportDate, setReportDate] = useState(
    new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  );

  // Editable Director Directives & Remarks
  const [directorStatement, setDirectorStatement] = useState(
    'بناءً على نتائج الملاحظات الميدانية المسجلة خلال هذه الفترة، نؤكد على ضرورة استكمال إغلاق كافة الحالات الحرجة المفتوحة فوراً، وتكثيف جلسات السلامة (Toolbox Talks) بمحطات الوقود ومستودعات الضواغط. كما نوجه بتفعيل الفحص الدوري بالرادار الحراري والميكروفون الصوتي لمنع حوادث تسريب الغاز وتلف المحامل استباقياً.'
  );

  // Toggles for Report Output Sections
  const [includeKpis, setIncludeKpis] = useState(true);
  const [includeObservationsTable, setIncludeObservationsTable] = useState(true);
  const [includeAiInspectionSummary, setIncludeAiInspectionSummary] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [includeOfficialStamp, setIncludeOfficialStamp] = useState(true);
  const [maxObservationsToShow, setMaxObservationsToShow] = useState(15);

  if (!isOpen) return null;

  // Filter observations based on Director's choices
  const filteredObservations = observations.filter((obs) => {
    const matchesStation = selectedStationFilter === 'ALL' || obs.stationName === selectedStationFilter;
    const matchesSeverity = selectedSeverityFilter === 'ALL' || obs.severity === selectedSeverityFilter;
    return matchesStation && matchesSeverity;
  });

  // Calculate Key Metrics
  const totalObs = filteredObservations.length;
  const criticalCount = filteredObservations.filter((o) => o.severity === 'high').length;
  const closedCount = filteredObservations.filter((o) => o.status.includes('تم الإغلاق')).length;
  const inProgressCount = totalObs - closedCount;
  const closureRate = totalObs > 0 ? Math.round((closedCount / totalObs) * 100) : 0;
  const unsafeActsCount = filteredObservations.filter((o) => o.type.includes('تصرف')).length;
  const unsafeConditionsCount = filteredObservations.filter((o) => o.type.includes('حالة')).length;

  // Available unique stations for dropdown
  const uniqueStations = Array.from(new Set(observations.map((o) => o.stationName)));

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `*${reportTitle}*\n${organizationName}\nالتاريخ: ${reportDate}\nالفترة: ${reportPeriod}\n\n*مؤشرات السلامة الحيوية:*\n• إجمالي البلاغات: ${totalObs}\n• المخاطر الحرجة: ${criticalCount}\n• الحالات المغلقة: ${closedCount} (${closureRate}%)\n• قيد المعالجة: ${inProgressCount}\n\n*توجيهات سعادة المدير العام:*\n${directorStatement}\n\nمعتمد رسمياً - منظومة STOP للسلامة 2026`;
    navigator.clipboard.writeText(summaryText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleDownloadHtml = () => {
    const printContent = document.getElementById('printable-executive-report');
    if (!printContent) return;
    const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"/><title>${reportTitle}</title><style>body{font-family:sans-serif;padding:24px;background:#fff;color:#000;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:right;}th{background:#f3f4f6;}</style></head><body>${printContent.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_السلامة_التنفيذي_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden during print styles applied through media print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-executive-report, #printable-executive-report * {
            visibility: visible;
          }
          #printable-executive-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            padding: 20px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Top Modal Navigation & Action Bar */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  معاينة وتخصيص تقرير الإدارة قبل الطباعة
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  صلاحيات المدير العام HSE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                يمكنك تعديل أي عنوان أو نص أو مؤشر والتحكم في كافة مخرجات التقرير المعتمد قبل استخراجه
              </p>
            </div>
          </div>

          {/* Mode Switcher (معاينة حية | تخصيص البيانات) */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'preview'
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>المعاينة الرسمية</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('customize')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'customize'
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>تخصيص المخرجات</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Either Preview Mode or Customization Mode */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/50">
          {activeTab === 'customize' ? (
            /* Customization Form */
            <div className="space-y-6 max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-black text-white">لوحة تحكم المدير العام في مدخلات التقرير</h4>
                </div>
                <span className="text-xs text-slate-400">التعديلات تنعكس فوراً على المعاينة المطبوعة</span>
              </div>

              {/* Basic Report Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">عنوان التقرير التنفيذي:</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">الجهة المصدرة / الإدارة:</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">اسم وتوقيع سعادة المدير العام:</label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">الفترة الزمنية / رقم الإصدار:</label>
                  <input
                    type="text"
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">تصفية حسب الموقع / المحطة:</label>
                  <select
                    value={selectedStationFilter}
                    onChange={(e) => setSelectedStationFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-400"
                  >
                    <option value="ALL">كافة المواقع والمحطات المركزية</option>
                    {uniqueStations.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">تصفية حسب درجة الخطورة:</label>
                  <select
                    value={selectedSeverityFilter}
                    onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-400"
                  >
                    <option value="ALL">جميع درجات الخطورة (حرجة، متوسطة، منخفضة)</option>
                    <option value="high">المخاطر الحرجة والوشيكة فقط (High Severity)</option>
                    <option value="medium">المخاطر المتوسطة (Medium)</option>
                  </select>
                </div>
              </div>

              {/* Editable Director Statement */}
              <div>
                <label className="font-bold text-slate-300 block mb-1 text-xs">
                  كلمة وتوجيهات سعادة المدير العام المعتمدة (تظهر بأعلى التقرير):
                </label>
                <textarea
                  rows={4}
                  value={directorStatement}
                  onChange={(e) => setDirectorStatement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-amber-200 outline-none focus:border-amber-400 leading-relaxed font-sans"
                  placeholder="أدخل توجيهات الإدارة العليا التي ستتم طباعتها..."
                />
              </div>

              {/* Section Visibility Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">
                  التحكم في الأقسام المضمنة في التقرير المطبوع:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeKpis}
                      onChange={(e) => setIncludeKpis(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-bold">بطاقات مؤشرات الأداء الحيوية (KPIs)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeObservationsTable}
                      onChange={(e) => setIncludeObservationsTable(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-bold">جدول البلاغات والملاحظات المرصودة</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeAiInspectionSummary}
                      onChange={(e) => setIncludeAiInspectionSummary(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-bold">ملخص الرصد الذكي (Computer Vision & Hearing)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-bold">الإجراءات والتدابير التصحيحية الموصى بها</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeSignatures}
                      onChange={(e) => setIncludeSignatures(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-bold">مربعات التوقيعات الرسمية للاعتماد</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeOfficialStamp}
                      onChange={(e) => setIncludeOfficialStamp(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-bold">ختم الاعتماد الرقمي لشركة عزوتي</span>
                  </label>
                </div>
              </div>

              {/* Ready Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition shadow flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة التقرير المعتمد الآن</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Printable Document Preview (The Document Sheet) */
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Document Paper Container */}
              <div
                id="printable-executive-report"
                className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 font-['Cairo',sans-serif] leading-normal"
              >
                {/* Official Letterhead Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
                  <div className="space-y-1 text-right">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
                      <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-wide">
                        {organizationName}
                      </h2>
                    </div>
                    <h1 className="text-sm sm:text-base font-bold text-slate-800">
                      {reportTitle}
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      {reportSubtitle}
                    </p>
                  </div>

                  {/* STOP Logo with ISO / Certification Badges */}
                  <div className="flex flex-col items-center shrink-0">
                    <StopSignLogo className="w-16 h-16 drop-shadow" />
                    <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">
                      STOP PLATFORM 2026
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-bold mt-0.5">
                      DuPont & OSHA Aligned
                    </span>
                  </div>
                </div>

                {/* Report Metadata Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">تاريخ الإصدار:</span>
                    <span className="font-bold text-slate-900">{reportDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">نطاق التغطية:</span>
                    <span className="font-bold text-slate-900">
                      {selectedStationFilter === 'ALL' ? 'كافة المحطات والمستودعات' : selectedStationFilter}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">الفترة الزمنية:</span>
                    <span className="font-bold text-slate-900">{reportPeriod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">الاعتماد:</span>
                    <span className="font-black text-emerald-700">معتمد من المدير العام ✓</span>
                  </div>
                </div>

                {/* Director's Official Statement */}
                <div className="bg-amber-50/70 border-r-4 border-amber-500 p-4 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>توجيهات وقرارات سعادة مدير عام السلامة والصحة المهنية:</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {directorStatement}
                  </p>
                  <div className="text-left text-[11px] font-bold text-slate-600 mt-1">
                    — {directorName}
                  </div>
                </div>

                {/* Section 1: Executive KPI Metrics Cards */}
                {includeKpis && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>1. ملخص مؤشرات الأداء الحيوية (Key Safety Performance Indicators)</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block">إجمالي البلاغات</span>
                        <span className="text-xl font-black text-slate-900 font-mono">{totalObs}</span>
                      </div>
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                        <span className="text-[10px] text-rose-700 font-bold block">مخاطر حرجة (وشيكة)</span>
                        <span className="text-xl font-black text-rose-700 font-mono">{criticalCount}</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold block">نسبة الإغلاق الفعلي</span>
                        <span className="text-xl font-black text-emerald-700 font-mono">{closureRate}%</span>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="text-[10px] text-blue-700 font-bold block">تصرفات / حالات غير آمنة</span>
                        <span className="text-sm font-bold text-blue-900 mt-1 block">
                          {unsafeActsCount} تصرف • {unsafeConditionsCount} حالة
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: AI Inspection Diagnostics (Computer Vision & Acoustic Hearing) */}
                {includeAiInspectionSummary && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>2. تقرير منظومة الفحص بالذكاء الاصطناعي (Computer Vision & Machine Hearing)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          الرصد البصري (Computer Vision):
                        </span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          • تم رصد ومطابقة أنماط تسريبات الغاز المرئية (Vapor Plume) واهتزازات المواسير والضواغط (Micro-vibrations 50Hz).
                          <br />• نسبة الامتثال لمهمات الوقاية (PPE Compliance): <strong>97.2%</strong> عبر محطات التموين.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                          الرصد الصوتي للماكينات (Machine Hearing):
                        </span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          • تحليل بصمة الترددات فوق الصوتية (Gas Hiss 14-22 kHz): <strong>مستقر وخالٍ من التسريب الصوتي النشط</strong>.
                          <br />• تحليل احتكاك المحامل والميكانيكا (Bearing Squeal): تم توجيه ضاغط الورشة لتغيير الزيت وموازنة البستون.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Observations Table */}
                {includeObservationsTable && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>3. بيان الملاحظات والبلاغات الميدانية المسجلة ({filteredObservations.length})</span>
                      </h3>
                      <span className="text-[10px] text-slate-500">معاينة أول {Math.min(maxObservationsToShow, filteredObservations.length)} بلاغات</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-[11px] border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2">رقم البلاغ</th>
                            <th className="p-2">الموقع / المحطة</th>
                            <th className="p-2">نوع الملاحظة والتصنيف</th>
                            <th className="p-2">الخطورة</th>
                            <th className="p-2">وصف الحالة</th>
                            <th className="p-2">الحالة الراهنة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredObservations.slice(0, maxObservationsToShow).map((obs) => (
                            <tr key={obs.id} className="hover:bg-slate-50/80">
                              <td className="p-2 font-mono font-bold text-slate-900">{obs.ticketNumber}</td>
                              <td className="p-2">{obs.stationName}</td>
                              <td className="p-2">
                                <span className="font-semibold text-slate-800">{obs.category}</span>
                              </td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    obs.severity === 'high'
                                      ? 'bg-red-100 text-red-800'
                                      : obs.severity === 'medium'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {obs.severity === 'high' ? 'حرج' : obs.severity === 'medium' ? 'متوسط' : 'منخفض'}
                                </span>
                              </td>
                              <td className="p-2 max-w-xs truncate">{obs.description}</td>
                              <td className="p-2 font-bold text-slate-900">{obs.status.split(' ')[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Section 4: Recommended Actions */}
                {includeRecommendations && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>4. التوصيات والإجراءات التصحيحية الإلزامية</span>
                    </h3>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      <li>إلزام فرق الصيانة الميدانية بإنهاء وإغلاق بلاغات التسريب والمخاطر الميكانيكية خلال 24 ساعة كحد أقصى.</li>
                      <li>تفعيل جداول التفتيش الأسبوعي الدوري على صمامات الأمان وفلاتر الغاز الطبيعي ومانعات الشرر.</li>
                      <li>صرف مكافآت أبطال السلامة للفنيين والعمال الذين ساهموا في رصد المخاطر الوشيكة ومنع الحوادث.</li>
                    </ul>
                  </div>
                )}

                {/* Section 5: Official Signatures & DuPont Verification Stamp */}
                {includeSignatures && (
                  <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-center">
                    <div className="space-y-2 text-right">
                      <span className="font-bold text-slate-500 text-[10px] block">إعداد وتدقيق تقرير السلامة:</span>
                      <p className="font-bold text-slate-800">مكتب المتابعة الفنية والرصد الميداني</p>
                      <div className="w-36 border-b border-dashed border-slate-400 mt-4"></div>
                    </div>

                    {includeOfficialStamp && (
                      <div className="p-3 rounded-2xl border-2 border-amber-600 bg-amber-50/50 text-center font-mono text-[10px] text-amber-900">
                        <div className="font-black text-xs">EZWETY IT Co. • VERIFIED HSE</div>
                        <div>منظومة STOP المعتمدة لعام 2026</div>
                        <div className="text-[9px] text-slate-600">Ref: STOP-REP-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</div>
                      </div>
                    )}

                    <div className="space-y-2 text-left">
                      <span className="font-bold text-slate-500 text-[10px] block">يعتمد مدير عام السلامة والصحة المهنية:</span>
                      <p className="font-black text-slate-950">{directorName}</p>
                      <div className="w-48 border-b-2 border-slate-900 mt-4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              عدد البلاغات المضمنة: <strong className="text-amber-400">{filteredObservations.length}</strong>
            </span>
            {copiedToast && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-fadeIn">
                <Check className="w-3 h-3" /> تم نسخ التقرير للحافظة بنجاح!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              <span>نسخ الملخص التنفيذي</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>تنزيل مستند HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-950/40 transition cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير المعتمد (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
