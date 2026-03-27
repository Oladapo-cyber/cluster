import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface CreateOrderInput {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface CreateOrderResult {
  id: string;
  total_kobo: number;
  status: string;
  payment_reference: string;
}

const generateReference = (): string => `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const createOrder = async (payload: CreateOrderInput): Promise<CreateOrderResult> => {
  if (payload.items.length === 0) {
    throw new AppError('Order must include at least one item', 400, 'EMPTY_ORDER');
  }

  const productIds = payload.items.map((item) => item.product_id);

  const { data: products, error: productError } = await supabaseAdmin
    .from('products')
    .select('id, price_kobo')
    .in('id', productIds);

  if (productError) {
    throw new AppError(`Failed to validate products: ${productError.message}`, 500, 'PRODUCT_VALIDATION_FAILED');
  }

  const priceMap = new Map<string, number>((products ?? []).map((product: any) => [product.id, product.price_kobo]));

  let total_kobo = 0;
  const orderItems = payload.items.map((item) => {
    const unitPrice = priceMap.get(item.product_id);
    if (unitPrice === undefined) {
      throw new AppError(`Invalid product id: ${item.product_id}`, 400, 'INVALID_PRODUCT');
    }
    total_kobo += unitPrice * item.quantity;
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_kobo: unitPrice,
    };
  });

  const payment_reference = generateReference();

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_email: payload.customer_email,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      delivery_address: payload.delivery_address,
      total_kobo,
      status: 'pending_payment',
      payment_reference,
    })
    .select('id,total_kobo,status,payment_reference')
    .single();

  if (orderError || !order) {
    throw new AppError(`Failed to create order: ${orderError?.message ?? 'unknown error'}`, 500, 'ORDER_CREATE_FAILED');
  }

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
    orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    })),
  );

  if (itemsError) {
    throw new AppError(`Failed to save order items: ${itemsError.message}`, 500, 'ORDER_ITEMS_CREATE_FAILED');
  }

  return {
    id: order.id,
    total_kobo: order.total_kobo,
    status: order.status,
    payment_reference: order.payment_reference,
  };
};

export const markOrderPaid = async (payment_reference: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: 'paid' })
    .eq('payment_reference', payment_reference)
    .neq('status', 'paid');

  if (error) {
    throw new AppError(`Failed to update order status: ${error.message}`, 500, 'ORDER_STATUS_UPDATE_FAILED');
  }
};
