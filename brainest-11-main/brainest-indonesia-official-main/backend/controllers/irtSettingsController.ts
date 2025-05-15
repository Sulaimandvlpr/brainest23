// controllers/irtSettingsController.ts
import { Request, Response } from 'express';
import IrtSetting from '../models/IrtSetting';

/**
 * Get User IRT Setting (Personalized)
 */
export const getUserSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const setting = await IrtSetting.findOne({ user: userId }) || await IrtSetting.findOne({ isGlobal: true });
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error fetching user setting' });
  }
};

/**
 * Update User IRT Setting (Personalized)
 */
export const updateUserSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // Ambil userId dari autentikasi
    const { mode, thetaMean, thetaSD, maxItems, startItems } = req.body;

    const setting = await IrtSetting.findOneAndUpdate(
      { user: userId }, // Menemukan setting berdasarkan userId
      { mode, thetaMean, thetaSD, maxItems, startItems }, // Memperbarui pengaturan
      { new: true, upsert: true } // upsert akan membuat dokumen baru jika belum ada
    );

    res.json(setting); // Mengembalikan pengaturan yang sudah diperbarui
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error updating user setting' });
  }
};