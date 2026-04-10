import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { submitClustaCareResult } from '../services/admin';
import { getCareProductByQrCode } from '../data/products';

const CARE_YOUTUBE_VIDEO_URL = 'https://youtu.be/tMUPNCR35h0?si=neeR7ErupAJcBxuB';

const toYouTubeEmbedUrl = (url: string): string | null => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const host = parsedUrl.hostname.replace('www.', '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsedUrl.pathname.startsWith('/embed/')) {
        const videoId = parsedUrl.pathname.split('/').filter(Boolean)[1];
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : null;
      }

      const watchVideoId = parsedUrl.searchParams.get('v');
      if (watchVideoId) {
        return `https://www.youtube-nocookie.com/embed/${watchVideoId}?rel=0`;
      }
    }

    if (host === 'youtu.be') {
      const shortVideoId = parsedUrl.pathname.replace('/', '').trim();
      return shortVideoId ? `https://www.youtube-nocookie.com/embed/${shortVideoId}?rel=0` : null;
    }
  } catch {
    return null;
  }

  return null;
};

const ClustaCare = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    testResult: '',
    whatsappNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const scannedProduct = getCareProductByQrCode(searchParams.get('product'));
  const scannedProductId = searchParams.get('product');
  const isCareQrVisit = searchParams.get('v')?.trim().toLowerCase() === 'care';
  const productVideoEmbedUrl = toYouTubeEmbedUrl(CARE_YOUTUBE_VIDEO_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitClustaCareResult({
        test_result: formData.testResult as 'positive' | 'negative' | 'invalid',
        whatsapp_number: formData.whatsappNumber.trim() || undefined,
      });
      toast.success('Thank you for submitting your result!');
      setFormData({ testResult: '', whatsappNumber: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit result');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16 px-4 lg:py-20">
        {/* Hero Section */}
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            {/* QR Code Icon */}
            <div className="flex justify-center mb-6">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 80 80" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#45AAB8]"
              >
                <rect x="8" y="8" width="28" height="28" fill="currentColor"/>
                <rect x="44" y="8" width="28" height="28" fill="currentColor"/>
                <rect x="8" y="44" width="28" height="28" fill="currentColor"/>
                <rect x="16" y="16" width="12" height="12" fill="white"/>
                <rect x="52" y="16" width="12" height="12" fill="white"/>
                <rect x="16" y="52" width="12" height="12" fill="white"/>
                <rect x="44" y="44" width="10" height="10" fill="currentColor"/>
                <rect x="58" y="44" width="6" height="6" fill="currentColor"/>
                <rect x="44" y="58" width="6" height="6" fill="currentColor"/>
                <rect x="58" y="58" width="14" height="14" fill="currentColor"/>
              </svg>
            </div>
            
            <h1 className="font-body text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
              Your Clusta Care Page
            </h1>
            <p className="font-body text-base text-[#4B5563] max-w-2xl mx-auto">
              Scan the QR code on your test kit or access your test information here
            </p>
          </div>

          {/* Two-Card Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Card - Scanned Product */}
            <div className="bg-white rounded-2xl border border-[#E4E1E1] shadow-lg p-8 min-h-[400px] flex flex-col justify-between">
              {scannedProduct ? (
                <div>
                  <div className="mb-5">
                    <span className="inline-flex items-center rounded-full bg-[#E6F4F6] px-3 py-1 text-xs font-semibold text-[#2F8E9B]">
                      QR scanned product
                    </span>
                    <h2 className="mt-3 font-body text-2xl font-bold text-[#000000]">
                      {scannedProduct.title}
                    </h2>
                  </div>

                  <div className="mb-5 overflow-hidden rounded-2xl bg-[#F5F5F5]">
                    {productVideoEmbedUrl ? (
                      <iframe
                        src={productVideoEmbedUrl}
                        title={`${scannedProduct.title} how it works video`}
                        className="h-56 w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={scannedProduct.image}
                        alt={`${scannedProduct.title} test kit`}
                        className="h-56 w-full object-cover"
                      />
                    )}
                  </div>

                  <p className="font-body text-base leading-relaxed text-[#4B5563]">
                    {scannedProduct.description}
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center">
                  {/* Blood Drop Icon */}
                  <div className="mb-6">
                    <svg 
                      width="120" 
                      height="140" 
                      viewBox="0 0 120 140" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M60 10C60 10 20 50 20 85C20 110.405 40.595 131 60 131C79.405 131 100 110.405 100 85C100 50 60 10 60 10Z" 
                        stroke="#3B82F6" 
                        strokeWidth="3" 
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div className={scannedProduct ? 'mt-8' : 'mt-6 flex flex-col items-center'}>
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#45AAB8] text-[#45AAB8] rounded-xl font-body font-semibold hover:bg-[#45AAB8] hover:text-white transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Watch How It Works
                </button>

                {scannedProductId && !scannedProduct && isCareQrVisit && (
                  <p className="mt-4 text-sm text-[#B45309]">
                    We could not match product ID {scannedProductId} to a kit.
                  </p>
                )}
              </div>
            </div>

            {/* Right Card - Submit Form */}
            <div className="bg-white rounded-2xl border border-[#E4E1E1] shadow-lg p-8">
              <h2 className="font-body text-2xl font-bold text-[#000000] mb-3">
                Submit Your Result
              </h2>
              <p className="font-body text-base text-[#4B5563] mb-6">
                {scannedProduct
                  ? `You are submitting a result for ${scannedProduct.title}.`
                  : 'Share your test result to help improve our products and services'}
              </p>

              {scannedProduct && (
                <div className="mb-6 rounded-xl border border-[#D9EEF1] bg-[#F4FBFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2F8E9B] mb-1">
                    Scanned kit
                  </p>
                  <p className="font-body text-base font-bold text-[#000000]">
                    {scannedProduct.title}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Test Result Dropdown */}
                <div className="mb-6">
                  <label className="block font-body text-sm font-medium text-[#4B5563] mb-2">
                    Test Result
                  </label>
                  <select
                    value={formData.testResult}
                    onChange={(e) => setFormData({ ...formData, testResult: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-body text-base text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                    required
                  >
                    <option value="">Select result</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="invalid">Invalid</option>
                  </select>
                </div>

                {/* WhatsApp Number Input */}
                <div className="mb-6">
                  <label className="block font-body text-sm font-medium text-[#4B5563] mb-2">
                    WhatsApp Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="e.g 080 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-body text-base text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                  />
                </div>

                {/* Privacy Note Box */}
                <div className="bg-[#E6F4F6] rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    {/* Shield Icon */}
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-[#3B82F6] flex-shrink-0 mt-0.5"
                    >
                      <path 
                        d="M12 2L4 6V12C4 16.55 7.16 20.74 12 22C16.84 20.74 20 16.55 20 12V6L12 2Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="none"
                      />
                    </svg>
                    <div>
                      <h3 className="font-body text-sm font-bold text-[#000000] mb-1">
                        Privacy Note
                      </h3>
                      <p className="font-body text-sm text-[#4B5563]">
                        Your data remains completely anonymous and is used only for product improvement.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="font-body text-xs text-[#4B5563] mb-6">
                  Only provide if you want updates. Clearly marked as optional.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-3 px-6 rounded-xl font-body font-semibold transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit My Result'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClustaCare;
