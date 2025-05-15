// controllers/questionsController.ts
import { Request, Response } from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Question, { IQuestion } from '../models/Question';

export const list = async (_req: Request, res: Response) => {
  const qs: IQuestion[] = await Question.find();
  res.json(qs);
};

export const create = async (req: Request, res: Response) => {
  const q = new Question(req.body);
  await q.save();
  res.json(q);
};

export const updateQ = async (req: Request, res: Response) => {
  const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
};

export const remove = async (req: Request, res: Response) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
};

export const importExcel = async (req: Request, res: Response) => {
  const file = (req as any).file.buffer as Buffer;
  const wb = xlsx.read(file, { type: 'buffer' });
  const data = xlsx.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
  const docs = data.map(d => ({
    category: d.category,
    subtest:  d.subtest,
    text:     d.soal,
    options:  { a:d.a, b:d.b, c:d.c, d:d.d },
    answer:   d.jawaban,
    parameter:{ a:d.param_a, b:d.param_b, c:d.param_c },
    status:   'active'
  }));
  await Question.insertMany(docs);
  res.json({ imported: docs.length });
};
