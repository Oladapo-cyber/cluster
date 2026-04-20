import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { healthRouter } from './routes/health-routes.js';
import { categoriesRouter } from './routes/categories-routes.js';
import { productsRouter } from './routes/products-routes.js';
import { adminProductsRouter } from './routes/admin-products-routes.js';
import { adminOrdersRouter } from './routes/admin-orders-routes.js';
import { adminResultsRouter } from './routes/admin-results-routes.js';
import { adminContactRouter } from './routes/admin-contact-routes.js';
import { ordersRouter } from './routes/orders-routes.js';
import { deliveryFeesRouter } from './routes/delivery-fees-routes.js';
import { paymentsRouter } from './routes/payments-routes.js';
import { clustacareRouter } from './routes/clustacare-routes.js';
import { contactRouter } from './routes/contact-routes.js';
import { userRouter } from './routes/user-routes.js';
import { adminDeliveryFeesRouter } from './routes/admin-delivery-fees-routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { frontendOrigins } from './config/env.js';

const app = express();
const allowedOrigins = new Set(frontendOrigins);
const normalizeRequestOrigin = (origin: string): string => origin.trim().replace(/\/+$/, '');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeRequestOrigin(origin);
      if (allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);
app.use(helmet());
app.use(morgan('dev'));

app.use(
  express.json({
    verify: (req, _res, buffer) => {
      (req as { bodyRaw?: string }).bodyRaw = buffer.toString();
    },
  }),
);

app.use('/api/v1', healthRouter);
app.use('/api/v1', categoriesRouter);
app.use('/api/v1', productsRouter);
app.use('/api/v1', ordersRouter);
app.use('/api/v1', deliveryFeesRouter);
app.use('/api/v1', paymentsRouter);
app.use('/api/v1', clustacareRouter);
app.use('/api/v1', contactRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', adminProductsRouter);
app.use('/api/v1', adminOrdersRouter);
app.use('/api/v1', adminDeliveryFeesRouter);
app.use('/api/v1', adminResultsRouter);
app.use('/api/v1', adminContactRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
