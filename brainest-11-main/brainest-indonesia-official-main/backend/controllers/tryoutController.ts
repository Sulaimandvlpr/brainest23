// controllers/tryoutController.ts
import { Request, Response } from 'express';
import IrtSetting from '../models/IrtSetting';
import Question, { IQuestion } from '../models/Question';
import UserAttempt from '../models/UserAttempt';
import { estimateTheta, P, thetaToPoint } from '../helpers/irt';
import { findUserRank } from './scoreboardController';

// Thresholds for adaptive model switching
const A_THRESH    = 1.0;   // average a for correct ≥ 1.0 to consider 2PL
const B_THRESH    = 1.0;   // average b for correct ≥ 1.0 to consider 3PL
const ACC_LOW     = 0.5;   // overall accuracy < 50% indicates guess => 3PL
const CHECK_AFTER = 5;     // check model after this many responses
const DELTA_B     = 0.2;   // delta for difficulty calibration

const CATEGORIES = ['TPS', 'TKA Saintek', 'TKA Soshum'] as const;

/**
 * Start a new tryout with optional category/subtest filtering
 */
export const start = async (req: Request, res: Response): Promise<Response> => {
  try {
    const category = req.query.category as string | undefined;

    // Tentukan subtest berdasarkan kategori yang dipilih
    const subtestsMap: { [key: string]: string[] } = {
      TPS: ['Matematika', 'Verbal'],
      'TKA Saintek': ['Fisika'],
      'TKA Soshum': ['Ekonomi'],
    };

    // Validasi kategori
    if (!category || !subtestsMap[category]) {
      return res.status(400).json({ msg: 'Invalid category selected' });
    }

    const setting =
      (await IrtSetting.findOne().sort({ updatedAt: -1 })) ||
      (await new IrtSetting({ mode: '1PL', thetaMean: 0, thetaSD: 1, maxItems: 20, startItems: 5 }).save());

    const filter: any = { status: 'active', category };
    const { startItems, mode: initialMode } = setting;

    // Ambil soal untuk semua subtest yang ada dalam kategori yang dipilih
    const allSubtests = subtestsMap[category];
    let allQuestions: IQuestion[] = [];

    // Mengambil soal berdasarkan urutan subtest
    for (const subtest of allSubtests) {
      const subtestQuestions: IQuestion[] = await Question.find({ ...filter, subtest }).limit(startItems);
      allQuestions = allQuestions.concat(subtestQuestions);
    }

    // Menyiapkan soal yang akan dikirimkan ke pengguna
    const nextItems = allQuestions.map(q => ({
      id:        q._id.toString(),
      parameter: q.parameter,
      category:  q.category,
      subtest:   q.subtest,
      text:      q.text,
      options:   q.options
    }));

    // Menyimpan percakapan yang dimulai
    const userId = (req as any).user.id;
    const attempt = await new UserAttempt({
      user: userId,
      mode: initialMode,
      category,
      subtest: allSubtests[0],  // Menyimpan subtest pertama yang akan dikerjakan
      items: [],
      subtestOrder: allSubtests, // Menyimpan urutan subtest untuk pengguna
    }).save();

    return res.json({ attemptId: attempt._id.toString(), nextItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error starting tryout' });
  }
};


const updateDifficulty = async (questionId: string, correctResponses: number, totalResponses: number): Promise<void> => {
  const question = await Question.findById(questionId);

  if (!question) return;

  // Hitung persentase jawaban benar
  const correctPercentage = correctResponses / totalResponses;

  // Tentukan perubahan yang akan diterapkan pada parameter `b` (kesulitan soal)
  let delta = 0;
  if (correctPercentage > 0.7) {
    delta = -0.1;  // Turunkan kesulitan soal jika lebih dari 70% siswa menjawab benar
  } else if (correctPercentage < 0.3) {
    delta = 0.1;  // Naikkan kesulitan soal jika kurang dari 30% siswa menjawab benar
  }

  // Update parameter `b` soal
  question.parameter.b += delta;

  // Simpan perubahan pada soal
  await question.save();
};


/**
 * Answer items: update theta, adaptively switch model, record responses, return next or finish
 */
export const answer = async (req: Request, res: Response): Promise<Response> => {
  const { attemptId, responses } = req.body;
  const category = req.query.category as string | undefined;

  if (!responses?.length) {
    return res.status(400).json({ msg: 'Invalid or empty responses' });
  }

  const attempt = await UserAttempt.findById(attemptId);
  if (!attempt) {
    return res.status(404).json({ msg: 'Attempt not found' });
  }

  const setting = (await IrtSetting.findOne().sort({ updatedAt: -1 })) ||
    await new IrtSetting({ mode: '1PL', thetaMean: 0, thetaSD: 1, maxItems: 20, startItems: 5 }).save();

  // Fetch full questions for responses
  const qIds = responses.map((r: any) => r.itemId).filter(Boolean);
  const itemsFull = await Question.find({ _id: { $in: qIds } });
  if (!itemsFull.length) {
    return res.status(404).json({ msg: 'No questions found for the given IDs' });
  }

  // Determine correctness
  const resps = responses.map((r: any) => {
    const q = itemsFull.find(x => x._id.toString() === r.itemId)!;
    return { correct: q.answer === r.answer };
  });

  // Estimate theta using current attempt.mode
  const modeToUse = attempt.mode;
  const irtItems = itemsFull.map(q => ({ parameter: q.parameter, mode: modeToUse }));
  const theta = estimateTheta(resps, irtItems, setting.thetaMean, setting.thetaSD);
  const points = Math.round(thetaToPoint(theta, -3, 3, 1000));

  // Save responses and update attempt
  responses.forEach((r: any, i: number) => {
    attempt.items.push({ question: r.itemId, response: r.answer, correct: resps[i].correct, theta });
  });
  await attempt.save();

  // Update difficulty of each answered question
  for (const r of responses) {
    const questionId = r.itemId;
    const correctResponses = resps.filter(resp => resp.correct).length;
    const totalResponses = await UserAttempt.countDocuments({ "items.question": questionId });
    await updateDifficulty(questionId, correctResponses, totalResponses);
  }

  // Move to next subtest after finishing current one
  if (attempt.subtestOrder) {
    const subtests = attempt.subtestOrder;
    const currentSubtestIndex = subtests.indexOf(attempt.subtest);
    if (currentSubtestIndex < subtests.length - 1) {
      const nextSubtest = subtests[currentSubtestIndex + 1];
      const nextSubtestQuestions = await Question.find({ category, subtest: nextSubtest }).limit(5);

      const nextItems = nextSubtestQuestions.map(q => ({
        id:        q._id.toString(),
        parameter: q.parameter,
        category:  q.category,
        subtest:   q.subtest,
        text:      q.text,
        options:   q.options
      }));

      attempt.subtest = nextSubtest;
      await attempt.save();

      return res.json({
        currentTheta: theta,
        points,
        mode: attempt.mode,
        nextItems
      });
    }
  }

  // Select next question by information
  const answered = attempt.items.map(i => i.question.toString());
  const filter: any = { status: 'active', _id: { $nin: answered }, subtest: attempt.subtest };
  if (category) filter.category = category;
  const pool = await Question.find(filter) as IQuestion[];

  let best: IQuestion|null = null;
  let bestInfo = -Infinity;
  pool.forEach(q => {
    const pVal = P(theta, q.parameter, attempt.mode);  // Calculate probability of correct response
    const info = q.parameter.a**2 * pVal * (1 - pVal); // Information measure
    if (info > bestInfo) {
      bestInfo = info;
      best = q;
    }
  });

  if (!best) {
    attempt.finalTheta = theta;
    await attempt.save();
    return res.json({ done: true, finalTheta: theta, points, mode: attempt.mode });
  }

  return res.json({
    currentTheta: theta,
    points,
    mode: attempt.mode,
    nextItem: {
      id:        best._id.toString(),
      parameter: best.parameter,
      category:  best.category,
      subtest:   best.subtest
    }
  });
};

/**
 * Stop tryout and calculate final score and leaderboard entry
 */
export const stop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { attemptId } = req.body;
    const attempt = await UserAttempt.findById(attemptId).populate('items.question');
    if (!attempt) {
      return res.status(404).json({ msg: 'Attempt not found' });
    }

    if (attempt.items.length === 0) {
      return res.status(400).json({ msg: 'No questions answered in this attempt' });
    }

    // Hitung correct answers, wrong answers, unanswered questions
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    // Iterasi semua items untuk menghitung jawaban
    attempt.items.forEach(item => {
      const question = item.question;
      if (!question) return;

      if (item.correct === true) {
        correctAnswers++;
      } else if (item.correct === false) {
        wrongAnswers++;
      } else {
        unanswered++;
      }
    });

    // Ambil pengaturan IRT terbaru
    const setting = await IrtSetting.findOne().sort({ updatedAt: -1 });
    const resps = attempt.items.map(i => ({ correct: i.correct }));
    const irtItems = attempt.items.map(i => ({
      parameter: i.question.parameter,
      mode: attempt.mode
    }));
    
    const theta = estimateTheta(resps, irtItems, setting?.thetaMean ?? 0, setting?.thetaSD ?? 1);
    const points = Math.round(thetaToPoint(theta, -3, 3, 1000));

    // Simpan hasil akhir di attempt
    attempt.finalTheta = theta;
    attempt.points = points;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.unanswered = unanswered;
    await attempt.save();

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

      // Tentukan kategori attempt dan proses data
      let category: Category | undefined = (att as any).category;
      if (!category && att.items.length) {
        const firstQId = att.items[0].question;
        const q = await Question.findById(firstQId) as IQuestion;
        if (q && CATEGORIES.includes(q.category as Category)) {
          category = q.category as Category;
        }
      }

      if (!category) continue;  // Jika kategori tidak ditemukan, lanjutkan ke attempt berikutnya

      const pts = Math.round(thetaToPoint(att.finalTheta!, -3, 3, 1000));

      const key = category === 'TPS'
        ? 'TPS'
        : category === 'TKA Saintek'
        ? 'TKA_Saintek'
        : 'TKA_Soshum';

      if (boardMap[uid].scores[key] === null) {
        boardMap[uid].scores[key] = pts;
      }

      // Hitung jumlah jawaban benar, salah, dan tidak dijawab
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

    // Bentuk array dan hitung rata-rata
    const board = Object.values(boardMap).map((entry: any) => {
      const vals = Object.values(entry.scores)
        .filter((v: number | null) => v !== null) as number[];
      const average = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : 0;
      return { ...entry, average };
    });

    // Urutkan descending berdasarkan average score
    board.sort((a: any, b: any) => b.average - a.average);

    // Cari rank pengguna setelah menambahkan ke leaderboard
    const rank = findUserRank(attempt.user.toString(), board);

    return res.json({
      done: true,
      finalTheta: theta,
      points,
      correctAnswers,
      wrongAnswers,
      unanswered,
      rank,  // Rank siswa yang baru saja selesai tryout
      mode: attempt.mode
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error stopping tryout' });
  }
};