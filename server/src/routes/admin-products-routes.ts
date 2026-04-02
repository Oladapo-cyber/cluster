import { Router } from 'express';
import { adminAuth } from '../middleware/admin-auth.js';
import {
  deleteAdminProduct,
  getAdminProduct,
  getAdminProducts,
  postAdminProduct,
  putAdminProduct,
} from '../controllers/admin-products-controller.js';

export const adminProductsRouter = Router();

adminProductsRouter.use(adminAuth);
adminProductsRouter.get('/products', getAdminProducts);
adminProductsRouter.get('/products/:id', getAdminProduct);
adminProductsRouter.post('/products', postAdminProduct);
adminProductsRouter.put('/products/:id', putAdminProduct);
adminProductsRouter.delete('/products/:id', deleteAdminProduct);