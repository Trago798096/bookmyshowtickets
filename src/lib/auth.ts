import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateAdminLogin } from './supabase';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await validateAdminLogin(credentials.username, credentials.password);
          
          if (!user) {
            set({ isLoading: false, error: 'Invalid credentials' });
            return {
              success: false,
              error: 'Invalid credentials'
            };
          }

          set({
            isAuthenticated: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            },
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            isLoading: false, 
            error: 'An unexpected error occurred',
            isAuthenticated: false,
            user: null
          });
          return {
            success: false,
            error: 'An unexpected error occurred'
          };
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
); 