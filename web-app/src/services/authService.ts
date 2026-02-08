/**
 * JWT Authentication Service
 * Handles login, signup, token storage, and auth state management
 */

// Force relative path in production if API URL is set to localhost (common configuration error)
// Force relative path in production to use Next.js proxy
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
const TOKEN_KEY = 'todo_jwt_token';
const USER_KEY = 'todo_user';

export interface User {
    id: string;
    email: string;
    name: string | null;
}

export interface AuthResponse {
    token: string;
    user: User;
    message: string;
}

class AuthService {
    /**
     * Get stored JWT token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Get stored user info
     */
    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Store auth data after login/signup
     */
    private setAuth(token: string, user: User): void {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    /**
     * Clear auth data on logout
     */
    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    /**
     * Sign up with email, password, and name
     * Returns JWT token on success
     */
    async signup(email: string, password: string, name: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Signup failed' }));
            throw new Error(error.detail || 'Signup failed');
        }

        const data: AuthResponse = await response.json();
        this.setAuth(data.token, data.user);
        return data;
    }

    /**
     * Login with email and password
     * Returns JWT token on success
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Login failed' }));
            throw new Error(error.detail || 'Invalid email or password');
        }

        const data: AuthResponse = await response.json();
        this.setAuth(data.token, data.user);
        return data;
    }

    /**
     * Get Authorization header for API requests
     */
    getAuthHeader(): Record<string, string> {
        const token = this.getToken();
        if (token) {
            return { 'Authorization': `Bearer ${token}` };
        }
        return {};
    }
}

export const authService = new AuthService();
