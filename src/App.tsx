import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { FieldMobileView } from './components/FieldMobileView';
import { WebManagementView } from './components/WebManagementView';
import { HotspotHeatmapView } from './components/HotspotHeatmapView';
import { RootCauseAnalyticsView } from './components/RootCauseAnalyticsView';
import { GamificationView } from './components/GamificationView';
import { LoginModal } from './components/LoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ThemeAndPaletteModal } from './components/ThemeAndPaletteModal';
import { AiCameraRadarModal } from './components/AiCameraRadarModal';
import { InternalChatModal } from './components/InternalChatModal';
import { HseEmergencyControlModal } from './components/HseEmergencyControlModal';
import { EmergencyBanner } from './components/EmergencyBanner';
import { EmergencyBotConfigModal } from './components/EmergencyBotConfigModal';
import { DropdownManagerModal } from './components/DropdownManagerModal';
import { ObservationHistoryLogModal } from './components/ObservationHistoryLogModal';
import { SystemAdminControlPanelView } from './components/SystemAdminControlPanelView';
import { LiveIncidentStreamModal } from './components/LiveIncidentStreamModal';
import { MobileAppDownloadModal } from './components/MobileAppDownloadModal';
import { PointsRewardsControlModal } from './components/PointsRewardsControlModal';
import { SiteWeatherRiskWidget } from './components/SiteWeatherRiskWidget';

import {
  INITIAL_OBSERVATIONS,
  INITIAL_STATIONS,
  INITIAL_USERS,
} from './data/mockData';
import {
  INITIAL_AUTH_USERS,
  INITIAL_BROADCASTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_HERO_REWARDS,
} from './data/advancedMockData';
import {
  INITIAL_DROPDOWN_OPTIONS,
  INITIAL_EMERGENCY_BOT_RULES,
} from './data/emergencyBotConfig';
import {
  AuthUser,
  ColorPalette,
  DropdownOptionsMap,
  EmergencyBotRule,
  EmergencyBroadcast,
  EmergencyHeroReward,
  HeatmapStation,
  Language,
  LiveIncidentStreamSession,
  RewardItem,
  SafetyUser,
  StopObservation,
  ThemeMode,
  AppUiCustomization,
} from './types';
import { getT } from './utils/translations';
import { generatePaletteCSS } from './utils/themeStyles';
import { DEFAULT_APP_UI_CUSTOMIZATION } from './data/defaultUiCustomization';

const STORAGE_KEY_OBS = 'minhaj_stop_observations_v2';
const STORAGE_KEY_QUEUE = 'minhaj_stop_offline_queue_v2';
const STORAGE_KEY_USER = 'minhaj_stop_current_user_v2';
const STORAGE_KEY_AUTH = 'minhaj_stop_auth_user_v2';
const STORAGE_KEY_THEME = 'minhaj_stop_theme_mode_v2';
const STORAGE_KEY_PALETTE = 'minhaj_stop_color_palette_v2';
const STORAGE_KEY_LANG = 'minhaj_stop_lang_v2';
const STORAGE_KEY_BROADCASTS = 'minhaj_stop_broadcasts_v2';
const STORAGE_KEY_HEROES = 'minhaj_stop_heroes_v2';
const STORAGE_KEY_DROPDOWNS = 'minhaj_stop_dropdowns_v2';
const STORAGE_KEY_BOT_RULES = 'minhaj_stop_bot_rules_v2';
const STORAGE_KEY_OFF_HOURS = 'minhaj_stop_off_hours_v2';
const STORAGE_KEY_ADMIN_PASS = 'minhaj_stop_sys_admin_pass_v2';
const STORAGE_KEY_UI_CUSTOM = 'minhaj_stop_ui_customization_v2';
const STORAGE_KEY_CURRENT_TAB = 'minhaj_stop_current_tab_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_TAB);
    if (saved && ['system_admin', 'management', 'field', 'heatmap', 'rootcause', 'gamification'].includes(saved)) {
      return saved as NavTab;
    }
    return 'system_admin'; // Adopt the new system admin control panel as the default view
  });
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Settings & Theme
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode) || 'dark';
  });
  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => {
    return (localStorage.getItem(STORAGE_KEY_PALETTE) as ColorPalette) || 'amber';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as Language) || 'ar';
  });

  // Observations
  const [observations, setObservations] = useState<StopObservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OBS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_OBSERVATIONS;
  });

  // Offline queue
  const [offlineQueue, setOfflineQueue] = useState<StopObservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUEUE);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  // Current active gamified user
  const [currentUser, setCurrentUser] = useState<SafetyUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_USERS[0];
  });

  // Authenticated user (Auth) - Defaults to System Admin to adopt new view
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_AUTH_USERS.find((u) => u.role === 'SYSTEM_ADMIN') || INITIAL_AUTH_USERS[1];
  });

  // Broadcasts, Heroes & Chat
  const [broadcasts, setBroadcasts] = useState<EmergencyBroadcast[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BROADCASTS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_BROADCASTS;
  });

  const [heroRewards, setHeroRewards] = useState<EmergencyHeroReward[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HEROES);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_HERO_REWARDS;
  });

  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);

  // Stations
  const [stations, setStations] = useState<HeatmapStation[]>(INITIAL_STATIONS);

  // Dropdown Options Configuration (Controlled by System Admin & HSE)
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptionsMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DROPDOWNS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_DROPDOWN_OPTIONS;
  });

  // Emergency Bot Response Rules (Autonomous off-hours emergency response)
  const [botRules, setBotRules] = useState<EmergencyBotRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOT_RULES);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_EMERGENCY_BOT_RULES;
  });

  // Off-hours schedule simulation (active outside 08:00 - 17:00 or simulated)
  const [isOffHoursSimulated, setIsOffHoursSimulated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFF_HOURS);
      if (saved !== null) return JSON.parse(saved);
    } catch (_) {}
    return true; // Default to off-hours active for demonstration
  });

  // Modals state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isUserLoginOpen, setIsUserLoginOpen] = useState<boolean>(false);
  const [isThemePaletteOpen, setIsThemePaletteOpen] = useState<boolean>(false);
  const [isRadarOpen, setIsRadarOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isHseCommandOpen, setIsHseCommandOpen] = useState<boolean>(false);
  const [isBotConfigOpen, setIsBotConfigOpen] = useState<boolean>(false);
  const [isDropdownManagerOpen, setIsDropdownManagerOpen] = useState<boolean>(false);
  const [isHistoryLogOpen, setIsHistoryLogOpen] = useState<boolean>(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState<boolean>(false);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveIncidentStreamSession | null>(null);
  const [isMobileDownloadOpen, setIsMobileDownloadOpen] = useState<boolean>(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);
  const [isRewardsControlOpen, setIsRewardsControlOpen] = useState<boolean>(false);
  const [directorSecretCode, setDirectorSecretCode] = useState<string>('000000 HSE');
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || '0000';
  });
  const [uiCustomization, setUiCustomization] = useState<AppUiCustomization>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UI_CUSTOM);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_APP_UI_CUSTOMIZATION;
  });

  const handleResetUiCustomization = () => {
    setUiCustomization(DEFAULT_APP_UI_CUSTOMIZATION);
    try {
      localStorage.setItem(STORAGE_KEY_UI_CUSTOM, JSON.stringify(DEFAULT_APP_UI_CUSTOMIZATION));
    } catch (_) {}
  };
  const [rewardsList, setRewardsList] = useState<RewardItem[]>([
    {
      id: 'REW-01',
      title: 'يوم إجازة إضافي مدفوع الأجر',
      description: 'إجازة تقديرية إضافية معتمدة من مدير عام السلامة والصحة المهنية لليقظة العالية.',
      pointsRequired: 250,
      icon: 'Calendar',
      category: 'LEAVE',
      available: true,
    },
    {
      id: 'REW-02',
      title: 'قسيمة مشتريات بقيمة 1,000 ج.م / ر.س',
      description: 'قسيمة شراء فورية لأفضل مراكز التجزئة والمتاجر الكبرى.',
      pointsRequired: 180,
      icon: 'Gift',
      category: 'VOUCHER',
      available: true,
    },
    {
      id: 'REW-03',
      title: 'خوذة سلامة ذكية ومهمات وقاية متطورة (Pro Series)',
      description: 'خوذة مهنية معتمدة ومزودة بمصباح ليلي وشريط عاكس ورباط ذقن.',
      pointsRequired: 120,
      icon: 'HardHat',
      category: 'GEAR',
      available: true,
    },
    {
      id: 'REW-04',
      title: 'درع تميز بطل السلامة مع شهادة تقدير موثقة',
      description: 'درع فاخر مطلي وموثق من الإدارة العامة للسلامة والصحة المهنية.',
      pointsRequired: 150,
      icon: 'Award',
      category: 'RECOGNITION',
      available: true,
    },
  ]);

  const handleUpdateUserPoints = (userId: string, addedPoints: number) => {
    setCurrentUser((prev) => (prev.id === userId ? { ...prev, points: Math.max(0, prev.points + addedPoints) } : prev));
  };

  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'system_admin') {
      const adminUser = INITIAL_AUTH_USERS.find((u) => u.role === 'SYSTEM_ADMIN') || INITIAL_AUTH_USERS[1];
      setAuthUser(adminUser);
    }
    setCurrentTab(tab);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_TAB, tab);
    } catch (_) {}
  };

  // Pre-fill state for observation from AI Radar
  const [radarPreFillData, setRadarPreFillData] = useState<Partial<StopObservation> | null>(null);

  // Active Emergency Broadcast
  const [activeBroadcast, setActiveBroadcast] = useState<EmergencyBroadcast | null>(() => {
    return broadcasts.find((b) => b.active) || null;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, themeMode);
      localStorage.setItem(STORAGE_KEY_PALETTE, colorPalette);
      localStorage.setItem(STORAGE_KEY_LANG, language);
      localStorage.setItem(STORAGE_KEY_OBS, JSON.stringify(observations));
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(offlineQueue));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      if (authUser) localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
      localStorage.setItem(STORAGE_KEY_BROADCASTS, JSON.stringify(broadcasts));
      localStorage.setItem(STORAGE_KEY_HEROES, JSON.stringify(heroRewards));
      localStorage.setItem(STORAGE_KEY_DROPDOWNS, JSON.stringify(dropdownOptions));
      localStorage.setItem(STORAGE_KEY_BOT_RULES, JSON.stringify(botRules));
      localStorage.setItem(STORAGE_KEY_OFF_HOURS, JSON.stringify(isOffHoursSimulated));
      localStorage.setItem(STORAGE_KEY_ADMIN_PASS, adminPassword);
      localStorage.setItem(STORAGE_KEY_UI_CUSTOM, JSON.stringify(uiCustomization));
      localStorage.setItem(STORAGE_KEY_CURRENT_TAB, currentTab);
    } catch (_) {}
  }, [themeMode, colorPalette, language, observations, offlineQueue, currentUser, authUser, broadcasts, heroRewards, dropdownOptions, botRules, isOffHoursSimulated, adminPassword, uiCustomization, currentTab]);

  // Adjust document direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Apply real-time dynamic palette CSS & dark/light overrides across the entire application
  useEffect(() => {
    let styleTag = document.getElementById('stop-dynamic-theme-overrides') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'stop-dynamic-theme-overrides';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = generatePaletteCSS(colorPalette, themeMode);
  }, [colorPalette, themeMode]);

  // Handle saving new observation from Field
  const handleSaveObservation = (newObs: StopObservation) => {
    // Award points to current user
    setCurrentUser((prev) => ({
      ...prev,
      points: prev.points + newObs.pointsAwarded,
      totalCards: prev.totalCards + 1,
      preventedIncidents:
        newObs.severity === 'high' ? prev.preventedIncidents + 1 : prev.preventedIncidents,
    }));

    if (isOffline) {
      setOfflineQueue((prev) => [newObs, ...prev]);
      setObservations((prev) => [newObs, ...prev]);
    } else {
      setObservations((prev) => [newObs, ...prev]);
    }

    // Update station heatmap counters
    setStations((prev) =>
      prev.map((stn) => {
        if (stn.name === newObs.stationName) {
          const isCritical = newObs.severity === 'high';
          const isMedium = newObs.severity === 'medium';
          const isLow = newObs.severity === 'low';
          return {
            ...stn,
            totalObservations: stn.totalObservations + 1,
            openCritical: isCritical ? stn.openCritical + 1 : stn.openCritical,
            openMedium: isMedium ? stn.openMedium + 1 : stn.openMedium,
            openLow: isLow ? stn.openLow + 1 : stn.openLow,
            statusColor: isCritical || stn.openCritical > 0 ? 'red' : stn.statusColor,
          };
        }
        return stn;
      })
    );

    // Clear radar pre-fill data after save
    setRadarPreFillData(null);
  };

  // Sync offline queue when coming back online
  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;

    setObservations((prev) =>
      prev.map((obs) => ({
        ...obs,
        isSynced: true,
      }))
    );
    setOfflineQueue([]);
    alert(
      language === 'ar'
        ? 'تمت مزامنة جميع البلاغات المحفوظة في وضع عدم الاتصال بنجاح مع الخادم المركزي! ✓'
        : 'All offline observations synchronized successfully with the central server! ✓'
    );
  };

  const handleUpdateObservation = (updated: StopObservation) => {
    setObservations((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    );
  };

  // Convert AI Camera Radar result into a STOP Observation
  const handleConvertRadarToObservation = (partialObs: Partial<StopObservation>) => {
    setRadarPreFillData(partialObs);
    setCurrentTab('field');
    setIsRadarOpen(false);
  };

  const handleStartLiveStream = (session: LiveIncidentStreamSession) => {
    setActiveLiveSession(session);
    setIsLiveStreamOpen(true);
  };

  const handleEndLiveStream = () => {
    if (activeLiveSession) {
      const streamObs: StopObservation = {
        id: `STOP-LIVE-${Date.now().toString().slice(-4)}`,
        ticketNumber: `LIVE-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
        observerName: activeLiveSession.broadcasterName,
        observerId: activeLiveSession.broadcasterBadge,
        observerRole: 'مفتش سلامة ميداني',
        stationName: activeLiveSession.stationName,
        locationDetails: activeLiveSession.locationDetails,
        description: `[بث مباشر موثق]: ${activeLiveSession.notes}`,
        type: activeLiveSession.incidentType === 'ACTUAL_INCIDENT' ? 'حالة غير آمنة (Unsafe Condition)' : 'تصرف غير آمن (Unsafe Act)',
        category: 'طوارئ وعمليات مباشرة',
        severity: activeLiveSession.severity,
        riskScore: 94,
        rootCause: 'رصد حادث وشيك ميداني وتدخل عاجل من قيادة السلامة بالبث المباشر',
        immediateAction: activeLiveSession.hseDirectorResponse?.actionDirected || 'تم بث الواقعة والتوجيه المباشر بإخلاء وعزل المنطقة',
        preventiveAction: 'فحص فوري للموقع ومراجعة خطة الطوارئ',
        status: 'قيد المعالجة (In Progress)',
        assignedTo: 'فريق الاستجابة السريعة والسلامة',
        routingRule: 'CRITICAL_ESCALATION',
        escalatedNotificationSent: true,
        isSynced: true,
        pointsAwarded: 50,
      };
      setObservations((prev) => [streamObs, ...prev]);
    }
    setActiveLiveSession(null);
  };

  const handleSendDirectorDirective = (directive: string, isEvacuate: boolean) => {
    if (activeLiveSession) {
      setActiveLiveSession({
        ...activeLiveSession,
        hseDirectorResponse: {
          actionDirected: directive,
          directedBy: authUser?.name || 'مدير عام الإدارة العامة للسلامة والصحة المهنية',
          directedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          evacuateImmediate: isEvacuate,
        },
      });
    }
  };

  // Hero Claim Action when emergency instruction executed
  const handleClaimHeroBonus = (broadcastTitle: string) => {
    const isAr = language === 'ar';
    const bonus = 500;

    // Award +500 points to user
    setCurrentUser((prev) => ({
      ...prev,
      points: prev.points + bonus,
      preventedIncidents: prev.preventedIncidents + 1,
    }));

    // Record verified Hero Reward
    const newHero: EmergencyHeroReward = {
      id: `HERO-${Date.now().toString().slice(-4)}`,
      employeeName: authUser?.name || currentUser.name,
      employeeId: authUser?.id || currentUser.id,
      badgeNumber: authUser?.badgeNumber || 'EMP-7700',
      actionTaken: isAr
        ? `تنفيذ خطة الاستجابة الفورية لـ (${broadcastTitle}) دون انتظار مسؤولي HSE`
        : `Executed emergency first-response plan for (${broadcastTitle}) without waiting for HSE`,
      actionTakenEn: `Executed emergency first-response plan for (${broadcastTitle}) without waiting for HSE`,
      emergencyType: broadcastTitle,
      emergencyTypeEn: broadcastTitle,
      executedPlanWithoutWaiting: true,
      responseTimeSeconds: 38,
      pointsAwarded: bonus,
      rewardDate: new Date().toISOString().slice(0, 10),
      verifiedByHse: true,
    };

    setHeroRewards((prev) => [newHero, ...prev]);

    // Also notify in internal chat
    const chatNotification = {
      id: `MSG-HERO-${Date.now().toString().slice(-4)}`,
      channel: 'HSE_EMPLOYEES' as const,
      senderId: 'SYS-HSE-COMMAND',
      senderName: 'مركز قيادة وتوجيه HSE المركزي',
      senderRole: 'HSE_ADMIN' as const,
      content: isAr
        ? `🏆 [مكافأة بطل الطوارئ الاستثنائية]: تم منح العامل/الموظف (${authUser?.name || currentUser.name}) مكافأة قدرها +${bonus} نقطة سلامة تقديراً لاستجابته الفورية وتنفيذ خطة الطوارئ بالموقع دون تأخير!`
        : `🏆 [Emergency Hero Reward]: Employee (${authUser?.name || currentUser.name}) credited +${bonus} Safety Points for swift emergency execution!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, chatNotification]);

    alert(
      isAr
        ? `تهانينا لك يا بطل السلامة! 🏆\nتم منحك مكافأة الاستجابة الفورية للطوارئ (+500 نقطة سلامة) وتسجيل بطولتك في سجل شرف إدارة HSE!`
        : `Congratulations Safety Hero! 🏆\nYou have been awarded +500 Emergency Response Points!`
    );
  };

  const handleAddBroadcast = (newBroadcast: EmergencyBroadcast) => {
    setBroadcasts((prev) => [newBroadcast, ...prev]);
    setActiveBroadcast(newBroadcast);
  };

  const handleAddHeroReward = (newReward: EmergencyHeroReward) => {
    setHeroRewards((prev) => [newReward, ...prev]);
  };

  const handleSendMessage = (newMsg: any) => {
    setChatMessages((prev) => [...prev, newMsg]);

    // Check if message triggers Emergency Bot (when off-hours active or simulated)
    if (newMsg.senderRole !== 'BOT') {
      const msgContent = (newMsg.content || '').toLowerCase();

      // Match against enabled emergency bot rules
      const matchedRule = botRules.find((rule: EmergencyBotRule) => {
        if (!rule.active) return false;
        if (rule.triggerOnlyOffHours && !isOffHoursSimulated) return false;
        return rule.keywords.some((kw: string) => msgContent.includes(kw.toLowerCase()));
      });

      if (matchedRule) {
        // Trigger automated bot response after 700ms
        setTimeout(() => {
          const isAr = language === 'ar';
          const instructionsFormatted = matchedRule.immediateActions
            .map((inst: string, idx: number) => `${idx + 1}. ${inst}`)
            .join('\n');

          const botResponse = {
            id: `BOT-MSG-${Date.now()}`,
            channel: newMsg.channel || 'HSE_EMPLOYEES',
            senderId: 'BOT-EMERGENCY-DISPATCHER',
            senderName: isAr ? 'بوت استجابة الطوارئ القصوى (HSE)' : 'Emergency Auto-Dispatcher Bot',
            senderRole: 'BOT' as const,
            content: isAr
              ? `🚨 [استجابة فورية لحالة: ${matchedRule.scenarioTitle}]\n\n⚠️ ${matchedRule.autoResponseAr}\n\n📋 بروتوكول التصرف الفوري المعتمد:\n${instructionsFormatted}\n\n📞 مسؤول الاتصال المناوب: ${matchedRule.contactPerson} (${matchedRule.contactPhone})\n\n⚡ تنبيه: تم إخطار فريق الطوارئ المناوب آلياً وتوثيق البلاغ في سجلات الإدارة العليا.`
              : `🚨 [IMMEDIATE EMERGENCY RESPONSE: ${matchedRule.scenarioTitleEn || matchedRule.scenarioTitle}]\n\n⚠️ ${matchedRule.autoResponseEn || matchedRule.autoResponseAr}\n\n📋 Standard Immediate Action Protocol:\n${(matchedRule.immediateActionsEn || matchedRule.immediateActions).join('\n')}\n\n📞 On-Call Emergency Escalation: ${matchedRule.contactPerson} (${matchedRule.contactPhone})\n\n⚡ Automated Alert Dispatched to Emergency Response Team.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          setChatMessages((prev) => [...prev, botResponse]);
        }, 700);
      }
    }
  };

  const criticalOpenCount = observations.filter(
    (o) => o.severity === 'high' && o.status !== 'تم الإغلاق والتحقق (Closed)'
  ).length;

  const t = getT(language);

  // Determine root theme styling
  const isLight = themeMode === 'light';

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-['Cairo',sans-serif] transition-colors duration-200 ${
        isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Active Emergency Broadcast Banner */}
      <EmergencyBanner
        broadcast={activeBroadcast}
        onDismiss={() => setActiveBroadcast(null)}
        onClaimHeroBonus={handleClaimHeroBonus}
        language={language}
      />

      {/* Top Header & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        offlineQueueCount={offlineQueue.length}
        onSyncOfflineQueue={handleSyncOfflineQueue}
        criticalCount={criticalOpenCount}
        currentUser={currentUser}
        authUser={authUser}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenUserLogin={() => setIsUserLoginOpen(true)}
        onOpenRadar={authUser?.role === 'SYSTEM_ADMIN' ? () => setIsRadarOpen(true) : undefined}
        onOpenHistoryLog={() => setIsHistoryLogOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenHseCommand={() => setIsHseCommandOpen(true)}
        onOpenThemePalette={() => setIsThemePaletteOpen(true)}
        onOpenBotConfig={() => setIsBotConfigOpen(true)}
        onOpenDropdownManager={authUser?.role === 'SYSTEM_ADMIN' ? () => setIsDropdownManagerOpen(true) : undefined}
        onOpenLiveStream={() => setIsLiveStreamOpen(true)}
        isLiveStreamActive={Boolean(activeLiveSession?.isActive)}
        activeLiveSession={activeLiveSession}
        isOffHoursSimulated={isOffHoursSimulated}
        onOpenMobileDownload={() => setIsMobileDownloadOpen(true)}
        onOpenWeatherAdvisory={() => setIsWeatherModalOpen(true)}
        language={language}
        themeMode={themeMode}
        colorPalette={colorPalette}
        uiConfig={uiCustomization.headerBar}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {currentTab === 'field' && (
          <FieldMobileView
            onSaveObservation={handleSaveObservation}
            isOffline={isOffline}
            offlineQueueCount={offlineQueue.length}
            initialData={radarPreFillData}
            onClearInitialData={() => setRadarPreFillData(null)}
            onOpenRadar={authUser?.role === 'SYSTEM_ADMIN' ? () => setIsRadarOpen(true) : undefined}
            onOpenLiveStream={() => setIsLiveStreamOpen(true)}
            dropdownOptions={dropdownOptions}
            onOpenDropdownManager={authUser?.role === 'SYSTEM_ADMIN' ? () => setIsDropdownManagerOpen(true) : undefined}
            onBack={() => handleSelectTab('management')}
            language={language}
            currentUserRole={authUser?.role || 'EMPLOYEE'}
            uiConfig={uiCustomization.workerPage}
          />
        )}

        {currentTab === 'management' && (
          <WebManagementView
            observations={observations}
            onUpdateObservation={handleUpdateObservation}
            onOpenBotConfig={() => setIsBotConfigOpen(true)}
            onOpenDropdownManager={authUser?.role === 'SYSTEM_ADMIN' ? () => setIsDropdownManagerOpen(true) : undefined}
            isOffHoursSimulated={isOffHoursSimulated}
            uiConfig={uiCustomization.directorPage}
            onSwitchToSystemAdmin={() => handleSelectTab('system_admin')}
          />
        )}

        {currentTab === 'heatmap' && (
          <HotspotHeatmapView stations={stations} observations={observations} />
        )}

        {currentTab === 'rootcause' && (
          <RootCauseAnalyticsView observations={observations} />
        )}

        {currentTab === 'gamification' && (
          <GamificationView users={INITIAL_USERS} currentUser={currentUser} />
        )}

        {currentTab === 'system_admin' && (
          <SystemAdminControlPanelView
            dropdownOptions={dropdownOptions}
            onOpenDropdownManager={() => setIsDropdownManagerOpen(true)}
            onOpenRadar={() => setIsRadarOpen(true)}
            language={language}
            directorSecretCode={directorSecretCode}
            onUpdateDirectorPassword={(newPass) => setDirectorSecretCode(newPass)}
            adminPassword={adminPassword}
            onUpdateAdminPassword={(newPass) => setAdminPassword(newPass)}
            onLoginAsGeneralDirector={() => {
              const dir = INITIAL_AUTH_USERS.find((u) => u.role === 'HSE_GENERAL_DIRECTOR') || INITIAL_AUTH_USERS[0];
              setAuthUser(dir);
              handleSelectTab('management');
            }}
            onOpenPointsRewardsManager={() => setIsRewardsControlOpen(true)}
            onOpenWeatherAdvisory={() => setIsWeatherModalOpen(true)}
            onBack={() => handleSelectTab('management')}
            uiCustomization={uiCustomization}
            onUpdateUiCustomization={(updated) => setUiCustomization(updated)}
            onResetUiCustomization={handleResetUiCustomization}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 px-6 text-xs transition-colors ${
          isLight
            ? 'border-slate-300 bg-white text-slate-700'
            : 'border-slate-900 bg-slate-950 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <span className="font-semibold text-slate-200 text-center sm:text-right">
              STOP - منصة تتبع وملاحظة السلامة (Safety Tracking & Observation Platform)
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-amber-400 text-[11px] bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 font-bold">
                نسخة 2026 • معتمد للشركات الصناعية
              </span>
            </div>
          </div>

          {/* Official Company Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[12px]">
            <div className="flex items-center gap-2 text-center sm:text-right">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="font-black text-slate-100 tracking-wide">
                إنتاج وتنفيذ وتصميم شركة عزوتي لتكنولوجيا المعلومات - EZWETY IT Co. M.A.Y - 2026
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>All Rights Reserved © 2026</span>
              <span>•</span>
              <span className="text-amber-400/90 font-bold">EZWETY IT Co.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Admin Login Modal (Triggered by 5-clicks on STOP) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(adminUser: AuthUser) => {
          setAuthUser(adminUser);
          if (adminUser.role === 'SYSTEM_ADMIN') {
            handleSelectTab('system_admin');
          } else {
            handleSelectTab('management');
          }
        }}
        language={language}
        directorSecretCode={directorSecretCode}
        adminPassword={adminPassword}
      />

      {/* 2. Employee / User Login Modal */}
      <LoginModal
        isOpen={isUserLoginOpen}
        onClose={() => setIsUserLoginOpen(false)}
        onLogin={(user: AuthUser) => {
          setAuthUser(user);
          if (user.role === 'SYSTEM_ADMIN') {
            setCurrentTab('system_admin');
          } else if (user.role === 'HSE_GENERAL_DIRECTOR') {
            setCurrentTab('management');
          } else {
            setCurrentTab('field');
          }
        }}
        language={language}
        directorSecretCode={directorSecretCode}
      />

      {/* 3. Theme, Palette & Language Modal */}
      <ThemeAndPaletteModal
        isOpen={isThemePaletteOpen}
        onClose={() => setIsThemePaletteOpen(false)}
        themeMode={themeMode}
        onToggleThemeMode={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        colorPalette={colorPalette}
        onSelectPalette={setColorPalette}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'))}
      />

      {/* 4. AI Camera & Thermal Radar Scanner Modal */}
      <AiCameraRadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        language={language}
        onConvertToObservation={handleConvertRadarToObservation}
      />

      {/* 5. Internal Multi-Channel Safety Chat Modal */}
      <InternalChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={
          authUser || {
            id: currentUser.id,
            name: currentUser.name,
            email: 'user@company.sa',
            role: 'EMPLOYEE',
            department: 'محطة التموين المركزية',
            badgeNumber: 'EMP-1021',
            avatar: '👷‍♂️',
          }
        }
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        language={language}
        onOpenBotConfig={() => setIsBotConfigOpen(true)}
        isOffHoursSimulated={isOffHoursSimulated}
      />

      {/* 6. HSE Emergency Control & Hero Rewards Center */}
      <HseEmergencyControlModal
        isOpen={isHseCommandOpen}
        onClose={() => setIsHseCommandOpen(false)}
        currentUser={
          authUser || {
            id: 'HSE-DIR-01',
            name: 'سعادة مدير عام السلامة والصحة المهنية',
            email: 'hse.director@company.sa',
            role: 'HSE_ADMIN',
            department: 'الإدارة العامة للسلامة والصحة المهنية',
            badgeNumber: 'HSE-001',
            avatar: '🛡️',
            isGeneralDirector: true,
          }
        }
        broadcasts={broadcasts}
        onAddBroadcast={handleAddBroadcast}
        heroRewards={heroRewards}
        onAddHeroReward={handleAddHeroReward}
        language={language}
      />

      {/* 7. Emergency Response Bot Configuration Modal (Off-Hours Autonomous First Response) */}
      <EmergencyBotConfigModal
        isOpen={isBotConfigOpen}
        onClose={() => setIsBotConfigOpen(false)}
        currentUser={
          authUser || {
            id: 'HSE-DIR-01',
            name: 'سعادة مدير عام السلامة والصحة المهنية',
            email: 'hse.director@company.sa',
            role: 'HSE_ADMIN',
            department: 'الإدارة العامة للسلامة والصحة المهنية',
            badgeNumber: 'HSE-001',
            avatar: '🛡️',
            isGeneralDirector: true,
          }
        }
        botRules={botRules}
        onSaveBotRules={(updatedRules: EmergencyBotRule[]) => setBotRules(updatedRules)}
        language={language}
        isOffHoursSimulated={isOffHoursSimulated}
        onToggleOffHours={() => setIsOffHoursSimulated((prev) => !prev)}
      />

      {/* 8. Dynamic Dropdown Options Manager Modal (Admin Control over All Select Lists) */}
      <DropdownManagerModal
        isOpen={isDropdownManagerOpen}
        onClose={() => setIsDropdownManagerOpen(false)}
        currentUser={
          authUser || {
            id: 'SYS-ADMIN-01',
            name: 'محمد يوسف (مدير النظام)',
            email: 'mohamedyoussef255@gmail.com',
            role: 'SYSTEM_ADMIN',
            department: 'إدارة تكنولوجيا المعلومات والنظم المركزية',
            badgeNumber: 'SYS-770',
            avatar: '💻',
            isGeneralDirector: true,
          }
        }
        dropdownOptions={dropdownOptions}
        onSaveDropdownOptions={(updatedOptions: DropdownOptionsMap) => setDropdownOptions(updatedOptions)}
        language={language}
      />

      {/* 9. Historical Safety Observations Log Modal (Replaces Camera Radar for Non-Admins) */}
      <ObservationHistoryLogModal
        isOpen={isHistoryLogOpen}
        onClose={() => setIsHistoryLogOpen(false)}
        observations={observations}
        language={language}
      />

      {/* 10. Live Field Incident & Near-Miss Video Broadcast Modal with Audio Alarm */}
      <LiveIncidentStreamModal
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
        activeSession={activeLiveSession}
        onStartStream={handleStartLiveStream}
        onEndStream={handleEndLiveStream}
        onSendDirectorDirective={handleSendDirectorDirective}
        authUser={authUser}
        language={language}
      />

      {/* 11. Mobile App Download Modal (Android APK & iOS PWA / App Store) */}
      <MobileAppDownloadModal
        isOpen={isMobileDownloadOpen}
        onClose={() => setIsMobileDownloadOpen(false)}
        language={language}
      />

      {/* 12. Points & Rewards Management Control Modal */}
      <PointsRewardsControlModal
        isOpen={isRewardsControlOpen}
        onClose={() => setIsRewardsControlOpen(false)}
        language={language}
        users={INITIAL_USERS}
        rewards={rewardsList}
        onUpdateUserPoints={handleUpdateUserPoints}
        onSaveRewards={setRewardsList}
      />

      {/* 13. Weather & Natural Disaster Emergency Advisory Modal */}
      {isWeatherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsWeatherModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition z-10"
              title="إغلاق"
            >
              ✕
            </button>
            <SiteWeatherRiskWidget language={language} />
          </div>
        </div>
      )}
    </div>
  );
}
