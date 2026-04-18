import { apiRequest } from './api';

export interface ClustaCareResultDTO {
  id: string;
  test_result: 'positive' | 'negative' | 'invalid';
  whatsapp_number: string | null;
  status: 'new' | 'reviewed' | 'follow_up';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiryDTO {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'spam';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeliveryFeeDTO {
  id: string;
  location: 'Mainland' | 'Island';
  fee_kobo: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderSummaryDTO {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_kobo: number;
  status: string;
  payment_reference: string | null;
  created_at: string;
}

export interface AdminOrderDetailsDTO extends AdminOrderSummaryDTO {
  items: Array<{
    id: string;
    product_id: string;
    product_name: string | null;
    quantity: number;
    unit_price_kobo: number;
  }>;
}

export const fetchAdminResults = async (): Promise<ClustaCareResultDTO[]> => {
  return apiRequest<ClustaCareResultDTO[]>('/admin/results');
};

export const updateAdminResult = async (
  id: string,
  payload: Partial<Pick<ClustaCareResultDTO, 'status' | 'admin_notes'>>,
): Promise<ClustaCareResultDTO> => {
  return apiRequest<ClustaCareResultDTO>(`/admin/results/${id}`, {
    method: 'PUT',
    body: payload,
  });
};

export const fetchAdminOrders = async (): Promise<AdminOrderSummaryDTO[]> => {
  return apiRequest<AdminOrderSummaryDTO[]>('/admin/orders');
};

export const fetchAdminDeliveryFees = async (): Promise<DeliveryFeeDTO[]> => {
  return apiRequest<DeliveryFeeDTO[]>('/admin/delivery-fees');
};

export const updateAdminDeliveryFee = async (payload: {
  location: 'Mainland' | 'Island';
  fee_kobo: number;
}): Promise<DeliveryFeeDTO> => {
  return apiRequest<DeliveryFeeDTO>('/admin/delivery-fees', {
    method: 'PUT',
    body: payload,
  });
};

export const fetchAdminOrderById = async (id: string): Promise<AdminOrderDetailsDTO> => {
  return apiRequest<AdminOrderDetailsDTO>(`/admin/orders/${id}`);
};

export const completeAdminOrder = async (id: string): Promise<AdminOrderSummaryDTO> => {
  return apiRequest<AdminOrderSummaryDTO>(`/admin/orders/${id}/complete`, {
    method: 'PUT',
  });
};

export const fetchAdminContactInquiries = async (): Promise<ContactInquiryDTO[]> => {
  return apiRequest<ContactInquiryDTO[]>('/admin/contact');
};

export const updateAdminContactInquiry = async (
  id: string,
  payload: Partial<Pick<ContactInquiryDTO, 'status' | 'admin_notes'>>,
): Promise<ContactInquiryDTO> => {
  return apiRequest<ContactInquiryDTO>(`/admin/contact/${id}`, {
    method: 'PUT',
    body: payload,
  });
};

export const submitClustaCareResult = async (payload: {
  test_result: 'positive' | 'negative' | 'invalid';
  whatsapp_number?: string;
}): Promise<ClustaCareResultDTO> => {
  return apiRequest<ClustaCareResultDTO>('/clustacare/results', {
    method: 'POST',
    body: payload,
  });
};

export const submitContactInquiry = async (payload: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactInquiryDTO> => {
  return apiRequest<ContactInquiryDTO>('/contact/inquiries', {
    method: 'POST',
    body: payload,
  });
};