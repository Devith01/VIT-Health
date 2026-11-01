import { apiClient } from './axios';

export interface SubmitDiagnosisPayload {
  appointmentId: string;
  finalDiagnosis: string;
  icdCode?: string;
  clinicalNotes: string;
  recommendedLeaveDays?: number;
  aiPredictionId?: string;
  isAiPredictionCorrect?: boolean;
  aiFeedbackNotes?: string;
}

export const submitDiagnosisApi = async (payload: SubmitDiagnosisPayload): Promise<{ status: string; message: string }> => {
  const response = await apiClient.post('/doctor/diagnosis', payload);
  return response.data;
};

export const getAiFeedbackStatsApi = async (): Promise<{ status: string; data: { totalEvaluations: number; correctPredictions: number; accuracyRate: number } }> => {
  const response = await apiClient.get('/doctor/ai-accuracy');
  return response.data;
};
