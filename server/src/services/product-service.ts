import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price_kobo: number;
  category_id: string | null;
  category_name?: string | null;
  created_at: string;
  updated_at: string;
}

export const listProducts = async (): Promise<ProductDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,description,image_url,price_kobo,category_id,created_at,updated_at,categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch products: ${error.message}`, 500, 'PRODUCT_FETCH_FAILED');
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.image_url,
    price_kobo: row.price_kobo,
    category_id: row.category_id,
    category_name: row.categories?.name ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
};

export const getProductById = async (id: string): Promise<ProductDTO> => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,description,image_url,price_kobo,category_id,created_at,updated_at,categories(name)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch product: ${error.message}`, 500, 'PRODUCT_FETCH_FAILED');
  }

  if (!data) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    image_url: data.image_url,
    price_kobo: data.price_kobo,
    category_id: data.category_id,
    category_name: (data as any).categories?.name ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};
