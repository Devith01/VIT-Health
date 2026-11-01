import { z } from 'zod';

export const submitDiagnosisSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  finalDiagnosis: z.string().min(1, 'Final diagnosis is required'),
  icdCode: z.string().optional(),
  clinicalNotes: z.string().min(1, 'Clinical notes are required'),
  recommendedLeaveDays: z.number().min(0).default(0),
  aiPredictionId: z.string().optional(),
  isAiPredictionCorrect: z.boolean().default(true),
  aiFeedbackNotes: z.string().optional(),
});

export type SubmitDiagnosisInput = z.infer<typeof submitDiagnosisSchema>;
