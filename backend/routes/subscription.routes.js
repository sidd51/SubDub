import { Router } from 'express';
import {
  createSubscription,
  getMySubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  getStats,
  getUpcoming,
  renewSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  changePlan,
} from '../controllers/subscription.controller.js';

import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.use(authorize);

//Special routes
subscriptionRouter.get('/stats', getStats);
subscriptionRouter.get('/upcoming', getUpcoming);

//ACTION routes (VERY IMPORTANT: before /:id)
subscriptionRouter.post('/:id/renew', renewSubscription);
subscriptionRouter.post('/:id/cancel', cancelSubscription);
subscriptionRouter.post('/:id/pause', pauseSubscription);
subscriptionRouter.post('/:id/resume', resumeSubscription);
subscriptionRouter.post('/:id/change-plan', changePlan);

//CRUD
subscriptionRouter.post('/', createSubscription);
subscriptionRouter.get('/', getMySubscriptions);
subscriptionRouter.get('/:id', getSubscription);
subscriptionRouter.put('/:id', updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);

export default subscriptionRouter;