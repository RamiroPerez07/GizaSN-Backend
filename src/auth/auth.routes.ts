import { Router } from 'express';
import { AuthController } from './auth.controller';
import authMiddleware from './auth.middleware'

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/register', authController.register);
// 🛡️ Ruta protegida para validar el token
router.get('/validate', authMiddleware, authController.validateToken);

export default router;