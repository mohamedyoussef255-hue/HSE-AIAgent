import React, { useState } from 'react';
import {
  AuthUser,
  EmergencyBroadcast,
  EmergencyHeroReward,
  EmergencySeverity,
  Language,
} from '../types';
import { getT } from '../utils/translations';
import {
  AlertOctagon,
  Bell,
  Award,
  ShieldAlert,
  Flame,
  Radio,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Send,
  Plus,
} from 'lucide-react';

interface HseEmergencyControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  broadcasts: EmergencyBroadcast[];
  onAddBroadcast: (broadcast: EmergencyBroadcast) => void;
  heroRewards: EmergencyHeroReward[];
  onAddHeroReward: (reward: EmergencyHeroReward) => void;
  language: Language;
}

export const HseEmergencyControlModal: React.FC<HseEmergencyControlModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  broadcasts,
  onAddBroadcast,
  heroRewards,
  onAddHeroReward,
  language,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'HERO_REWARDS'>('DISPATCH');

  // Form for Dispatch
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<EmergencySeverity>('WARNING');
  const [musterPoint, setMusterPoint] = useState('نقطة التجمع رقم (A) - الساحة الشرقية الآمنة');
  const [isFieldDrill, setIsFieldDrill] = useState(false);
  const [step1, setStep1] = useState('إيقاف كافة المعدات وتفعيل زر الطوارئ ESD');
  const [step2, setStep2] = useState('إخلاء الموقع فوراً دون هلع والتوجه لنقطة التجمع');
  const [step3, setStep3] = useState('حصر الأفراد وتسليم الكشف لمشرف الطوارئ');

  // Form for Hero Reward
  const [heroName, setHeroName] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroAction, setHeroAction] = useState('');
  const [heroEmergencyType, setHeroEmergencyType] = useState('تسريب محتمل في خط الوقود');
  const [heroResponseSeconds, setHeroResponseSeconds] = useState(45);

  if (!isOpen) return null;

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newBroadcast: EmergencyBroadcast = {
      id: `BC-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      titleEn: title.trim(),
      message: message.trim(),
      messageEn: message.trim(),
      type: severity,
      issuedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      issuedBy: currentUser.name,
      active: true,
      evacuationMusterPoint: severity === 'EVACUATION' || isFieldDrill ? musterPoint : undefined,
      isFieldDrill,
      requiresAcknowledgment: severity === 'EVACUATION' || severity === 'CRITICAL',
      safeProtocolSteps: [step1, step2, step3].filter(Boolean),
      safeProtocolStepsEn: [step1, step2, step3].filter(Boolean),
    };

    onAddBroadcast(newBroadcast);
    alert(
      language === 'ar'
        ? 'تم بث التعميم / أمر الإخلاء بنجاح لجميع العاملين في الميدان! ✓'
        : 'Broadcast / Evacuation Order dispatched successfully! ✓'
    );
    setTitle('');
    setMessage('');
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim() || !heroAction.trim()) return;

    const newReward: EmergencyHeroReward = {
      id: `HERO-${Date.now().toString().slice(-4)}`,
      employeeName: heroName.trim(),
      employeeId: heroBadge.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      badgeNumber: heroBadge.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      actionTaken: heroAction.trim(),
      actionTakenEn: heroAction.trim(),
      emergencyType: heroEmergencyType,
      emergencyTypeEn: heroEmergencyType,
      executedPlanWithoutWaiting: true,
      responseTimeSeconds: heroResponseSeconds,
      pointsAwarded: 500,
      rewardDate: new Date().toISOString().slice(0, 10),
      verifiedByHse: true,
    };

    onAddHeroReward(newReward);
    alert(
      language === 'ar'
        ? `تم اعتماد مكافأة بطل الطوارئ (+500 نقطة) للموظف: ${heroName.trim()} بنجاح! 🏆`
        : `Emergency Hero Reward (+500 Pts) credited to ${heroName.trim()}! 🏆`
    );
    setHeroName('');
    setHeroAction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl space-y-5 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>HSE Command & Emergency Control Center</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">{t.hseCommand}</h3>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'التحكم المركزي في بث الإنذارات، أوامر الإخلاء، محاكاة الطوارئ، واعتماد مكافأة العامل البطل'
              : 'Centralized control for hazard warnings, evacuation orders, simulation drills, and Hero Rewards'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('DISPATCH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'DISPATCH'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>بث التنبيهات وأوامر الإخلاء</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HERO_REWARDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'HERO_REWARDS'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>مكافأة الاستجابة الفورية للطوارئ (+500 نقطة)</span>
          </button>
        </div>

        {/* TAB 1: DISPATCH BROADCASTS */}
        {activeTab === 'DISPATCH' && (
          <form onSubmit={handleDispatchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">نوع البلاغ أو الإشعار:</label>
                <select
                  value={severity}
                  onChange={(e: any) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="INFO">إشعار إرشادي / بروتوكول الوضع الآمن (Safe Info)</option>
                  <option value="WARNING">تحذير مهني ومناخي (Hazard Warning)</option>
                  <option value="CRITICAL">إنذار طوارئ حاد (Critical Alert)</option>
                  <option value="EVACUATION">أمر إخلاء طوارئ فوري (Evacuation Order)</option>
                  <option value="DRILL">تجربة محاكاة إخلاء ميدانية (Emergency Drill)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">تصنيف التجربة التدريبية:</label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFieldDrill}
                    onChange={(e) => setIsFieldDrill(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span className="text-slate-300">تجربة محاكاة وهمية ميدانية (Field Drill)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">عنوان التنبيه:</label>
              <input
                type="text"
                required
                placeholder="مثال: تنبيه طوارئ: تسريب غاز في خط الأنابيب رقم 2..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                نص الرسالة والإرشادات الإلزامية للعاملين:
              </label>
              <textarea
                rows={3}
                required
                placeholder="اكتب تفاصيل التنبيه، الإجراءات المطلوبة، والاحتياطات الميدانية الفورية..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>

            {(severity === 'EVACUATION' || isFieldDrill) && (
              <div className="bg-rose-950/40 p-3.5 rounded-2xl border border-rose-800/60 space-y-2 text-xs">
                <label className="font-bold text-rose-300 block">نقطة التجمع المحددة للإخلاء:</label>
                <input
                  type="text"
                  value={musterPoint}
                  onChange={(e) => setMusterPoint(e.target.value)}
                  className="w-full bg-slate-950 border border-rose-900 rounded-xl p-2 text-slate-200 outline-none"
                />
              </div>
            )}

            {/* Protocol Steps */}
            <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <span className="font-bold text-slate-300 block">
                بروتوكول الخطوات الإرشادية (الوضع الآمن أو حالات الخطر):
              </span>
              <input
                type="text"
                value={step1}
                onChange={(e) => setStep1(e.target.value)}
                placeholder="الخطوة 1"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
              />
              <input
                type="text"
                value={step2}
                onChange={(e) => setStep2(e.target.value)}
                placeholder="الخطوة 2"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
              />
              <input
                type="text"
                value={step3}
                onChange={(e) => setStep3(e.target.value)}
                placeholder="الخطوة 3"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إطلاق التنبيه وبثه لحظياً لجميع شاشات العاملين والمشرفين</span>
            </button>
          </form>
        )}

        {/* TAB 2: EMERGENCY HERO REWARDS */}
        {activeTab === 'HERO_REWARDS' && (
          <div className="space-y-5 text-xs">
            {/* Explanatory Banner */}
            <div className="bg-amber-950/50 p-4 rounded-2xl border border-amber-500/50 flex items-start gap-3">
              <Award className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-black text-amber-300 text-sm">
                  مكافأة الاستجابة الفورية للطوارئ (Emergency First Responder Bonus)
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  تُمنح هذه المكافأة الاستثنائية (+500 نقطة سلامة مع وسام الشجاعة) للعامل أو الموظف
                  الذي يتلقى تعليمات الإدارة وينفذ خطة الطوارئ بالموقع فوراً دون انتظار وصول مسؤول
                  السلامة والصحة المهنية، مما يمنع وقوع كارثة ويحفظ الأرواح.
                </p>
              </div>
            </div>

            {/* Form to Grant Bonus */}
            <form onSubmit={handleHeroSubmit} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>تسجيل واعتماد مكافأة عامل بطل جديد:</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">اسم الموظف البطل:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: صالح بن حمد المطيري"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">الرقم الوظيفي / البطاقة:</label>
                  <input
                    type="text"
                    placeholder="EMP-5091"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">طبيعة حالة الطوارئ:</label>
                <input
                  type="text"
                  value={heroEmergencyType}
                  onChange={(e) => setHeroEmergencyType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">
                  الإجراء البطولي المنفذ وفق تعليمات الإدارة دون انتظار مسؤول HSE:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="وصف الإجراء الفوري المنفذ (مثل: إغلاق صمام الغاز ESD وتأمين القاطع الكهربائي وإخلاء 4 زملاء خلال 45 ثانية)..."
                  value={heroAction}
                  onChange={(e) => setHeroAction(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">زمن الاستجابة القياسي:</span>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={heroResponseSeconds}
                  onChange={(e) => setHeroResponseSeconds(parseInt(e.target.value) || 30)}
                  className="w-20 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-amber-400 font-mono text-center font-bold"
                />
                <span className="text-slate-400">ثانية فقط!</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-2 shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>اعتماد المكافأة الاستثنائية ومنح +500 نقطة فورا</span>
              </button>
            </form>

            {/* List of Honored Emergency Heroes */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-300 text-xs">
                سجل شرف أبطال الاستجابة الفورية المعتمدين:
              </h5>
              <div className="space-y-2">
                {heroRewards.map((hero) => (
                  <div
                    key={hero.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-black text-slate-100">{hero.employeeName}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                          {hero.badgeNumber}
                        </span>
                        <span className="text-slate-500 text-[10px]">{hero.rewardDate}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{hero.actionTaken}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          تم التحقق من إدارة HSE
                        </span>
                        <span className="flex items-center gap-1 text-sky-400 font-mono">
                          <Clock className="w-3 h-3" />
                          سرعة الاستجابة: {hero.responseTimeSeconds} ثانية
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-left bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                      <span className="text-amber-400 font-black font-mono text-sm block">
                        +{hero.pointsAwarded}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">نقطة تميز</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
