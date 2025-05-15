import mongoose, { Document } from 'mongoose';

export interface IParameter {
  a: number;
  b: number;
  c: number;
}

export interface IQuestion extends Document {
  category: string;
  subtest?: string;
  text: string;
  options: { a: string; b: string; c: string; d: string };
  answer: string;
  parameter: IParameter;
  status: 'active' | 'draft';
}

const QuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    subtest: String,
    text: String,
    options: { a: String, b: String, c: String, d: String },
    answer: String,
    parameter: { a: Number, b: Number, c: Number },
    status: { type: String, enum: ['active', 'draft'], default: 'draft' }
  }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);