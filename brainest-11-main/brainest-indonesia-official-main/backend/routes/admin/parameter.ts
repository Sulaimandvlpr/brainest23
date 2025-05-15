// routes/admin/parameter.ts
import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { roles } from '../../middleware/roles';
import { calibrateDifficulty } from '../../controllers/parameterController';

const router = Router();

// Hanya admin yang boleh menjalankan kalibrasi
router.post('/calibrate', auth, roles('admin', 'guru'), calibrateDifficulty);

export default router;
