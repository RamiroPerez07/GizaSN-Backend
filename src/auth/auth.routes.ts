import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/register', authController.register);
// 🛡️ Ruta protegida para validar el token con get
router.get('/validate', authController.validateToken);

export default router;