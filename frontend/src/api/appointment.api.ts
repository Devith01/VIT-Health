import { apiClient } from './axios';

export interface Doctor {
  id: string;
  specialization: string;
  user: {
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  availabilities?: any[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  type: 'IN_PERSON' | 'TELECONSULTATION';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  priorityScore: number;
  appointmentTime: string;
  meetingLink?: string | null;
  doctor?: Doctor;
  student?: any;
  notes?: string;
  createdAt: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    specialization: 'General Medicine & Campus Epidemic Surveillance',
    user: { fullName: 'Dr. Vikramaditya Sen', email: 'doctor@demo.com', phoneNumber: '+91 9898989898' },
  },
  {
    id: 'doc-2',
    specialization: 'Pediatrics & Student Wellness',
    user: { fullName: 'Dr. Ananya Roy', email: 'ananya.roy@vit.ac.in', phoneNumber: '+91 9898989899' },
  },
  {
    id: 'doc-3',
    specialization: 'Emergency Medicine & Critical Response',
    user: { fullName: 'Dr. Rajesh Sharma', email: 'rajesh.sharma@vit.ac.in', phoneNumber: '+91 9898989900' },
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-demo-1',
    doctorId: 'doc-1',
    type: 'TELECONSULTATION',
    status: 'CONFIRMED',
    priorityScore: 88.5,
    appointmentTime: new Date(Date.now() + 86400000).toISOString(),
    meetingLink: 'https://meet.jit.si/vhealth-teleconsult-demo-101',
    doctor: MOCK_DOCTORS[0],
    notes: 'Severe headache and fever for 3 days',
    createdAt: new Date().toISOString(),
  },
];

export const getDoctorsApi = async (): Promise<{ status: string; data: { doctors: Doctor[] } }> => {
  try {
    const response = await apiClient.get('/appointments/doctors');
    if (response.data?.data?.doctors?.length > 0) return response.data;
  } catch (err) {
    console.warn('[Appointment API] Backend offline, using mock doctors');
  }

  return { status: 'success', data: { doctors: MOCK_DOCTORS } };
};

export const bookAppointmentApi = async (payload: {
  doctorId: string;
  type: 'IN_PERSON' | 'TELECONSULTATION';
  appointmentTime: string;
  symptomReportId?: string;
  notes?: string;
}): Promise<{ status: string; data: { appointment: Appointment } }> => {
  try {
    const response = await apiClient.post('/appointments/book', payload);
    return response.data;
  } catch (err) {
    console.warn('[Appointment API] Backend offline, returning mock booked appointment');
  }

  const doctor = MOCK_DOCTORS.find((d) => d.id === payload.doctorId) || MOCK_DOCTORS[0];

  return {
    status: 'success',
    data: {
      appointment: {
        id: `apt-demo-${Date.now()}`,
        doctorId: payload.doctorId,
        type: payload.type,
        status: 'CONFIRMED',
        priorityScore: 85.0,
        appointmentTime: payload.appointmentTime,
        meetingLink:
          payload.type === 'TELECONSULTATION'
            ? `https://meet.jit.si/vhealth-teleconsult-${Date.now()}`
            : null,
        doctor,
        notes: payload.notes,
        createdAt: new Date().toISOString(),
      },
    },
  };
};

export const getMyAppointmentsApi = async (): Promise<{ status: string; data: { appointments: Appointment[] } }> => {
  try {
    const response = await apiClient.get('/appointments/my-appointments');
    if (response.data?.data?.appointments) return response.data;
  } catch (err) {
    console.warn('[Appointment API] Backend offline, using mock appointments');
  }

  return { status: 'success', data: { appointments: MOCK_APPOINTMENTS } };
};

export const cancelAppointmentApi = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/appointments/${id}/cancel`);
  } catch (err) {
    console.warn('[Appointment API] Backend offline, cancelled locally');
  }
};
