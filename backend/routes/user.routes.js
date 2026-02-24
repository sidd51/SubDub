
import { Router } from 'express';
import { getUser, getMe, updateMe } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

// All user routes are protected — must send a valid JWT in the Authorization header
userRouter.use(authorize);

userRouter.get('/me', getMe);           // GET  /api/v1/users/me
userRouter.put('/me', updateMe);        // PUT  /api/v1/users/me
userRouter.get('/:id', getUser);        // GET  /api/v1/users/:id

export default userRouter;