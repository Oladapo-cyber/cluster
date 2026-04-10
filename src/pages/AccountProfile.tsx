import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchMyProfile, updateMyProfile } from '../services/profile';
import { useAuth } from '../context/AuthContext';

const AccountProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    delivery_location: '',
    delivery_address: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const profile = await fetchMyProfile();
        if (!isMounted) {
          return;
        }

        setFormData({
          full_name: profile.full_name ?? '',
          phone: profile.phone ?? '',
          delivery_location: profile.delivery_location ?? '',
          delivery_address: profile.delivery_address ?? '',
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load account details.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const updated = await updateMyProfile({
        full_name: formData.full_name.trim() || null,
        phone: formData.phone.trim() || null,
        delivery_location: formData.delivery_location.trim() || null,
        delivery_address: formData.delivery_address.trim() || null,
      });

      setFormData({
        full_name: updated.full_name ?? '',
        phone: updated.phone ?? '',
        delivery_location: updated.delivery_location ?? '',
        delivery_address: updated.delivery_address ?? '',
      });
      toast.success('Account details updated successfully.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save account details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16 px-4 lg:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#101828]">My Account</h1>
            <p className="mt-2 font-body text-sm lg:text-base text-[#4B5563]">
              Update your profile and delivery information for faster checkout.
            </p>
          </div>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8 shadow-sm">
            {isLoading ? (
              <p className="font-body text-sm text-[#4B5563]">Loading account details...</p>
            ) : (
              <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block mb-2 font-body text-sm font-semibold text-[#101828]">Email</label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 font-body text-sm text-[#667085]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-body text-sm font-semibold text-[#101828]">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, full_name: event.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-body text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#45AAB8]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-body text-sm font-semibold text-[#101828]">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-body text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#45AAB8]"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-body text-sm font-semibold text-[#101828]">Delivery Location</label>
                  <select
                    value={formData.delivery_location}
                    onChange={(event) => setFormData((prev) => ({ ...prev, delivery_location: event.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-body text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#45AAB8]"
                  >
                    <option value="">Select location</option>
                    <option value="Mainland">Lagos Mainland</option>
                    <option value="Island">Lagos Island</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-body text-sm font-semibold text-[#101828]">Delivery Address</label>
                  <textarea
                    value={formData.delivery_address}
                    onChange={(event) => setFormData((prev) => ({ ...prev, delivery_address: event.target.value }))}
                    rows={3}
                    placeholder="Enter your delivery address"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-body text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#45AAB8] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full rounded-lg bg-[#45AAB8] py-3 text-sm font-semibold text-white hover:bg-[#3d98a5] disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountProfile;