import { validateAdminLogin } from './supabase';

interface LoginResponse {
  ok: boolean;
  data?: {
    user: {
      id: string;
      username: string;
      role: string;
    };
  };
  error?: string;
}

export async function adminLogin(credentials: { username: string; password: string }): Promise<LoginResponse> {
  try {
    const user = await validateAdminLogin(credentials.username, credentials.password);
    
    if (!user) {
      return {
        ok: false,
        error: 'Invalid credentials'
      };
    }

    return {
      ok: true,
      data: {
        user: {
          id: user.id.toString(),
          username: user.username,
          role: user.role
        }
      }
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      ok: false,
      error: 'An unexpected error occurred'
    };
  }
} 