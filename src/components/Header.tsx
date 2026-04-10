import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import CartPopover from './CartPopover';
import OrderModal from './OrderModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import clustaLogo from '../assets/clustalogo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const handleOrderClick = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Clusta Care', href: '/clusta-care' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1306px]">
        <div className="flex items-center justify-between h-[52px] lg:h-[80px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" aria-label="Clusta home" className="inline-flex items-center">
              <img
                src={clustaLogo}
                alt="Clusta"
                className="h-8 w-auto lg:h-12"
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-[30px]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-body text-[16px] font-normal transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#45AAB8]' 
                    : 'text-[#484A4A] hover:text-[#45AAB8]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/account"
                  className={`font-body text-[16px] font-normal transition-colors ${
                    location.pathname === '/account'
                      ? 'text-[#45AAB8]'
                      : 'text-[#484A4A] hover:text-[#45AAB8]'
                  }`}
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    void logout();
                  }}
                  className="font-body text-[16px] font-normal text-[#484A4A] hover:text-[#45AAB8] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="font-body text-[16px] font-normal text-[#484A4A] hover:text-[#45AAB8] transition-colors"
              >
                Login
              </button>
            )}
          </nav>

          {/* Cart Icon, Login & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <div className="relative">
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 relative hover:bg-gray-100 rounded-full transition-colors" 
                aria-label="Shopping cart"
              >
                <svg className="w-6 h-6 text-[#484A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#45AAB8] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                    {itemCount}
                  </span>
                )}
              </button>
              <CartPopover 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                onOrder={handleOrderClick}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-[#484A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - 2 Row Grid Layout */}
        {isMenuOpen && (
          <nav className="lg:hidden pt-4 pb-6 border-t border-gray-200">
            {/* Row 1: Home, Shop, Clusta Care */}
            <div className="flex justify-center items-center gap-8 mb-6">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-body text-[16px] font-normal text-[#2276A0] hover:opacity-70 transition-opacity"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Row 2: About, Contact */}
            <div className="flex justify-center items-center gap-8">
              {navLinks.slice(3, 5).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-body text-[16px] font-normal text-[#2276A0] hover:opacity-70 transition-opacity"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="mt-6 flex justify-center items-center gap-6">
                <Link
                  to="/account"
                  className="font-body text-[16px] font-semibold text-[#2276A0] hover:opacity-70 transition-opacity"
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    void logout();
                    setIsMenuOpen(false);
                  }}
                  className="font-body text-[16px] font-semibold text-[#2276A0] hover:opacity-70 transition-opacity"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="font-body text-[16px] font-semibold text-[#2276A0] hover:opacity-70 transition-opacity"
                >
                  Login
                </button>
              </div>
            )}
          </nav>
        )}

        {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
      </div>
    </header>
  );
};

export default Header;
