// routes/admin/scoreboard.ts
import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { roles } from '../../middleware/roles';
import { getScoreboard } from '../../controllers/scoreboardController';

const router = Router();
router.get('/', auth, roles('admin','guru', 'siswa'), getScoreboard);
export default router;
