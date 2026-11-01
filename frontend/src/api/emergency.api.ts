import { apiClient } from './axios';

export interface EmergencyCasePayload {
  studentRegistrationNo?: string;
  location: string;
  description: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isThirdPartyReport?: boolean;
  reporterName?: string;
  reporterPhone?: string;
}

export interface EmergencyCase {
  id: string;
  description: string;
  severity: string;
  status: string;
  location: string;
  reportedBy?: string;
  ambulance?: any;
  etaMinutes?: number;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  emergencyId: string;
  recipientId: string;
  recipientRole: 'SECURITY_OFFICER' | 'DOCTOR' | 'AMBULANCE_OFFICER' | 'STUDENT';
  recipientName?: string;
  recipientPhone?: string;
  notificationType: string;
  channel: 'SMS' | 'PUSH';
  title: string;
  body: string;
  deliveryStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'TEST_MODE';
  failureReason?: string;
  retryCount: number;
  sentAt?: string;
  createdAt: string;
}

export const createEmergencyApi = async (payload: EmergencyCasePayload): Promise<{ status: string; data: { emergency: EmergencyCase } }> => {
  const response = await apiClient.post('/emergency/report', payload);
  return response.data;
};

export const getActiveEmergenciesApi = async (): Promise<{ status: string; data: { emergencies: EmergencyCase[] } }> => {
  const response = await apiClient.get('/emergency/active');
  return response.data;
};

export const getNotificationLogsApi = async (params?: {
  recipientRole?: string;
  channel?: string;
  deliveryStatus?: string;
  emergencyId?: string;
}): Promise<{ status: string; results: number; data: { logs: NotificationLog[] } }> => {
  const response = await apiClient.get('/emergency/notification-logs', { params });
  return response.data;
};

export const retryNotificationApi = async (logId: string): Promise<{ status: string; data: { log: NotificationLog } }> => {
  const response = await apiClient.post(`/emergency/notification-logs/${logId}/retry`);
  return response.data;
};

export const triggerTestNotificationApi = async (payload?: { location?: string; reporterName?: string }): Promise<{ status: string; message: string; data: any }> => {
  const response = await apiClient.post('/emergency/test-notification', payload || {});
  return response.data;
};

export interface DispatchAmbulancePayload {
  destinationHostel: 'Boys Hostel 1' | 'Girls Hostel 1';
  roomNumber: string;
  latitude: number;
  longitude: number;
}

export const dispatchAmbulanceApi = async (payload: DispatchAmbulancePayload) => {
  const response = await apiClient.post('/emergency/dispatch', payload);
  return response.data;
};

