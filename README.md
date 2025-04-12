# IPL Ticket Booking System

A full-stack application for booking IPL match tickets, built with React, Vite, and Supabase.

## Features

- View upcoming IPL matches
- Book tickets for matches
- Multiple ticket types and pricing
- UPI payment integration
- Admin dashboard for managing matches and bookings
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Payment**: UPI Integration

## Prerequisites

- Node.js 16+ and npm
- Supabase account
- UPI payment gateway (for production)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ipl-ticket-booking.git
   cd ipl-ticket-booking
   ```

2. Install dependencies:
```bash
npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and other environment variables.

4. Set up the database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the development server:
   ```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-database-connection-string
PORT=5000
NODE_ENV=development
```

## Database Schema

The application uses the following main tables:

- `matches`: IPL match details
- `ticket_types`: Different ticket categories
- `bookings`: User bookings
- `admin_users`: Admin authentication
- `upi_details`: Payment configuration

## API Routes

- `GET /api/matches`: Get all matches
- `GET /api/matches/:id`: Get match details
- `POST /api/bookings`: Create a booking
- `GET /api/bookings/:id`: Get booking details
- `POST /api/admin/login`: Admin authentication
- `GET /api/admin/bookings`: Get all bookings (admin only)

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.