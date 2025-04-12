import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketType {
  id: number;
  match_id: number;
  name: string;
  description: string;
  price: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  booking_id: string;
  match_id: number;
  ticket_type_id: number;
  quantity: number;
  full_name: string;
  email: string;
  phone: string;
  total_amount: number;
  status: string;
  payment_method?: string;
  utr_number?: string;
  created_at: string;
  updated_at: string;
}

export interface UpiDetail {
  id: number;
  upi_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions
export const getMatches = async (active?: boolean) => {
  let query = supabase.from('matches').select('*');
  if (active !== undefined) {
    query = query.eq('is_active', active);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getMatchById = async (id: number) => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const getTicketTypesByMatchId = async (matchId: number) => {
  const { data, error } = await supabase
    .from('ticket_types')
    .select('*')
    .eq('match_id', matchId);
  if (error) throw error;
  return data;
};

export const getTicketTypeById = async (id: number) => {
  const { data, error } = await supabase
    .from('ticket_types')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getBookingsByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('email', email);
  if (error) throw error;
  return data;
};

export const getBookingByBookingId = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .single();
  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('booking_id', bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateBookingPayment = async (bookingId: string, paymentMethod: string, utrNumber: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ payment_method: paymentMethod, utr_number: utrNumber })
    .eq('booking_id', bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getActiveUpiDetail = async () => {
  const { data, error } = await supabase
    .from('upi_details')
    .select('*')
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
};

// Admin functions
export const validateAdminLogin = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  if (!data) return null;
  
  // In production, use proper password hashing
  if (data.password !== password) return null;
  
  return data;
}; 