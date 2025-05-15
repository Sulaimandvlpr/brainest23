import { IParameter } from '../models/Question';

/**
 * Hitung probabilitas berdasarkan model IRT
 */
export function P(
  theta: number,
  param: IParameter,
  mode: '1PL' | '2PL' | '3PL'
): number {
  const expTerm = Math.exp(param.a * (theta - param.b));
  if (mode === '1PL') return expTerm / (1 + expTerm); // Model 1PL
  if (mode === '2PL') return expTerm / (1 + expTerm); // Model 2PL
  return param.c + (1 - param.c) * (expTerm / (1 + expTerm)); // Model 3PL
}

/**
 * Estimasi theta berdasarkan EAP (Expected A Posteriori)
 * @param responses: Jawaban siswa
 * @param items: Soal-soal yang diberikan
 * @param priorMean: Rata-rata distribusi theta (biasanya 0)
 * @param priorSD: Standar deviasi distribusi theta (biasanya 1)
 */
export function estimateTheta(
  responses: { correct: boolean }[],
  items: { parameter: IParameter; mode: '1PL' | '2PL' | '3PL' }[],
  priorMean: number,
  priorSD: number
): number {
  const thetas: number[] = [];
  // Rentang theta yang diuji
  for (let t = -4; t <= 4; t += 0.1) thetas.push(t);
  
  // Menghitung bobot untuk setiap nilai theta berdasarkan prior dan likelihood
  const weights = thetas.map((theta) => {
    const prior = Math.exp(-0.5 * ((theta - priorMean) / priorSD) ** 2); // Menghitung prior berdasarkan distribusi normal
    let like = 1;
    responses.forEach((resp, i) => {
      const p = P(theta, items[i].parameter, items[i].mode); // Probabilitas untuk setiap soal
      like *= resp.correct ? p : 1 - p; // Likelihood berdasarkan jawaban benar/salah
    });
    return prior * like; // Prior * Likelihood = Posterior
  });
  
  // Normalisasi bobot
  const norm = weights.reduce((a, b) => a + b, 0);
  
  // Menghitung EAP (Expected A Posteriori)
  const eap = thetas.reduce(
    (sum, t, i) => sum + t * weights[i],
    0
  ) / norm;

  return eap;
}

/**
 * Map theta (biasanya di kisaran [-3, +3]) ke skor 0–100
 * @param theta nilai kemampuan
 * @param minTheta nilai minimum theta (default -3)
 * @param maxTheta nilai maksimum theta (default +3)
 * @param maxScale maksimum skor poin (default 100)
 */
export function thetaToPoint(
  theta: number,
  minTheta = -3,
  maxTheta = 3,
  maxScale = 100
): number {
  // clamp theta ke dalam rentang [minTheta, maxTheta]
  const t = Math.max(minTheta, Math.min(maxTheta, theta));
  // linear map ke [0, maxScale]
  return ((t - minTheta) / (maxTheta - minTheta)) * maxScale;
}