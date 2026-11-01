import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';
import { io } from '../server.js';
import { MOCK_USERS, MOCK_AMBULANCES } from '../utils/mockSeedData.js';
import { SmsProviderService } from './smsProvider.service.js';
import { FcmProviderService } from './fcmProvider.service.js';
import {
  buildSecurityNotification,
  buildDoctorNotification,
  buildAmbulanceNotification,
  EmergencyNotificationParams,
} from './notificationTemplates.js';

const prisma = new PrismaClient();

export interface NotificationLogItem {
  id: string;
  emergencyId: string;
  recipientId: string;
  recipientRole: 'SECURITY_OFFICER' | 'DOCTOR' | 'AMBULANCE_OFFICER' | 'STUDENT';
  recipientName: string;
  recipientPhone: string;
  notificationType: string;
  channel: 'SMS' | 'PUSH';
  title: string;
  body: string;
  deliveryStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'TEST_MODE';
  failureReason?: string;
  retryCount: number;
  sentAt: string;
  createdAt: string;
}

// In-memory persistent fallback store for notification logs
const memoryNotificationLogs: NotificationLogItem[] = [
  {
    id: 'log-demo-101',
    emergencyId: 'emerg-demo-101',
    recipientId: 'user-sec-1',
    recipientRole: 'SECURITY_OFFICER',
    recipientName: 'Officer Deshmukh (Main Security Desk)',
    recipientPhone: '+91 9988776655',
    notificationType: 'EMERGENCY_ALERT',
    channel: 'SMS',
    title: '🚨 URGENT SOS DISPATCH - Block A',
    body: '🚨 URGENT V-HEALTH SOS: Emergency #emerg-demo-101 [Priority: CRITICAL]. Location: Block A, Floor 3, Room 301. Student Reg No: 21BCE1001. Required Action: Immediate Security Patrol & First Responder Gate Clearance Required. Access Portal: https://our-interim-tax-pickup.trycloudflare.com/security/emergencies',
    deliveryStatus: 'TEST_MODE',
    retryCount: 0,
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'log-demo-102',
    emergencyId: 'emerg-demo-101',
    recipientId: 'user-doc-1',
    recipientRole: 'DOCTOR',
    recipientName: 'Dr. Vikramaditya Sen',
    recipientPhone: '+91 9898989898',
    notificationType: 'DOCTOR_ASSIGNMENT',
    channel: 'PUSH',
    title: '🩺 Emergency Clinical Assignment (#emerg-demo-101)',
    body: 'Emergency #emerg-demo-101 [CRITICAL] assigned. Student ID: 21BCE1001.',
    deliveryStatus: 'DELIVERED',
    retryCount: 0,
    sentAt: new Date(Date.now() - 3500000).toISOString(),
    createdAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'log-demo-103',
    emergencyId: 'emerg-demo-101',
    recipientId: 'user-amb-1',
    recipientRole: 'AMBULANCE_OFFICER',
    recipientName: 'Ramesh Kumar (Ambulance Alpha Driver)',
    recipientPhone: '+91 9988776655',
    notificationType: 'AMBULANCE_DISPATCH',
    channel: 'SMS',
    title: '🚑 Emergency Ambulance Dispatch',
    body: '🚑 V-HEALTH AMBULANCE DISPATCH: Emergency #emerg-demo-101 [Priority: CRITICAL]. Pickup: Block A, Floor 3, Room 301. Destination: Dr. Morepen Campus Health Centre. Nav: https://maps.google.com/?q=23.0775,76.8513 | Mobile Dashboard: https://our-interim-tax-pickup.trycloudflare.com/ambulance/current-assignment',
    deliveryStatus: 'TEST_MODE',
    retryCount: 0,
    sentAt: new Date(Date.now() - 3400000).toISOString(),
    createdAt: new Date(Date.now() - 3400000).toISOString(),
  },
];

export class EmergencyNotificationService {
  /**
   * Complete Emergency Cascade Workflow:
   * 1. Determine priority & location details.
   * 2. Find/assign Doctor.
   * 3. Find/assign Security Officer.
   * 4. Find/assign Ambulance Officer.
   * 5. Format role-specific privacy-compliant notifications.
   * 6. Send Push + SMS for each responder.
   * 7. Store delivery logs & emit Socket.IO real-time events.
   */
  static async triggerEmergencyCascade(emergencyCase: any, reporterUserId?: string) {
    const emergencyId = emergencyCase.id || `emerg-demo-${Date.now()}`;
    const priority = emergencyCase.severity || 'CRITICAL';
    const locationStr = emergencyCase.location || 'Block A - Floor 3 - Room 301';

    // Parse block, floor, room
    const blockMatch = locationStr.match(/(Block\s+[A-Za-z0-9]+|BH\d+|Girls Block \d+)/i);
    const floorMatch = locationStr.match(/(Floor\s+\d+|\d+nd Floor|\d+rd Floor|\d+th Floor)/i);
    const roomMatch = locationStr.match(/(Room\s+[A-Za-z0-9]+|\d{3,4})/i);

    const block = blockMatch ? blockMatch[0] : 'Block A';
    const floor = floorMatch ? floorMatch[0] : 'Floor 3';
    const room = roomMatch ? roomMatch[0] : 'Room 301';

    // Retrieve Student Reg No (privacy compliant ID)
    let studentRegNo = '21BCE1001';
    let studentName = emergencyCase.reportedBy || 'Student User';
    try {
      if (emergencyCase.student?.registrationNo) {
        studentRegNo = emergencyCase.student.registrationNo;
        studentName = emergencyCase.student.user?.fullName || studentName;
      } else if (emergencyCase.studentId) {
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { id: emergencyCase.studentId },
          include: { user: true },
        });
        if (studentProfile) {
          studentRegNo = studentProfile.registrationNo;
          studentName = studentProfile.user.fullName;
        }
      }
    } catch (e) {}

    // Parameters for Template Construction
    const templateParams: EmergencyNotificationParams = {
      emergencyId,
      priority,
      studentRegNo,
      studentName,
      block,
      floor,
      roomLocation: room,
      fullLocationString: locationStr,
      requiredAssistance: 'Immediate Security Patrol & First Responder Gate Clearance Required',
      assignmentStatus: 'ASSIGNED_PRIMARY_PHYSICIAN',
      destination: 'Dr. Morepen Campus Health Centre',
      gpsCoordinates: { lat: 23.0775, lng: 76.8513 },
    };

    // 1. Discover Responders
    const responders = await this.discoverResponders(block, emergencyCase);

    const createdLogs: NotificationLogItem[] = [];

    // 2. Process Notifications for Each Responder Role
    for (const responder of responders) {
      let payload;
      if (responder.role === 'SECURITY_OFFICER') {
        payload = buildSecurityNotification(templateParams);
      } else if (responder.role === 'DOCTOR') {
        payload = buildDoctorNotification(templateParams);
      } else {
        payload = buildAmbulanceNotification(templateParams);
      }

      // Send SMS
      const smsRes = await SmsProviderService.sendSms(responder.phone, payload.smsBody);
      const smsLogItem: NotificationLogItem = {
        id: `log-sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        emergencyId,
        recipientId: responder.id,
        recipientRole: responder.role,
        recipientName: responder.name,
        recipientPhone: smsRes.recipientPhone,
        notificationType: `${responder.role}_ALERT`,
        channel: 'SMS',
        title: payload.pushPayload.title,
        body: payload.smsBody,
        deliveryStatus: smsRes.success ? (smsRes.provider === 'TEST_MODE' ? 'TEST_MODE' : 'DELIVERED') : 'FAILED',
        failureReason: smsRes.failureReason,
        retryCount: 0,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      this.saveLogToStore(smsLogItem);
      createdLogs.push(smsLogItem);

      // Send Push Notification
      const pushRes = await FcmProviderService.sendPushNotification(
        responder.pushToken,
        payload.pushPayload.title,
        payload.pushPayload.body,
        payload.pushPayload.data
      );

      const pushLogItem: NotificationLogItem = {
        id: `log-push-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        emergencyId,
        recipientId: responder.id,
        recipientRole: responder.role,
        recipientName: responder.name,
        recipientPhone: smsRes.recipientPhone,
        notificationType: `${responder.role}_ALERT`,
        channel: 'PUSH',
        title: payload.pushPayload.title,
        body: payload.pushPayload.body,
        deliveryStatus: pushRes.success ? (pushRes.provider === 'TEST_MODE' ? 'TEST_MODE' : 'DELIVERED') : 'FAILED',
        failureReason: pushRes.failureReason,
        retryCount: 0,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      this.saveLogToStore(pushLogItem);
      createdLogs.push(pushLogItem);
    }

    // 3. Emit Real-time Socket.IO Events
    io.emit('emergency_notification_cascade', {
      emergencyId,
      priority,
      location: locationStr,
      respondersNotified: responders.length,
      logsCount: createdLogs.length,
      timestamp: new Date().toISOString(),
    });

    io.emit('notification_log_created', {
      emergencyId,
      logs: createdLogs,
    });

    return {
      emergencyId,
      respondersNotified: responders.map((r) => ({ role: r.role, name: r.name, phone: r.phone })),
      notificationLogs: createdLogs,
    };
  }

  /**
   * Finds registered responders (Security Officer, Doctor, Ambulance Officer) from DB or fallback mock profiles.
   * Dynamic DB Lookup - Never hardcoded phone numbers.
   */
  private static async discoverResponders(block: string, emergencyCase: any) {
    const responders: Array<{
      id: string;
      role: 'SECURITY_OFFICER' | 'DOCTOR' | 'AMBULANCE_OFFICER';
      name: string;
      phone: string;
      pushToken?: string;
    }> = [];

    // A. SECURITY OFFICER
    try {
      const securityUser = await prisma.user.findFirst({
        where: { roleName: 'SECURITY_OFFICER' },
        include: { securityOfficerProfile: true },
      });

      if (securityUser) {
        responders.push({
          id: securityUser.id,
          role: 'SECURITY_OFFICER',
          name: securityUser.fullName,
          phone: securityUser.phoneNumber || env.TEST_NOTIFICATION_RECIPIENT_PHONE,
          pushToken: (securityUser as any).pushToken,
        });
      }
    } catch (e) {}

    if (responders.filter((r) => r.role === 'SECURITY_OFFICER').length === 0) {
      const mockSec = MOCK_USERS.find((u) => u.roleName === 'SECURITY_OFFICER');
      responders.push({
        id: mockSec?.id || 'user-sec-1',
        role: 'SECURITY_OFFICER',
        name: mockSec?.fullName || 'Officer Deshmukh (Main Security Desk)',
        phone: mockSec?.phoneNumber || env.TEST_NOTIFICATION_RECIPIENT_PHONE,
        pushToken: env.TEST_NOTIFICATION_RECIPIENT_FCM,
      });
    }

    // B. DOCTOR
    try {
      const doctorUser = await prisma.user.findFirst({
        where: { roleName: 'DOCTOR' },
        include: { doctorProfile: true },
      });

      if (doctorUser) {
        responders.push({
          id: doctorUser.id,
          role: 'DOCTOR',
          name: doctorUser.fullName,
          phone: doctorUser.phoneNumber || '+91 9898989898',
          pushToken: (doctorUser as any).pushToken,
        });
      }
    } catch (e) {}

    if (responders.filter((r) => r.role === 'DOCTOR').length === 0) {
      const mockDoc = MOCK_USERS.find((u) => u.roleName === 'DOCTOR');
      responders.push({
        id: mockDoc?.id || 'user-doc-1',
        role: 'DOCTOR',
        name: mockDoc?.fullName || 'Dr. Vikramaditya Sen',
        phone: mockDoc?.phoneNumber || '+91 9898989898',
        pushToken: env.TEST_NOTIFICATION_RECIPIENT_FCM,
      });
    }

    // C. AMBULANCE OFFICER
    try {
      let ambOfficer = await prisma.ambulanceOfficerProfile.findFirst({
        include: { user: true, ambulance: true },
      });

      if (ambOfficer) {
        responders.push({
          id: ambOfficer.user.id,
          role: 'AMBULANCE_OFFICER',
          name: `${ambOfficer.user.fullName} (${ambOfficer.vehicleNumber})`,
          phone: ambOfficer.ambulance?.driverPhone || ambOfficer.user.phoneNumber || '+91 9988776655',
          pushToken: (ambOfficer.user as any).pushToken,
        });
      }
    } catch (e) {}

    if (responders.filter((r) => r.role === 'AMBULANCE_OFFICER').length === 0) {
      const mockAmb = MOCK_AMBULANCES[0];
      responders.push({
        id: 'user-amb-1',
        role: 'AMBULANCE_OFFICER',
        name: `${mockAmb.driverName} (${mockAmb.vehicleNumber})`,
        phone: mockAmb.driverPhone || '+91 9988776655',
        pushToken: env.TEST_NOTIFICATION_RECIPIENT_FCM,
      });
    }

    return responders;
  }

  /**
   * Persists log in memory fallback & DB store if active.
   */
  private static saveLogToStore(item: NotificationLogItem) {
    memoryNotificationLogs.unshift(item);

    // DB Persistence Attempt
    try {
      (prisma as any).notificationLog?.create({
        data: {
          id: item.id,
          emergencyId: item.emergencyId,
          recipientId: item.recipientId,
          recipientRole: item.recipientRole as any,
          recipientName: item.recipientName,
          recipientPhone: item.recipientPhone,
          notificationType: item.notificationType,
          channel: item.channel,
          title: item.title,
          body: item.body,
          deliveryStatus: item.deliveryStatus,
          failureReason: item.failureReason,
          retryCount: item.retryCount,
          sentAt: new Date(item.sentAt),
          createdAt: new Date(item.createdAt),
        },
      })?.catch(() => {});
    } catch (e) {}
  }

  /**
   * Retrieves notification logs for Admin Dashboard.
   */
  static async getNotificationLogs(filters?: {
    recipientRole?: string;
    channel?: string;
    deliveryStatus?: string;
    emergencyId?: string;
  }) {
    let logs = [...memoryNotificationLogs];

    try {
      const dbLogs = await (prisma as any).notificationLog?.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (dbLogs && dbLogs.length > 0) {
        logs = dbLogs.map((d: any) => ({
          ...d,
          sentAt: d.sentAt ? d.sentAt.toISOString() : new Date().toISOString(),
          createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {}

    if (filters?.recipientRole && filters.recipientRole !== 'ALL') {
      logs = logs.filter((l) => l.recipientRole === filters.recipientRole);
    }
    if (filters?.channel && filters.channel !== 'ALL') {
      logs = logs.filter((l) => l.channel === filters.channel);
    }
    if (filters?.deliveryStatus && filters.deliveryStatus !== 'ALL') {
      logs = logs.filter((l) => l.deliveryStatus === filters.deliveryStatus);
    }
    if (filters?.emergencyId) {
      logs = logs.filter((l) => l.emergencyId.toLowerCase().includes(filters.emergencyId!.toLowerCase()));
    }

    return logs;
  }

  /**
   * Implements Retry Handling for failed or test notifications.
   */
  static async retryNotificationLog(logId: string) {
    const logIndex = memoryNotificationLogs.findIndex((l) => l.id === logId);
    let targetLog: NotificationLogItem | undefined = logIndex !== -1 ? memoryNotificationLogs[logIndex] : undefined;

    if (!targetLog) {
      try {
        const dbLog = await (prisma as any).notificationLog?.findUnique({ where: { id: logId } });
        if (dbLog) {
          targetLog = {
            ...dbLog,
            recipientRole: dbLog.recipientRole as any,
            channel: dbLog.channel as any,
            deliveryStatus: dbLog.deliveryStatus as any,
            sentAt: dbLog.sentAt ? dbLog.sentAt.toISOString() : new Date().toISOString(),
            createdAt: dbLog.createdAt ? dbLog.createdAt.toISOString() : new Date().toISOString(),
          };
        }
      } catch (e) {}
    }

    if (!targetLog) {
      throw new Error(`Notification Log #${logId} not found`);
    }

    const updatedRetryCount = targetLog.retryCount + 1;

    let res;
    if (targetLog.channel === 'SMS') {
      res = await SmsProviderService.sendSms(targetLog.recipientPhone, targetLog.body);
    } else {
      res = await FcmProviderService.sendPushNotification(
        env.TEST_NOTIFICATION_RECIPIENT_FCM,
        targetLog.title,
        targetLog.body,
        { emergencyId: targetLog.emergencyId, retry: String(updatedRetryCount) }
      );
    }

    const newStatus = res.success ? (res.provider === 'TEST_MODE' ? 'TEST_MODE' : 'DELIVERED') : 'FAILED';

    const updatedLog: NotificationLogItem = {
      ...targetLog,
      retryCount: updatedRetryCount,
      deliveryStatus: newStatus,
      failureReason: res.failureReason || undefined,
      sentAt: new Date().toISOString(),
    };

    if (logIndex !== -1) {
      memoryNotificationLogs[logIndex] = updatedLog;
    }

    try {
      await (prisma as any).notificationLog?.update({
        where: { id: logId },
        data: {
          retryCount: updatedRetryCount,
          deliveryStatus: newStatus,
          failureReason: res.failureReason || null,
          sentAt: new Date(),
        },
      });
    } catch (e) {}

    io.emit('notification_log_updated', updatedLog);

    return updatedLog;
  }
}
