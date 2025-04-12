import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { fetchTicketTypeById } from "@/lib/api";
import { TicketType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import BookingProgress from "@/components/booking/booking-progress";
import BookingSummary from "@/components/booking/booking-summary";
import CustomerForm from "@/components/booking/customer-form";
import { calculateTotalAmount } from "@/lib/utils";

interface BookingSummaryPageProps {
  ticketTypeId: number;
  quantity: number;
}

export default function BookingSummaryPage({ ticketTypeId, quantity }: BookingSummaryPageProps) {
  const { data: ticketType, isLoading, isError } = useQuery<TicketType>({
    queryKey: [`/api/ticket-types/${ticketTypeId}`],
    queryFn: () => fetchTicketTypeById(ticketTypeId),
  });

  const baseAmount = ticketType ? ticketType.price * quantity : 0;

  return (
    <div>
      <BookingProgress 
        step={2} 
        title="Complete Your Booking" 
        backLink={`/matches/${ticketType?.matchId || ''}`}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {isLoading && (
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          )}

          {isError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start mb-6">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>Failed to load booking details. Please try again later.</p>
            </div>
          )}

          {ticketType && (
            <>
              <BookingSummary 
                ticketTypeId={ticketTypeId}
                quantity={quantity}
                showActions={false}
              />
              
              <CustomerForm 
                ticketTypeId={ticketTypeId}
                matchId={ticketType.matchId}
                quantity={quantity}
                baseAmount={baseAmount}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
