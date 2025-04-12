import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, LoginCredentials } from '@shared/schema';
import { supabase } from './supabase';

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
          // Sign in with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.username,
            password: credentials.password,
          });

          if (authError) throw authError;
          if (!authData.user) throw new Error('Authentication failed');

          // Get admin data
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_id', authData.user.id)
            .maybeSingle();

          if (adminError) throw adminError;
          if (!adminData) throw new Error('User is not an admin');

          set({ 
            admin: adminData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });

          // Store in localStorage for redundancy
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminData', JSON.stringify(adminData));
        } catch (error: any) {
          console.error('Login error:', error);
          set({ 
            error: error.message || 'Login failed. Please check your credentials.', 
            isLoading: false 
          });
        }
      },
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ 
            admin: null, 
            isAuthenticated: false,
            error: null
          });
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminData');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
    {
      name: 'admin-auth-storage',
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
