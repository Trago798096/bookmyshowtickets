# BookMyShow Tickets

A fully functional IPL ticket booking website clone built with React and Supabase.

## Features

- User interface for viewing matches and booking tickets
- Manual payment through UPI
- Booking history tracking
- Admin panel for managing matches, tickets, and bookings

## Tech Stack

- **Frontend:** React, TailwindCSS, ShadCN UI, TanStack Query
- **Backend:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Other:** Zod (validation), React Hook Form

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src` - Main source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/shared` - Shared types and utilities

## Admin Credentials

- **Username:** admin@example.com
- **Password:** admin123

## Deployment

The project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your changes.