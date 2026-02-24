import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const authRouter = Router();

// Public routes — no auth required
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;