import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  BarChart3,
  Boxes,
  ChevronDown,
  ExternalLink,
  Mail,
  Menu,
  ShoppingCart,
  Truck,
  X,
} from 'lucide-react';
import clustaLogo from '../../assets/clustalogo.png';

const ENV_ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY;

const navItems = [
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/delivery-fees', label: 'Delivery Fees', icon: Truck },
  { to: '/admin/results', label: 'Results', icon: BarChart3 },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/contact', label: 'Contact', icon: Mail },
];

const AdminLayout = () => {
  const location = useLocation();
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(Boolean(localStorage.getItem('admin_api_key') || ENV_ADMIN_KEY));

  const hasKey = useMemo(() => Boolean(localStorage.getItem('admin_api_key') || ENV_ADMIN_KEY), [isAuthorized]);

  const currentLabel =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? 'Dashboard';

  if (!isAuthorized || !hasKey) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] px-4 py-14">
        <main className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="font-heading text-3xl font-bold text-[#101828] mb-3">Admin Access</h1>
            <p className="font-body text-[#575151] mb-6">Enter your admin API key to access dashboard pages.</p>
            <input
              type="password"
              value={adminKeyInput}
              onChange={(event) => setAdminKeyInput(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-4"
              placeholder="Admin API key"
            />
            {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
            <button
              onClick={() => {
                if (!adminKeyInput.trim()) {
                  setErrorMessage('Enter the admin API key to continue.');
                  return;
                }
                localStorage.setItem('admin_api_key', adminKeyInput.trim());
                setIsAuthorized(true);
                setErrorMessage(null);
              }}
              className="w-full bg-[#45AAB8] text-white py-3 rounded-lg font-semibold hover:bg-[#3d98a5]"
            >
              Unlock Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="lg:hidden px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-40 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#111827]"
        >
          <Menu size={16} />
          Menu
        </button>
        <img src={clustaLogo} alt="Clusta" className="h-7 w-auto" />
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white p-5 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <img src={clustaLogo} alt="Clusta" className="h-12 w-auto" />
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md p-2 text-[#6B7280] hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#D8F2EE] text-[#0F766E]'
                      : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-2xl font-bold text-[#101828]">{currentLabel}</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#374151] hover:bg-gray-50"
              >
                <ExternalLink size={14} />
                View Site
              </a>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#45AAB8] px-3 py-2 text-sm font-medium text-white"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                    A
                  </span>
                  Admin
                  <ChevronDown size={14} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#374151] hover:bg-gray-100"
                      onClick={() => {
                        localStorage.removeItem('admin_api_key');
                        setIsAuthorized(false);
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      Lock Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;