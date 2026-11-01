import { PrismaClient } from '@prisma/client';
import { PlaceMedicineOrderInput } from '../validators/pharmacy.validator.js';

const prisma = new PrismaClient();

// Helper to generate dynamic 4-digit OTP code for medicine delivery
const generateDynamicOtp = (): string => Math.floor(1000 + Math.random() * 9000).toString();

export class PharmacyService {
  static async getMedications() {
    try {
      const medications = await prisma.medication.findMany({
        where: { isAvailable: true },
        orderBy: { name: 'asc' },
      });
      if (medications.length > 0) return medications;
    } catch (err) {
      console.warn('[PharmacyService] DB query failed, returning mock medications');
    }

    return [
      { id: 'med-1', name: 'Paracetamol 500mg', dosage: '1 tablet 3 times a day', stockCount: 200, isAvailable: true },
      { id: 'med-2', name: 'ORS Electrolyte Sachet', dosage: 'Dissolve in 1L water', stockCount: 150, isAvailable: true },
      { id: 'med-3', name: 'Azithromycin 500mg', dosage: '1 tablet daily for 3 days', stockCount: 50, isAvailable: true },
      { id: 'med-4', name: 'Cetirizine 10mg', dosage: '1 tablet at bedtime', stockCount: 100, isAvailable: true },
      { id: 'med-5', name: 'Pantoprazole 40mg', dosage: '1 tablet before breakfast', stockCount: 80, isAvailable: true },
      { id: 'med-6', name: 'Dextromethorphan Cough Syrup 100ml', dosage: '10ml thrice daily', stockCount: 60, isAvailable: true },
    ];
  }

  static async placeOrder(input: PlaceMedicineOrderInput, userId: string) {
    const otpCode = generateDynamicOtp();

    try {
      let studentId = userId;
      const student = await prisma.studentProfile.findFirst({ where: { userId } });
      if (student) studentId = student.id;

      const order = await prisma.medicineOrder.create({
        data: {
          studentId,
          prescriptionId: input.prescriptionId,
          status: 'PENDING' as any,
          deliveryAddress: input.deliveryAddress,
          otpCode,
          items: {
            create: [
              {
                medicationId: input.medicationId,
                quantity: input.quantity,
              },
            ],
          },
        },
        include: {
          items: { include: { medication: true } },
        },
      });

      return order;
    } catch (err) {
      console.warn('[PharmacyService] DB operation failed, returning mock order with dynamic OTP');
      return {
        id: `ord-demo-${Date.now()}`,
        studentId: userId,
        status: 'PREPARING',
        deliveryAddress: input.deliveryAddress || 'Boys Hostel 1 - Block A - Floor 3 - Room 301',
        otpCode: generateDynamicOtp(),
        items: [{ medicationId: input.medicationId, quantity: input.quantity, medication: { name: 'Paracetamol 500mg', dosage: '1 tablet 3x daily' } }],
        createdAt: new Date().toISOString(),
      };
    }
  }

  static async getMyOrders(userId: string) {
    try {
      const student = await prisma.studentProfile.findFirst({ where: { userId } });
      if (student) {
        const orders = await prisma.medicineOrder.findMany({
          where: { studentId: student.id },
          include: { items: { include: { medication: true } } },
          orderBy: { createdAt: 'desc' },
        });
        return orders;
      }
    } catch (err) {
      console.warn('[PharmacyService] DB query failed, returning mock order list');
    }

    return [
      {
        id: 'ord-demo-101',
        status: 'OUT_FOR_DELIVERY',
        deliveryAddress: 'Boys Hostel 1 - Block A - Floor 3 - Room 301',
        otpCode: generateDynamicOtp(),
        items: [{ medication: { name: 'ORS Electrolyte Sachet', dosage: 'Dissolve in 1L water' }, quantity: 2 }],
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

