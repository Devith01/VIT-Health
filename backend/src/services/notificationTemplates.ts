import { env } from '../config/env.js';

export interface EmergencyNotificationParams {
  emergencyId: string;
  priority: string;
  studentRegNo: string;
  studentName?: string;
  block: string;
  floor: string | number;
  roomLocation: string;
  fullLocationString: string;
  requiredAssistance?: string;
  assignmentStatus?: string;
  destination?: string;
  gpsCoordinates?: { lat: number; lng: number };
}

export interface NotificationPayload {
  role: 'SECURITY_OFFICER' | 'DOCTOR' | 'AMBULANCE_OFFICER';
  smsBody: string;
  pushPayload: {
    title: string;
    body: string;
    data: Record<string, string>;
  };
}

/**
 * SECURITY OFFICER NOTIFICATION TEMPLATE
 * Privacy-compliant: Contains location, priority, student reg no, and dashboard link.
 * Excludes sensitive medical history.
 */
export function buildSecurityNotification(params: EmergencyNotificationParams): NotificationPayload {
  const baseUrl = env.FRONTEND_BASE_URL;
  const dashboardUrl = `${baseUrl}/security/emergencies`;
  const assistance = params.requiredAssistance || 'Immediate Security Patrol & First Responder Gate Clearance Required';

  const smsBody = `🚨 URGENT V-HEALTH SOS: Emergency #${params.emergencyId} [Priority: ${params.priority}]. Location: ${params.block}, Floor ${params.floor}, ${params.roomLocation}. Student Reg No: ${params.studentRegNo}. Required Action: ${assistance}. Access Portal: ${dashboardUrl}`;

  return {
    role: 'SECURITY_OFFICER',
    smsBody,
    pushPayload: {
      title: `🚨 URGENT SOS DISPATCH - ${params.block}`,
      body: `Emergency #${params.emergencyId} [${params.priority}] at ${params.block} Room ${params.roomLocation}. Assistance required.`,
      data: {
        emergencyId: params.emergencyId,
        priority: params.priority,
        block: params.block,
        floor: String(params.floor),
        roomLocation: params.roomLocation,
        studentRegNo: params.studentRegNo,
        requiredAssistance: assistance,
        actionUrl: dashboardUrl,
      },
    },
  };
}

/**
 * DOCTOR NOTIFICATION TEMPLATE
 * Privacy-compliant: Assigned physician notification with student identifier and clinical dashboard link.
 */
export function buildDoctorNotification(params: EmergencyNotificationParams): NotificationPayload {
  const baseUrl = env.FRONTEND_BASE_URL;
  const dashboardUrl = `${baseUrl}/doctor/queue`;
  const status = params.assignmentStatus || 'ASSIGNED_PRIMARY_PHYSICIAN';

  const smsBody = `🩺 V-HEALTH CLINICAL ALERT: Emergency #${params.emergencyId} [Priority: ${params.priority}] assigned to you. Student ID: ${params.studentRegNo}. Status: ${status}. Access Clinical Dashboard: ${dashboardUrl}`;

  return {
    role: 'DOCTOR',
    smsBody,
    pushPayload: {
      title: `🩺 Emergency Clinical Assignment (#${params.emergencyId})`,
      body: `Emergency #${params.emergencyId} [${params.priority}] assigned. Student ID: ${params.studentRegNo}.`,
      data: {
        emergencyId: params.emergencyId,
        priority: params.priority,
        assignmentStatus: status,
        studentRegNo: params.studentRegNo,
        actionUrl: dashboardUrl,
      },
    },
  };
}

/**
 * AMBULANCE OFFICER NOTIFICATION TEMPLATE
 * Contains pickup location, destination, navigation link, and ambulance dashboard link.
 */
export function buildAmbulanceNotification(params: EmergencyNotificationParams): NotificationPayload {
  const baseUrl = env.FRONTEND_BASE_URL;
  const dashboardUrl = `${baseUrl}/ambulance/current-assignment`;
  const lat = params.gpsCoordinates?.lat || 23.075;
  const lng = params.gpsCoordinates?.lng || 76.859;
  const navUrl = `https://maps.google.com/?q=${lat},${lng}`;
  const destination = params.destination || 'Dr. Morepen Campus Health Centre';

  const smsBody = `🚑 V-HEALTH AMBULANCE DISPATCH: Emergency #${params.emergencyId} [Priority: ${params.priority}]. Pickup: ${params.fullLocationString}. Destination: ${destination}. Navigation: ${navUrl} | Mobile Dashboard: ${dashboardUrl}`;

  return {
    role: 'AMBULANCE_OFFICER',
    smsBody,
    pushPayload: {
      title: `🚑 Emergency Ambulance Dispatch`,
      body: `Emergency #${params.emergencyId} [${params.priority}]. Pickup: ${params.fullLocationString}.`,
      data: {
        emergencyId: params.emergencyId,
        priority: params.priority,
        pickupLocation: params.fullLocationString,
        destination,
        navigationUrl: navUrl,
        actionUrl: dashboardUrl,
      },
    },
  };
}
