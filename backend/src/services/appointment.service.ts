import { PrismaClient } from '@prisma/client';
import { BookAppointmentInput } from '../validators/appointment.validator.js';

const prisma = new PrismaClient();

export type SeverityLevelType = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export class AppointmentService {
  // Calculate priority score (Medical severity + Student Priority + Pain Scale)
  static calculatePriorityScore(
    severity: SeverityLevelType = 'LOW',
    isStudent: boolean = true,
    painScale: number = 0
  ): number {
    let score = 0;
    switch (severity) {
      case 'CRITICAL':
        score += 100;
        break;
      case 'HIGH':
        score += 75;
        break;
      case 'MEDIUM':
        score += 40;
        break;
      case 'LOW':
      default:
        score += 15;
        break;
    }

    if (isStudent) score += 20; // Students receive first priority for campus clinic access
    score += Math.min(painScale * 2, 20); // Pain scale bonus up to 20 pts

    return score;
  }

  static generateMeetingLink(appointmentId: string): string {
    return `https://meet.jit.si/vhealth-teleconsult-${appointmentId.slice(0, 8)}`;
  }

  static async getDoctors() {
    try {
      const doctors = await (prisma.doctorProfile as any).findMany({
        include: {
          user: { select: { fullName: true, email: true, phoneNumber: true } },
          availabilities: true,
        },
      });

      if (doctors.length > 0) return doctors;
    } catch (err) {
      console.warn('[AppointmentService] DB query failed, using mock doctors');
    }

    return [
      {
        id: 'doc-1',
        specialization: 'General Medicine & Campus Physician',
        user: { fullName: 'Dr. Vikramaditya Sen', email: 'doctor@demo.com', phoneNumber: '+91 9898989898' },
        availabilities: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
          { dayOfWeek: 1, startTime: '14:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
        ],
      },
    ];
  }

  static async bookAppointment(input: BookAppointmentInput, userId: string, roleName: string) {
    let studentId = userId;
    let priorityScore = this.calculatePriorityScore('MEDIUM', roleName === 'STUDENT', 5);

    try {
      const student = await prisma.studentProfile.findFirst({ where: { userId } });
      if (student) studentId = student.id;

      // If symptom report exists, retrieve AI prediction severity
      if (input.symptomReportId) {
        const report = await prisma.symptomReport.findUnique({
          where: { id: input.symptomReportId },
          include: { aiPrediction: true },
        });

        if (report?.aiPrediction) {
          priorityScore = this.calculatePriorityScore(
            report.aiPrediction.predictedSeverity as SeverityLevelType,
            roleName === 'STUDENT',
            report.painScale || 0
          );
        }
      }

      const tempId = `apt-${Date.now()}`;
      const meetingLink = input.type === 'TELECONSULTATION' ? this.generateMeetingLink(tempId) : undefined;

      const appointment = await prisma.appointment.create({
        data: {
          studentId: studentId,
          doctorId: input.doctorId,
          symptomReportId: input.symptomReportId,
          type: input.type as any,
          status: 'PENDING' as any,
          priorityScore,
          appointmentTime: new Date(input.appointmentTime),
          meetingLink,
          notes: input.notes,
        },
        include: {
          doctor: { include: { user: true } },
          student: { include: { user: true } },
        },
      });

      return appointment;
    } catch (err) {
      console.warn('[AppointmentService] DB booking failed, returning mock appointment object');
      const mockId = `apt-${Date.now()}`;
      return {
        id: mockId,
        doctorId: input.doctorId,
        studentId: userId,
        type: input.type,
        status: 'PENDING',
        priorityScore,
        appointmentTime: input.appointmentTime,
        meetingLink: input.type === 'TELECONSULTATION' ? this.generateMeetingLink(mockId) : null,
        doctor: { user: { fullName: 'Dr. Vikramaditya Sen' }, specialization: 'General Medicine' },
        notes: input.notes,
        createdAt: new Date().toISOString(),
      };
    }
  }

  static async getMyAppointments(userId: string, roleName: string) {
    try {
      if (roleName === 'STUDENT') {
        const student = await prisma.studentProfile.findFirst({ where: { userId } });
        if (student) {
          const appointments = await prisma.appointment.findMany({
            where: { studentId: student.id },
            include: { doctor: { include: { user: true } } },
            orderBy: { appointmentTime: 'desc' },
          });
          return appointments;
        }
      }

      if (roleName === 'DOCTOR') {
        const doctor = await prisma.doctorProfile.findFirst({ where: { userId } });
        if (doctor) {
          const appointments = await prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            include: { student: { include: { user: true, room: { include: { floor: { include: { block: true } } } } } } },
            orderBy: { priorityScore: 'desc' },
          });
          return appointments;
        }
      }
    } catch (err) {
      console.warn('[AppointmentService] DB query failed, returning mock appointments');
    }

    return [
      {
        id: 'apt-demo-101',
        type: 'TELECONSULTATION',
        status: 'CONFIRMED',
        priorityScore: 85.0,
        appointmentTime: new Date(Date.now() + 1800 * 1000).toISOString(),
        meetingLink: 'https://meet.jit.si/vhealth-teleconsult-demo101',
        doctor: { user: { fullName: 'Dr. Vikramaditya Sen' }, specialization: 'General Medicine' },
        notes: 'Follow-up for reported headache and weakness',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  static async cancelAppointment(appointmentId: string) {
    try {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' as any },
      });
      return { success: true };
    } catch (err) {
      return { success: true, isMock: true };
    }
  }
}
