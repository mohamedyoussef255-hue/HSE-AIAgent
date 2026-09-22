import React, { useState } from 'react';
import { AuthUser, ChatAttachment, ChatMessage, EmergencyBotRule, Language } from '../types';
import { getT } from '../utils/translations';
import {
  MessageSquare,
  Send,
  FileText,
  Image as ImageIcon,
  Paperclip,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  Download,
  AlertCircle,
  Eye,
  Bot,
  AlertOctagon,
  PhoneCall,
  Clock,
} from 'lucide-react';

interface InternalChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  language: Language;
  onOpenBotConfig?: () => void;
  isOffHoursSimulated?: boolean;
}

export const InternalChatModal: React.FC<InternalChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  messages,
  onSendMessage,
  language,
  onOpenBotConfig,
  isOffHoursSimulated,
}) => {
  const t = getT(language);
  const [activeChannel, setActiveChannel] = useState<'HSE_EMPLOYEES' | 'HSE_SYSADMIN'>('HSE_EMPLOYEES');
  const [inputText, setInputText] = useState('');
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [targetPage, setTargetPage] = useState<'ADMIN_DASHBOARD' | 'USER_FORM' | 'RADAR_VIEW'>('USER_FORM');
  const [fieldName, setFieldName] = useState('');
  const [actionType, setActionType] = useState<'ADD_FIELD' | 'MODIFY_SEVERITY' | 'MAKE_MANDATORY'>('ADD_FIELD');

  if (!isOpen) return null;

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  const handleSend = (attachments?: ChatAttachment[], isFieldReq = false, customDetails?: any) => {
    if (!inputText.trim() && (!attachments || attachments.length === 0) && !isFieldReq) return;

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      channel: activeChannel,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content: inputText.trim() || (isFieldReq ? 'طلب تعديل حقول النظام' : 'مرفق ملف جديد'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments || [],
      isFieldCustomizationRequest: isFieldReq,
      customizationDetails: customDetails,
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const handleAttachPdf = () => {
    const samplePdf: ChatAttachment = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      name: `تعميم_سلامة_${new Date().toISOString().slice(0, 10)}.pdf`,
      type: 'pdf',
      url: '#',
      size: '1.2 MB',
    };
    handleSend([samplePdf]);
  };

  const handleAttachImage = () => {
    const sampleImg: ChatAttachment = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      name: 'معاينة_المعدة_الميدانية.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      size: '780 KB',
    };
    handleSend([sampleImg]);
  };

  const handleCustomFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    const customDetails = {
      targetPage,
      fieldName: fieldName.trim(),
      actionType,
    };

    const description =
      language === 'ar'
        ? `[طلب تعديل رسمي من مدير السلامة] يرجى ${
            actionType === 'ADD_FIELD'
              ? 'إضافة الحقل الجديد'
              : actionType === 'MAKE_MANDATORY'
              ? 'جعل الحقل إلزامياً'
              : 'تعديل معايير الخطورة للحقل'
          } "${fieldName.trim()}" في ${
            targetPage === 'USER_FORM'
              ? 'صفحة استمارة الموظفين'
              : targetPage === 'ADMIN_DASHBOARD'
              ? 'لوحة المدير العام'
              : 'شاشة رادار الكاميرا'
          }.`
        : `[Official Field Customization Request] Please ${actionType} "${fieldName.trim()}" in ${targetPage}.`;

    const samplePdf: ChatAttachment = {
      id: `ATT-DOC-${Date.now().toString().slice(-4)}`,
      name: `مذكرة_تعديل_${fieldName.trim()}.pdf`,
      type: 'pdf',
      url: '#',
      size: '540 KB',
    };

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      channel: 'HSE_SYSADMIN',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content: description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [samplePdf],
      isFieldCustomizationRequest: true,
      customizationDetails: customDetails,
    };

    onSendMessage(newMsg);
    setShowCustomFieldModal(false);
    setFieldName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full h-[88vh] flex flex-col shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100">{t.internalChat}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'منظومة المحادثات الآمنة، تبادل ملفات PDF والصور، وإدارة طلبات التعديل'
                  : 'Encrypted safety chat, PDF/photo exchange, and field customization dispatch'}
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

        {/* Channel Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveChannel('HSE_EMPLOYEES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeChannel === 'HSE_EMPLOYEES'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              <span>{t.chatHseEmployees}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveChannel('HSE_SYSADMIN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeChannel === 'HSE_SYSADMIN'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              <span>{t.chatHseSysAdmin}</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenBotConfig && (
              <button
                type="button"
                onClick={onOpenBotConfig}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 transition flex items-center gap-1.5 shadow"
                title={language === 'ar' ? 'لوحة تحكم بوت الطوارئ الآلي خارج أوقات العمل' : 'Emergency Bot Control'}
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">
                  {language === 'ar' ? 'بوت الطوارئ' : 'Emergency Bot'}
                </span>
                {isOffHoursSimulated && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                )}
              </button>
            )}

            {/* HSE Director Feature: Request Field Customization */}
            {activeChannel === 'HSE_SYSADMIN' && (
              <button
                type="button"
                onClick={() => setShowCustomFieldModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-amber-300 transition flex items-center gap-1.5 shadow"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.requestCustomFields}</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-950/40">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              {language === 'ar' ? 'لا توجد رسائل سابقة في هذه القناة.' : 'No messages yet in this channel.'}
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isBot = msg.senderRole === 'BOT';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                    {isBot && <Bot className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className={`font-bold ${isBot ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {msg.senderName}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        isBot
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-slate-800 text-amber-400'
                      }`}
                    >
                      {isBot ? 'HSE_EMERGENCY_BOT' : msg.senderRole}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs space-y-2.5 shadow ${
                      isMine
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-100 rounded-tl-sm'
                        : isBot
                        ? 'bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-100 rounded-tr-sm shadow-emerald-950/50'
                        : msg.isFieldCustomizationRequest
                        ? 'bg-purple-950/60 border border-purple-700/60 text-purple-200 rounded-tr-sm'
                        : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tr-sm'
                    }`}
                  >
                    {isBot && (
                      <div className="flex items-center gap-2 text-emerald-300 font-black text-[11px] border-b border-emerald-500/30 pb-1.5">
                        <Bot className="w-4 h-4 text-emerald-400" />
                        <span>
                          {language === 'ar'
                            ? '🚨 استجابة طوارئ آلية معتمدة (خارج أوقات العمل الرسمية)'
                            : '🚨 Automated Emergency First-Response Protocol'}
                        </span>
                      </div>
                    )}
                    {msg.isFieldCustomizationRequest && (
                      <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px] border-b border-purple-700/40 pb-1.5">
                        <Sliders className="w-3.5 h-3.5" />
                        <span>طلب تعديل حقول النظام (Field Customization)</span>
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {/* Attachments rendering */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between gap-3 text-[11px]"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {att.type === 'pdf' ? (
                                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                              )}
                              <span className="truncate text-slate-200 font-medium">{att.name}</span>
                              <span className="text-slate-500 font-mono text-[10px] shrink-0">
                                ({att.size})
                              </span>
                            </div>

                            <a
                              href={att.url}
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`معاينة وتنزيل المرفق: ${att.name}`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 shrink-0 text-[10px]"
                            >
                              <Download className="w-3 h-3" />
                              <span>تحميل</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Input & Attachment Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 space-y-2">
          {/* Action pills: Attach PDF & Attach Photo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAttachPdf}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.attachPdf}</span>
            </button>
            <button
              type="button"
              onClick={handleAttachImage}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.attachImage}</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t.typeMessage}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl transition shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Modal: Request Field Customization for HSE Director */}
        {showCustomFieldModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-md w-full p-5 space-y-4 text-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Sliders className="w-4 h-4" />
                  <span>طلب تعديل حقول النظام (HSE Director)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomFieldModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCustomFieldSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">الصفحة المستهدفة:</label>
                  <select
                    value={targetPage}
                    onChange={(e: any) => setTargetPage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    <option value="USER_FORM">صفحات المستخدمين (استمارة الميدان)</option>
                    <option value="ADMIN_DASHBOARD">صفحة المدير العام (لوحة الإدارة)</option>
                    <option value="RADAR_VIEW">شاشة رادار الكاميرا والفحص الحراري</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">نوع الإجراء المطلوب:</label>
                  <select
                    value={actionType}
                    onChange={(e: any) => setActionType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    <option value="ADD_FIELD">إضافة حقل جديد</option>
                    <option value="MAKE_MANDATORY">جعل الحقل إلزامياً</option>
                    <option value="MODIFY_SEVERITY">تعديل معايير الخطورة للحقل</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">اسم الحقل المقترح:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فحص تسريب الغاز بالأشعة تحت الحمراء..."
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] text-purple-300">
                  سيتم إرسال الطلب رسمياً لمدير النظام مع إرفاق مذكرة المواصفات تلقائياً بتنسيق PDF.
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomFieldModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow"
                  >
                    إرسال الطلب
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
