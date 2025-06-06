export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: number
          username: string
          email: string
          auth_id: string
          created_at: string
        }
        Insert: {
          id?: number
          username: string
          email: string
          auth_id: string
          created_at?: string
        }
        Update: {
          id?: number
          username?: string
          email?: string
          auth_id?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: number
          team1: string
          team2: string
          team1_logo: string | null
          team2_logo: string | null
          venue: string
          stadium: string
          date: string
          time: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          team1: string
          team2: string
          team1_logo?: string | null
          team2_logo?: string | null
          venue: string
          stadium: string
          date: string
          time: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          team1?: string
          team2?: string
          team1_logo?: string | null
          team2_logo?: string | null
          venue?: string
          stadium?: string
          date?: string
          time?: string
          is_active?: boolean
          created_at?: string
        }
      }
      ticket_types: {
        Row: {
          id: number
          name: string
          price: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          user_id: number
          ticket_type_id: number
          quantity: number
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          ticket_type_id: number
          quantity: number
          total_amount: number
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          ticket_type_id?: number
          quantity?: number
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      upi_details: {
        Row: {
          id: number
          upi_id: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          upi_id: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          upi_id?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
