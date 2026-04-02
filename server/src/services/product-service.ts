import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  image_url: string | null;
  price_kobo: number;
  category_id: string | null;
  category_name?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string | undefined;
  description?: string | null | undefined;
  full_description?: string | null | undefined;
  image_url?: string | null | undefined;
  price_kobo: number;
  category_id?: string | null | undefined;
  is_active?: boolean | undefined;
}

export interface UpdateProductInput {
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | null | undefined;
  full_description?: string | null | undefined;
  image_url?: string | null | undefined;
  price_kobo?: number | undefined;
  category_id?: string | null | undefined;
  is_active?: boolean | undefined;
}

const mapProduct = (row: any): ProductDTO => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  full_description: row.full_description,
  image_url: row.image_url,
  price_kobo: row.price_kobo,
  category_id: row.category_id,
  category_name: row.categories?.name ?? null,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const listProducts = async (): Promise<ProductDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,description,full_description,image_url,price_kobo,category_id,is_active,created_at,updated_at,categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch products: ${error.message}`, 500, 'PRODUCT_FETCH_FAILED');
  }

  return (data ?? []).map(mapProduct);
};

export const getProductById = async (id: string): Promise<ProductDTO> => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,description,full_description,image_url,price_kobo,category_id,is_active,created_at,updated_at,categories(name)')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch product: ${error.message}`, 500, 'PRODUCT_FETCH_FAILED');
  }

  if (!data) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  return mapProduct(data);
};

export const listProductsAdmin = async (): Promise<ProductDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,description,full_description,image_url,price_kobo,category_id,is_active,created_at,updated_at,categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch products: ${error.message}`, 500, 'PRODUCT_FETCH_FAILED');
  }

  return (data ?? []).map(mapProduct);
};

export const getProductByIdAdmin = async (id: string): Promise<ProductDTO> => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,description,full_description,image_url,price_kobo,category_id,is_active,created_at,updated_at,categories(name)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch product: ${error.message}`, 500, 'PRODUCT_FETCH_FAILED');
  }

  if (!data) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  return mapProduct(data);
};

export const createProduct = async (input: CreateProductInput): Promise<ProductDTO> => {
  const slug = input.slug?.trim() || slugify(input.name);

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name: input.name.trim(),
      slug,
      description: input.description ?? null,
      full_description: input.full_description ?? null,
      image_url: input.image_url ?? null,
      price_kobo: input.price_kobo,
      category_id: input.category_id ?? null,
      is_active: input.is_active ?? true,
    })
    .select('id,name,slug,description,full_description,image_url,price_kobo,category_id,is_active,created_at,updated_at,categories(name)')
    .single();

  if (error || !data) {
    if (error?.code === '23505') {
      throw new AppError('A product with that slug already exists', 409, 'PRODUCT_SLUG_EXISTS');
    }

    throw new AppError(`Failed to create product: ${error?.message ?? 'unknown error'}`, 500, 'PRODUCT_CREATE_FAILED');
  }

  return mapProduct(data);
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<ProductDTO> => {
  const updatePayload: Record<string, unknown> = {};

  if (input.name !== undefined) {
    updatePayload.name = input.name.trim();
  }

  if (input.slug !== undefined) {
    updatePayload.slug = input.slug.trim() || slugify(input.name ?? '');
  }

  if (input.description !== undefined) {
    updatePayload.description = input.description;
  }

  if (input.full_description !== undefined) {
    updatePayload.full_description = input.full_description;
  }

  if (input.image_url !== undefined) {
    updatePayload.image_url = input.image_url;
  }

  if (input.price_kobo !== undefined) {
    updatePayload.price_kobo = input.price_kobo;
  }

  if (input.category_id !== undefined) {
    updatePayload.category_id = input.category_id;
  }

  if (input.is_active !== undefined) {
    updatePayload.is_active = input.is_active;
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updatePayload)
    .eq('id', id)
    .select('id,name,slug,description,full_description,image_url,price_kobo,category_id,is_active,created_at,updated_at,categories(name)')
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      throw new AppError('A product with that slug already exists', 409, 'PRODUCT_SLUG_EXISTS');
    }

    throw new AppError(`Failed to update product: ${error.message}`, 500, 'PRODUCT_UPDATE_FAILED');
  }

  if (!data) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  return mapProduct(data);
};

export const archiveProduct = async (id: string): Promise<ProductDTO> => updateProduct(id, { is_active: false });
