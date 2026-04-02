import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const listCategories = async (): Promise<CategoryDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id,name,slug,description,created_at,updated_at')
    .order('name', { ascending: true });

  if (error) {
    throw new AppError(`Failed to fetch categories: ${error.message}`, 500, 'CATEGORY_FETCH_FAILED');
  }

  return (data ?? []) as CategoryDTO[];
};