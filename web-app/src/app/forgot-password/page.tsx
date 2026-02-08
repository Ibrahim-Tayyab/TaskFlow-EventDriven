'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call - In real app, this would send email
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center py-8 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md animate-scaleIn">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto animate-float">
                        <img src="/logo.png" alt="TaskFlow Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                        {submitted ? 'Check Your Email' : 'Forgot Password'}
                    </h1>
                    <p className="mt-2 text-slate-400 text-sm sm:text-base">
                        {submitted
                            ? 'We\'ve sent a password reset link to your email'
                            : 'Enter your email to reset your password'
                        }
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card p-6 sm:p-8 shadow-2xl animate-fadeIn stagger-2">
                    {submitted ? (
                        <div className="text-center space-y-6">
                            {/* Success Icon */}
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-scaleIn">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <p className="text-white font-medium">Reset link sent to:</p>
                                <p className="text-purple-400">{email}</p>
                            </div>

                            <p className="text-slate-400 text-sm">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-secondary"
                                >
                                    Try Another Email
                                </button>
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                    ← Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
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

                            <button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : 'Send Reset Link'}
                            </button>

                            <div className="text-center pt-2">
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 glass-card p-4 animate-fadeIn stagger-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-sm">
                            <p className="text-slate-300 font-medium">Demo Mode</p>
                            <p className="text-slate-500 text-xs mt-1">
                                This is a demo. In production, a real email would be sent with a reset link.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
