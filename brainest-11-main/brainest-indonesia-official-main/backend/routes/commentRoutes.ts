import { Router } from 'express';
import { auth } from '../middleware/auth';
import { addComment, getComments } from '../controllers/commentController';

const router = Router();

// Endpoint untuk menambah komentar (role: siswa/guru)
router.post('/', auth, addComment);

// Endpoint untuk mengambil komentar berdasar ID soal
router.get('/:questionId', auth, getComments);

export default router;