import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Flame,
  Printer,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  ArrowUpRight,
  Eye,
  FileSpreadsheet,
  FileText,
  X,
  Volume2,
  Cpu,
  MapPin,
  Sparkles,
  Bot,
  ListFilter,
  Video,
} from 'lucide-react';
import { ReportStatus, SeverityLevel, StopObservation } from '../types';
import { exportToCSV, printExecutiveReport } from '../utils/exportUtils';
import { TimeToClosureWidget } from './TimeToClosureWidget';

interface WebManagementViewProps {
  observations: StopObservation[];
  onUpdateObservation: (updated: StopObservation) => void;
  onOpenBotConfig?: () => void;
  onOpenDropdownManager?: () => void;
  isOffHoursSimulated?: boolean;
}

export const WebManagementView: React.FC<WebManagementViewProps> = ({
  observations,
  onUpdateObservation,
  onOpenBotConfig,
  onOpenDropdownManager,
  isOffHoursSimulated,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedObservation, setSelectedObservation] = useState<StopObservation | null>(null);
  const [closureNoteInput, setClosureNoteInput] = useState<string>('');
  const [confirmationToast, setConfirmationToast] = useState<string | null>(null);

  // Filtered observations
  const filtered = observations.filter((obs) => {
    const matchesSearch =
      obs.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.observerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (obs.assetName && obs.assetName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = filterSeverity === 'all' || obs.severity === filterSeverity;
    const matchesType =
      filterType === 'all' ||
      (filterType === 'act' && obs.type.includes('تصرف')) ||
      (filterType === 'condition' && obs.type.includes('حالة')) ||
      (filterType === 'safe' && obs.type.includes('ممارسة'));

    const matchesStatus = filterStatus === 'all' || obs.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesType && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = observations.length;
  const criticalCount = observations.filter((o) => o.severity === 'high' && o.status !== 'تم الإغلاق والتحقق (Closed)').length;
  const unsafeActsCount = observations.filter((o) => o.type.includes('تصرف')).length;
  const unsafeConditionsCount = observations.filter((o) => o.type.includes('حالة')).length;
  const closedCount = observations.filter((o) => o.status === 'تم الإغلاق والتحقق (Closed)').length;
  const closureRate = totalCount ? Math.round((closedCount / totalCount) * 100) : 0;

  const handleStatusChange = (newStatus: ReportStatus) => {
    if (!selectedObservation) return;
    const now = new Date();
    const updated: StopObservation = {
      ...selectedObservation,
      status: newStatus,
      closedAt:
        newStatus === 'تم الإغلاق والتحقق (Closed)'
          ? `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`
          : selectedObservation.closedAt,
      closureNotes: closureNoteInput || selectedObservation.closureNotes,
    };
    onUpdateObservation(updated);
    setSelectedObservation(updated);

    // Show Confirmation Notice
    const actionLabel =
      newStatus === 'تم الإغلاق والتحقق (Closed)'
        ? 'تم تأكيد إغلاق وتحقق بطاقة STOP بنجاح ✓'
        : newStatus === 'تم التوجيه للصيانة (Assigned)'
        ? 'تم تأكيد توجيه أمر صيانة عاجل بنجاح'
        : 'تم تحديث حالة بطاقة STOP وبدء المعالجة';

    setConfirmationToast(`${actionLabel} - التذكرة ${selectedObservation.ticketNumber}`);
    setTimeout(() => setConfirmationToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-black text-slate-100">
              لوحة التحكم والإدارة العليا - STOP (Safety Training Observation Program)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            متابعة البلاغات، أتمتة التوجيه للورديات، الرقابة على المخاطر الحرجة وإغلاق الملاحظات
          </p>
        </div>

        {/* 1-Click Export Buttons & Admin Control Centers */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          {onOpenBotConfig && (
            <button
              type="button"
              onClick={onOpenBotConfig}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition shadow-sm ${
                isOffHoursSimulated
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>بوت طوارئ خارج أوقات العمل</span>
              {isOffHoursSimulated && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              )}
            </button>
          )}

          {onOpenDropdownManager && (
            <button
              type="button"
              onClick={onOpenDropdownManager}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors shadow-sm"
            >
              <ListFilter className="w-4 h-4 text-amber-400" />
              <span>تعديل القوائم المنسدلة</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => exportToCSV(observations)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>تصدير Excel (CSV)</span>
          </button>
          <button
            type="button"
            onClick={printExecutiveReport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة تقرير الإدارة (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cards */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">إجمالي بطاقات STOP</span>
            <span className="text-2xl font-black text-slate-100 font-mono mt-1 block">
              {totalCount}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              محدثة لحظياً من الميدان
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Open Hazards */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-rose-950/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-300 font-medium block">مخاطر حرجة مفتوحة</span>
            <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">
              {criticalCount}
            </span>
            <span className="text-[10px] text-rose-400/90 flex items-center gap-1 mt-1 font-semibold">
              <AlertTriangle className="w-3 h-3" /> تم تصعيدها فورياً
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Unsafe Acts vs Conditions Ratio */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">تصرفات / حالات غير آمنة</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">{unsafeActsCount}</span>
              <span className="text-xs text-slate-500 font-mono">سلوك</span>
              <span className="text-slate-600">/</span>
              <span className="text-xl font-bold text-sky-400 font-mono">{unsafeConditionsCount}</span>
              <span className="text-xs text-slate-500 font-mono">حالة</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              وفق معايير STOP العالمية
            </span>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Closure Rate */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">معدل الإغلاق والتحقق</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {closureRate}%
            </span>
            <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-1">
              {closedCount} من أصل {totalCount} بطاقة
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* D3 High-Level KPI: Time to Closure across Departments & Bottlenecks */}
      <TimeToClosureWidget
        observations={observations}
        onFilterByDepartment={(dept) => {
          setSearchTerm(dept);
        }}
      />

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث برقم البطاقة، وصف الملاحظة، المعدة، أو اسم المفتش..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none"
            >
              <option value="all">كل مستويات الخطورة</option>
              <option value="high">حرج (Critical)</option>
              <option value="medium">متوسط (Medium)</option>
              <option value="low">منخفض (Low)</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none"
            >
              <option value="all">كل أنواع STOP</option>
              <option value="act">تصرف غير آمن (Unsafe Act)</option>
              <option value="condition">حالة غير آمنة (Unsafe Condition)</option>
              <option value="safe">ممارسة آمنة (Safe Practice)</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="جديد (New)">جديد</option>
              <option value="قيد المعالجة (In Progress)">قيد المعالجة</option>
              <option value="تم التوجيه للصيانة (Assigned)">تم التوجيه للصيانة</option>
              <option value="تم الإغلاق والتحقق (Closed)">تم الإغلاق والتحقق</option>
            </select>
          </div>
        </div>

        {/* Active Automated Routing Highlights */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            أتمتة سير العمل النشطة:
            <strong className="text-slate-200">التصرفات السلوكية ➔ مشرف الوردية</strong> |{' '}
            <strong className="text-rose-400">الحالات الحرجة ➔ تنبيه فوري للصيانة ومدير السلامة</strong>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            عدد البلاغات المطابقة: {filtered.length}
          </span>
        </div>
      </div>

      {/* Observations Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="p-3.5">رقم البطاقة</th>
                <th className="p-3.5">الموقع / المعدة</th>
                <th className="p-3.5">نوع الملاحظة والتصنيف</th>
                <th className="p-3.5">الخطورة والمخاطرة</th>
                <th className="p-3.5">التوجيه الآلي (Workflow)</th>
                <th className="p-3.5">الحالة الحالية</th>
                <th className="p-3.5">الراصد والتاريخ</th>
                <th className="p-3.5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filtered.map((obs) => (
                <tr
                  key={obs.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedObservation(obs)}
                >
                  <td className="p-3.5 font-mono font-bold text-amber-400">
                    {obs.ticketNumber}
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-slate-100">{obs.stationName}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                      {obs.assetName ? (
                        <span className="text-amber-300 font-mono text-[10px] bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                          {obs.assetName}
                        </span>
                      ) : (
                        <span>{obs.locationDetails}</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        obs.type.includes('تصرف')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : obs.type.includes('حالة')
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {obs.type.split('(')[0]}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">{obs.category}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          obs.severity === 'high'
                            ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                            : obs.severity === 'medium'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-bold">
                        {obs.severity === 'high'
                          ? 'حرج'
                          : obs.severity === 'medium'
                          ? 'متوسط'
                          : 'منخفض'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                        {obs.riskScore}/100
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-medium text-slate-300">
                      {obs.routingRule === 'CRITICAL_ESCALATION' ? (
                        <span className="text-rose-400 flex items-center gap-1 font-bold">
                          <Flame className="w-3.5 h-3.5" /> مدير السلامة والصيانة
                        </span>
                      ) : (
                        <span>{obs.assignedTo}</span>
                      )}
                    </div>
                    {obs.escalatedNotificationSent && (
                      <span className="text-[10px] text-amber-400/90 font-mono block">
                        تم إرسال إشعار SMS & Push
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                        obs.status === 'تم الإغلاق والتحقق (Closed)'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : obs.status === 'تم التوجيه للصيانة (Assigned)'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : obs.status === 'قيد المعالجة (In Progress)'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {obs.status.split('(')[0]}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-400">
                    <div className="font-medium text-slate-200">{obs.observerName}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {obs.date} • {obs.time}
                    </div>
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedObservation(obs);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors"
                      title="عرض التفاصيل واتخاذ قرار"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation Inspection & Decision Drawer / Modal */}
      {selectedObservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                  {selectedObservation.ticketNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">
                    بطاقة ملاحظة STOP التفصيلية
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedObservation.stationName} • {selectedObservation.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedObservation(null)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Video preview if recorded */}
              {selectedObservation.videoUrl && (
                <div className="space-y-1.5">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-400" />
                    لقطة الفيديو المسجلة للواقعة الميدانية:
                  </span>
                  <div className="rounded-2xl overflow-hidden border-2 border-rose-500/40 relative aspect-video bg-black flex items-center justify-center">
                    <video
                      src={selectedObservation.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Photo preview if present */}
              {selectedObservation.photoUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 relative h-48 bg-slate-950">
                  <img
                    src={selectedObservation.photoUrl}
                    alt="Hazard site"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2.5 py-1 rounded-lg text-amber-300 font-semibold text-[11px] backdrop-blur-sm">
                    توثيق فوتوغرافي من الميدان
                  </div>
                </div>
              )}

              {/* Description Block */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  وصف الملاحظة الميدانية:
                </span>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {selectedObservation.description}
                </p>

                {selectedObservation.voiceTranscript && (
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>التفريغ الصوتي الذكي: "{selectedObservation.voiceTranscript}"</span>
                  </div>
                )}
              </div>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">نوع الملاحظة</span>
                  <span className="font-bold text-amber-300">
                    {selectedObservation.type.split('(')[0]}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">التصنيف الفني</span>
                  <span className="font-bold text-slate-200">
                    {selectedObservation.category}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">مستوى الخطورة</span>
                  <span
                    className={`font-bold ${
                      selectedObservation.severity === 'high'
                        ? 'text-rose-400'
                        : selectedObservation.severity === 'medium'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedObservation.severity === 'high'
                      ? 'حرج'
                      : selectedObservation.severity === 'medium'
                      ? 'متوسط'
                      : 'منخفض'}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">درجة الخطر المحسوبة</span>
                  <span className="font-mono font-bold text-slate-100 text-sm">
                    {selectedObservation.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Automated Routing & Escalation Box */}
              <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    أتمتة سير العمل والتوجيه (Workflow Automation)
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                    {selectedObservation.routingRule}
                  </span>
                </div>
                <p className="text-slate-300 text-xs">
                  جهة المتابعة المعينة آلياً:{' '}
                  <strong className="text-slate-100">{selectedObservation.assignedTo}</strong>
                </p>
                {selectedObservation.escalatedNotificationSent && (
                  <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-semibold bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    تم إطلاق تنبيه عاجل وإشعار SMS لمدير السلامة وإدارة الصيانة المركزية
                  </div>
                )}
              </div>

              {/* Actions & Root Causes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    الإجراء الفوري المتخذ (Immediate Action):
                  </span>
                  <p className="text-slate-300">{selectedObservation.immediateAction}</p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-sky-400 block">
                    الإجراء الوقائي الجذري (Preventive Action):
                  </span>
                  <p className="text-slate-300">{selectedObservation.preventiveAction}</p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-amber-300 block mb-1">
                  السبب الجذري المصنف (Root Cause):
                </span>
                <p className="text-slate-300">{selectedObservation.rootCause}</p>
              </div>

              {/* Closure Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">
                    تحديث حالة المعالجة والتحقق الميداني:
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    الحالة: {selectedObservation.status}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="ملاحظات الإغلاق والتحقق (مثال: تم استبدال الصمام وإجراء الفحص الهيدروستاتيكي بنجاح)..."
                  value={closureNoteInput}
                  onChange={(e) => setClosureNoteInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 outline-none"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('قيد المعالجة (In Progress)')}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
                  >
                    بدء المعالجة
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('تم التوجيه للصيانة (Assigned)')}
                    className="flex-1 py-2 px-3 bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 font-bold rounded-lg border border-purple-700/60 transition-colors"
                  >
                    أمر صيانة عاجل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('تم الإغلاق والتحقق (Closed)')}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg shadow transition-colors"
                  >
                    إغلاق الملاحظة بنجاح ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating Confirmation Toast */}
      {confirmationToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{confirmationToast}</span>
          <button
            type="button"
            onClick={() => setConfirmationToast(null)}
            className="p-1 rounded-lg hover:bg-emerald-900/50 text-emerald-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
