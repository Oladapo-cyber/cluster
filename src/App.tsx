import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Homepage from './pages/Homepage';
import Shop from './pages/Shop';
import Quiz from './pages/Quiz';
import ProductDetails from './pages/ProductDetails';
import AdminLayout from './pages/admin/AdminLayout';
import ResultsPage from './pages/admin/ResultsPage';
import ProductsPage from './pages/admin/ProductsPage';
import RequireAuth from './components/RequireAuth';
import AccountProfile from './pages/AccountProfile';
import OrdersPage from './pages/admin/OrdersPage';
import ContactPage from './pages/admin/ContactPage';
import ClustaCare from './pages/ClustaCare';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import OrderSuccess from './pages/OrderSuccess';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '10px',
              background: '#45aab8',
              color: '#F9FAFB',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#065F46',
              },
            },
            error: {
              style: {
                background: '#991B1B',
              },
            },
          }}
        />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/shop" element={<Shop />} />
            <Route
              path="/account"
              element={(
                <RequireAuth>
                  <AccountProfile />
                </RequireAuth>
              )}
            />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="results" element={<ResultsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/admin/products" replace />} />
            <Route path="/clusta-care" element={<ClustaCare />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/checkout/success" element={<OrderSuccess />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
