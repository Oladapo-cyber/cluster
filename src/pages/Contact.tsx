import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-16 px-4 lg:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="font-body text-3xl lg:text-4xl font-bold text-[#101828] mb-4">
              Get in Touch
            </h1>
            <p className="font-body text-base lg:text-lg text-[#4B5563]">
              Have questions? We're here to help you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="font-body text-xl font-bold text-[#101828] mb-2">
                  Send us a message
                </h2>
                <p className="font-body text-sm text-[#4B5563]">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body text-sm font-semibold text-[#101828] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 font-body text-sm text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-semibold text-[#101828] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@gmail.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 font-body text-sm text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body text-sm font-semibold text-[#101828] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 font-body text-sm text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-3.5 px-6 rounded-lg font-body text-sm font-bold transition-colors shadow-sm"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              {/* Order Inquiry Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#45AAB8] mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-body text-base font-bold text-[#101828] mb-2">
                      Order Inquiry
                    </h3>
                    <p className="font-body text-sm text-[#4B5563] mb-3 leading-relaxed">
                      Questions about products, shipping, or your order? Contact our support team.
                    </p>
                    <a href="mailto:support@clusta.com" className="font-body text-sm font-medium text-[#45AAB8] hover:underline">
                      support@clusta.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Partner With Us Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#45AAB8] mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-body text-base font-bold text-[#101828] mb-2">
                      Partner With Us
                    </h3>
                    <p className="font-body text-sm text-[#4B5563] mb-3 leading-relaxed">
                      Interested in becoming a distributor or healthcare partner?
                    </p>
                    <a href="mailto:partnerships@clusta.com" className="font-body text-sm font-medium text-[#45AAB8] hover:underline">
                      partnerships@clusta.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Press & Collaboration Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#45AAB8] mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-body text-base font-bold text-[#101828] mb-2">
                      Press & Collaboration
                    </h3>
                    <p className="font-body text-sm text-[#4B5563] mb-3 leading-relaxed">
                      Media inquiries, research collaborations, and press releases.
                    </p>
                    <a href="mailto:press@clusta.com" className="font-body text-sm font-medium text-[#45AAB8] hover:underline">
                      press@clusta.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick FAQ Card */}
              <div className="bg-[#EFF8FF] rounded-2xl border border-blue-100 p-6">
                <h3 className="font-body text-base font-bold text-[#101828] mb-3">
                  Quick FAQ
                </h3>
                <p className="font-body text-sm text-[#4B5563] mb-4 leading-relaxed">
                  Looking for quick answers? Check out our FAQ section before reaching out.
                </p>
                <button className="bg-white hover:bg-gray-50 text-[#101828] border border-gray-200 py-2 px-4 rounded-lg font-body text-sm font-medium transition-colors">
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
