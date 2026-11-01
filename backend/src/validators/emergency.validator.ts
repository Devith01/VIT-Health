import { z } from 'zod';

export const createEmergencySchema = z.object({
  studentRegistrationNo: z.string().optional(),
  location: z.string().min(1, 'Location or Hostel Room is required'),
  description: z.string().min(1, 'Description of emergency is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('CRITICAL'),
  isThirdPartyReport: z.boolean().default(false),
  reporterName: z.string().optional(),
  reporterPhone: z.string().optional(),
});

export type CreateEmergencyInput = z.infer<typeof createEmergencySchema>;

export const updateAmbulanceLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  status: z.enum(['AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'BUSY', 'OFFLINE']).optional(),
});

export const dispatchAmbulanceSchema = z.object({
  destinationHostel: z.enum(['Boys Hostel 1', 'Girls Hostel 1']),
  roomNumber: z.string().min(1, 'Room number is required'),
  latitude: z.number(),
  longitude: z.number(),
});

export type DispatchAmbulanceInput = z.infer<typeof dispatchAmbulanceSchema>;
