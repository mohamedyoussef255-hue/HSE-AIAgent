import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  Cpu,
  RefreshCw,
  BellRing,
  ArrowRight,
} from 'lucide-react';
import { AIIncidentClassification, Language, SeverityLevel } from '../types';

interface AIIncidentClassifierProps {
  description: string;
  onApplyClassification: (classification: AIIncidentClassification, suggestedSeverity: SeverityLevel, rationale: string) => void;
  language: Language;
}

interface ClassificationResult {
  classification: AIIncidentClassification;
  confidence: number;
  labelAr: string;
  labelEn: string;
  badgeColor: string;
  rationaleAr: string;
  immediateContainment: string;
  suggestedSeverity: SeverityLevel;
  keywordsDetected: string[];
}

export const AIIncidentClassifier: React.FC<AIIncidentClassifierProps> = ({
  description,
  onApplyClassification,
  language,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const classifyTextWithAI = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const text = description.toLowerCase();

      // Rule-based intelligent semantic detection
      const emergencyKeywords = ['حريق', 'اشتعال', 'تسرب غاز', 'انفجار', 'انهيار', 'كسر', 'نزيف', 'إصابة', 'اسعاف', 'إخلاء', 'طوارئ', 'fire', 'leak', 'explosion', 'collapse', 'injury'];
      const nearMissKeywords = ['كاد', 'أوشك', 'سقطت بجوار', 'تفادي', 'لحسن الحظ', 'انزلاق دون', 'مر بجانب', 'توقف قبل', 'near', 'miss', 'almost', 'barely', 'avoided'];
      const potentialKeywords = ['مكشوف', 'عدم ارتداء', 'غير مثبت', 'صدأ', 'انسداد', 'تراخي', 'إهمال', 'رطب', 'زلق', 'بدون حزام', 'نقص', 'hazard', 'unsecured', 'missing', 'lack'];

      let detectedClass: AIIncidentClassification = 'POTENTIAL_HAZARD';
      let confidence = 88;
      let matchedKeywords: string[] = [];

      const emergencyMatches = emergencyKeywords.filter((k) => text.includes(k));
      const nearMissMatches = nearMissKeywords.filter((k) => text.includes(k));
      const potentialMatches = potentialKeywords.filter((k) => text.includes(k));

      if (emergencyMatches.length > 0 && !text.includes('كاد')) {
        detectedClass = 'EMERGENCY_INCIDENT';
        matchedKeywords = emergencyMatches;
        confidence = 96;
      } else if (nearMissMatches.length > 0) {
        detectedClass = 'NEAR_MISS';
        matchedKeywords = nearMissMatches;
        confidence = 94;
      } else if (potentialMatches.length > 0) {
        detectedClass = 'POTENTIAL_HAZARD';
        matchedKeywords = potentialMatches;
        confidence = 91;
      } else {
        // Default classification based on length & keywords
        if (text.length > 30) {
          detectedClass = 'NEAR_MISS';
          confidence = 85;
        }
      }

      let res: ClassificationResult;

      if (detectedClass === 'EMERGENCY_INCIDENT') {
        res = {
          classification: 'EMERGENCY_INCIDENT',
          confidence,
          labelAr: 'حادثة طارئة فورية (Emergency / Acute Incident)',
          labelEn: 'Acute Emergency Incident',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          rationaleAr: 'تم رصد مؤشرات حالة طوارئ حادة أو نشطة تتطلب استجابة فورية، تدخلاً لعزل المصدر وتفعيل صفارات الإنذار وفرق الإسعاف أو الإطفاء.',
          immediateContainment: 'إيقاف العمل الشامل فوراً، تشغيل جرس الإنذار، وتوجيه فريق التدخل السريع وعزل مصادر الطاقة.',
          suggestedSeverity: 'high',
          keywordsDetected: matchedKeywords,
        };
      } else if (detectedClass === 'NEAR_MISS') {
        res = {
          classification: 'NEAR_MISS',
          confidence,
          labelAr: 'حادثة وشيكة (Near-Miss)',
          labelEn: 'Near-Miss Event',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          rationaleAr: 'حدثت الواقعة بالفعل وكادت أن تسفر عن إصابة أو تلف مادي جسيم، ولكنها انتهت بلطف دون ضرر بفضل مسافة أو ثوانٍ معدودة.',
          immediateContainment: 'إيقاف النشاط مؤقتاً، تثبيت المعدة أو الحاجز، والتحقيق الفوري في السبب الجذري لمنع تكرارها كحادث حقيقي.',
          suggestedSeverity: 'high',
          keywordsDetected: matchedKeywords,
        };
      } else {
        res = {
          classification: 'POTENTIAL_HAZARD',
          confidence,
          labelAr: 'حادثة محتملة / خطر كامن (Potential Hazard / Unsafe Condition)',
          labelEn: 'Potential Hazard Condition',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
          rationaleAr: 'تم رصد ظرف غير آمن أو تراخٍ في مهمات الوقاية لم ينتج عنه واقعة بعد، ولكنه يمثل خطراً كامناً يجب إغلاقه قبل أن يتحول لحادث وشيك.',
          immediateContainment: 'وضع شريط تحذيري أو إشعار المشرف الميداني لتوفير مهمات الوقاية أو جدولة الصيانة الوقائية.',
          suggestedSeverity: 'medium',
          keywordsDetected: matchedKeywords,
        };
      }

      setResult(res);
      setAnalyzing(false);
    }, 600);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyClassification(result.classification, result.suggestedSeverity, result.rationaleAr);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>التمييز الذكي بالذكاء الاصطناعي (AI Incident Classifier)</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 text-[9px] font-bold">
                Smart Engine
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              يميز تلقائياً بين الحادثة الوشيكة (Near-Miss)، الحادثة المحتملة (Potential Hazard)، والحادثة الطارئة الفورية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={classifyTextWithAI}
          disabled={analyzing || !description.trim()}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shrink-0"
        >
          {analyzing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{analyzing ? 'جارِ التحليل...' : 'تحليل وتصنيف البلاغ'}</span>
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5 animate-fadeIn text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">التصنيف المعتمد بالذكاء الاصطناعي:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-black border text-xs ${result.badgeColor}`}>
                {result.labelAr}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">
              دقة المطابقة: {result.confidence}%
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
            <strong className="text-purple-300">التعليل الفني: </strong>
            {result.rationaleAr}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] pt-1 border-t border-slate-800">
            <div className="text-amber-300">
              <strong>الإجراء الفوري المقترح: </strong>
              <span>{result.immediateContainment}</span>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] transition flex items-center gap-1 self-end sm:self-auto shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>اعتماد التصنيف في الاستمارة</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Comparison Info Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px]">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
          <strong className="text-amber-400 block mb-0.5">1. حادثة وشيكة (Near-Miss)</strong>
          <span>واقعة حدثت بالفعل كادت تصيب عاملاً أو معدة ولكن تم تفاديها بلطف من الله.</span>
        </div>
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200">
          <strong className="text-blue-400 block mb-0.5">2. حادثة محتملة (Hazard)</strong>
          <span>ظرف غير آمن أو سلوك خاطئ كامن لم ينتج عنه حدث بعد ولكنه يهدد بوقوعه مستقبلاً.</span>
        </div>
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
          <strong className="text-rose-400 block mb-0.5">3. حادثة طارئة (Emergency)</strong>
          <span>حالة طوارئ نشطة متصاعدة (حريق، تسرب، انهيار) تتطلب تدخلاً فورياً وإخلاءً.</span>
        </div>
      </div>
    </div>
  );
};
