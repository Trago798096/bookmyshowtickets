import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function generateBookingId(): string {
  return `IPLBK${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function calculateGST(amount: number): number {
  return Math.round(amount * 0.18);
}

export function calculateServiceFee(amount: number): number {
  return Math.round(amount * 0.05);
}

export function calculateTotalAmount(baseAmount: number): {
  gst: number;
  serviceFee: number;
  totalAmount: number;
} {
  const gst = calculateGST(baseAmount);
  const serviceFee = calculateServiceFee(baseAmount);
  const totalAmount = baseAmount + gst + serviceFee;
  
  return {
    gst,
    serviceFee,
    totalAmount,
  };
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
