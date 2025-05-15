import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const header = req.header('Authorization');
  if (!header) {
    res.status(401).json({ msg: 'No token, authorization denied' });
    return;
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { user: { id: string; role: string } };
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};