import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Send,
  Sparkles,
  Shirt,
  HardHat,
  Eye,
  MessageCircle,
  RefreshCw,
  Info,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Waves,
  Sun,
  CloudRain,
  Compass,
} from 'lucide-react';
import { Language, SiteWeatherStatus, WeatherReadinessLevel } from '../types';

interface SiteWeatherRiskWidgetProps {
  language: Language;
  selectedStation?: string;
  onStationChange?: (stationName: string) => void;
}

export const INITIAL_SITES_WEATHER: SiteWeatherStatus[] = [
  {
    stationName: 'مستودع مسطرد للبترول والتوزيع',
    city: 'القاهرة الكبرى / القليوبية',
    tempC: 38,
    feelsLikeC: 41,
    condition: 'حرارة شديدة',
    conditionEn: 'Extreme Heat & Dust',
    windSpeedKmH: 28,
    humidityPercent: 42,
    airQualityIndex: 125,
    readinessLevel: 'HIGH_ALERT',
    naturalDisasterWarning: 'موجة حرارة قاسية ورياح ترابية متقطعة ترفع خطر الإجهاد الحراري والاشتعال السريع بالخزانات',
    mandatoryPpeAdvisory: {
      clothing: [
        'ارتداء ملابس عمل قطنية 100% خفيفة عاكسة ومضادة للشحنات الساكنة (Anti-Static).',
        'تغطية الرأس بخوذة بيضاء مزودة بواقي رقبة من الشمس (Sun Neck Shade).',
        'استخدام نظارات شمسية صناعية معتمة معتمدة لحماية العين من الأشعة فوق البنفسجية والغبار.',
      ],
      restrictedActivities: [
        'حظر الأعمال الساخنة واللحام في الساحات المكشوفة من الساعة 12:00 ظهراً وحتى 03:30 عصراً.',
        'إلزامية فترات استراحة مظللة وتناول 500 مل ماء وأملاح كل 45 دقيقة.',
      ],
      hydrationRestIntervalMinutes: 45,
      jobSpecificInstructions: [
        {
          jobTitle: 'أعمال المرتفعات والسقالات',
          instructions: 'فحص ثبات أربطة الأمان، وممنوع العمل الفردي في درجات الحرارة فوق 38°C.',
          requiredGear: 'حزام أمان مزدوج + خوذة برباط ذقن + قفازات مانعة للتعرق والانزلاق',
        },
        {
          jobTitle: 'التعبئة ومضخات تداول الوقود',
          instructions: 'توصيل خطوط التأريض الأرضي (Earthing) قبل فتح صمامات الصهريج، ومنع أي ملابس صناعية تولد شرارة.',
          requiredGear: 'بدلة قطنية معتمدة + حذاء أمان عازل ومضاد للشرر (ATEX Boot)',
        },
        {
          jobTitle: 'أعمال اللحام والورش الميدانية',
          instructions: 'عزل منطقة العمل بستائر مقاومة للحريق وتوفير طفايتي رغوة وبودرة بجوار المشغل.',
          requiredGear: 'سترة جلدية واقية من الشرر + قناع وجه كامل + قفازات لحام ممتدة',
        },
        {
          jobTitle: 'الساحات الخارجية وعمال النظافة والخدمات',
          instructions: 'شرب السوائل بانتظام، والتواجد تحت المظلات الشمسية المخصصة.',
          requiredGear: 'سترة فسفورية عاكسة خفيفة + قبعة واقية من الشمس + نظارات واقية',
        },
      ],
    },
  },
  {
    stationName: 'مجمع الإسكندرية للبتروكيماويات',
    city: 'الإسكندرية / العامرية',
    tempC: 29,
    feelsLikeC: 32,
    condition: 'رياح شديدة وعواصف',
    conditionEn: 'High Coastal Winds',
    windSpeedKmH: 48,
    humidityPercent: 78,
    airQualityIndex: 65,
    readinessLevel: 'HIGH_ALERT',
    naturalDisasterWarning: 'رياح ساحلية نشطة تتجاوز 48 كم/س مع نوّة بحرية وارتفاع في حركة الأمواج',
    mandatoryPpeAdvisory: {
      clothing: [
        'سترات واقية من الرياح مبطنة ومثبتة بإحكام مع أربطة مطاطية.',
        'أحزمة أمان كاملة وخوذ مزودة برباط ذقن مشدود ضد السقوط بفعل الرياح.',
      ],
      restrictedActivities: [
        'إيقاف فوري وشامل لأعمال الرافعات الشوكية والأوناش التلسكوبية في الأماكن المرتفعة.',
        'حظر العمل على السقالات المكشوفة المطلة على البحر لحين هدوء سرعة الرياح.',
      ],
      jobSpecificInstructions: [
        {
          jobTitle: 'أعمال المرتفعات والسقالات',
          instructions: 'حظر الصعود نهائياً أثناء تخطي الرياح سرعة 40 كم/س.',
          requiredGear: 'تأمين المنصات بالأحزمة وعدم الصعود',
        },
        {
          jobTitle: 'أرصفة الشحن البحري',
          instructions: 'ارتداء سترات النجاة الطافية الذاتية (Life Jackets) طوال التواجد على الرصيف.',
          requiredGear: 'سترة نجاة بحرية + خوذة مضادة للصدمات + حذاء مانع للانزلاق الزيتي',
        },
      ],
    },
  },
  {
    stationName: 'مجمع السويس للغاز والتكرير',
    city: 'السويس / الزيتية',
    tempC: 34,
    feelsLikeC: 36,
    condition: 'عاصفة رملية وترابية',
    conditionEn: 'Sandstorm & Low Visibility',
    windSpeedKmH: 42,
    humidityPercent: 35,
    airQualityIndex: 185,
    readinessLevel: 'DISASTER_EMERGENCY',
    naturalDisasterWarning: 'عاصفة ترابية شديدة تحجب الرؤية لأقل من 200 متر مع ذرات رملية كثيفة',
    mandatoryPpeAdvisory: {
      clothing: [
        'ارتداء كمامات تنفسية فلاتر N95 أو FFP2 محكمة الغلق حول الأنف والفم.',
        'نظارات غبار مغلقة بالكامل (Sealed Goggles) تمنع دخول ذرات الرمل.',
      ],
      restrictedActivities: [
        'إيقاف حركة شاحنات الصهاريج غير المجهزة بكشافات ضباب صفراء.',
        'حظر فتح أغطية الخزانات وفتحات التفتيش لمنع تلوث الشحنات البترولية.',
      ],
      jobSpecificInstructions: [
        {
          jobTitle: 'سائقو شاحنات الصهاريج',
          instructions: 'تشغيل أضواء الطوارئ والالتزام بسرعة لا تتعدى 30 كم/س داخل المحطة والانتظار بالمسارات الآمنة.',
          requiredGear: 'سترة فسفورية + كمامة ترابية + نظارة شفافة',
        },
        {
          jobTitle: 'فنيو الصيانة الخارجية',
          instructions: 'الاحتماء داخل الورش المغلقة لحين انتهاء ذروة العاصفة الترابية.',
          requiredGear: 'كمامة N95 + نظارات غبار محكمة',
        },
      ],
    },
  },
  {
    stationName: 'المنطقة الصناعية بالعاشر من رمضان',
    city: 'الشرقية / العاشر من رمضان',
    tempC: 32,
    feelsLikeC: 33,
    condition: 'مشمس معتدل',
    conditionEn: 'Clear & Stable',
    windSpeedKmH: 15,
    humidityPercent: 40,
    airQualityIndex: 55,
    readinessLevel: 'NORMAL',
    mandatoryPpeAdvisory: {
      clothing: [
        'مهمات الوقاية القياسية (PPE): خوذة الأمان، حذاء السيفتي، والسترة الفسفورية.',
      ],
      restrictedActivities: [],
      jobSpecificInstructions: [
        {
          jobTitle: 'جميع التخصصات',
          instructions: 'الالتزام بإجراءات العمل القياسية (SOP) والملاحظة الاستباقية للسلامة.',
          requiredGear: 'المهمات القياسية المعتمدة',
        },
      ],
    },
  },
];

export const SiteWeatherRiskWidget: React.FC<SiteWeatherRiskWidgetProps> = ({
  language,
  selectedStation,
  onStationChange,
}) => {
  const [sites, setSites] = useState<SiteWeatherStatus[]>(INITIAL_SITES_WEATHER);
  const [activeSiteIndex, setActiveSiteIndex] = useState<number>(0);
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('all');
  const [whatsAppDispatched, setWhatsAppDispatched] = useState<boolean>(false);
  const [showFullForecastModal, setShowFullForecastModal] = useState<boolean>(false);

  const activeSite = sites[activeSiteIndex] || sites[0];

  // Helper for readiness styling
  const getReadinessBadge = (level: WeatherReadinessLevel) => {
    switch (level) {
      case 'DISASTER_EMERGENCY':
        return {
          text: 'طوارئ كوارث طبيعية قصوى (Disaster Alert)',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse',
          dot: 'bg-rose-500',
        };
      case 'HIGH_ALERT':
        return {
          text: 'حالة تأهب مرتفعة (High Alert)',
          color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
          dot: 'bg-orange-500',
        };
      case 'ELEVATED':
        return {
          text: 'تنبيه مناخي معتدل (Elevated Alert)',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-500',
        };
      default:
        return {
          text: 'طقس طبيعي مستقر (Normal Operation)',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          dot: 'bg-emerald-500',
        };
    }
  };

  const badge = getReadinessBadge(activeSite.readinessLevel);

  // Send Daily Weather & PPE Advisory via WhatsApp
  const handleSendWhatsAppDailyAdvisory = () => {
    const todayStr = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const clothingItems = activeSite.mandatoryPpeAdvisory.clothing.map((c) => `• ${c}`).join('\n');
    const restricted = activeSite.mandatoryPpeAdvisory.restrictedActivities.length > 0
      ? `\n🚫 الأنشطة المحظورة احترازياً:\n` + activeSite.mandatoryPpeAdvisory.restrictedActivities.map((r) => `• ${r}`).join('\n')
      : '';

    const jobsAdvice = activeSite.mandatoryPpeAdvisory.jobSpecificInstructions
      .map((j) => `👷‍♂️ [ ${j.jobTitle} ]:\n  - التوجيه: ${j.instructions}\n  - المهمات الإلزامية: ${j.requiredGear}`)
      .join('\n\n');

    const msg =
      `📢 *نشرة الطقس وإرشادات مهمات الوقاية اليومية للعاملين*\n` +
      `🏢 *الموقع:* ${activeSite.stationName} (${activeSite.city})\n` +
      `📅 *التاريخ:* ${todayStr}\n\n` +
      `🌡️ *حالة الطقس:* ${activeSite.condition} | درجة الحرارة: ${activeSite.tempC}°C (المحسوسة: ${activeSite.feelsLikeC}°C)\n` +
      `💨 *سرعة الرياح:* ${activeSite.windSpeedKmH} كم/س | الرطوبة: ${activeSite.humidityPercent}%\n` +
      `⚠️ *مستوى التأهب والسلامة:* ${badge.text}\n` +
      (activeSite.naturalDisasterWarning ? `🚨 *تنبيه الكوارث الطبيعية:* ${activeSite.naturalDisasterWarning}\n` : '') +
      `\n👔 *إرشادات الملابس ومهمات الوقاية الإلزامية:* \n${clothingItems}\n` +
      restricted +
      `\n\n📌 *تعليمات حسب طبيعة العمل والوظيفة:*\n${jobsAdvice}\n\n` +
      `سلامتكم هي غايتنا الأولى دائماً.\n` +
      `صادر عن: الإدارة العامة للسلامة والصحة المهنية (HSE) - شركة عزوتي IT Co. 2026.`;

    const waLink = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
    setWhatsAppDispatched(true);
    setTimeout(() => setWhatsAppDispatched(false), 4000);
  };

  // Raise readiness level manually
  const handleToggleReadiness = () => {
    setSites((prev) =>
      prev.map((site, idx) => {
        if (idx !== activeSiteIndex) return site;
        const levels: WeatherReadinessLevel[] = ['NORMAL', 'ELEVATED', 'HIGH_ALERT', 'DISASTER_EMERGENCY'];
        const currentIdx = levels.indexOf(site.readinessLevel);
        const nextLevel = levels[(currentIdx + 1) % levels.length];
        return { ...site, readinessLevel: nextLevel };
      })
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4 text-slate-100">
      {/* Top Header: Weather & Disaster Monitoring Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                منظومة الرصد الجوي والكوارث الطبيعية
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${badge.color}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                {badge.text}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              مؤشرات الطقس، رصد الكوارث الطبيعية ونشرة ملابس ومهمات العمل
            </h3>
          </div>
        </div>

        {/* Site Switcher */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <select
            value={activeSiteIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setActiveSiteIndex(idx);
              if (onStationChange) {
                onStationChange(sites[idx].stationName);
              }
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-400 font-bold"
          >
            {sites.map((site, idx) => (
              <option key={site.stationName} value={idx}>
                {site.stationName} ({site.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weather Indicator Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Stat 1: Temperature & Condition */}
        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>درجة الحرارة</span>
            <Thermometer className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{activeSite.tempC}°</span>
            <span className="text-xs text-slate-400">محسوسة {activeSite.feelsLikeC}°</span>
          </div>
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <Sun className="w-3 h-3" />
            <span>{activeSite.condition}</span>
          </div>
        </div>

        {/* Stat 2: Wind Speed */}
        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>سرعة الرياح</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{activeSite.windSpeedKmH}</span>
            <span className="text-xs text-slate-400">كم/ساعة</span>
          </div>
          <div className="text-[11px] font-bold text-slate-300">
            {activeSite.windSpeedKmH > 40 ? (
              <span className="text-rose-400 font-black">حظر أعمال السقالات</span>
            ) : (
              <span className="text-emerald-400">مسموح بالرفع الآمن</span>
            )}
          </div>
        </div>

        {/* Stat 3: Humidity & Fog */}
        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>الرطوبة الجوية</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{activeSite.humidityPercent}%</span>
            <span className="text-xs text-slate-400">نسبية</span>
          </div>
          <div className="text-[11px] font-bold text-slate-300">
            {activeSite.humidityPercent > 70 ? 'احتمال ضباب صباحي' : 'رطوبة طبيعية'}
          </div>
        </div>

        {/* Stat 4: Air Quality & Dust */}
        <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>جودة الهواء والغبار</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{activeSite.airQualityIndex}</span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>
          <div className="text-[11px] font-bold text-slate-300">
            {activeSite.airQualityIndex > 100 ? (
              <span className="text-amber-400 font-bold">إلزامية كمامة N95</span>
            ) : (
              <span className="text-emerald-400">هواء نقي ومستقر</span>
            )}
          </div>
        </div>
      </div>

      {/* Natural Disaster Alert Box if applicable */}
      {activeSite.naturalDisasterWarning && (
        <div className="bg-rose-950/50 border border-rose-700/60 p-3.5 rounded-2xl flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <div className="font-black text-rose-200 flex items-center gap-2">
              <span>إنذار الكوارث الطبيعية والطقس الحرج:</span>
              <span className="px-2 py-0.5 bg-rose-500/30 rounded text-[10px] text-rose-300">إجراءات طوارئ فورية</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeSite.naturalDisasterWarning}
            </p>
          </div>
        </div>
      )}

      {/* Mandatory Clothing & PPE Advisory By Job Nature */}
      <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black text-white">
              الملابس الواجب ارتداؤها في موقع العمل وإرشادات مهمات الوقاية (PPE)
            </h4>
          </div>

          {/* Quick toggle readiness */}
          <button
            type="button"
            onClick={handleToggleReadiness}
            className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 font-bold transition"
            title="محاكاة رفع حالة التأهب"
          >
            <RefreshCw className="w-3 h-3" />
            <span>تغيير درجة التأهب يدوياً (محاكاة)</span>
          </button>
        </div>

        {/* General Clothing Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5" /> الملابس المعتمدة للطقس الحالي:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc pr-4">
              {activeSite.mandatoryPpeAdvisory.clothing.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> القيود والأنشطة المحظورة:
            </span>
            {activeSite.mandatoryPpeAdvisory.restrictedActivities.length > 0 ? (
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc pr-4">
                {activeSite.mandatoryPpeAdvisory.restrictedActivities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-emerald-400">لا توجد قيود استثنائية، الالتزام بالعمل الاعتيادي الآمن.</p>
            )}
          </div>
        </div>

        {/* Specific Job Nature Guidance Cards */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400">
            توجيهات تفصيلية حسب طبيعة العمل في الموقع:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeSite.mandatoryPpeAdvisory.jobSpecificInstructions.map((job, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1 hover:border-amber-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-300 flex items-center gap-1">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" />
                    {job.jobTitle}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{job.instructions}</p>
                <div className="text-[10px] text-emerald-400 bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800">
                  <strong className="text-slate-400">المهمات:</strong> {job.requiredGear}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Daily Advisory Broadcast Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            يمكن لإدارة السلامة إرسال نشرة الطقس والملابس اليومية بكبسة زر لجميع العاملين عبر واتساب.
          </p>

          <button
            type="button"
            onClick={handleSendWhatsAppDailyAdvisory}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>إرسال نشرة الطقس والملابس للعاملين عبر واتساب 📲</span>
          </button>
        </div>

        {whatsAppDispatched && (
          <p className="text-[11px] text-emerald-400 font-bold text-center animate-fadeIn">
            ✓ تم فتح واتساب وتجهيز النشرة اليومية الرسمية بحالة الطقس ومهمات الوقاية الإلزامية!
          </p>
        )}
      </div>
    </div>
  );
};
