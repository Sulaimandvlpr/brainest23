import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
  question: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:  { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
