import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClustaCare = () => {
  const [formData, setFormData] = useState({
    testResult: '',
    whatsappNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    toast.success('Thank you for submitting your result!');
    // Reset form
    setFormData({ testResult: '', whatsappNumber: '' });
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
            {/* Left Card - How It Works */}
            <div className="bg-white rounded-2xl border border-[#E4E1E1] shadow-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
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
              
              {/* Button */}
              <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#45AAB8] text-[#45AAB8] rounded-xl font-body font-semibold hover:bg-[#45AAB8] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
                Watch How It Works
              </button>
            </div>

            {/* Right Card - Submit Form */}
            <div className="bg-white rounded-2xl border border-[#E4E1E1] shadow-lg p-8">
              <h2 className="font-body text-2xl font-bold text-[#000000] mb-3">
                Submit Your Result
              </h2>
              <p className="font-body text-base text-[#4B5563] mb-6">
                Share your test result to help improve our products and services
              </p>

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
                  className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-3 px-6 rounded-xl font-body font-semibold transition-colors"
                >
                  Submit My Result
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
