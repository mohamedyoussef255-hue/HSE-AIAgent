import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Eye,
  Filter,
  Flame,
  Layers,
  MapPin,
  Navigation,
  Send,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { HeatmapStation, StopObservation } from '../types';

interface HotspotHeatmapViewProps {
  stations: HeatmapStation[];
  observations: StopObservation[];
  onSelectStationFilter?: (stationName: string) => void;
}

export const HotspotHeatmapView: React.FC<HotspotHeatmapViewProps> = ({
  stations,
  observations,
}) => {
  const [selectedStation, setSelectedStation] = useState<HeatmapStation>(stations[0]);
  const [dispatchedStationId, setDispatchedStationId] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'critical' | 'fuel'>('all');

  const handleDispatchTeam = (station: HeatmapStation) => {
    setDispatchedStationId(station.id);
    setTimeout(() => {
      setDispatchedStationId(null);
    }, 3000);
  };

  // Observations for selected station
  const stationObservations = observations.filter(
    (o) => o.stationName === selectedStation.name
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-100">
              خرائط النقاط الساخنة الجغرافية (HSE Geographic Heatmaps)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            رصد كثافة البلاغات المفتوحة ومدى خطورتها جغرافياً بالألوان (أحمر، أصفر، أخضر) لتوجيه فرق التفتيش الاستباقية
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
            <span className="text-rose-300 font-bold">حرج (مخاطر مفتوحة)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-amber-300 font-bold">متوسط (قيد المعالجة)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-bold">مستقر وآمن</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Facility Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Visual (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-400" />
              الخريطة التفاعلية للمحطات والمستودعات والورش الإقليمية:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              اضغط على أي محطة للاطلاع على تفاصيل الخطورة
            </span>
          </div>

          {/* SVG Map Canvas with Regional Hotspots */}
          <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Stylized Contour Map Silhouette */}
            <svg
              viewBox="0 0 1000 650"
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
            >
              <path
                d="M200,100 C350,80 500,120 700,90 C850,70 920,200 880,320 C840,440 680,550 520,600 C380,630 280,520 220,400 C170,300 120,200 200,100 Z"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M260,180 C400,160 550,180 750,220 C800,320 720,440 580,500 C420,520 300,420 260,320 Z"
                fill="#334155"
                fillOpacity="0.15"
              />
            </svg>

            {/* Hotspot Markers on Map */}
            {stations.map((stn) => {
              const isSelected = selectedStation.id === stn.id;
              const isRed = stn.statusColor === 'red';
              const isAmber = stn.statusColor === 'amber';

              return (
                <div
                  key={stn.id}
                  style={{
                    left: `${stn.coords.x}%`,
                    top: `${stn.coords.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group"
                  onClick={() => setSelectedStation(stn)}
                >
                  {/* Outer Pulsing Aura for Red Hotspots */}
                  {isRed && (
                    <span className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping opacity-75" />
                  )}

                  {/* Hotspot Pin */}
                  <div
                    className={`relative px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-xl transition-all ${
                      isSelected
                        ? 'scale-110 ring-2 ring-amber-400 bg-slate-900 border-amber-400 z-30'
                        : isRed
                        ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                        : isAmber
                        ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                        : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isRed
                          ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                          : isAmber
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="text-[11px] font-bold whitespace-nowrap">
                      {stn.city}
                    </span>
                    {stn.openCritical > 0 && (
                      <span className="text-[9px] bg-rose-600 text-white font-mono px-1 rounded-full font-bold">
                        {stn.openCritical}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Station Selector Pills */}
          <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-800">
            {stations.map((stn) => (
              <button
                key={stn.id}
                type="button"
                onClick={() => setSelectedStation(stn)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  selectedStation.id === stn.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    stn.statusColor === 'red'
                      ? 'bg-rose-500'
                      : stn.statusColor === 'amber'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span>{stn.name.split('-')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Facility Deep Dive Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono">
                {selectedStation.type}
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-1.5">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                المسؤول: {selectedStation.manager} • المدينة: {selectedStation.city}
              </p>
            </div>

            {/* Severity Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-rose-950/40 border border-rose-900/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-rose-300 block">مخاطر حرجة</span>
                <span className="text-lg font-black text-rose-400 font-mono mt-0.5 block">
                  {selectedStation.openCritical}
                </span>
              </div>
              <div className="bg-amber-950/40 border border-amber-900/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-amber-300 block">ملاحظات متوسطة</span>
                <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                  {selectedStation.openMedium}
                </span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl">
                <span className="text-[10px] text-emerald-300 block">ملاحظات منخفضة</span>
                <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                  {selectedStation.openLow}
                </span>
              </div>
            </div>

            {/* Days since incident */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">أيام العمل الآمن دون حوادث مقعدة:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {selectedStation.lastIncidentDaysAgo} يوم
              </span>
            </div>

            {/* Dispatch Inspection Team Button */}
            <button
              type="button"
              onClick={() => handleDispatchTeam(selectedStation)}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>
                {dispatchedStationId === selectedStation.id
                  ? 'تم إرسال أمر التفتيش الميداني فوراً ✓'
                  : 'توجيه فرقة تفتيش وقائية للمحطة'}
              </span>
            </button>
          </div>

          {/* Micro Blueprint of Facility Zones */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              توزيع المخاطر داخل المنشأة (Zone Layout):
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-rose-900/50 flex flex-col justify-between">
                <span className="font-bold text-rose-300">منطقة الضواغط والمضخات</span>
                <span className="text-[10px] text-rose-400 mt-1">⚠️ تسريب وقود وضغط عالي</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-900/50 flex flex-col justify-between">
                <span className="font-bold text-amber-300">حفر تغيير الزيوت</span>
                <span className="text-[10px] text-amber-400 mt-1">كابلات مؤقتة</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-emerald-900/50 flex flex-col justify-between">
                <span className="font-bold text-emerald-300">مخارج الطوارئ والتجمع</span>
                <span className="text-[10px] text-emerald-400 mt-1">ممرات سالكة ومؤمنة</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                <span className="font-bold text-slate-300">خزانات الوقود الأرضية</span>
                <span className="text-[10px] text-slate-400 mt-1">أنظمة الإطفاء تعمل بكفاءة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
