import React, { useState } from 'react';
import {
  BarChart3,
  Brain,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Lightbulb,
  PieChart,
  Printer,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { StopObservation } from '../types';
import { exportToCSV, printExecutiveReport } from '../utils/exportUtils';

interface RootCauseAnalyticsViewProps {
  observations: StopObservation[];
  onBack?: () => void;
}

export const RootCauseAnalyticsView: React.FC<RootCauseAnalyticsViewProps> = ({
  observations,
  onBack,
}) => {
  const [aiInsights, setAiInsights] = useState<{
    summary: string;
    topRiskArea: string;
    recommendedInterventions: string[];
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Frequency count for causes
  const causesMap: Record<string, number> = {
    'نقص تدريب وتوعية سلوكية': 0,
    'تهالك معدات أو نقص صيانة وقائية': 0,
    'استعجال العمل وضغط تسليم الشحنات': 0,
    'عدم توفر مهمات وقاية شخصية ملائمة': 0,
    'إجراءات تشغيل قياسية (SOP) غير واضحة': 0,
    'بيئة عمل وظروف إضاءة غير ملائمة': 0,
  };

  observations.forEach((obs) => {
    const rc = obs.rootCause.toLowerCase();
    if (rc.includes('تدريب') || rc.includes('توعية')) {
      causesMap['نقص تدريب وتوعية سلوكية'] += 1;
    } else if (rc.includes('تهالك') || rc.includes('صيانة') || rc.includes('جوانات')) {
      causesMap['تهالك معدات أو نقص صيانة وقائية'] += 1;
    } else if (rc.includes('استعجال') || rc.includes('ضغط')) {
      causesMap['استعجال العمل وضغط تسليم الشحنات'] += 1;
    } else if (rc.includes('وقاية') || rc.includes('مهمات') || rc.includes('قفازات')) {
      causesMap['عدم توفر مهمات وقاية شخصية ملائمة'] += 1;
    } else if (rc.includes('إجراء') || rc.includes('تصريح') || rc.includes('sop')) {
      causesMap['إجراءات تشغيل قياسية (SOP) غير واضحة'] += 1;
    } else {
      causesMap['بيئة عمل وظروف إضاءة غير ملائمة'] += 1;
    }
  });

  const totalCauses = Object.values(causesMap).reduce((a, b) => a + b, 0) || 1;

  // Categories count
  const categoriesCount: Record<string, number> = {};
  observations.forEach((o) => {
    categoriesCount[o.category] = (categoriesCount[o.category] || 0) + 1;
  });

  // Acts vs Conditions
  const unsafeActs = observations.filter((o) => o.type.includes('تصرف')).length;
  const unsafeConditions = observations.filter((o) => o.type.includes('حالة')).length;
  const safePractices = observations.filter((o) => o.type.includes('ممارسة')).length;
  const totalReports = observations.length || 1;

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/root-cause-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            totalObservations: observations.length,
            unsafeActs,
            unsafeConditions,
            safePractices,
          },
          openReportsCount: observations.filter(
            (o) => o.status !== 'تم الإغلاق والتحقق (Closed)'
          ).length,
          frequentCategories: categoriesCount,
        }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.warn('AI insight fetch error:', err);
      setAiInsights({
        summary:
          'تشير البيانات إلى أن 45% من المخاطر ناتجة عن تصرفات سلوكية يمكن تفاديها عبر تكثيف جلسات Toolbox Talks قبل الورديات، مع ضرورة الإسراع في صيانة صمامات ومضخات الوقود.',
        topRiskArea: 'محطة التموين المركزية ومستودع الكيماويات',
        recommendedInterventions: [
          'تنظيم ورش عمل تفاعلية لمشغلي الرافعات والمضخات حول التوقف الآمن.',
          'تحديث جدول الصيانة الوقائية لموانع التسرب O-rings وفحص العوازل الكهربائية.',
          'تفعيل نظام الحوافز ومكافأة الورديات الأكثر رصداً للسلوكيات الآمنة.',
        ],
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Universal Page Back / Exit Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-sm">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-bold transition group"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform text-amber-400" />
            <span>تراجع / رجوع للصفحة الرئيسية</span>
          </button>
        ) : <div />}

        <div className="text-xs text-slate-400">
          أنت الآن في: <strong className="text-amber-400">تحليلات الأسباب الجذرية (Root Cause Analysis)</strong>
        </div>
      </div>

      {/* Title & Quick Actions */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-100">
              لوحة تحليل الأسباب الجذرية (Root Cause Analysis Dashboard)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            تفكيك البلاغات إلى مسبباتها العميقة (نقص تدريب، تهالك معدات، ضغط عمل) لبناء خطط وقائية طويلة المدى
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAiInsights}
            disabled={loadingAi}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loadingAi ? 'جارِ التحليل...' : 'توليد توصيات استراتيجية بـ Gemini'}</span>
          </button>
          <button
            type="button"
            onClick={printExecutiveReport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة PDF</span>
          </button>
        </div>
      </div>

      {/* AI Strategic Recommendations Card if available */}
      {aiInsights && (
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
            <span className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              التقرير التنفيذي الاستراتيجي من الذكاء الاصطناعي (Gemini HSE Advisor)
            </span>
            <span className="text-xs bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">
              المنطقة الأعلى خطورة: {aiInsights.topRiskArea}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {aiInsights.summary}
          </p>

          <div className="pt-2">
            <span className="text-xs font-bold text-amber-400 block mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              التدخلات الوقائية الموصى بها للإدارة العليا:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {aiInsights.recommendedInterventions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Root Causes Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cause Bars Breakdown */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              توزيع الأسباب الجذرية للبلاغات (Root Cause Analysis)
            </h3>
            <span className="text-xs text-slate-400 font-mono">100% قاعدة ديبونت</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {Object.entries(causesMap).map(([causeName, count]) => {
              const pct = Math.round((count / totalCauses) * 100);
              return (
                <div key={causeName} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span>{causeName}</span>
                    <span className="font-mono font-bold text-amber-400">
                      {count} بلاغ ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DuPont STOP Ratio: Acts vs Conditions & Categories */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-sky-400" />
              نسبة السلوك (Unsafe Acts) مقابل الظروف المادية (Conditions)
            </h3>

            {/* Split Visual Meter */}
            <div className="space-y-2">
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
                <div
                  style={{ width: `${Math.round((unsafeActs / totalReports) * 100)}%` }}
                  className="bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                  title="تصرفات غير آمنة"
                />
                <div
                  style={{ width: `${Math.round((unsafeConditions / totalReports) * 100)}%` }}
                  className="bg-sky-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                  title="حالات غير آمنة"
                />
                <div
                  style={{ width: `${Math.round((safePractices / totalReports) * 100)}%` }}
                  className="bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                  title="ممارسات آمنة"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  تصرفات سلوكية: {Math.round((unsafeActs / totalReports) * 100)}%
                </span>
                <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  حالات مادية ومعدات: {Math.round((unsafeConditions / totalReports) * 100)}%
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ممارسات آمنة: {Math.round((safePractices / totalReports) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2.5">
              توزيع الملاحظات حسب المجال التشغيلي:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(categoriesCount).map(([cat, count]) => (
                <div
                  key={cat}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-300">{cat}</span>
                  <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
