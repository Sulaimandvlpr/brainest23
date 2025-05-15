import { Request, Response } from 'express';
import Comment from '../models/Comment';

/**
 * Tambah komentar untuk soal tertentu
 */
export const addComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { questionId, content } = req.body;
    const userId = (req as any).user.id;
    if (!questionId || !content) {
      return res.status(400).json({ msg: 'questionId and content are required' });
    }
    const comment = await new Comment({ question: questionId, user: userId, content }).save();
    return res.json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error adding comment' });
  }
};

/**
 * Ambil semua komentar untuk soal tertentu
 */
export const getComments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(400).json({ msg: 'questionId is required in params' });
    }
    const comments = await Comment.find({ question: questionId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    return res.json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error fetching comments' });
  }
};