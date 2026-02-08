'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = authService.isAuthenticated()
            setIsLoggedIn(authenticated)
            if (authenticated) {
                const user = authService.getUser()
                setUserName(user?.name || 'User')
            }
        }
        checkAuth()
        // Close mobile menu on route change
        setMobileMenuOpen(false)
    }, [pathname])

    const handleLogout = () => {
        authService.logout()
        setIsLoggedIn(false)
        setUserName('')
        setMobileMenuOpen(false)
        router.push('/')
    }

    const isHomePage = pathname === '/'
    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'
    const isDashboard = pathname === '/dashboard'

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10 safe-top">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo + Back Button */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!isHomePage && !isAuthPage && (
                            <button
                                onClick={() => router.back()}
                                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                                aria-label="Go back"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
                            <img
                                src="/logo.png"
                                alt="TaskFlow Logo"
                                className="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-110 transition-transform"
                            />
                            <span className="text-lg sm:text-xl font-bold text-white">TaskFlow</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3 lg:gap-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-slate-300 text-sm hidden lg:block">Welcome, {userName}</span>
                                {!isDashboard && (
                                    <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="btn-danger text-sm py-2 px-4">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {!isAuthPage && (
                                    <>
                                        <Link href="/login" className="text-slate-300 hover:text-white transition-colors font-medium text-sm">
                                            Login
                                        </Link>
                                        <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu - Slide Down */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-60 pb-4' : 'max-h-0'}`}>
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                        {isLoggedIn ? (
                            <>
                                <div className="px-3 py-2 text-sm text-slate-400">
                                    👋 Welcome, <span className="text-white font-medium">{userName}</span>
                                </div>
                                {!isDashboard && (
                                    <Link
                                        href="/dashboard"
                                        className="mx-1 py-3 px-4 text-center bg-white/5 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        📊 Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="mx-1 py-3 px-4 text-center bg-red-600/20 rounded-xl text-red-400 font-medium hover:bg-red-600/30 transition-colors"
                                >
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {!isAuthPage && (
                                    <>
                                        <Link
                                            href="/login"
                                            className="mx-1 py-3 px-4 text-center bg-white/5 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            🔑 Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="mx-1 py-3 px-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            ✨ Sign Up Free
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
