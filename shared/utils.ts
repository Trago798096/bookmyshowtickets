/**
 * Generates a random booking ID with a prefix of 'IPL' followed by a timestamp and random characters.
 */
export function generateBookingId(): string {
  const prefix = 'IPL';
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${randomChars}`;
}

/**
 * Calculates the GST amount (18%) for a given base amount.
 */
export function calculateGST(amount: number): number {
  return Math.round(amount * 0.18);
}

/**
 * Calculates the service fee (5%) for a given base amount.
 */
export function calculateServiceFee(amount: number): number {
  return Math.round(amount * 0.05);
}

/**
 * Calculates the total amount including GST and service fee.
 */
export function calculateTotalAmount(baseAmount: number): {
  baseAmount: number;
  gst: number;
  serviceFee: number;
  totalAmount: number;
} {
  const gst = calculateGST(baseAmount);
  const serviceFee = calculateServiceFee(baseAmount);
  const totalAmount = baseAmount + gst + serviceFee;
  
  return {
    baseAmount,
    gst,
    serviceFee,
    totalAmount
  };
}

/**
 * Formats a number as Indian currency (INR).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats a date string to a more readable format.
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', options);
}

/**
 * Returns a CSS color class based on the booking status.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'text-green-600';
    case 'pending':
    case 'payment_pending':
      return 'text-amber-600';
    case 'cancelled':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Truncates text to a specified length and adds ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}