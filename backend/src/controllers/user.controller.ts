import { Response } from 'express';
import { UserService } from '../services/user.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const profile = await UserService.getProfile(req.user.userId);
    return res.status(200).json({ status: 'success', data: { profile } });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const stats = await UserService.getDashboardStats(req.user);
    return res.status(200).json({ status: 'success', data: stats });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const updateLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    const { blockName, roomNum } = req.body;
    if (!blockName || !roomNum) {
      return res.status(400).json({ status: 'fail', message: 'blockName and roomNum are required' });
    }

    const updated = await UserService.updateUserLocation(req.user.userId, blockName, roomNum);
    return res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};
