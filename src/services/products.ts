import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES, type Category, type Product } from '../data/products';
import { apiRequest } from './api';

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  image_url: string | null;
  price_kobo: number;
  category_id: string | null;
  category_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminProductInput {
  name: string;
  slug?: string;
  description?: string | null;
  full_description?: string | null;
  image_url?: string | null;
  price_kobo: number;
  category_id?: string | null;
  is_active?: boolean;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

const normalizeCategory = (value: string | null): Category[] => {
  if (!value) {
    return [];
  }

  return CATEGORIES.includes(value as Category) ? [value as Category] : [];
};

const mapApiProduct = (product: ProductDTO): Product => ({
  id: product.slug,
  backendId: product.id,
  title: product.name,
  price: currencyFormatter.format(product.price_kobo / 100),
  description: product.description ?? '',
  fullDescription: product.full_description ?? product.description ?? '',
  categories: normalizeCategory(product.category_name),
  available: product.is_active,
  image: product.image_url ?? '',
});

const isFallbackNeeded = (products: ProductDTO[]): boolean => products.length === 0;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const products = await apiRequest<ProductDTO[]>('/products');
    if (isFallbackNeeded(products)) {
      return FALLBACK_PRODUCTS;
    }

    return products.map(mapApiProduct);
  } catch {
    return FALLBACK_PRODUCTS;
  }
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const product = await apiRequest<ProductDTO>(`/products/${id}`);
    return mapApiProduct(product);
  } catch {
    return FALLBACK_PRODUCTS.find((product) => product.id === id);
  }
};

export const fetchFeaturedProducts = async (category: Category = 'All'): Promise<Product[]> => {
  const products = await fetchProducts();

  if (category === 'All') {
    return products.slice(0, 3);
  }

  return products.filter((product) => product.categories.includes(category)).slice(0, 3);
};

export const fetchAdminProducts = async (): Promise<ProductDTO[]> => {
  return apiRequest<ProductDTO[]>('/admin/products');
};

export const createAdminProduct = async (payload: AdminProductInput): Promise<ProductDTO> => {
  return apiRequest<ProductDTO>('/admin/products', {
    method: 'POST',
    body: payload,
  });
};

export const updateAdminProduct = async (id: string, payload: Partial<AdminProductInput>): Promise<ProductDTO> => {
  return apiRequest<ProductDTO>(`/admin/products/${id}`, {
    method: 'PUT',
    body: payload,
  });
};

export const deleteAdminProduct = async (id: string): Promise<ProductDTO> => {
  return apiRequest<ProductDTO>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
};

export const fetchCategories = async (): Promise<CategoryDTO[]> => {
  return apiRequest<CategoryDTO[]>('/categories');
};