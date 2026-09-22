import React, { useState } from 'react';
import {
  Bot,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  PhoneCall,
  Flame,
  Zap,
  Droplets,
  ShieldAlert,
  Send,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { EmergencyBotScenario, EmergencySeverity, Language } from '../types';

interface EmergencyBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: EmergencyBotScenario[];
  onSaveScenarios: (scenarios: EmergencyBotScenario[]) => void;
  language: Language;
}

export const EmergencyBotModal: React.FC<EmergencyBotModalProps> = ({
  isOpen,
  onClose,
  scenarios,
  onSaveScenarios,
  language,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'SCENARIOS' | 'SIMULATOR'>('SCENARIOS');
  const [scenarioList, setScenarioList] = useState<EmergencyBotScenario[]>(scenarios);
  const [editingScenario, setEditingScenario] = useState<EmergencyBotScenario | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Bot Simulator states
  const [simMessage, setSimMessage] = useState('');
  const [simOffHoursOverride, setSimOffHoursOverride] = useState(true);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; scenario?: EmergencyBotScenario }>>([
    {
      sender: 'bot',
      text: isAr
        ? 'مرحباً، أنا بوت الاستجابة الآلي لحالات الطوارئ خارج أوقات العمل الرسمية 🛡️. أنا جاهز للتعامل مع أي بلاغ طارئ (تسريب غاز، حريق، صعق كهربائي، انسكاب كيميائي) وتقديم التعليمات الفورية وعزل المخاطر فوراً.'
        : 'Hello, I am the Automated Off-Hours Emergency Safety Bot 🛡️. I am standing by to process acute incidents (gas leaks, fires, electrical shock, chemical spills) with immediate life-saving protocols and dispatch escalation.',
      time: '00:00',
    },
  ]);

  // Form states for creating/editing scenario
  const [formTitle, setFormTitle] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formSeverity, setFormSeverity] = useState<EmergencySeverity>('CRITICAL');
  const [formCategory, setFormCategory] = useState('سلامة ومكافحة حريق');
  const [formInstructions, setFormInstructions] = useState('');
  const [formMusterPoint, setFormMusterPoint] = useState('');
  const [formCustomResponse, setFormCustomResponse] = useState('');
  const [formOffHoursOnly, setFormOffHoursOnly] = useState(true);
  const [formEnabled, setFormEnabled] = useState(true);

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setEditingScenario(null);
    setFormTitle('');
    setFormTitleEn('');
    setFormKeywords('');
    setFormSeverity('CRITICAL');
    setFormCategory('سلامة ومكافحة حريق');
    setFormInstructions('');
    setFormMusterPoint('نقطة التجمع رقم (A)');
    setFormCustomResponse('');
    setFormOffHoursOnly(true);
    setFormEnabled(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (scn: EmergencyBotScenario) => {
    setEditingScenario(scn);
    setFormTitle(scn.title);
    setFormTitleEn(scn.titleEn);
    setFormKeywords(scn.keywords.join(', '));
    setFormSeverity(scn.severity);
    setFormCategory(scn.category);
    setFormInstructions(scn.immediateInstructions.join('\n'));
    setFormMusterPoint(scn.musterPoint || '');
    setFormCustomResponse(scn.customResponseText);
    setFormOffHoursOnly(scn.activeOffHoursOnly);
    setFormEnabled(scn.enabled);
    setIsFormOpen(true);
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const keywordsArray = formKeywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    const instructionsArray = formInstructions
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newScn: EmergencyBotScenario = {
      id: editingScenario ? editingScenario.id : `SCN-${Date.now().toString().slice(-4)}`,
      title: formTitle.trim(),
      titleEn: formTitleEn.trim() || formTitle.trim(),
      keywords: keywordsArray.length > 0 ? keywordsArray : ['طوارئ', 'خطر'],
      severity: formSeverity,
      category: formCategory,
      immediateInstructions:
        instructionsArray.length > 0 ? instructionsArray : ['التوجه فوراً لنقطة التجمع الآمنة.'],
      immediateInstructionsEn: instructionsArray,
      evacuationRequired: formSeverity === 'EVACUATION' || formSeverity === 'CRITICAL',
      musterPoint: formMusterPoint.trim() || undefined,
      escalationContacts: editingScenario?.escalationContacts || [
        { name: 'غرفة العمليات المركزية 24/7', role: 'الخط الساخن للطوارئ', phone: '998 / 011-400-9999' },
        { name: 'مدير السلامة المناوب', role: 'HSE On-Duty Lead', phone: '+966 50 123 4567' },
      ],
      enabled: formEnabled,
      activeOffHoursOnly: formOffHoursOnly,
      customResponseText:
        formCustomResponse.trim() ||
        (isAr
          ? `🚨 [استجابة البوت الآلي الفورية]: تم رصد حالة (${formTitle.trim()}). يُرجى تنفيذ تعليمات السلامة والابتعاد عن مصدر الخطر فوراً!`
          : `🚨 [Emergency Bot Auto-Response]: Detected (${formTitle.trim()}). Execute safety protocols and evacuate immediately!`),
      customResponseTextEn:
        formCustomResponse.trim() || `🚨 [Emergency Bot]: Detected ${formTitle.trim()}. Evacuate immediately!`,
    };

    let updated: EmergencyBotScenario[];
    if (editingScenario) {
      updated = scenarioList.map((s) => (s.id === editingScenario.id ? newScn : s));
    } else {
      updated = [newScn, ...scenarioList];
    }

    setScenarioList(updated);
    onSaveScenarios(updated);
    setIsFormOpen(false);
  };

  const handleDeleteScenario = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا السيناريو من البوت الآلي؟' : 'Delete this scenario?')) return;
    const updated = scenarioList.filter((s) => s.id !== id);
    setScenarioList(updated);
    onSaveScenarios(updated);
  };

  const handleToggleEnabled = (id: string) => {
    const updated = scenarioList.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    setScenarioList(updated);
    onSaveScenarios(updated);
  };

  // Bot Simulator Engine
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessage.trim()) return;

    const userText = simMessage.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const newChat = [...chatLog, { sender: 'user' as const, text: userText, time: nowTime }];
    setSimMessage('');
    setChatLog(newChat);

    // Analyze text against scenarios
    setTimeout(() => {
      const lower = userText.toLowerCase();

      // Find matching enabled scenario
      const matchedScenario = scenarioList.find((s) => {
        if (!s.enabled) return false;
        return s.keywords.some((k) => lower.includes(k.toLowerCase()));
      });

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (matchedScenario) {
        newChat.push({
          sender: 'bot',
          text: isAr ? matchedScenario.customResponseText : matchedScenario.customResponseTextEn,
          time: replyTime,
          scenario: matchedScenario,
        });
      } else {
        // Fallback response
        newChat.push({
          sender: 'bot',
          text: isAr
            ? `⚠️ تم استلام بلاغك خارج الدوام الرسمي: "${userText}".\nلم يتم التعرف على نمط خطر حرج مباشر، ولكن تم توجيه بلاغك فوراً إلى سجل البلاغات الميدانية المناوبة. إذا كان هناك خطر فوري على الحياة، اتصل بالدفاع المدني (998) أو الإسعاف (997) فوراً.`
            : `⚠️ Off-hours message received: "${userText}". No acute pattern matched; logged for on-duty review. If life-threatening, call emergency services directly.`,
          time: replyTime,
        });
      }

      setChatLog([...newChat]);
    }, 450);
  };

  const getSeverityBadge = (sev: EmergencySeverity) => {
    switch (sev) {
      case 'EVACUATION':
        return <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">إخلاء شامل</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">خطر حرج</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">تحذير</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px]">إرشادي</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-5 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            <span>Off-Hours Autonomous Emergency Bot • بوت الطوارئ الآلي خارج الدوام</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {isAr ? 'لوحة تحكم بوت الطوارئ القصوى في أوقات العمل غير الرسمية' : 'Off-Hours Emergency AI Bot Control'}
          </h3>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'تغذية البوت بالسيناريوهات الشائعة والردود الفورية الإلزامية وعزل المخاطر وإشعار الجهات المختصة آلياً عند غياب مسؤولي السلامة'
              : 'Feed the bot with common incident scenarios, life-saving instant instructions, and emergency escalations for off-duty hours'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('SCENARIOS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'SCENARIOS'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{isAr ? 'السيناريوهات والردود المبرمجة' : 'Programmed Scenarios'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono">
                {scenarioList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SIMULATOR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'SIMULATOR'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'مختبر اختبار ومحاكاة البوت (Simulator)' : 'Live Bot Simulator'}</span>
            </button>
          </div>

          {activeTab === 'SCENARIOS' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'إضافة سيناريو طوارئ جديد' : 'New Scenario'}</span>
            </button>
          )}
        </div>

        {/* TAB 1: SCENARIOS LIST */}
        {activeTab === 'SCENARIOS' && (
          <div className="space-y-4">
            {scenarioList.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-800">
                <Bot className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">{isAr ? 'لا توجد سيناريوهات طوارئ معرفة حالياً.' : 'No scenarios added.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {scenarioList.map((scn) => (
                  <div
                    key={scn.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      scn.enabled
                        ? 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50'
                        : 'bg-slate-950/30 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(scn.severity)}
                          <span className="text-xs font-mono text-slate-500">{scn.category}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{scn.title}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(scn.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            scn.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {scn.enabled ? (isAr ? 'مفعّل' : 'Active') : isAr ? 'معطّل' : 'Disabled'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(scn)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteScenario(scn.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Keywords tags */}
                    <div className="mb-2.5 flex flex-wrap gap-1">
                      {scn.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>

                    {/* Instructions preview */}
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                      <span className="text-[10px] text-amber-400 font-bold block">
                        {isAr ? 'التعليمات الفورية للموظف:' : 'Instant Directives:'}
                      </span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px] leading-relaxed">
                        {scn.immediateInstructions.slice(0, 2).map((ins, idx) => (
                          <li key={idx} className="truncate">
                            {ins}
                          </li>
                        ))}
                        {scn.immediateInstructions.length > 2 && (
                          <li className="text-slate-500">+{scn.immediateInstructions.length - 2} {isAr ? 'خطوات أخرى...' : 'more steps...'}</li>
                        )}
                      </ul>
                    </div>

                    {/* Escalation contact */}
                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <PhoneCall className="w-3 h-3" />
                        <span>{scn.escalationContacts[0]?.name || 'غرفة الطوارئ'}</span>
                      </span>
                      {scn.activeOffHoursOnly && (
                        <span className="text-[10px] text-purple-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>خارج أوقات العمل</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE BOT SIMULATOR */}
        {activeTab === 'SIMULATOR' && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-200">
                  {isAr
                    ? 'جرب محاكاة إرسال بلاغ طارئ في منتصف الليل أو عطلة نهاية الأسبوع لاختبار ردود البوت الفورية والتوجيهات الإلزامية.'
                    : 'Simulate emergency messages received during midnight or weekends to verify instant automated responses.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setChatLog([
                    {
                      sender: 'bot',
                      text: isAr
                        ? 'مرحباً، أنا بوت الاستجابة الآلي لحالات الطوارئ خارج أوقات العمل الرسمية 🛡️. أنا جاهز للتعامل مع أي بلاغ طارئ.'
                        : 'Emergency Bot standing by.',
                      time: '00:00',
                    },
                  ])
                }
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'إعادة ضبط المحادثة' : 'Reset'}</span>
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px]">{isAr ? 'أمثلة سريعة للتجربة:' : 'Quick samples:'}</span>
              {[
                'يوجد تسريب غاز قوي ورائحة نفاذة بجوار المضخة 4',
                'اشتعال حريق في لوحة الكهرباء وتصاعد دخان كثيف',
                'انسكاب برميل كيماويات حارقة في المستودع',
                'تعرض عامل لصعق كهربائي وسقوطه مغشياً عليه',
              ].map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSimMessage(sample)}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-[11px] text-slate-300 transition"
                >
                  {sample}
                </button>
              ))}
            </div>

            {/* Simulator Chat Feed */}
            <div className="h-80 overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              {chatLog.map((c, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${c.sender === 'user' ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-bold">{c.sender === 'user' ? (isAr ? 'الموظف في الموقع' : 'Worker on Site') : (isAr ? 'بوت الطوارئ الذكي' : 'Emergency AI Bot')}</span>
                    <span>• {c.time}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-2 shadow ${
                      c.sender === 'user'
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-100 rounded-tl-sm'
                        : 'bg-emerald-950/70 border border-emerald-600/50 text-emerald-100 rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{c.text}</p>

                    {c.scenario && (
                      <div className="mt-2 pt-2 border-t border-emerald-500/30 space-y-1.5 text-[11px]">
                        <div className="font-bold text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isAr ? 'خطة العمل الفورية الإلزامية:' : 'Immediate Mandatory Protocol:'}</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-slate-200">
                          {c.scenario.immediateInstructions.map((ins, idx) => (
                            <li key={idx}>{ins}</li>
                          ))}
                        </ol>

                        {c.scenario.musterPoint && (
                          <div className="p-1.5 bg-rose-950/50 rounded border border-rose-800/60 text-rose-200 text-[11px] font-bold">
                            📍 {isAr ? 'نقطة التجمع للإخلاء:' : 'Evacuation Point:'} {c.scenario.musterPoint}
                          </div>
                        )}

                        <div className="pt-1 flex flex-wrap gap-2 text-[10px] text-slate-300">
                          {c.scenario.escalationContacts.map((ct, idx) => (
                            <span key={idx} className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                              📞 {ct.name}: <strong className="text-emerald-400">{ct.phone}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSimulateSubmit} className="flex gap-2">
              <input
                type="text"
                value={simMessage}
                onChange={(e) => setSimMessage(e.target.value)}
                placeholder={isAr ? 'اكتب بلاغ الطوارئ لاختبار استجابة البوت (مثال: تسريب غاز حاد في المضخة 2)...' : 'Type simulated emergency message...'}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'إرسال للبوت' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}

        {/* MODAL / DRAWER FOR CREATE & EDIT SCENARIO */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <span>{editingScenario ? (isAr ? 'تعديل سيناريو طوارئ للبوت' : 'Edit Scenario') : (isAr ? 'إضافة سيناريو طوارئ جديد' : 'New Scenario')}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveScenario} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {isAr ? 'عنوان حالة الطوارئ (مثال: تسريب غاز البترول المسال LPG):' : 'Emergency Scenario Title:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="تسريب غاز أو مواد بترولية سريعة الاشتعال..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      {isAr ? 'مستوى خطورة الحالة:' : 'Severity Level:'}
                    </label>
                    <select
                      value={formSeverity}
                      onChange={(e: any) => setFormSeverity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                    >
                      <option value="CRITICAL">خطر حرج (Critical Alert)</option>
                      <option value="EVACUATION">إخلاء شامل فوري (Evacuation)</option>
                      <option value="WARNING">تحذير مهني (Warning)</option>
                      <option value="INFO">إرشادي (Info)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      {isAr ? 'المجال الفني:' : 'Technical Category:'}
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                    >
                      <option value="سلامة ومكافحة حريق">سلامة ومكافحة حريق</option>
                      <option value="كيميائي / بيئي">كيميائي / بيئي</option>
                      <option value="كهربائي">كهربائي</option>
                      <option value="ميكانيكي / هيدروليكي">ميكانيكي / هيدروليكي</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {isAr ? 'الكلمات المفتاحية المشغلة للبوت (مفصولة بفاصلة):' : 'Trigger Keywords (comma separated):'}
                  </label>
                  <input
                    type="text"
                    value={formKeywords}
                    onChange={(e) => setFormKeywords(e.target.value)}
                    placeholder="غاز, تسريب, رائحة, بنزين, انفجار, leak, gas"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {isAr ? 'عند ورود أي من هذه الكلمات في بلاغ العامل، يستجيب البوت فوراً بهذا السيناريو.' : 'Bot triggers when message contains any of these words.'}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {isAr ? 'الخطوات الفورية الإلزامية للموظف بالموقع (كل خطوة في سطر):' : 'Instant Protocol Steps (one per line):'}
                  </label>
                  <textarea
                    rows={3}
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    placeholder={'الضغط الفوري على أقرب زر إغلاق طوارئ (ESD)\nالابتعاد بمسافة لا تقل عن 100 متر عكس اتجاه الرياح\nحظر استخدام الهواتف أو مفاتيح الكهرباء'}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {isAr ? 'نقطة التجمع المحددة للإخلاء (إن وجد):' : 'Muster Point (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={formMusterPoint}
                    onChange={(e) => setFormMusterPoint(e.target.value)}
                    placeholder="نقطة التجمع رقم (A) - الساحة الشرقية الآمنة"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {isAr ? 'نص الرد الآلي المخصص للبوت:' : 'Custom Bot Response Text:'}
                  </label>
                  <textarea
                    rows={2}
                    value={formCustomResponse}
                    onChange={(e) => setFormCustomResponse(e.target.value)}
                    placeholder="🚨 [استجابة البوت الفورية]: تم رصد بلاغ طارئ! اتبع التعليمات فوراً..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formOffHoursOnly}
                      onChange={(e) => setFormOffHoursOnly(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-300">{isAr ? 'تفعيل فقط في غير أوقات العمل الرسمية (Off-Hours)' : 'Off-Hours Only'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEnabled}
                      onChange={(e) => setFormEnabled(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-300">{isAr ? 'تفعيل السيناريو' : 'Enabled'}</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/50"
                  >
                    {isAr ? 'حفظ وتغذية البوت' : 'Save & Feed Bot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
