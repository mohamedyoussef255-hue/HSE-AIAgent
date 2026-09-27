import { SeverityLevel } from '../types';

export type VisualPatternCategory =
  | 'VAPOR_LEAK'
  | 'VIBRATION_MONITORING'
  | 'CORROSION_DETECTION'
  | 'PPE_COMPLIANCE';

export type AcousticPatternCategory =
  | 'GAS_HISS'
  | 'MECHANICAL_GRINDING';

export interface VisualPattern {
  id: string;
  category: VisualPatternCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  targetComponent: string;
  thresholdParam: string;
  baselineImageUrl: string;
  defaultSeverity: SeverityLevel;
  immediateActionAr: string;
  preventiveActionAr: string;
  sampleCount: number;
  confidenceScore: number;
  isTrained: boolean;
  frequencyHz?: number;
  amplitudeMmS?: number;
  corrosionGrade?: 'C1' | 'C2' | 'C3' | 'C4';
}

export interface AcousticPattern {
  id: string;
  category: AcousticPatternCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  frequencyRangeHz: { min: number; max: number };
  decibelThreshold: number;
  targetMechanicalComponent: string;
  faultDiagnosisAr: string;
  immediateActionAr: string;
  preventiveActionAr: string;
  sampleCount: number;
  confidenceScore: number;
  isTrained: boolean;
}

export interface AiLibraryConfig {
  visualSensitivity: number; // 1-100
  acousticSensitivity: number; // 1-100
  autoAlertOnCritical: boolean;
  autoCreateObservationCard: boolean;
  visualPatterns: VisualPattern[];
  acousticPatterns: AcousticPattern[];
  lastCalibratedAt: string;
}
