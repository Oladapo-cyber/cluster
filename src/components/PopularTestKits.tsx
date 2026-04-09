import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORIES, PRODUCTS, type Category, type Product } from '../data/products';
import { fetchFeaturedProducts } from '../services/products';

const PopularTestKits = () => {
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    void fetchFeaturedProducts(activeFilter).then((nextProducts) => {
      if (isMounted) {
        setProducts(nextProducts);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  const displayProducts = activeFilter === 'All'
    ? products.slice(0, 3)
    : products.filter((product) => product.categories.includes(activeFilter)).slice(0, 3);

  return (
    <section className="py-16 px-4 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#101828] mb-3">
            Popular Test Kits
          </h2>
          <p className="font-body text-base text-[#575151]">
            Our most trusted and frequently used diagnostic tests
          </p>
        </div>

        {/* Category Filter Pills with Background Container */}
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

        {/* Product Grid - 3 Cards on Desktop, Larger Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-[#E5E7EB] aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={`${product.title} test kit`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Product Info - Larger Padding */}
              <div className="p-6 lg:p-7">
                <h3 className="font-body text-xl lg:text-2xl font-bold text-[#101828] mb-3">
                  {product.title}
                </h3>
                <p className="font-body text-sm lg:text-base text-[#575151] mb-6 leading-relaxed min-h-[3.5rem]">
                  {product.description}
                </p>

                {/* Price and Cart Button Row */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.id,
                      backendProductId: product.backendId,
                      name: product.title,
                      price: product.price,
                      image: product.image
                    });
                  }}
                  className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-body font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between mt-auto"
                  aria-label="Add to cart"
                >
                  <span className="text-base">{product.price}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr className="hidden xs:block md:hidden border-[#E5E7EB] border-2 px-2 mt-6 shadow" />
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/shop')}
            className="bg-[#45AAB8] hover:bg-[#3d98a5] cursor-pointer text-white font-body text-sm lg:text-base font-medium px-10 py-3.5 rounded-xl transition-colors shadow-md"
          >
            View All Test Kits
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTestKits;
