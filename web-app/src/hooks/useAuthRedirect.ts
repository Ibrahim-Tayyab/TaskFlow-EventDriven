'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'

export function useAuthRedirect() {
    const router = useRouter()

    useEffect(() => {
        if (authService.isAuthenticated()) {
            router.replace('/dashboard')
        }
    }, [router])
}
