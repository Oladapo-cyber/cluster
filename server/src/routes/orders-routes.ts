import { Router } from 'express';
import { postOrder } from '../controllers/orders-controller.js';

export const ordersRouter = Router();

ordersRouter.post('/orders', postOrder);
