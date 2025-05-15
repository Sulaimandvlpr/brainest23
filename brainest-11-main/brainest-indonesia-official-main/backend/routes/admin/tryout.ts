// routes/admin/tryout.ts
import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { roles } from '../../middleware/roles';
import { start, answer, stop } from '../../controllers/tryoutController';

const router = Router();

// Start a new tryout
router.post('/start', auth, roles('siswa'), start);

// Submit answers and get next item or finish
router.post('/answer', auth, roles('siswa'), answer);

// Stop tryout and get final result
router.post('/stop', auth, roles('siswa'), stop);

export default router;
