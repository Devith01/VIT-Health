import { Response } from 'express';
import { AppointmentService } from '../services/appointment.service.js';
import { bookAppointmentSchema } from '../validators/appointment.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getDoctors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctors = await AppointmentService.getDoctors();
    return res.status(200).json({ status: 'success', data: { doctors } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const bookAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const validatedInput = bookAppointmentSchema.parse(req.body);
    const appointment = await AppointmentService.bookAppointment(
      validatedInput,
      req.user.userId,
      req.user.roleName
    );

    return res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: { appointment },
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getMyAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const appointments = await AppointmentService.getMyAppointments(req.user.userId, req.user.roleName);
    return res.status(200).json({ status: 'success', data: { appointments } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const cancelAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await AppointmentService.cancelAppointment(id);
    return res.status(200).json({ status: 'success', message: 'Appointment cancelled' });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
