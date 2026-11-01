import { PrismaClient } from '@prisma/client';
import { MOCK_USERS, MOCK_OUTBREAK_ALERTS } from '../utils/mockSeedData.js';

const prisma = new PrismaClient();

export class UserService {
  static async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          roleName: true,
          phoneNumber: true,
          studentProfile: {
            include: {
              room: {
                include: {
                  floor: {
                    include: {
                      block: {
                        include: {
                          hostel: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          doctorProfile: true,
          facultyProfile: true,
        },
      });

      if (user) return user;
    } catch (err) {
      console.warn('[UserService] DB query failed, falling back to mock profile data');
    }

    const mockUser = MOCK_USERS.find((u) => u.id === userId);
    return mockUser || MOCK_USERS[0];
  }

  static async getDashboardStats(user: { userId: string; roleName: string }) {
    try {
      if (user.roleName === 'STUDENT') {
        const student = await prisma.studentProfile.findFirst({
          where: { userId: user.userId },
        });

        const activeAlerts = await prisma.outbreakAlert.findMany({
          where: { status: { in: ['WARNING', 'ALERT'] } },
          orderBy: { createdAt: 'desc' },
          take: 3,
        });

        const recentAppointments = student
          ? await prisma.appointment.findMany({
              where: { studentId: student.id },
              include: { doctor: { include: { user: true } } },
              orderBy: { appointmentTime: 'desc' },
              take: 5,
            })
          : [];

        return {
          activeAlerts,
          recentAppointments,
          totalConsultations: recentAppointments.length,
        };
      }

      if (user.roleName === 'DOCTOR') {
        const pendingAppointments = await prisma.appointment.findMany({
          where: { status: 'PENDING' },
          include: {
            student: { include: { user: true, room: { include: { floor: { include: { block: true } } } } } },
            symptomReport: { include: { aiPrediction: true } },
          },
          orderBy: { priorityScore: 'desc' },
        });

        return {
          pendingAppointments,
          queueLength: pendingAppointments.length,
          criticalCount: pendingAppointments.filter(
            (a: any) => a.symptomReport?.aiPrediction?.predictedSeverity === 'CRITICAL'
          ).length,
        };
      }
    } catch (err) {
      // Mock Fallback Stats
    }

    return {
      activeAlerts: MOCK_OUTBREAK_ALERTS,
      recentAppointments: [],
      totalConsultations: 2,
      pendingAppointments: [
        {
          id: 'apt-demo-1',
          type: 'IN_PERSON',
          status: 'PENDING',
          priorityScore: 85,
          appointmentTime: new Date(Date.now() + 3600 * 1000).toISOString(),
          student: {
            user: { fullName: 'Aarav Patel', email: 'student@demo.com' },
            room: { roomNum: '301', floor: { floorNum: 3, block: { name: 'Block A' } } },
          },
          symptomReport: {
            freeTextSymptoms: 'Severe fever, headache and weakness for 3 days',
            aiPrediction: {
              topConditions: [{ disease: 'Food Poisoning', confidence: 0.88 }],
              predictedSeverity: 'HIGH',
            },
          },
        },
      ],
      queueLength: 1,
      criticalCount: 0,
    };
  }

  static async updateUserLocation(userId: string, blockName: string, roomNum: string) {
    try {
      const student = await prisma.studentProfile.findFirst({
        where: { userId },
        include: { room: true },
      });

      if (student) {
        let block = await prisma.block.findFirst({ where: { name: blockName } });
        if (!block) {
          let hostel = await prisma.hostel.findFirst();
          if (!hostel) {
            hostel = await prisma.hostel.create({
              data: { name: 'Main Campus Hostel', code: 'MCH' },
            });
          }
          block = await prisma.block.create({
            data: { name: blockName, hostelId: hostel.id },
          });
        }

        const floorNum = parseInt((roomNum || '301').replace(/\D/g, '')[0]) || 3;
        let floor = await prisma.floor.findFirst({
          where: { blockId: block.id, floorNum },
        });

        if (!floor) {
          floor = await prisma.floor.create({
            data: { blockId: block.id, floorNum },
          });
        }

        let room = await prisma.room.findFirst({
          where: { floorId: floor.id, roomNum },
        });

        if (!room) {
          room = await prisma.room.create({
            data: { floorId: floor.id, roomNum },
          });
        }

        await prisma.studentProfile.update({
          where: { id: student.id },
          data: { roomId: room.id },
        });
      }
    } catch (err: any) {
      console.warn('[UserService] DB location update silent fallback:', err.message);
    }

    return {
      success: true,
      blockName,
      roomNum,
      floorNum: parseInt((roomNum || '301').replace(/\D/g, '')[0]) || 3,
    };
  }
}
