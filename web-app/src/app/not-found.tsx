'use client'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black">
            {/* Immersive Background Animation - Acts as the "Window" */}
            <img
                src="/assets/404.webp"
                alt="Page Not Found"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Subtle Overlay (Optional, adds depth) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Minimal Navigation Button */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-full transition-all duration-300 shadow-2xl group"
                >
                    <svg
                        className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-light tracking-wide">Return Home</span>
                </Link>
            </div>
        </div>
    )
}
