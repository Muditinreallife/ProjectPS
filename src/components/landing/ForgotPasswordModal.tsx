import React, { useState } from 'react';
import { X, Lock, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[390px] rounded-2xl bg-[#1c1c1c] border border-neutral-800 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full border-2 border-neutral-700 mx-auto flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-neutral-300" />
        </div>

        <h2 className="text-lg font-bold text-white mb-2">Trouble logging in?</h2>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          Enter your email, phone, or username and we'll send you a link to get back into your account.
        </p>

        {submitted ? (
          <div className="py-4 space-y-4">
            <CheckCircle className="w-10 h-10 text-[#00D659] mx-auto animate-bounce" />
            <p className="text-sm text-neutral-200">
              We've sent a login link to <span className="font-semibold text-white">{identifier}</span>.
            </p>
            <button
              onClick={onClose}
              type="button"
              className="w-full h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Email, Phone, or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:border-neutral-400 focus:outline-none transition-colors"
              required
            />

            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="w-full h-11 rounded-xl bg-[#0064e0] hover:bg-[#0057c2] active:bg-[#004bb0] text-white font-semibold text-sm transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending Link...' : 'Send login link'}
            </button>

            <button
              onClick={onClose}
              type="button"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
