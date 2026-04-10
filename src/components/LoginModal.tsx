import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(email.trim(), password, name.trim() || undefined);
      if (result.requiresEmailConfirmation) {
        toast.success('Signup successful. Please verify your email before logging in.');
      } else {
        toast.success('Account created successfully.');
        onClose();
      }
      resetFields();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn(email.trim(), password);
      toast.success('Login successful.');
      onClose();
      resetFields();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto outline-none focus:outline-none" aria-modal="true" role="dialog">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[480px] p-8 md:p-10 animate-in fade-in zoom-in duration-200 z-10 my-8">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-2xl font-bold font-heading text-[#101828] mb-6">
            {mode === 'login' ? 'Login' : 'Sign up'}
          </h2>

          {mode === 'signup' ? (
            /* Sign Up Form */
            <form className="space-y-4" onSubmit={(event) => void handleSignUp(event)}>
              <div>
                <input
                  type="text"
                  placeholder="Name (Optional)"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                  required
                />
              </div>

              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

              <p className="text-xs text-gray-500 mt-2">
                By signing up, I agree to the <a href="#" className="font-semibold text-gray-700">Privacy Policy</a> and the <a href="#" className="font-semibold text-gray-700">Terms of Services</a>.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors"
              >
                {isSubmitting ? 'Please wait...' : 'Sign up'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#45AAB8] hover:underline"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form className="space-y-4" onSubmit={(event) => void handleLogin(event)}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent"
                  required
                />
              </div>

              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors"
              >
                {isSubmitting ? 'Please wait...' : 'Login'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#45AAB8] hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
