import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const roles = (...allowed: string[]) => (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !allowed.includes(req.user.role)) {
    res.status(403).json({ msg: 'Forbidden' });
    return;
  }
  next();
};