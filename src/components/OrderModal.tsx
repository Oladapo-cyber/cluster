import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ApiError } from '../services/api';
import { createCheckoutOrder, fetchPaystackPublicKey, verifyPaystackPayment } from '../services/checkout';
import { launchPaystackCheckout } from '../services/paystack';
import { fetchProducts } from '../services/products';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    address: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const priceStr = String(item.price).replace(/[^0-9.]/g, '');
    const price = parseFloat(priceStr);
    return acc + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);
  const formattedTotal = `₦${subtotal.toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Add at least one item before checkout.');
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);

    setIsLoading(true);

    try {
      const productCatalog = await fetchProducts();
      const backendIdBySlug = new Map(
        productCatalog
          .filter((product) => Boolean(product.backendId))
          .map((product) => [product.id, product.backendId as string]),
      );

      const orderItems = items.map((item) => {
        const fallbackBackendId = backendIdBySlug.get(String(item.id));
        const productId = item.backendProductId ?? fallbackBackendId;

        if (!productId) {
          throw new Error(
            `Could not sync product ID for "${item.name}". Please refresh products and try checkout again.`,
          );
        }

        return {
          product_id: productId,
          quantity: item.quantity,
        };
      });

      const order = await createCheckoutOrder({
        customer_email: formData.email.trim(),
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        delivery_address: `${formData.address.trim()}, Lagos ${formData.location}`,
        items: orderItems,
      });

      const publicKey = await fetchPaystackPublicKey();
      const paymentResult = await launchPaystackCheckout({
        publicKey,
        email: formData.email.trim(),
        amountKobo: order.total_kobo,
        reference: order.payment_reference,
        firstName: formData.fullName.trim(),
      });

      if (paymentResult.status === 'cancelled') {
        setInfoMessage('Payment was cancelled. Your order is pending payment and can be retried.');
        return;
      }

      const verification = await verifyPaystackPayment(paymentResult.reference);
      if (!verification.paid) {
        setErrorMessage('Payment could not be verified. Please contact support with your transaction reference.');
        return;
      }

      clearCart();
      onClose();
      navigate(`/checkout/success?reference=${encodeURIComponent(verification.reference)}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Checkout failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const itemSummary = items.map(i => i.name).join(', ');

  return createPortal(
    <div className="fixed inset-0 z-[110] overflow-y-auto outline-none focus:outline-none" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-6 md:p-8 animate-in fade-in zoom-in duration-200 z-10 my-8">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-heading text-[#101828]">Order Details</h2>
              <div className="w-12 h-1 bg-[#101828] mt-1 rounded-full"></div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Items Summary */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Items:</label>
              <p className="text-sm text-gray-500 font-body leading-relaxed">{itemSummary}</p>
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Total Price:</label>
              <p className="text-xl font-bold text-gray-900 font-body">{formattedTotal}</p>
            </div>

            {/* Delivery Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#101828] pt-2">Delivery Info:</h3>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {infoMessage && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {infoMessage}
                </div>
              )}
              
              <input
                type="text"
                required
                placeholder="Enter your Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent outline-none transition-all font-body text-sm"
              />

              <input
                type="tel"
                required
                placeholder="Enter your Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent outline-none transition-all font-body text-sm"
              />

              <input
                type="email"
                required
                placeholder="Enter your Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent outline-none transition-all font-body text-sm"
              />

              <div className="relative">
                <select
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent outline-none transition-all font-body text-sm appearance-none bg-white font-normal text-gray-500"
                >
                  <option value="" disabled>Lagos Mainland Or Island</option>
                  <option value="Mainland">Lagos Mainland</option>
                  <option value="Island">Lagos Island</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <input
                type="text"
                required
                placeholder="Enter your delivery address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent outline-none transition-all font-body text-sm"
              />
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#93C5FD] hover:bg-[#60A5FA] text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Pay'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderModal;
