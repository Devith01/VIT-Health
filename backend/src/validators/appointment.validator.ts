import { z } from 'zod';

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor selection is required'),
  type: z.enum(['IN_PERSON', 'TELECONSULTATION']),
  appointmentTime: z.string().datetime({ message: 'Valid ISO date time string required' }),
  symptomReportId: z.string().optional(),
  notes: z.string().optional(),
});

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
});
