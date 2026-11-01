import { apiClient } from './axios';

export interface MentalHealthAnswers {
  age: number;
  study_hours: number;
  exam_pressure: number;
  academic_performance: number;
  stress_level: number;
  anxiety_frequency: number;
  depressive_feelings: number;
  sleep_hours: number;
  physical_activity: number;
  social_support: number;
  screen_hours: number;
  internet_hours: number;
  financial_stress: number;
  family_pressure: number;
  academic_exhaustion: number;
}

export interface MentalHealthScreeningResult {
  id: string;
  riskLevel: string;
  prediction: 'High' | 'Low' | 'Medium';
  confidence: number;
  risk_category: string;
  isReferred: boolean;
  counselorNote?: string | null;
  disclaimer: string;
  createdAt: string;
}

export const submitMentalHealthScreeningApi = async (
  answers: MentalHealthAnswers
): Promise<{ status: string; data: { screening: MentalHealthScreeningResult } }> => {
  const response = await apiClient.post('/mental-health/screen', { answers });
  return response.data;
};
