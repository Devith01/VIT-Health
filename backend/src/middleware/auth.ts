import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { verifyJwtToken, JwtPayload } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const demoSessions: Record<string, JwtPayload> = {
  student: {
    userId: 'user-std-1',
    email: 'student@demo.com',
    roleName: 'STUDENT',
  },
  doctor: {
    userId: 'user-doc-1',
    email: 'doctor@demo.com',
    roleName: 'DOCTOR',
  },
  admin: {
    userId: 'user-adm-1',
    email: 'admin@demo.com',
    roleName: 'ADMIN',
  },
  security_officer: {
    userId: 'user-sec-1',
    email: 'security@demo.com',
    roleName: 'SECURITY_OFFICER',
  },
  ambulance_officer: {
    userId: 'user-amb-1',
    email: 'ambulance@demo.com',
    roleName: 'AMBULANCE_OFFICER',
  },
  floor_representative: {
    userId: 'user-rep-1',
    email: 'floorrep@demo.com',
    roleName: 'FLOOR_REPRESENTATIVE',
  },
  pharmacy_staff: {
    userId: 'user-phr-1',
    email: 'pharmacy@demo.com',
    roleName: 'PHARMACY_DESK',
  },
  pharmacy_desk: {
    userId: 'user-phr-1',
    email: 'pharmacy@demo.com',
    roleName: 'PHARMACY_DESK',
  },
  faculty: {
    userId: 'user-fac-1',
    email: 'faculty@demo.com',
    roleName: 'FACULTY',
  },
};

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication token missing or invalid format',
    });
  }

  const token = authHeader.split(' ')[1];

  if (env.NODE_ENV !== 'production' && token.startsWith('mock-jwt-token-demo-')) {
    const roleKey = token.slice('mock-jwt-token-demo-'.length);
    const demoUser = demoSessions[roleKey];

    if (demoUser) {
      req.user = demoUser;
      return next();
    }
  }

  try {
    const decoded = verifyJwtToken(token);

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired authentication token',
    });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.roleName)) {
      return res.status(403).json({
        status: 'fail',
        message: `Access denied. Role '${req.user.roleName}' is not authorized for this resource.`,
      });
    }

    next();
  };
};
