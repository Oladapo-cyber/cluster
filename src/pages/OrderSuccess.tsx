import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-16 px-4 lg:py-24">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-9 w-9 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-heading text-3xl font-bold text-[#101828]">Payment Confirmed</h1>
            <p className="mt-3 font-body text-[#475467]">
              Your order has been received and your payment was successfully verified.
            </p>

            {reference && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-[#667085]">Transaction Reference</p>
                <p className="mt-1 break-all font-semibold text-[#101828]">{reference}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/shop"
                className="rounded-lg bg-[#45AAB8] px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-[#3d98a5]"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="rounded-lg border border-[#D0D5DD] px-6 py-3 font-body font-semibold text-[#344054] transition-colors hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;