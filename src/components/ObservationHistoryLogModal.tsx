import React, { useState } from 'react';
import { StopObservation, Language } from '../types';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Filter,
  Eye,
  Video,
  Shield,
  User,
  ExternalLink,
} from 'lucide-react';

interface ObservationHistoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: StopObservation[];
  language: Language;
}

export const ObservationHistoryLogModal: React.FC<ObservationHistoryLogModalProps> = ({
  isOpen,
  onClose,
  observations,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedObs, setSelectedObs] = useState<StopObservation | null>(null);

  if (!isOpen) return null;

  const filtered = observations.filter((obs) => {
    const matchesSearch =
      obs.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.observerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = selectedSeverity === 'all' || obs.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Video className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>مكتبة سجل رصد الكاميرا والوقائع الميدانية</span>
                <span className="text-[10px] bg-slate-800 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {observations.length} تقرير موثق
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                مكتبة وسجلات الرصد المصور بالفيديو والصور والتواريخ والبيانات المعتمدة لحالات STOP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              type="text"
              placeholder="البحث برقم البلاغ، المحطة، الراصد، أو محتوى الملاحظة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="all">كافة مستويات الخطورة</option>
              <option value="high">حرج (High)</option>
              <option value="medium">متوسط (Medium)</option>
              <option value="low">منخفض (Low)</option>
            </select>
          </div>
        </div>

        {/* Content Table / Card List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              لا توجد بلاغات تطابق معايير البحث الحالية.
            </div>
          ) : (
            filtered.map((obs) => {
              const isHigh = obs.severity === 'high';
              const isMedium = obs.severity === 'medium';
              const isClosed = obs.status === 'تم الإغلاق والتحقق (Closed)';

              return (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObs(obs)}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl transition cursor-pointer space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {obs.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : isMedium
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {isHigh ? 'خطر حرج' : isMedium ? 'خطر متوسط' : 'خطر منخفض'}
                      </span>
                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {obs.type.split('(')[0]}
                      </span>
                      {obs.videoUrl && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/40 flex items-center gap-1 font-bold">
                          <Video className="w-3 h-3" />
                          <span>فيديو مرفق</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {obs.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {obs.time}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {obs.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {obs.stationName}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {obs.observerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          isClosed ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {obs.status}
                      </span>
                      <span className="text-amber-500 text-xs font-bold hover:underline">
                        عرض التفاصيل &larr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Observation Full Detail Drawer / Overlay */}
        {selectedObs && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-5 max-h-[85vh] overflow-y-auto space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-amber-400">
                    {selectedObs.ticketNumber}
                  </span>
                  <span className="text-xs text-slate-400">| تفاصيل الرصد الكاملة</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedObs(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player if present */}
              {selectedObs.videoUrl && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-400" />
                    لقطة الفيديو المسجلة للمخاطرة الميدانية:
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-700 aspect-video bg-black flex items-center justify-center">
                    <video
                      src={selectedObs.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Photo Preview if present */}
              {selectedObs.photoUrl && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-300">الصورة الفوتوغرافية:</span>
                  <div className="rounded-xl overflow-hidden border border-slate-700 h-40">
                    <img
                      src={selectedObs.photoUrl}
                      alt="Site condition"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">الوصف:</span>
                  <p className="text-slate-100 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {selectedObs.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">الموقع:</span>
                    <span className="text-slate-200 font-bold">{selectedObs.stationName}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">المعدة / الأصل:</span>
                    <span className="text-slate-200 font-bold">
                      {selectedObs.assetName || 'فحص عام للمنشأة'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 block text-[10px] font-bold">
                    الإجراء الفوري:
                  </span>
                  <p className="text-slate-200">{selectedObs.immediateAction}</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 block text-[10px] font-bold">
                    السبب الجذري:
                  </span>
                  <p className="text-slate-200">{selectedObs.rootCause}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">جهة التوجيه:</span>
                    <span className="text-slate-200 font-bold">{selectedObs.assignedTo}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">حالة الملاحظة:</span>
                    <span className="text-emerald-400 font-bold">{selectedObs.status}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedObs(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
