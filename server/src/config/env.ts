import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const normalizeOrigin = (value: string): string => value.trim().replace(/\/+$/, '');

const parseOrigins = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter((origin) => origin.length > 0);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  FRONTEND_ORIGINS: z.string().optional(),
  ADMIN_API_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_PUBLIC_KEY: z.string().min(1).optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment variables: ${issues}`);
}

export const env = result.data;
export const frontendOrigins = Array.from(
  new Set([
    normalizeOrigin(env.FRONTEND_ORIGIN),
    'https://clustadiagnostics.com',
    'https://www.clustadiagnostics.com',
    'http://localhost:5173',
    'http://localhost:4173',
    ...parseOrigins(env.FRONTEND_ORIGINS),
  ]),
);
