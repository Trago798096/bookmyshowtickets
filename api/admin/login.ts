import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: true, 
        message: 'Username and password are required' 
      });
    }

    // Get admin user from database
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (adminError || !admin) {
      return res.status(401).json({ 
        error: true, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: true, 
        message: 'Invalid credentials' 
      });
    }

    // Create session
    const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: password
    });

    if (sessionError) {
      throw sessionError;
    }

    // Return success response
    return res.status(200).json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      },
      session: session
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: true, 
      message: error.message || 'Internal server error' 
    });
  }
} 