import { Router } from 'express';
import { supabase } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  username: string;
  role: string;
}

// Add type declaration for the user property on Request
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const router = Router();

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Username and password are required'
      });
    }

    // Query admin user from Supabase
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (adminError || !admin) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid credentials'
      });
    }

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    return res.json({
      ok: true,
      data: {
        admin: adminWithoutPassword
      }
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

// Protected admin routes below this middleware
router.use((req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (typeof decoded === 'string' || !('username' in decoded) || !('role' in decoded)) {
      throw new Error('Invalid token payload');
    }
    
    req.user = decoded as JWTPayload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Get all matches
router.get('/matches', async (req, res) => {
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return res.json({
      ok: true,
      data: { matches }
    });
  } catch (error: any) {
    console.error('Get matches error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

// Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized'
      });
    }

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (adminError || !admin) {
      return res.status(404).json({
        ok: false,
        error: 'Admin not found'
      });
    }

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    return res.json({
      ok: true,
      data: {
        admin: adminWithoutPassword
      }
    });
  } catch (error: any) {
    console.error('Get admin profile error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    });
  }
});

// Other admin routes...

export default router; 