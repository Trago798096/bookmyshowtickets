import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, LoginCredentials } from '@shared/schema';
import { adminLogin } from './api';

interface AuthState {
  admin: Omit<AdminUser, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const result = await adminLogin(credentials);
          
          if (!result.ok || !result.data) {
            throw new Error(result.error || 'Login failed');
          }

          const { admin } = result.data;
          
          if (!admin) {
            throw new Error('Invalid response from server');
          }

          set({ 
            admin, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });

          // Store in localStorage for redundancy
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminData', JSON.stringify(admin));
        } catch (error: any) {
          console.error('Login error:', error);
          set({ 
            error: error.message || 'Login failed. Please check your credentials.', 
            isLoading: false,
            isAuthenticated: false,
            admin: null
          });
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminData');
        }
      },
      logout: () => {
        set({ admin: null, isAuthenticated: false, error: null });
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminData');
      },
    }),
    {
      name: 'admin-auth',
    }
  )
);

export const useBookingEmailStore = create<{
  email: string;
  setEmail: (email: string) => void;
}>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email: string) => set({ email }),
    }),
    {
      name: 'booking-email',
    }
  )
);
