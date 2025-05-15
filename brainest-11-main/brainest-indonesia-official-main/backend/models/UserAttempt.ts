import mongoose, { Document } from 'mongoose';

interface IItemRecord {
  question: mongoose.Types.ObjectId;
  response: string;
  correct: boolean;
  theta: number;
}

export interface IUserAttempt extends Document {
  user: mongoose.Types.ObjectId;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  mode: '1PL' | '2PL' | '3PL';
  items: IItemRecord[];
  finalTheta?: number;
}

const UserAttemptSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  unanswered: { type: Number, default: 0 },
  mode:      { type: String, enum: ['1PL','2PL','3PL'], required: true },
  items:     [{ question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, response: String, correct: Boolean, theta: Number }],
  finalTheta:Number
}, { timestamps: true });

export default mongoose.model<IUserAttempt>('UserAttempt', UserAttemptSchema);
