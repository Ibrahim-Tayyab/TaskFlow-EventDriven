'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

// Password requirement checker
const usePasswordStrength = (password: string) => {
  return useMemo(() => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);
};

// Animated requirement indicator component
const RequirementIndicator = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-2 transition-all duration-300 ${met ? 'text-green-400' : 'text-slate-500'}`}>
    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${met
      ? 'bg-green-500/20 scale-100'
      : 'bg-slate-700/50 scale-90'
      }`}>
      {met ? (
        <svg className="w-3 h-3 animate-scaleIn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </span>
    <span className={`text-xs transition-all duration-300 ${met ? 'font-medium' : ''}`}>{label}</span>
  </div>
);

export default function SignupPage() {
  useAuthRedirect();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const strength = usePasswordStrength(password);
  const strengthCount = Object.values(strength).filter(Boolean).length;
  const isPasswordStrong = strengthCount >= 4; // At least 4 out of 5 requirements

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordStrong) {
      setError('Please create a stronger password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.signup(email, password, name);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Strength bar color
  const getStrengthColor = () => {
    if (strengthCount <= 1) return 'bg-red-500';
    if (strengthCount <= 2) return 'bg-orange-500';
    if (strengthCount <= 3) return 'bg-yellow-500';
    if (strengthCount <= 4) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (password.length === 0) return '';
    if (strengthCount <= 1) return 'Very Weak';
    if (strengthCount <= 2) return 'Weak';
    if (strengthCount <= 3) return 'Fair';
    if (strengthCount <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center py-8 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-scaleIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto animate-float">
            <img src="/logo.png" alt="TaskFlow Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">Start managing your tasks today</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8 shadow-2xl animate-fadeIn stagger-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-slideIn">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-3 space-y-3 animate-fadeIn">
                  {/* Strength Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Password Strength</span>
                      <span className={`text-xs font-medium ${strengthCount <= 2 ? 'text-red-400' :
                        strengthCount <= 3 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-500 ease-out rounded-full`}
                        style={{ width: `${(strengthCount / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="grid grid-cols-1 gap-1.5 p-3 bg-slate-800/50 rounded-xl border border-white/5">
                    <RequirementIndicator met={strength.minLength} label="At least 8 characters" />
                    <RequirementIndicator met={strength.hasUppercase} label="One uppercase letter (A-Z)" />
                    <RequirementIndicator met={strength.hasLowercase} label="One lowercase letter (a-z)" />
                    <RequirementIndicator met={strength.hasNumber} label="One number (0-9)" />
                    <RequirementIndicator met={strength.hasSpecial} label="One special character (!@#$%)" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordStrong}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
