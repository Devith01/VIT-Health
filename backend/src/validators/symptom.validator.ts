import { z } from 'zod';

const triagePayloadSchema = z.object({
  age: z.number().min(0).max(120),

  sex: z.enum(['Male', 'Female', 'Other']),

  symptom_duration: z.enum([
    'Today',
    'Yesterday',
    '2–3 days',
    'More than 3 days',
  ]),

  fever: z.boolean(),
  headache: z.boolean(),
  body_muscle_pain: z.boolean(),
  breathing_difficulty: z.boolean(),
  vomiting: z.boolean(),
  diarrhea: z.boolean(),
  fatigue: z.boolean(),
  chest_pain: z.boolean(),
  dizziness: z.boolean(),
  abdominal_pain: z.boolean(),

  main_complaint: z.string().nullable(),

  mental_status: z.string().nullable(),

  pain_score: z.number().min(0).max(10),
});

export const submitSymptomReportSchema = z.object({
  freeTextSymptoms: z.string().optional(),

  painScale: z
    .number()
    .min(1)
    .max(10)
    .default(5),

  durationDays: z
    .number()
    .min(1)
    .default(1),

  structuredInputs: z
    .record(z.any())
    .optional(),

  imageUrl: z
    .string()
    .optional(),

  isExplicitImageFlagged: z
    .boolean()
    .optional(),

  /*
   * Website AI triage payload.
   *
   * This contains the 16 features required by
   * the detailed XGBoost model.
   */
  triagePayload: triagePayloadSchema.optional(),
});

export type SubmitSymptomReportInput = z.infer<
  typeof submitSymptomReportSchema
>;