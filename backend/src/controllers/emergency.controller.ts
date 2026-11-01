import { Response } from 'express';
import { EmergencyService } from '../services/emergency.service.js';
import { EmergencyNotificationService } from '../services/emergencyNotification.service.js';
import { createEmergencySchema, updateAmbulanceLocationSchema, dispatchAmbulanceSchema } from '../validators/emergency.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createEmergency = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const validatedInput = createEmergencySchema.parse(req.body);
    const emergency = await EmergencyService.createEmergency(validatedInput, req.user.userId);

    return res.status(201).json({
      status: 'success',
      message: 'Emergency case logged & ambulance/security/doctor dispatched with notifications',
      data: { emergency },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getActiveEmergencies = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const emergencies = await EmergencyService.getActiveEmergencies();
    return res.status(200).json({ status: 'success', data: { emergencies } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const updateAmbulanceLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedInput = updateAmbulanceLocationSchema.parse(req.body);
    const updated = await EmergencyService.updateAmbulanceLocation(id, validatedInput.lat, validatedInput.lng, validatedInput.status);

    return res.status(200).json({ status: 'success', data: { ambulance: updated } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getNotificationLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientRole, channel, deliveryStatus, emergencyId } = req.query;

    const logs = await EmergencyNotificationService.getNotificationLogs({
      recipientRole: recipientRole as string,
      channel: channel as string,
      deliveryStatus: deliveryStatus as string,
      emergencyId: emergencyId as string,
    });

    return res.status(200).json({
      status: 'success',
      results: logs.length,
      data: { logs },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const retryNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedLog = await EmergencyNotificationService.retryNotificationLog(id);

    return res.status(200).json({
      status: 'success',
      message: 'Notification delivery retry executed',
      data: { log: updatedLog },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const triggerTestNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mockCase = {
      id: `emerg-test-${Date.now()}`,
      description: 'DEMO TEST SOS: Student reporting severe allergic reaction & breathing difficulty',
      severity: 'CRITICAL',
      status: 'AMBULANCE_DISPATCHED',
      location: req.body.location || 'Boys Block 1 - Floor 3 - Room 301',
      reportedBy: req.body.reporterName || 'Demo Student User',
    };

    const cascadeResult = await EmergencyNotificationService.triggerEmergencyCascade(mockCase, req.user?.userId);

    return res.status(200).json({
      status: 'success',
      message: 'TEST_EMERGENCY_NOTIFICATION mode executed successfully. SMS & Push notifications redirected to configured test targets.',
      data: cascadeResult,
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const dispatchAmbulance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedInput = dispatchAmbulanceSchema.parse(req.body);
    const dispatchResult = await EmergencyService.dispatchAmbulance(
      validatedInput,
      req.user?.userId || 'system-dispatcher'
    );

    return res.status(200).json({
      status: 'success',
      message: `Ambulance dispatched to ${validatedInput.destinationHostel} Room ${validatedInput.roomNumber}`,
      data: dispatchResult,
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

