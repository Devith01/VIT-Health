import { apiClient } from './axios';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  stockCount: number;
  isAvailable: boolean;
  requiresPrescription?: boolean;
  category?: 'OTC' | 'PRESCRIPTION';
}

export interface DoctorPrescription {
  id: string;
  date: string;
  doctorName: string;
  specialization: string;
  diagnosis: string;
  medicationName: string;
  dosage: string;
  refillCount: number;
}

export interface MedicineOrder {
  id: string;
  status: string;
  deliveryAddress: string;
  otpCode?: string;
  orderType?: 'PRESCRIPTION_REORDER' | 'DIRECT_OTC';
  doctorName?: string;
  prescriptionId?: string;
  items: any[];
  createdAt: string;
}

export const MOCK_MEDICATIONS: Medication[] = [
  // OTC Medicines (No Doctor Prescription Needed)
  { id: 'med-1', name: 'Paracetamol 500mg (Pain & Fever)', dosage: '1 tablet 3 times a day', stockCount: 200, isAvailable: true, requiresPrescription: false, category: 'OTC' },
  { id: 'med-2', name: 'ORS Electrolyte Hydration Sachet', dosage: 'Dissolve 1 sachet in 1L drinking water', stockCount: 150, isAvailable: true, requiresPrescription: false, category: 'OTC' },
  { id: 'med-4', name: 'Cetirizine 10mg (Anti-Allergy)', dosage: '1 tablet at bedtime', stockCount: 100, isAvailable: true, requiresPrescription: false, category: 'OTC' },
  { id: 'med-6', name: 'Dextromethorphan Cough Syrup 100ml', dosage: '10ml thrice daily', stockCount: 60, isAvailable: true, requiresPrescription: false, category: 'OTC' },
  { id: 'med-7', name: 'Volini Instant Pain Relief Spray 50g', dosage: 'Apply to affected joint/muscle thrice daily', stockCount: 75, isAvailable: true, requiresPrescription: false, category: 'OTC' },
  { id: 'med-8', name: 'Antacid Gel Digestene 170ml', dosage: '2 teaspoonfuls after meals', stockCount: 90, isAvailable: true, requiresPrescription: false, category: 'OTC' },
  { id: 'med-9', name: 'First Aid Bandage & Antiseptic Wipes Kit', dosage: 'For topical wound dressing', stockCount: 120, isAvailable: true, requiresPrescription: false, category: 'OTC' },

  // Rx Medicines (Doctor Prescription)
  { id: 'med-3', name: 'Azithromycin 500mg (Antibiotic)', dosage: '1 tablet daily for 3 days', stockCount: 50, isAvailable: true, requiresPrescription: true, category: 'PRESCRIPTION' },
  { id: 'med-5', name: 'Pantoprazole 40mg (Gastro-protective)', dosage: '1 tablet before breakfast', stockCount: 80, isAvailable: true, requiresPrescription: true, category: 'PRESCRIPTION' },
];

export const MOCK_DOCTOR_PRESCRIPTIONS: DoctorPrescription[] = [
  {
    id: 'RX-2026-901',
    date: '15-09-2026',
    doctorName: 'Dr. Vikramaditya Sen, M.D.',
    specialization: 'General Medicine & Campus Epidemic Officer',
    diagnosis: 'Acute Viral Febrile Illness',
    medicationName: 'Paracetamol 650mg & ORS Sachet',
    dosage: '1 tablet 3x daily after meals + ORS hydration',
    refillCount: 2,
  },
  {
    id: 'RX-2026-742',
    date: '20-08-2026',
    doctorName: 'Dr. Ananya Roy, M.D.',
    specialization: 'Dermatology & Student Health',
    diagnosis: 'Seasonal Allergic Contact Dermatitis',
    medicationName: 'Cetirizine 10mg & Calamine Lotion',
    dosage: '1 tablet at night + topical application',
    refillCount: 1,
  },
];

export const generateDynamicOtp = (): string => Math.floor(1000 + Math.random() * 9000).toString();

export const MOCK_ORDERS: MedicineOrder[] = [
  {
    id: 'ord-demo-101',
    status: 'OUT_FOR_DELIVERY',
    deliveryAddress: 'Boys Hostel 1 - Block A - Floor 3 - Room 301',
    otpCode: generateDynamicOtp(),
    orderType: 'DIRECT_OTC',
    items: [{ medication: { name: 'ORS Electrolyte Hydration Sachet', dosage: 'Dissolve in 1L water' }, quantity: 2 }],
    createdAt: new Date().toISOString(),
  },
];

export const getMedicationsApi = async (): Promise<{ status: string; data: { medications: Medication[] } }> => {
  try {
    const response = await apiClient.get('/pharmacy/medications');
    if (response.data?.data?.medications?.length > 0) return response.data;
  } catch (err) {
    console.warn('[Pharmacy API] Backend offline, using mock medications');
  }

  return { status: 'success', data: { medications: MOCK_MEDICATIONS } };
};

export const placeMedicineOrderApi = async (payload: {
  medicationId?: string;
  prescriptionId?: string;
  quantity: number;
  deliveryAddress: string;
  orderType?: 'PRESCRIPTION_REORDER' | 'DIRECT_OTC';
  doctorName?: string;
}): Promise<{ status: string; data: { order: MedicineOrder } }> => {
  try {
    const response = await apiClient.post('/pharmacy/orders', payload);
    if (response.data?.data?.order) {
      return response.data;
    }
  } catch (err) {
    console.warn('[Pharmacy API] Backend offline, returning mock order with dynamic OTP');
  }

  const med = MOCK_MEDICATIONS.find((m) => m.id === payload.medicationId) || MOCK_MEDICATIONS[0];
  const dynamicOtp = generateDynamicOtp();

  return {
    status: 'success',
    data: {
      order: {
        id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PREPARING',
        deliveryAddress: payload.deliveryAddress,
        otpCode: dynamicOtp,
        orderType: payload.orderType || 'DIRECT_OTC',
        doctorName: payload.doctorName,
        prescriptionId: payload.prescriptionId,
        items: [{ medication: med, quantity: payload.quantity }],
        createdAt: new Date().toISOString(),
      },
    },
  };
};

export const getMyMedicineOrdersApi = async (): Promise<{ status: string; data: { orders: MedicineOrder[] } }> => {
  try {
    const response = await apiClient.get('/pharmacy/my-orders');
    if (response.data?.data?.orders) return response.data;
  } catch (err) {
    console.warn('[Pharmacy API] Backend offline, using mock orders');
  }

  return { status: 'success', data: { orders: MOCK_ORDERS } };
};


