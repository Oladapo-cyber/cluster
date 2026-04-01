import { useState, useEffect } from 'react';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    slug: string;
    title: string;
    price: string;
    image?: string;
    description: string;
    fullDescription?: string;
    instruction?: string;
    faq?: string;
  } | null;
}

const ProductDetailsModal = ({ isOpen, onClose, product }: ProductDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('details');

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

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-white/30 transition-all"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Left: Product Image */}
              <div className="bg-[#EDEDED] aspect-square rounded-xl overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`${product.title} test kit`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-xs">
                        <p className="text-lg font-bold text-gray-700 mb-2 font-body">
                          {product.title}
                        </p>
                        <p className="text-sm text-gray-500 font-body">Image coming soon</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Product Info */}
              <div className="flex flex-col">
                <h2 className="font-body text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
                  {product.title}
                </h2>
                <p className="font-body text-2xl font-semibold text-[#45AAB8] mb-6">
                  {product.price}
                </p>
                <p className="font-body text-base text-[#4B5563] mb-8 leading-relaxed">
                  {product.fullDescription ||product.description}
                </p>
                <button className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-body font-semibold py-3 px-6 rounded-xl transition-colors">
                  Add to cart
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-2 rounded-lg font-body font-semibold transition-colors ${
                    activeTab === 'details'
                      ? 'bg-[#E6F4F6] text-[#2276A0]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('instruction')}
                  className={`px-6 py-2 rounded-lg font-body font-semibold transition-colors ${
                    activeTab === 'instruction'
                      ? 'bg-[#E6F4F6] text-[#2276A0]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Instruction
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-6 py-2 rounded-lg font-body font-semibold transition-colors ${
                    activeTab === 'faq'
                      ? 'bg-[#E6F4F6] text-[#2276A0]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  FAQ
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === 'details' && (
                  <div className="font-body text-base text-[#4B5563] leading-relaxed">
                    <p>{product.fullDescription || product.description}</p>
                  </div>
                )}
                {activeTab === 'instruction' && (
                  <div className="font-body text-base text-[#4B5563] leading-relaxed">
                    <p>{product.instruction || 'Instructions for this product will be provided.'}</p>
                  </div>
                )}
                {activeTab === 'faq' && (
                  <div className="font-body text-base text-[#4B5563] leading-relaxed">
                    <p>{product.faq || 'Frequently asked questions for this product will be provided.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
