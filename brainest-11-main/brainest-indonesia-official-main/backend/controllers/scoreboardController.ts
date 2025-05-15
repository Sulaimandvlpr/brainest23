import { Request, Response } from 'express';
import UserAttempt, { IUserAttempt } from '../models/UserAttempt';
import Question, { IQuestion } from '../models/Question';
import { thetaToPoint } from '../helpers/irt';

// Daftar kategori yang tersedia
const CATEGORIES = ['TPS', 'TKA Saintek', 'TKA Soshum'] as const;
type Category = typeof CATEGORIES[number];

export const getScoreboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    // 1. Ambil semua attempt yang sudah selesai (finalTheta ada), tanpa memfilter mode
    const attempts = await UserAttempt.find({ finalTheta: { $exists: true } })
      .sort({ updatedAt: -1 })
      .populate('user', 'name'); // Populate user name

    // 2. Mapping per user
    const boardMap: Record<string, any> = {};

    for (const att of attempts as (IUserAttempt & { user: any })[]) {
      const uid = att.user._id.toString();
      if (!boardMap[uid]) {
        boardMap[uid] = {
          userId: uid,
          name: att.user.name,
          scores: {
            TPS: null,
            TKA_Saintek: null,
            TKA_Soshum: null
          },
          correctAnswers: 0,
          wrongAnswers: 0,
          unanswered: 0
        };
      }

      // 3. Tentukan kategori attempt:
      //    - Jika disimpan di attempt.category, pakai itu.
      //    - Kalau belum, cek soal pertama yang diitem untuk cari kategori.
      let category: Category | undefined = (att as any).category;
      if (!category && att.items.length) {
        const firstQId = att.items[0].question;
        const q = await Question.findById(firstQId) as IQuestion;
        if (q && CATEGORIES.includes(q.category as Category)) {
          category = q.category as Category;
        }
      }

      // Jika kategori tidak ditemukan, lanjutkan ke next attempt
      if (!category) {
        continue;
      }

      // 4. Konversi theta → poin 0–1000 (menggunakan 3PL model untuk semua)
      const pts = Math.round(thetaToPoint(att.finalTheta!, -3, 3, 1000));

      // Tentukan key berdasarkan kategori
      const key = category === 'TPS'
        ? 'TPS'
        : category === 'TKA Saintek'
          ? 'TKA_Saintek'
          : 'TKA_Soshum';

      // Simpan nilai skor untuk kategori yang sesuai
      if (boardMap[uid].scores[key] === null) {
        boardMap[uid].scores[key] = pts;
      }

      // 5. Hitung jumlah jawaban benar, salah, dan tidak dijawab
      att.items.forEach(item => {
        if (item.correct === true) {
          boardMap[uid].correctAnswers += 1;
        } else if (item.correct === false) {
          boardMap[uid].wrongAnswers += 1;
        } else {
          boardMap[uid].unanswered += 1;
        }
      });
    }

    // 6. Bentuk array dan hitung rata-rata
    const board = Object.values(boardMap).map((entry: any) => {
      const vals = Object.values(entry.scores)
        .filter((v: number | null) => v !== null) as number[];
      const average = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : 0;
      return { ...entry, average };
    });

    // 7. Urutkan descending berdasarkan average
    board.sort((a: any, b: any) => b.average - a.average);

    res.json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error fetching leaderboard' });
  }
};

/**
 * Fungsi untuk mencari rank user berdasarkan userId
 */
export const findUserRank = (userId: string, board: any[]): number => {
  // Urutkan leaderboard berdasarkan average score (skor rata-rata) secara menurun
  const sortedBoard = board.sort((a: any, b: any) => b.average - a.average);
  
  // Cari index rank user berdasarkan userId
  const userRank = sortedBoard.findIndex(entry => entry.userId === userId) + 1;  // Rank dimulai dari 1
  return userRank >= 0 ? userRank : -1; // Jika user ditemukan, return rank, jika tidak -1
};