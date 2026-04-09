import { Link } from 'react-router-dom';
import clustaLogo from '../assets/footerlogo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Shop', href: '/shop' },
    { name: 'Quiz', href: '/quiz' },
    { name: 'Clusta Care', href: '/clusta-care' },
  ];
  
  const supportLinks = [
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Privacy Policy', href: '#' },
  ];

  return (
    <footer className="bg-[#101828] text-white py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Branding Column */}
          <div>
            <img
              src={clustaLogo}
              alt="Clusta"
              className="block h-12 w-auto mb-4 object-contain brightness-0 invert transition-all duration-300"
              loading="lazy"
              decoding="async"
            />
            <p className="font-body text-sm text-gray-400 leading-relaxed">
              Empowering you to take control of your health with accurate, easy-to-use at-home diagnostic tests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="font-body text-sm text-gray-400 hover:text-[#45AAB8] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-base mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="font-body text-sm text-gray-400 hover:text-[#45AAB8] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body font-semibold text-base mb-4">Newsletter</h4>
            <p className="font-body text-sm text-gray-400 mb-4">
              Stay updated with health tips and new products
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-white/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#45AAB8] transition-colors text-sm"
              />
              <button className="bg-[#45AAB8] text-white px-6 py-2 rounded-lg hover:bg-[#3d98a5] transition-colors text-sm font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="font-body text-sm text-gray-400">
            © {currentYear} Clusta Diagnostics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
