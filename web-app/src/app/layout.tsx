import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import QueryProvider from '../providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'TaskFlow - Todo App',
    description: 'A modern todo application with JWT authentication',
    icons: {
        icon: '/favicon.png',
        apple: '/favicon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-900 min-h-screen`}>
                <QueryProvider>
                    <Navbar />
                    <main className="min-h-[calc(100vh-64px)]">
                        {children}
                    </main>
                </QueryProvider>
            </body>
        </html>
    )
}
