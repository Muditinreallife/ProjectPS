import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { InstagramLogo } from '../icons/InstagramLogo';
import { useAuth } from '../../context/AuthContext';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { signup, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !fullName.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await signup({
        email: email.trim(),
        name: fullName.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] rounded-2xl bg-[#1c1c1c] border border-neutral-800 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <InstagramLogo size={42} />
          <h2 className="text-xl font-bold text-white mt-4">Create your account</h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-[320px]">
            Sign up to see everyday moments, stories, and reels from your close friends.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center">
            <CheckCircle className="w-12 h-12 text-[#00D659] mb-3 animate-bounce" />
            <h3 className="text-lg font-semibold text-white">Account Created!</h3>
            <p className="text-sm text-neutral-400 mt-1">Taking you to your Instagram feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <input
                type="text"
                placeholder="Mobile number or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-neutral-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-neutral-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-neutral-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password (6+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-neutral-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <p className="text-[11px] text-neutral-400 text-center leading-relaxed px-2 pt-1">
              By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-[#0064e0] hover:bg-[#0057c2] active:bg-[#004bb0] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(0,100,224,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign up</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
