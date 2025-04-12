import { Match, TicketType, Booking, upiDetails, LoginCredentials } from "@shared/schema";
import { supabase, supabaseAdmin } from "./supabase";

// Remove API_BASE_URL and MOCK_MATCHES as we'll use Supabase directly

// Admin login function using Supabase
export const adminLogin = async (credentials: LoginCredentials) => {
  try {
    // Query the admin_users table directly
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username')
      .eq('username', credentials.username)
      .eq('password', credentials.password)
      .maybeSingle();

    if (error) {
      console.error('Admin login error:', error);
      return {
        ok: false,
        error: 'Invalid credentials',
        status: 401
      };
    }

    if (!data) {
      return {
        ok: false,
        error: 'Invalid credentials',
        status: 401
      };
    }

    // Return the admin data
    return {
      ok: true,
      data: { admin: data },
      status: 200
    };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return {
      ok: false,
      error: error.message || 'Login failed',
      status: 401
    };
  }
};

// Matches API using Supabase
export const matchesApi = {
  getMatches: async (): Promise<Match[]> => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  getMatchById: async (id: number): Promise<Match> => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error(`Match with ID ${id} not found`);
    return data;
  }
};

// Improved fetchMatches function with Supabase
export const fetchMatches = async (activeOnly: boolean = false): Promise<Match[]> => {
  try {
    let query = supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true });
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Match by ID using Supabase
export const fetchMatchById = async (id: number): Promise<Match> => {
  // Check if id is valid
  if (!id || isNaN(id)) {
    throw new Error('Invalid match ID');
  }

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  if (!data) throw new Error(`Match with ID ${id} not found`);
  return data;
};

// Admin match operations using Supabase
export const adminCreateMatch = async (matchData: Partial<Match>): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .insert(matchData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const adminUpdateMatch = async (id: number, matchData: Partial<Match>): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .update(matchData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const adminDeleteMatch = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Ticket type operations using Supabase
export const fetchTicketTypesByMatchId = async (matchId: number): Promise<TicketType[]> => {
  const { data, error } = await supabase
    .from('ticket_types')
    .select('*')
    .eq('matchId', matchId);
  
  if (error) throw error;
  return data || [];
};

export const fetchTicketTypeById = async (id: number): Promise<TicketType> => {
  const { data, error } = await supabase
    .from('ticket_types')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  if (!data) throw new Error(`Ticket type with ID ${id} not found`);
  return data;
};

// Booking operations using Supabase
export const createBooking = async (data: Partial<Booking>): Promise<Booking> => {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return booking;
};

export const fetchBookingByBookingId = async (bookingId: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('bookingId', bookingId)
    .single();
  
  if (error) throw error;
  if (!data) throw new Error(`Booking with ID ${bookingId} not found`);
  return data;
};

export const fetchBookingsByEmail = async (email: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('email', email);
  
  if (error) throw error;
  return data || [];
};

export const updateBookingPayment = async (bookingId: string, paymentData: any): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update(paymentData)
    .eq('bookingId', bookingId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Admin booking operations using Supabase
export const adminFetchAllBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('createdAt', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const adminUpdateBookingStatus = async (bookingId: string, status: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('bookingId', bookingId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// UPI operations using Supabase
export const fetchActiveUpiDetail = async (): Promise<typeof upiDetails.$inferSelect> => {
  const { data, error } = await supabase
    .from('upi_details')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error fetching active UPI detail:', error);
    throw new Error('Failed to fetch active UPI detail');
  }
  
  return data;
};

export const adminCreateUpiDetail = async (upiDetailData: typeof upiDetails.$inferInsert): Promise<typeof upiDetails.$inferSelect> => {
  const { data, error } = await supabase
    .from('upi_details')
    .insert(upiDetailData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating UPI detail:', error);
    throw new Error('Failed to create UPI detail');
  }
  
  return data;
};

export const adminUpdateUpiDetail = async (id: number, upiDetailData: Partial<typeof upiDetails.$inferInsert>): Promise<typeof upiDetails.$inferSelect> => {
  const { data, error } = await supabase
    .from('upi_details')
    .update(upiDetailData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating UPI detail:', error);
    throw new Error('Failed to update UPI detail');
  }
  
  return data;
};

// Admin ticket type operations using Supabase
export const adminCreateTicketType = async (ticketTypeData: Partial<TicketType>): Promise<TicketType> => {
  const { data, error } = await supabase
    .from('ticket_types')
    .insert(ticketTypeData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
  };

export const adminUpdateTicketType = async (id: number, ticketTypeData: Partial<TicketType>): Promise<TicketType> => {
  const { data, error } = await supabase
    .from('ticket_types')
    .update(ticketTypeData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
  };

export const adminDeleteTicketType = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('ticket_types')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
    return true;
  };

export async function fetchUpiDetails(): Promise<typeof upiDetails.$inferSelect[]> {
  const { data, error } = await supabase
    .from('upi_details')
    .select('*');

  if (error) {
    console.error('Error fetching UPI details:', error);
    throw new Error('Failed to fetch UPI details');
  }

  return data || [];
}

export async function createUpiDetail(details: typeof upiDetails.$inferInsert): Promise<typeof upiDetails.$inferSelect> {
  const { data, error } = await supabase
    .from('upi_details')
    .insert(details)
    .select()
    .single();

  if (error) {
    console.error('Error creating UPI detail:', error);
    throw new Error('Failed to create UPI detail');
  }

  return data;
}

export async function updateUpiDetail(id: number, details: Partial<typeof upiDetails.$inferInsert>): Promise<typeof upiDetails.$inferSelect> {
  const { data, error } = await supabase
    .from('upi_details')
    .update(details)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating UPI detail:', error);
    throw new Error('Failed to update UPI detail');
  }

  return data;
}

// Admin operations
export const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking admin users:', checkError);
      throw checkError;
    }

    // If no admin exists, create default admin
    if (!existingAdmins || existingAdmins.length === 0) {
      const defaultAdmin = {
        username: 'admin',
        password: 'admin123' // In production, this should be hashed
      };

      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .insert(defaultAdmin)
        .select()
        .single();

      if (error) {
        console.error('Error creating default admin:', error);
        throw error;
      }

      console.log('Default admin created successfully');
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error in createDefaultAdmin:', error);
    throw error;
  }
};

// Call this function when the app starts
createDefaultAdmin().catch(console.error);

export * from '@shared/schema';