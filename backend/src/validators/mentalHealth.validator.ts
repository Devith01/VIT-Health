import { z } from 'zod';

export const submitMentalHealthSchema = z.object({
  answers: z.object({
    age: z.number().int().min(17).max(29),
    study_hours: z.number().int().min(0).max(12),
    exam_pressure: z.number().int().min(0).max(10),
    academic_performance: z.number().int().min(0).max(100),
    stress_level: z.number().int().min(0).max(10),
    anxiety_frequency: z.number().int().min(0).max(8),
    depressive_feelings: z.number().int().min(0).max(6),
    sleep_hours: z.number().int().min(3).max(10),
    physical_activity: z.number().int().min(0).max(8),
    social_support: z.number().int().min(0).max(10),
    screen_hours: z.number().int().min(1).max(12),
    internet_hours: z.number().int().min(1).max(13),
    financial_stress: z.number().int().min(0).max(10),
    family_pressure: z.number().int().min(0).max(10),
    academic_exhaustion: z.number().int().min(0).max(10),
  }),
});

export type SubmitMentalHealthInput = z.infer<typeof submitMentalHealthSchema>;
