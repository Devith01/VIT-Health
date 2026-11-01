import { apiClient } from './axios';
import { AuthResponse, User } from '../types/auth';

export interface SignupPayload {
  fullName?: string;
  name?: string;
  registrationNumber: string;
  mobileNumber: string;
  hostelBlock: string;
  roomNumber: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  registrationNumber: string;
  mobileNumber: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateLocationPayload {
  registrationNumber: string;
  password: string;
  hostelBlock: string;
  roomNumber: string;
}

export const loginApi = async (
  emailOrRegNo: string,
  password: string
): Promise<AuthResponse> => {
  const payload = emailOrRegNo.includes('@')
    ? { email: emailOrRegNo, password }
    : { registrationNumber: emailOrRegNo, password };
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

export const studentLoginApi = async (
  registrationNumber: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    registrationNumber,
    password,
  });
  return response.data;
};

export const signupApi = async (
  payload: SignupPayload
): Promise<{ status: string; message: string; data: any }> => {
  const response = await apiClient.post<{ status: string; message: string; data: any }>(
    '/auth/signup',
    payload
  );
  return response.data;
};

export const resetPasswordApi = async (
  payload: ResetPasswordPayload
): Promise<{ status: string; message: string; data: any }> => {
  const response = await apiClient.post<{ status: string; message: string; data: any }>(
    '/auth/reset-password',
    payload
  );
  return response.data;
};

export const updateLocationApi = async (
  payload: UpdateLocationPayload
): Promise<{ status: string; message: string; data: any }> => {
  const response = await apiClient.post<{ status: string; message: string; data: any }>(
    '/auth/update-location',
    payload
  );
  return response.data;
};

export const getMeApi = async (): Promise<{ status: string; data: { user: User } }> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
