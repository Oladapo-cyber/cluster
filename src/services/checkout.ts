import { apiRequest } from './api';

export interface CheckoutOrderItemInput {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_location: 'Mainland' | 'Island';
  items: CheckoutOrderItemInput[];
}

export interface CreateAuthenticatedOrderPayload {
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  delivery_location?: 'Mainland' | 'Island';
  items: CheckoutOrderItemInput[];
}

export interface CreateOrderResponse {
  id: string;
  total_kobo: number;
  delivery_fee_kobo: number;
  delivery_location: string;
  status: string;
  payment_reference: string;
}

export interface DeliveryFeeDTO {
  id: string;
  location: 'Mainland' | 'Island';
  fee_kobo: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerifyPaystackResponse {
  reference: string;
  paystack_status: string;
  paid: boolean;
}

export interface PublicKeyResponse {
  public_key: string;
}

export const createCheckoutOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  return apiRequest<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: payload,
  });
};

export const createAuthenticatedCheckoutOrder = async (
  payload: CreateAuthenticatedOrderPayload,
): Promise<CreateOrderResponse> => {
  return apiRequest<CreateOrderResponse>('/orders/authenticated', {
    method: 'POST',
    body: payload,
  });
};

export const verifyPaystackPayment = async (reference: string): Promise<VerifyPaystackResponse> => {
  return apiRequest<VerifyPaystackResponse>('/payments/paystack/verify', {
    method: 'POST',
    body: { reference },
  });
};

export const fetchPaystackPublicKey = async (): Promise<string> => {
  const response = await apiRequest<PublicKeyResponse>('/payments/paystack/public-key');
  return response.public_key;
};

export const fetchDeliveryFees = async (): Promise<DeliveryFeeDTO[]> => {
  return apiRequest<DeliveryFeeDTO[]>('/delivery-fees');
};