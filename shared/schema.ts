import { z } from "zod";
import { Database } from "./supabase-types";

// Types from Supabase
export type Tables = Database["public"]["Tables"];

// Admin Users
export type AdminUser = Tables["admin_users"]["Row"];
export type InsertAdminUser = Omit<AdminUser, "id" | "created_at">;

export const insertAdminUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  auth_id: z.string().min(1, "Auth ID is required"),
});

// Matches
export type Match = Tables["matches"]["Row"];
export type InsertMatch = Omit<Match, "id" | "created_at">;

export const insertMatchSchema = z.object({
  team1: z.string().min(1, "Team 1 is required"),
  team2: z.string().min(1, "Team 2 is required"),
  team1_logo: z.string().optional(),
  team2_logo: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  stadium: z.string().min(1, "Stadium is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  is_active: z.boolean().default(true),
});

// Ticket Types
export type TicketType = Tables["ticket_types"]["Row"];
export type InsertTicketType = Omit<TicketType, "id" | "created_at" | "updated_at">;

export const insertTicketTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
});

// Bookings
export type Booking = Tables["bookings"]["Row"];
export type InsertBooking = Omit<Booking, "id" | "created_at" | "updated_at">;

export const insertBookingSchema = z.object({
  user_id: z.number().int().positive(),
  ticket_type_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  total_amount: z.number().min(0, "Total amount must be positive"),
  status: z.string().min(1, "Status is required"),
});

// UPI Details
export type UpiDetail = Tables["upi_details"]["Row"];
export type InsertUpiDetail = Omit<UpiDetail, "id" | "created_at" | "updated_at">;

export const insertUpiDetailSchema = z.object({
  upi_id: z.string().min(1, "UPI ID is required"),
  name: z.string().min(1, "Name is required"),
  is_active: z.boolean().default(true),
});

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
