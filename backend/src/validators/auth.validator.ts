import { z } from 'zod';

export const HOSTEL_OPTIONS = [
  'Boys Hostel 1',
  'Boys Hostel 2',
  'Boys Hostel 3',
  'Boys Hostel 4',
  'Boys Hostel 5',
  'Boys Hostel 6',
  'Boys Hostel 7',
  'Boys Hostel 8',
  'Girls Hostel 1',
  'Girls Hostel 2',
  'Special Block Girls Hostel',
] as const;

export const loginSchema = z.object({
  email: z.string().optional(),
  registrationNumber: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine((data) => (data.registrationNumber && data.registrationNumber.trim().length > 0) || (data.email && data.email.trim().length > 0), {
  message: 'Registration number is required',
  path: ['registrationNumber'],
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').optional(),
  registrationNumber: z.string().trim().min(1, 'Registration number is required'),
  mobileNumber: z.string().trim().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
  hostelBlock: z.enum(HOSTEL_OPTIONS, {
    errorMap: () => ({ message: 'Please select your hostel.' }),
  }),
  roomNumber: z.string().trim().min(1, 'Please enter your room number.'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof signupSchema>;

export const resetPasswordSchema = z.object({
  registrationNumber: z.string().trim().min(1, 'Registration number is required'),
  mobileNumber: z.string().trim().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match.',
  path: ['confirmNewPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateLocationSchema = z.object({
  registrationNumber: z.string().trim().min(1, 'Registration number is required'),
  password: z.string().min(1, 'Password is required'),
  hostelBlock: z.enum(HOSTEL_OPTIONS, {
    errorMap: () => ({ message: 'Please select your hostel.' }),
  }),
  roomNumber: z.string().trim().min(1, 'Please enter your room number.'),
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
