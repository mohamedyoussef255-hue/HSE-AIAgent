export type ObservationType = 'تصرف غير آمن (Unsafe Act)' | 'حالة غير آمنة (Unsafe Condition)' | 'ممارسة آمنة (Safe Practice)';

export type SeverityLevel = 'low' | 'medium' | 'high';

export type ReportStatus = 'جديد (New)' | 'قيد المعالجة (In Progress)' | 'تم التوجيه للصيانة (Assigned)' | 'تم الإغلاق والتحقق (Closed)';

export interface Asset {
  id: string;
  code: string;
  name: string;
  location: string;
  station: string;
  riskCategory: string;
  lastInspection: string;
  status: 'operational' | 'needs_inspection' | 'critical';
}

export interface StopObservation {
  id: string;
  ticketNumber: string;
  date: string;
  time: string;
  observerName: string;
  observerId: string;
  observerRole: string;
  stationName: string;
  locationDetails: string;
  assetId?: string;
  assetName?: string;
  description: string;
  audioRecorded?: boolean;
  voiceTranscript?: string;
  photoUrl?: string;
  videoUrl?: string; // لقطة فيديو قصيرة للحالة المرصودة
  videoDurationSeconds?: number;
  type: ObservationType;
  category: string; // ميكانيكي، كهربائي، كيميائي، مهمات وقاية، الخ
  severity: SeverityLevel;
  riskScore: number; // 1-100
  rootCause: string;
  immediateAction: string;
  preventiveAction: string;
  status: ReportStatus;
  assignedTo: string;
  routingRule: 'SUPERVISOR_ROUTING' | 'CRITICAL_ESCALATION' | 'TRAINING_DEPT' | 'MAINTENANCE_DIRECT';
  escalatedNotificationSent?: boolean;
  isSynced: boolean;
  pointsAwarded: number;
  closedAt?: string;
  closureDurationHours?: number; // وقت الإغلاق بالساعات للتحليل والرسوم البيانية
  closureNotes?: string;
}

export interface HeatmapStation {
  id: string;
  name: string;
  city: string;
  type: 'محطة وقود' | 'مستودع لوجستي' | 'ورشة صيانة مركزية' | 'محطة ضواغط وتفريغ';
  coords: { x: number; y: number }; // percentage coordinates for visual map
  totalObservations: number;
  openCritical: number;
  openMedium: number;
  openLow: number;
  statusColor: 'red' | 'amber' | 'green';
  lastIncidentDaysAgo: number;
  manager: string;
}

export interface SafetyUser {
  id: string;
  name: string;
  badgeNumber: string;
  role: string;
  department: string;
  totalCards: number;
  points: number;
  rank: number;
  badges: string[];
  preventedIncidents: number;
  email?: string;
}

export type UserRole = 'EMPLOYEE' | 'HSE_OFFICER' | 'SUPERVISOR' | 'HSE_ADMIN' | 'HSE_GENERAL_DIRECTOR' | 'SYSTEM_ADMIN' | 'BOT';

export type AIIncidentClassification = 'NEAR_MISS' | 'POTENTIAL_HAZARD' | 'EMERGENCY_INCIDENT';

export type WeatherReadinessLevel = 'NORMAL' | 'ELEVATED' | 'HIGH_ALERT' | 'DISASTER_EMERGENCY';

export interface SiteWeatherStatus {
  stationName: string;
  city: string;
  tempC: number;
  feelsLikeC: number;
  condition: 'مشمس معتدل' | 'حرارة شديدة' | 'عاصفة رملية وترابية' | 'أمطار غزيرة وسيول' | 'رياح شديدة وعواصف' | 'ضباب كثيف وانعدام رؤية';
  conditionEn: string;
  windSpeedKmH: number;
  humidityPercent: number;
  airQualityIndex: number;
  readinessLevel: WeatherReadinessLevel;
  naturalDisasterWarning?: string;
  mandatoryPpeAdvisory: {
    clothing: string[];
    restrictedActivities: string[];
    hydrationRestIntervalMinutes?: number;
    jobSpecificInstructions: {
      jobTitle: string;
      instructions: string;
      requiredGear: string;
    }[];
  };
}

export interface RewardItem {
  id: string;
  title: string;
  points?: number;
  pointsRequired?: number;
  icon: string;
  desc?: string;
  description?: string;
  active?: boolean;
  available?: boolean;
  category?: string;
}

export interface EmergencyBotScenario {
  id: string;
  title: string;
  titleEn: string;
  keywords: string[];
  severity: EmergencySeverity;
  category: string;
  immediateInstructions: string[];
  immediateInstructionsEn: string[];
  evacuationRequired: boolean;
  musterPoint?: string;
  escalationContacts: { name: string; role: string; phone: string }[];
  enabled: boolean;
  activeOffHoursOnly: boolean;
  customResponseText: string;
  customResponseTextEn: string;
}

export interface LiveIncidentStreamSession {
  id: string;
  stationName: string;
  locationDetails: string;
  incidentType: 'NEAR_MISS' | 'ACTUAL_INCIDENT' | 'STOP_WORK_ORDER';
  severity: SeverityLevel;
  broadcasterName: string;
  broadcasterBadge: string;
  startedAt: string;
  isActive: boolean;
  notes: string;
  snapshotUrl?: string;
  audioAlertTriggered: boolean;
  hseDirectorResponse?: {
    actionDirected: string;
    directedBy: string;
    directedAt: string;
    evacuateImmediate: boolean;
  };
}

export interface EmergencyBotRule {
  id: string;
  scenarioTitle: string;
  scenarioTitleEn: string;
  keywords: string[];
  severity: EmergencySeverity;
  autoResponseAr: string;
  autoResponseEn: string;
  immediateActions: string[];
  immediateActionsEn: string[];
  contactPerson: string;
  contactPhone: string;
  active: boolean;
  triggerOnlyOffHours: boolean; // اوقات العمل الغير رسمية
  autoDispatchEvacuation: boolean;
}

export interface DropdownOptionsMap {
  technicalCategories: string[];
  stations: string[];
  observationTypes: ObservationType[];
  rootCauses: string[];
  assignedTeams: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  badgeNumber: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  isGeneralDirector?: boolean;
}

export type ThemeMode = 'dark' | 'light';

export type ColorPalette =
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'purple'
  | 'teal'
  | 'orange'
  | 'cyan'
  | 'rose'
  | 'indigo'
  | 'bronze'
  | 'slate';

export type Language = 'ar' | 'en';

export type EmergencySeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'EVACUATION' | 'DRILL';

export interface EmergencyBroadcast {
  id: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: EmergencySeverity;
  issuedAt: string;
  issuedBy: string;
  active: boolean;
  evacuationMusterPoint?: string;
  evacuationMusterPointEn?: string;
  isFieldDrill?: boolean;
  requiresAcknowledgment?: boolean;
  safeProtocolSteps: string[];
  safeProtocolStepsEn: string[];
}

export interface EmergencyHeroReward {
  id: string;
  employeeName: string;
  employeeId: string;
  badgeNumber: string;
  actionTaken: string;
  actionTakenEn: string;
  emergencyType: string;
  emergencyTypeEn: string;
  executedPlanWithoutWaiting: boolean;
  responseTimeSeconds: number;
  pointsAwarded: number;
  rewardDate: string;
  verifiedByHse: boolean;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  size: string;
}

export interface ChatMessage {
  id: string;
  channel: 'HSE_EMPLOYEES' | 'HSE_SYSADMIN';
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  isFieldCustomizationRequest?: boolean;
  customizationDetails?: {
    targetPage: 'ADMIN_DASHBOARD' | 'USER_FORM' | 'RADAR_VIEW';
    fieldName: string;
    actionType: 'ADD_FIELD' | 'MODIFY_SEVERITY' | 'MAKE_MANDATORY';
  };
}

export interface RadarScanResult {
  id: string;
  timestamp: string;
  mode: 'hazard_radar' | 'thermal_scan' | 'defect_scan';
  isNearMiss: boolean;
  isAcuteDanger: boolean;
  isSafeCondition: boolean;
  nearMissProbability: number;
  hazardType: string;
  hazardTypeEn: string;
  defectDetected: string;
  defectDetectedEn: string;
  thermalHotspotC?: number;
  stepByStepAction: string[];
  stepByStepActionEn: string[];
  recommendationDecision: 'IMMEDIATE_ACTION' | 'SCHEDULED_MAINTENANCE' | 'NO_ACTION_REQUIRED';
  decisionSummary: string;
  decisionSummaryEn: string;
  photoUrl?: string;
}

export interface AppUiCustomization {
  // Director Page Controls
  directorPage: {
    pageTitle: string;
    pageSubtitle: string;
    showExecutiveSummary: boolean;
    showKpiCards: boolean;
    showEmergencyBotBtn: boolean;
    showDropdownManagerBtn: boolean;
    showExportExcelBtn: boolean;
    showPrintReportBtn: boolean;
    showObservationsTable: boolean;
    showTimeToClosureWidget: boolean;
    showChangePasswordBtn: boolean;
    showStatusFilter: boolean;
    showSeverityFilter: boolean;
    showTypeFilter: boolean;
    showSearchBar: boolean;
  };
  // Field Worker Page Controls
  workerPage: {
    pageTitle: string;
    pageSubtitle: string;
    showWeatherWidget: boolean;
    showQrScanBtn: boolean;
    showObserverRoleToggle: boolean;
    showLiveStreamNearMissBanner: boolean;
    showAssetLocationSelector: boolean;
    showVoiceRecorder: boolean;
    showDescriptionField: boolean;
    showAiGeminiClassifyBtn: boolean;
    showStopClassificationCards: boolean;
    showSeverityLevelSelector: boolean;
    showTechnicalCategorySelector: boolean;
    showRootCauseSelector: boolean;
    showAssignedTeamSelector: boolean;
    showImmediateActionField: boolean;
    showPhotoUpload: boolean;
    showVideoRecorder: boolean;
    showPointsRewardCard: boolean;
    showSimplifiedModeToggle: boolean;
  };
  // Top Header Global Bar Controls
  headerBar: {
    showLiveStreamBtn: boolean;
    showDropdownManagerBtn: boolean;
    showRadarScanBtn: boolean;
    showMobileAppDownloadBtn: boolean;
    showWeatherAdvisoryBtn: boolean;
    showThemePaletteBtn: boolean;
    showLanguageToggleBtn: boolean;
    showOfflineSyncBtn: boolean;
    showEmergencyBotBtn: boolean;
    showCameraLibraryBtn: boolean;
    showSafetyChatBtn: boolean;
    showHeatmapTab: boolean;
    showRootCauseTab: boolean;
    showHeroesTab: boolean;
    showManagementTab: boolean;
    showFieldTab: boolean;
  };
}
