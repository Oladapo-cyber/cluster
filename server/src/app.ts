import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { healthRouter } from './routes/health-routes.js';
import { categoriesRouter } from './routes/categories-routes.js';
import { productsRouter } from './routes/products-routes.js';
import { adminProductsRouter } from './routes/admin-products-routes.js';
import { ordersRouter } from './routes/orders-routes.js';
import { paymentsRouter } from './routes/payments-routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
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
app.use('/api/v1', paymentsRouter);
app.use('/api/v1/admin', adminProductsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
