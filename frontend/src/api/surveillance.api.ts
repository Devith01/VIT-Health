import { apiClient } from './axios';

export interface SurveillanceSummary {
  totalCases: number;
  confirmedCount: number;
  suspectedCount: number;
  hierarchy: {
    campusTotal: number;
    blocks: Record<string, { confirmed: number; suspected: number; total: number; categories: Record<string, number> }>;
  };
  recentCases: any[];
}

export interface OutbreakForecast {
  disease_category: str;
  location_name: str;
  current_cases: number;
  threshold_count: number;
  predicted_next_day_cases: number;
  trend: string;
  outbreak_risk: string;
  baseline_mae: number;
  lstm_mae: number;
  model_selected: string;
  warning_triggered: boolean;
  message: string;
  disclaimer: string;
}

type str = string;

export const getSurveillanceSummaryApi = async (): Promise<{ status: string; data: SurveillanceSummary }> => {
  const response = await apiClient.get('/surveillance/summary');
  return response.data;
};

export const getClustersApi = async (): Promise<{ status: string; data: { clusters: any[] } }> => {
  const response = await apiClient.get('/surveillance/clusters');
  return response.data;
};

export const getThresholdsApi = async (): Promise<{ status: string; data: { thresholds: any[] } }> => {
  const response = await apiClient.get('/surveillance/thresholds');
  return response.data;
};

export const getOutbreakForecastApi = async (category = 'Food Poisoning', location = 'Block A - Floor 3'): Promise<{ status: string; data: { forecast: OutbreakForecast } }> => {
  const response = await apiClient.get(`/surveillance/forecasting?category=${category}&location=${location}`);
  return response.data;
};
