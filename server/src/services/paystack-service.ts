import { AppError } from '../types/api.js';
import { env } from '../config/env.js';

interface PaystackVerifyApiResponse {
  status: boolean;
  message: string;
  data?: {
    status?: string;
    reference?: string;
  };
}

export interface VerifyTransactionResult {
  reference: string;
  paystack_status: string;
  paid: boolean;
}

export const verifyPaystackTransaction = async (reference: string): Promise<VerifyTransactionResult> => {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
  });

  const payload = (await response.json()) as PaystackVerifyApiResponse;

  if (!response.ok || !payload.status || !payload.data?.reference) {
    throw new AppError(
      `Paystack verify failed: ${payload.message ?? 'unknown error'}`,
      400,
      'PAYSTACK_VERIFY_FAILED',
    );
  }

  return {
    reference: payload.data.reference,
    paystack_status: payload.data.status ?? 'unknown',
    paid: payload.data.status === 'success',
  };
};
