import { z } from 'zod';

export const placeMedicineOrderSchema = z.object({
  medicationId: z.string().min(1, 'Medication selection is required'),
  quantity: z.number().min(1).default(1),
  deliveryAddress: z.string().min(1, 'Hostel block and room delivery address required'),
  prescriptionId: z.string().optional(),
});

export type PlaceMedicineOrderInput = z.infer<typeof placeMedicineOrderSchema>;
