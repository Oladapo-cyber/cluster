import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { supabaseAdmin } from '../config/supabase.js';

interface StaticProduct {
  id: string;
  title: string;
  price: string;
  description: string;
  fullDescription: string;
  categories: string[];
  available: boolean;
  image: string;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
}

const STORAGE_BUCKET = 'product-images';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../');
const productsTsPath = path.resolve(repoRoot, 'src/data/products.ts');
const assetsBasePath = path.resolve(repoRoot, 'src/assets');

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const parsePriceToKobo = (priceLabel: string): number => {
  const digits = priceLabel.replace(/[^0-9.]/g, '');
  const naira = Number(digits);
  if (!Number.isFinite(naira)) {
    throw new Error(`Invalid price format: ${priceLabel}`);
  }

  return Math.round(naira * 100);
};

const extractConstArray = (source: string, constName: string): string => {
  const anchor = `export const ${constName}`;
  const start = source.indexOf(anchor);
  if (start === -1) {
    throw new Error(`Unable to locate ${constName} in products.ts`);
  }

  const equalsIndex = source.indexOf('=', start);
  if (equalsIndex === -1) {
    throw new Error(`Unable to parse ${constName} assignment`);
  }

  const openBracket = source.indexOf('[', equalsIndex);
  if (openBracket === -1) {
    throw new Error(`Unable to parse ${constName} array`);
  }

  let depth = 0;
  let end = -1;

  for (let i = openBracket; i < source.length; i += 1) {
    const char = source[i];
    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) {
    throw new Error(`Unable to find end of ${constName} array`);
  }

  return source.slice(openBracket, end + 1);
};

const parseStaticCatalog = async (): Promise<{ products: StaticProduct[]; categories: string[]; imageVarMap: Map<string, string> }> => {
  const source = await fs.readFile(productsTsPath, 'utf8');

  const importPattern = /import\s+(\w+)\s+from\s+'\.\.\/assets\/(.+?)';/g;
  const imageVarMap = new Map<string, string>();
  for (const match of source.matchAll(importPattern)) {
    const variable = match[1];
    const relativeFile = match[2];
    if (!variable || !relativeFile) {
      continue;
    }
    imageVarMap.set(variable, path.resolve(assetsBasePath, relativeFile));
  }

  const categoriesLiteral = extractConstArray(source, 'CATEGORIES');
  const productsLiteral = extractConstArray(source, 'PRODUCTS');

  const sandbox = Object.fromEntries(imageVarMap.entries());
  const categories = vm.runInNewContext(categoriesLiteral, sandbox) as string[];
  const products = vm.runInNewContext(productsLiteral, sandbox) as StaticProduct[];

  return { products, categories, imageVarMap };
};

const ensureBucket = async (): Promise<boolean> => {
  const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
  if (error) {
    console.warn(`Storage disabled for this run: ${error.message}`);
    return false;
  }

  const exists = buckets.some((bucket) => bucket.name === STORAGE_BUCKET);
  if (exists) {
    return true;
  }

  const { error: createError } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  });

  if (createError) {
    console.warn(`Storage disabled for this run: ${createError.message}`);
    return false;
  }

  return true;
};

const uploadProductImage = async (
  productSlug: string,
  localFilePath: string,
  canUseStorage: boolean,
): Promise<string | null> => {
  if (!canUseStorage) {
    return null;
  }

  try {
    const fileBuffer = await fs.readFile(localFilePath);
    const ext = path.extname(localFilePath).toLowerCase();
    const contentType =
      ext === '.avif'
        ? 'image/avif'
        : ext === '.jpg' || ext === '.jpeg'
          ? 'image/jpeg'
          : 'application/octet-stream';

    const objectPath = `${productSlug}${ext || '.avif'}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, fileBuffer, { contentType, upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
    return data.publicUrl;
  } catch (error) {
    console.warn(`Image upload skipped for ${productSlug}: ${(error as Error).message}`);
    return null;
  }
};

const upsertCategories = async (categories: string[]): Promise<Map<string, CategoryRow>> => {
  const dbCategories = categories
    .filter((category) => category !== 'All')
    .map((name) => ({
      name,
      slug: slugify(name),
      description: `${name} diagnostics category`,
    }));

  if (dbCategories.length > 0) {
    const { error } = await supabaseAdmin.from('categories').upsert(dbCategories, { onConflict: 'slug' });
    if (error) {
      throw new Error(`Failed to upsert categories: ${error.message}`);
    }
  }

  const { data, error } = await supabaseAdmin.from('categories').select('id,name,slug');
  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categoryMap = new Map<string, CategoryRow>();
  (data ?? []).forEach((row) => {
    categoryMap.set(row.name, row as CategoryRow);
  });
  return categoryMap;
};

const run = async (): Promise<void> => {
  const { products, categories } = await parseStaticCatalog();
  const canUseStorage = await ensureBucket();

  const categoryMap = await upsertCategories(categories);

  for (const product of products) {
    const primaryCategoryName = product.categories[0] ?? null;
    const categoryId = primaryCategoryName ? categoryMap.get(primaryCategoryName)?.id ?? null : null;
    const imageUrl = product.image ? await uploadProductImage(product.id, product.image, canUseStorage) : null;

    const payload = {
      name: product.title,
      slug: product.id,
      description: product.description,
      full_description: product.fullDescription,
      image_url: imageUrl,
      price_kobo: parsePriceToKobo(product.price),
      category_id: categoryId,
      is_active: product.available,
    };

    const { error } = await supabaseAdmin.from('products').upsert(payload, { onConflict: 'slug' });
    if (error) {
      throw new Error(`Failed to upsert product ${product.id}: ${error.message}`);
    }

    console.log(`Seeded ${product.id}`);
  }

  console.log(`Seed complete. Processed ${products.length} products.`);
  if (!canUseStorage) {
    console.log('Seed completed without storage uploads. image_url values may be null.');
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});