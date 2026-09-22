import React, { useState } from 'react';
import { AuthUser, EmergencyBotRule, EmergencySeverity, Language } from '../types';
import {
  Bot,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  AlertOctagon,
  PhoneCall,
  X,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Flame,
  KeyRound,
  Edit3,
} from 'lucide-react';
import { INITIAL_EMERGENCY_BOT_RULES } from '../data/emergencyBotConfig';

interface EmergencyBotConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  botRules: EmergencyBotRule[];
  onSaveBotRules: (rules: EmergencyBotRule[]) => void;
  isOffHoursSimulated: boolean;
  onToggleOffHours: () => void;
  language: Language;
}

export const EmergencyBotConfigModal: React.FC<EmergencyBotConfigModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  botRules,
  onSaveBotRules,
  isOffHoursSimulated,
  onToggleOffHours,
  language,
}) => {
  const [localRules, setLocalRules] = useState<EmergencyBotRule[]>(botRules);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  // Form states
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [severity, setSeverity] = useState<EmergencySeverity>('CRITICAL');
  const [autoResponseAr, setAutoResponseAr] = useState('');
  const [immediateActions, setImmediateActions] = useState('');
  const [contactPerson, setContactPerson] = useState('م. خالد السبيعي (مدير الطوارئ المناوب)');
  const [contactPhone, setContactPhone] = useState('+966 50 123 4567');
  const [triggerOnlyOffHours, setTriggerOnlyOffHours] = useState(false);
  const [autoDispatchEvacuation, setAutoDispatchEvacuation] = useState(false);

  if (!isOpen) return null;

  const handleToggleRule = (id: string) => {
    const updated = localRules.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    setLocalRules(updated);
    onSaveBotRules(updated);
  };

  const handleDeleteRule = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا السيناريو الآلي؟' : 'Delete this rule?')) {
      const updated = localRules.filter((r) => r.id !== id);
      setLocalRules(updated);
      onSaveBotRules(updated);
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioTitle.trim() || !autoResponseAr.trim() || !keywords.trim()) return;

    const newRule: EmergencyBotRule = {
      id: `BOT-RULE-${Date.now().toString().slice(-4)}`,
      scenarioTitle: scenarioTitle.trim(),
      scenarioTitleEn: scenarioTitle.trim(),
      keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
      severity,
      autoResponseAr: autoResponseAr.trim(),
      autoResponseEn: autoResponseAr.trim(),
      immediateActions: immediateActions.split('\n').map((a) => a.trim()).filter(Boolean),
      immediateActionsEn: immediateActions.split('\n').map((a) => a.trim()).filter(Boolean),
      contactPerson: contactPerson.trim(),
      contactPhone: contactPhone.trim(),
      active: true,
      triggerOnlyOffHours,
      autoDispatchEvacuation,
    };

    const updated = [newRule, ...localRules];
    setLocalRules(updated);
    onSaveBotRules(updated);
    setShowNewRuleForm(false);

    // Reset Form
    setScenarioTitle('');
    setKeywords('');
    setAutoResponseAr('');
    setImmediateActions('');
  };

  const handleResetDefaultRules = () => {
    if (confirm(language === 'ar' ? 'استعادة جميع قواعد البوت الافتراضية المعتمدة؟' : 'Reset bot rules to defaults?')) {
      setLocalRules(INITIAL_EMERGENCY_BOT_RULES);
      onSaveBotRules(INITIAL_EMERGENCY_BOT_RULES);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-100">
                  {language === 'ar'
                    ? 'بوت إدارة الطوارئ القصوى خارج أوقات العمل الرسمية'
                    : 'Off-Hours Emergency AI Dispatcher Bot'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  HSE Autonomous Bot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'تغذية البوت بالردود الفورية للتعامل مع سيناريوهات الطوارئ الحرجة والمتكررة عند غياب المسؤول الميداني'
                  : 'Feed automated response rules for critical incidents during nights, weekends & off-hours'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Off-Hours Status Bar & Simulation Switch */}
        <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-300">
              {language === 'ar' ? 'حالة وقت العمل الحالية:' : 'Current Work Schedule Status:'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                isOffHoursSimulated
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOffHoursSimulated ? 'bg-rose-400' : 'bg-emerald-400'}`}
              />
              {isOffHoursSimulated
                ? language === 'ar'
                  ? 'خارج أوقات العمل الرسمية (Off-Hours) - البوت نشط للرد الفوري'
                  : 'Off-Hours / Night Shift - Bot in Full Auto-Response'
                : language === 'ar'
                ? 'أوقات العمل الرسمية (HSE Official Hours)'
                : 'Official Work Hours'}
            </span>
          </div>

          {/* Toggle off-hours button for testing */}
          <button
            type="button"
            onClick={onToggleOffHours}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            {isOffHoursSimulated ? (
              <>
                <ToggleRight className="w-4 h-4 text-rose-400" />
                <span>{language === 'ar' ? 'محاكاة وقت العمل الرسمي' : 'Simulate Official Hours'}</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'محاكاة أوقات خارج العمل' : 'Simulate Off-Hours Shift'}</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/40">
          {/* Top Action Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'ar'
                  ? `سيناريوهات وقواعد الاستجابة الآلية المبرمجة (${localRules.length})`
                  : `Automated Response Scenarios (${localRules.length})`}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setShowNewRuleForm(!showNewRuleForm)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة سيناريو طوارئ مخصص' : 'Add Emergency Rule'}</span>
            </button>
          </div>

          {/* New Rule Form */}
          {showNewRuleForm && (
            <form
              onSubmit={handleCreateRule}
              className="p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 space-y-3.5 animate-fadeIn text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-black text-emerald-400 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تغذية سيناريو طوارئ جديد' : 'New Emergency Scenario'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewRuleForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">عنوان السيناريو الطارئ:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تسريب غاز H2S أو كبريتيد الهيدروجين"
                    value={scenarioTitle}
                    onChange={(e) => setScenarioTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    الكلمات المفتاحية المشغلة للرد (مفصولة بفواصل):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="غاز, H2S, رائحة بيض فاسد, اختناق, تسرب"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  رد البوت الفوري للعامل في الموقع (الإرشادات المنقذة للحياة):
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="اكتب التعليمات الدقيقة التي يجب أن تظهر فوراً للعامل على الشاشة وفي المحادثة..."
                  value={autoResponseAr}
                  onChange={(e) => setAutoResponseAr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  خطوات العمل الفورية الإلزامية (كل خطوة في سطر منفصل):
                </label>
                <textarea
                  rows={2}
                  placeholder={'1. ارتداء جهاز التنفس الذاتي SCBA فورا.\n2. إيقاف الصمام الرئيسي ESD.\n3. التوجه لنقطة التجمع عكس الرياح.'}
                  value={immediateActions}
                  onChange={(e) => setImmediateActions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">مسؤول الطوارئ المناوب المعتمد:</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">هاتف الطوارئ للاتصال المباشر:</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDispatchEvacuation}
                    onChange={(e) => setAutoDispatchEvacuation(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span className="text-rose-300 font-bold">بث أمر إخلاء فوري تلقائياً مع صفارة إنذار</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={triggerOnlyOffHours}
                    onChange={(e) => setTriggerOnlyOffHours(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-300 font-semibold">تفعيل الرد التلقائي فقط خارج أوقات العمل</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRuleForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow"
                >
                  حفظ وتفعيل في البوت
                </button>
              </div>
            </form>
          )}

          {/* List of Configured Bot Rules */}
          <div className="space-y-3">
            {localRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-2xl border transition-all ${
                  rule.active
                    ? 'bg-slate-900/90 border-slate-700 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-1.5 rounded-xl ${
                        rule.severity === 'EVACUATION'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : rule.severity === 'CRITICAL'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <AlertOctagon className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-100">{rule.scenarioTitle}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">الكلمات المشغلة:</span>
                        {rule.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                        rule.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>مفعل</span>
                        </>
                      ) : (
                        <span>معطل</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                      title="حذف السيناريو"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Auto Response Content Preview */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-400 block mb-0.5">رد البوت المبرمج:</span>
                    <p>{rule.autoResponseAr}</p>
                  </div>

                  {rule.immediateActions && rule.immediateActions.length > 0 && (
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-amber-300 block">
                        خطوات الاستجابة الإلزامية للعامل:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                        {rule.immediateActions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                      <span>{rule.contactPerson}</span>
                      <span className="font-mono text-sky-300 font-bold">{rule.contactPhone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rule.autoDispatchEvacuation && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          🚨 بث إخلاء آلي
                        </span>
                      )}
                      {rule.triggerOnlyOffHours && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          🌙 خارج أوقات العمل الرسمية فقط
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaultRules}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-bold"
          >
            {language === 'ar' ? 'استعادة سيناريوهات الطوارئ الافتراضية' : 'Restore Default Scenarios'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition shadow"
          >
            {language === 'ar' ? 'إغلاق وحفظ' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
