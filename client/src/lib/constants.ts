export const TICKET_TYPES = [
  { id: 'general', name: 'General Stand', description: 'Affordable seating, usually in the upper stands.' },
  { id: 'premium', name: 'Premium Stand', description: 'Better view and closer to the action.' },
  { id: 'pavilion', name: 'Pavilion Stand', description: 'Premium seating with excellent view.' },
  { id: 'vip', name: 'VIP Stand', description: 'Exclusive seating with food and drinks.' },
  { id: 'corporate', name: 'Corporate Box', description: 'Private box for corporate groups with premium services.' },
  { id: 'hospitality', name: 'Hospitality Box', description: 'All-inclusive hospitality experience with top-tier service.' },
  { id: 'skybox', name: 'Skybox Lounge', description: 'Elevated experience with panoramic views of the stadium.' }
];

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI/QR', icon: 'qrcode' },
  { id: 'card', name: 'Cards', icon: 'credit-card' },
  { id: 'wallet', name: 'Wallet', icon: 'wallet' },
  { id: 'netbanking', name: 'Net Banking', icon: 'landmark' }
];

export const SPONSORS = [
  { name: 'Star Sports', role: 'Official Broadcaster', logo: '/images/sponsors/star.png' },
  { name: 'TATA', role: 'Title Sponsor', logo: '/images/sponsors/tata.png' },
  { name: 'Jio', role: 'Official Digital Streaming Partner', logo: '/images/sponsors/jio.png' },
  { name: 'RuPay', role: 'Official Partner', logo: '/images/sponsors/rupay.png' }
];

export const STADIUM_SECTIONS = [
  { id: 'north', name: 'North Pavilion', color: 'bg-yellow-400' },
  { id: 'premium', name: 'Premium Blocks', color: 'bg-pink-400' },
  { id: 'club', name: 'Club House', color: 'bg-blue-400' }
];

export const TEAM_LOGOS: Record<string, string> = {
  'Mumbai Indians': '/images/teams/mumbai-indians.png',
  'Chennai Super Kings': '/images/teams/chennai-super-kings.png',
  'Royal Challengers Bangalore': '/images/teams/rcb.png',
  'Kolkata Knight Riders': '/images/teams/kkr.png',
  'Delhi Capitals': '/images/teams/delhi-capitals.png',
  'Rajasthan Royals': '/images/teams/rajasthan-royals.png',
  'Sunrisers Hyderabad': '/images/teams/sunrisers-hyderabad.png',
  'Punjab Kings': '/images/teams/punjab-kings.png',
  'Gujarat Titans': '/images/teams/gujarat-titans.png',
  'Lucknow Super Giants': '/images/teams/lucknow-super-giants.png',
};

// Environment variables should be accessed through a config file to handle TypeScript issues
// export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
// export const IS_PROD = import.meta.env.PROD;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};