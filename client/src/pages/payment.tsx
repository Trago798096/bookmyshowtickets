import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Bolt } from "lucide-react";
import { fetchBookingByBookingId } from "@/lib/api";
import { Booking } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import BookingProgress from "@/components/booking/booking-progress";
import PaymentMethods from "@/components/payment/payment-methods";
import { formatCurrency } from "@/lib/utils";

interface PaymentProps {
  bookingId: string;
}

export default function Payment({ bookingId }: PaymentProps) {
  const [_, navigate] = useLocation();
  
  const { data: booking, isLoading, isError } = useQuery<Booking>({
    queryKey: [`/api/bookings/${bookingId}`],
    queryFn: () => fetchBookingByBookingId(bookingId),
  });

  const handlePaymentComplete = () => {
    navigate(`/booking-confirmation/${bookingId}`);
  };

  // Calculate discounted amount (10% off for demo)
  const discountedAmount = booking ? Math.round(booking.totalAmount * 0.9) : 0;
  const discount = booking ? booking.totalAmount - discountedAmount : 0;

  return (
    <div>
      <BookingProgress 
        step={3} 
        title="IPL Tickets" 
        backLink={`/booking-summary/${booking?.ticketTypeId || ''}/${booking?.quantity || 1}`}
      />
      
      <div className="bg-primary bg-opacity-5 py-2 border-b border-primary border-opacity-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <span className="mr-2 font-medium">UPI/QR: Pay with GPay & grab up to ₹400 instantly!</span>
            <Bolt className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading && (
            <Skeleton className="h-96 w-full rounded-lg" />
          )}

          {isError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start mb-6">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>Failed to load booking details. Please try again later.</p>
            </div>
          )}

          {booking && (
            <PaymentMethods 
              amount={discountedAmount}
              bookingId={bookingId}
              onPaymentComplete={handlePaymentComplete}
            />
          )}

          {booking && (
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <span className="text-sm text-gray-600">Amount:</span>
                <div className="flex flex-col">
                  <span className="font-medium">{formatCurrency(discountedAmount)}</span>
                  {discount > 0 && (
                    <span className="text-xs text-green-600">({formatCurrency(discount)} off)</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Booking ID:</span>
                <div className="font-medium">{booking.bookingId}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
