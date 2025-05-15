// controllers/parameterController.ts
import { Request, Response } from 'express';
import Question from '../models/Question';
import UserAttempt from '../models/UserAttempt';

const CORRECT_LOWER = 0.2;  // ≤20% benar → naikkan b
const CORRECT_UPPER = 0.8;  // ≥80% benar → turunkan b
const DELTA = 0.2;          // langkah perubahan b

/**
 * Calibrate question difficulty parameters (b) adaptively.
 * Untuk setiap soal:
 *  - hitung proporsi jawaban benar dari semua UserAttempt yang mencakup soal itu
 *  - jika prop ≤ CORRECT_LOWER, b += DELTA
 *  - jika prop ≥ CORRECT_UPPER, b -= DELTA
 *  - simpan perubahan (minimal b pada rentang [-4,4])
 */
export const calibrateDifficulty = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Ambil semua soal
    const questions = await Question.find();

    for (const q of questions) {
      // Cari semua attempt yang mencantumkan soal ini
      const attempts = await UserAttempt.find({ 'items.question': q._id }, { 'items.$': 1 });
      if (!attempts.length) continue;

      // Kumpulkan jawaban untuk soal ini
      let correctCount = 0;
      attempts.forEach(att => {
        att.items.forEach(item => {
          if (item.question.toString() === q._id.toString()) {
            if (item.correct) correctCount++;
          }
        });
      });

      const total = attempts.length;
      const propCorrect = correctCount / total;

      let newB = q.parameter.b;
      if (propCorrect <= CORRECT_LOWER) {
        newB += DELTA;
      } else if (propCorrect >= CORRECT_UPPER) {
        newB -= DELTA;
      }

      // Clamp b ke rentang [-4, +4]
      newB = Math.max(-4, Math.min(4, newB));

      // Hanya update jika berubah
      if (Math.abs(newB - q.parameter.b) > 1e-6) {
        q.parameter.b = parseFloat(newB.toFixed(3));
        await q.save();
      }
    }

    res.json({ msg: 'Calibration complete', count: questions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error calibrating difficulty' });
  }
};
