// routes/admin/questions.ts
import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth';
import { roles } from '../../middleware/roles';
import { list, create, updateQ as update, remove, importExcel } from '../../controllers/questionController';

const upload = multer();
const router = Router();

router.get('/',    auth, roles('admin','guru'), list);
router.post('/',   auth, roles('admin','guru'), create);
router.put('/:id', auth, roles('admin','guru'), update);
router.delete('/:id', auth, roles('admin','guru'), remove);
router.post('/import', auth, roles('admin','guru'), upload.single('file'), importExcel);

export default router;
