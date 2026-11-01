import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { loginSchema, signupSchema, resetPasswordSchema, updateLocationSchema } from '../validators/auth.validator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    const message = error.errors?.[0]?.message || error.message || 'Login failed';
    return res.status(400).json({
      status: 'fail',
      message,
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const userProfile = await AuthService.getUserProfile(req.user.userId, req.user.email);

    return res.status(200).json({
      status: 'success',
      data: { user: userProfile },
    });
  } catch (error: any) {
    return res.status(404).json({
      status: 'fail',
      message: error.message || 'User profile not found',
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const result = await AuthService.signup(validatedData);

    return res.status(201).json({
      status: 'success',
      message: 'Student account created successfully',
      data: result,
    });
  } catch (error: any) {
    const message = error.errors?.[0]?.message || error.message || 'Signup failed';
    const isConflict = message.includes('already exists') || message.includes('Unique constraint');
    return res.status(isConflict ? 409 : 400).json({
      status: 'fail',
      message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(validatedData);

    return res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
      data: result,
    });
  } catch (error: any) {
    const message = error.errors?.[0]?.message || error.message || 'Password reset failed';
    return res.status(400).json({
      status: 'fail',
      message,
    });
  }
};

export const updateLocationAuth = async (req: Request, res: Response) => {
  try {
    const validatedData = updateLocationSchema.parse(req.body);
    const result = await AuthService.updateLocation(validatedData);

    return res.status(200).json({
      status: 'success',
      message: 'Hostel and room updated successfully',
      data: result,
    });
  } catch (error: any) {
    const message = error.errors?.[0]?.message || error.message || 'Location update failed';
    return res.status(400).json({
      status: 'fail',
      message,
    });
  }
};

