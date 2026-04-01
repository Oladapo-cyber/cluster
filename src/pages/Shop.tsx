import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { CATEGORIES, filterProducts, type Category } from '../data/products';

const Shop = () => {
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Filter products based on category and search query using centralized data
  const filteredProducts = filterProducts(searchQuery, activeFilter);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16 px-4 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#101828] mb-3">
              Our Test Kits
            </h1>
            <p className="font-body text-base text-[#575151]">
              Professional-grade diagnostic tests for home use
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-[#F5F5F5] border-none focus:outline-none focus:ring-2 focus:ring-[#45AAB8] font-body text-sm lg:text-base"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="bg-[#F5F5F5] rounded-2xl px-3 py-2 mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-2 rounded-xl font-body text-sm lg:text-base cursor-pointer font-bold transition-all whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-[#D1FAE5] text-[#101828]'
                      : 'bg-transparent text-[#575151] hover:bg-[#D1FAE5]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl overflow-hidden border border-[#E4E1E1] hover:shadow-md transition-shadow flex flex-col min-h-[450px] cursor-pointer"
              >
                <div className="bg-[#EDEDED] aspect-[16/10] overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.title} test kit`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Product Info - Flex grow to push button to bottom */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-body text-xl font-bold text-[#000000] mb-2">
                    {product.title}
                  </h3>
                  <p className="font-body text-sm text-[#4B5563] mb-4 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  {/* Price Button - Always at bottom */}
                  {product.available ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.title,
                          price: product.price,
                          image: product.image
                        });
                      }}
                      className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-body font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between mt-auto"
                    >
                      <span className="text-base">{product.price}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-full bg-gray-200 text-gray-600 font-body font-semibold py-3 px-4 rounded-lg text-center mt-auto">
                      {product.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-lg text-[#575151]">
                No test kits match your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
