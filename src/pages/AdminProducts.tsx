import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchCategories,
  fetchAdminProducts,
  type CategoryDTO,
  type ProductDTO,
  updateAdminProduct,
} from '../services/products';

const ENV_ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY;

interface ProductFormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  full_description: string;
  image_url: string;
  price_kobo: string;
  category_id: string;
  is_active: boolean;
}

const defaultFormState: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  full_description: '',
  image_url: '',
  price_kobo: '',
  category_id: '',
  is_active: true,
};

const requestArchiveConfirmation = (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastId = toast.custom(
      () => (
        <div className="w-[340px] rounded-lg border border-amber-300 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-[#111827]">Archive {name}?</p>
          <p className="mt-1 text-xs text-[#4B5563]">This product will be hidden from shoppers.</p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              Archive
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  });
};

const AdminProducts = () => {
  const [isAuthorized, setIsAuthorized] = useState(Boolean(localStorage.getItem('admin_api_key') || ENV_ADMIN_KEY));
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(defaultFormState);

  const isEditing = Boolean(form.id);

  const categoriesById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const loadProducts = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load products';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      void loadProducts();
      void fetchCategories().then(setCategories).catch(() => {
        // Keep the rest of the dashboard usable if categories endpoint fails.
      });
    }
  }, [isAuthorized]);

  const formatNaira = (priceKobo: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(priceKobo / 100);
  };

  const startEdit = (product: ProductDTO) => {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      full_description: product.full_description ?? '',
      image_url: product.image_url ?? '',
      price_kobo: String(product.price_kobo),
      category_id: product.category_id ?? '',
      is_active: product.is_active,
    });
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setErrorMessage(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const parsedPrice = Number(form.price_kobo);
    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Price must be a whole number in kobo. Example: 17000');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      full_description: form.full_description.trim() || null,
      image_url: form.image_url.trim() || null,
      price_kobo: parsedPrice,
      category_id: form.category_id.trim() || null,
      is_active: form.is_active,
    };

    try {
      if (form.id) {
        await updateAdminProduct(form.id, payload);
      } else {
        await createAdminProduct(payload);
      }

      await loadProducts();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: ProductDTO) => {
    const shouldDelete = await requestArchiveConfirmation(product.name);
    if (!shouldDelete) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await deleteAdminProduct(product.id);
      await loadProducts();
      if (form.id === product.id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to archive product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (product: ProductDTO) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await updateAdminProduct(product.id, { is_active: !product.is_active });
      await loadProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const authorize = () => {
    if (!adminKeyInput.trim()) {
      setErrorMessage('Enter the admin API key to continue.');
      return;
    }

    localStorage.setItem('admin_api_key', adminKeyInput.trim());
    setIsAuthorized(true);
    setErrorMessage(null);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16 px-4">
          <div className="max-w-xl mx-auto border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h1 className="font-heading text-3xl font-bold text-[#101828] mb-3">Admin Access</h1>
            <p className="font-body text-[#575151] mb-6">Enter your admin API key to manage products.</p>
            <input
              type="password"
              value={adminKeyInput}
              onChange={(event) => setAdminKeyInput(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-4"
              placeholder="Admin API key"
            />
            {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
            <button
              onClick={authorize}
              className="w-full bg-[#45AAB8] text-white py-3 rounded-lg font-semibold hover:bg-[#3d98a5]"
            >
              Unlock Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!localStorage.getItem('admin_api_key') && !ENV_ADMIN_KEY) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-10 px-4 lg:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-3xl font-bold text-[#101828]">Admin Product Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('admin_api_key');
                setIsAuthorized(false);
              }}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
            >
              Lock
            </button>
          </div>

          {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
            <section className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[860px]">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-[#101828]">Name</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[#101828]">Slug</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[#101828]">Price</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[#101828]">Category</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[#101828]">Active</th>
                      <th className="px-4 py-3 text-sm font-semibold text-[#101828]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td className="px-4 py-6 text-sm text-gray-500" colSpan={6}>
                          Loading products...
                        </td>
                      </tr>
                    )}
                    {!isLoading && products.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-sm text-gray-500" colSpan={6}>
                          No products found.
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-100 align-top">
                          <td className="px-4 py-3 text-sm text-[#101828] font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.slug}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatNaira(product.price_kobo)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {product.category_name ?? categoriesById.get(product.category_id ?? '')?.name ?? '-'}
                          </td>
                          <td className="px-4 py-3">
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={product.is_active}
                                onChange={() => void handleToggleActive(product)}
                                disabled={isSubmitting}
                              />
                              {product.is_active ? 'Yes' : 'No'}
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(product)}
                                className="px-3 py-1.5 text-xs rounded bg-[#D1FAE5] text-[#101828]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => void handleDelete(product)}
                                className="px-3 py-1.5 text-xs rounded bg-red-100 text-red-700"
                                disabled={isSubmitting}
                              >
                                Archive
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border border-gray-200 rounded-2xl p-5">
              <h2 className="font-heading text-xl font-bold text-[#101828] mb-4">
                {isEditing ? 'Edit Product' : 'Create Product'}
              </h2>
              <form className="space-y-3" onSubmit={(event) => void handleSave(event)}>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Name"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Slug (optional)"
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Price in kobo (e.g. 17000)"
                  value={form.price_kobo}
                  onChange={(event) => setForm((prev) => ({ ...prev, price_kobo: event.target.value }))}
                  required
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Image URL"
                  value={form.image_url}
                  onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
                />
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-20"
                  placeholder="Card description"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
                  placeholder="Full product description"
                  value={form.full_description}
                  onChange={(event) => setForm((prev) => ({ ...prev, full_description: event.target.value }))}
                />
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={form.category_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))}
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                  />
                  Product is active
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#45AAB8] text-white py-2 rounded-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isEditing ? 'Save Changes' : 'Create Product'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-lg border border-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProducts;