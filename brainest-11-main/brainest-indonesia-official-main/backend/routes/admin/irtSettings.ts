import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { roles } from '../../middleware/roles';
import { getUserSetting, updateUserSetting } from '../../controllers/irtSettingsController';

const router = Router();
router.get('/', auth, roles('admin', 'guru', 'siswa'), getUserSetting);
router.post('/', auth, roles('admin', 'guru'), updateUserSetting);
export default router;