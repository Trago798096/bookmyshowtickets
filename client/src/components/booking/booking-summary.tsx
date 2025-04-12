import { useQuery } from "@tanstack/react-query";
import { TicketType, Match } from "@shared/schema";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { fetchMatchById, fetchTicketTypeById } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, calculateTotalAmount } from "@/lib/utils";
import { TEAM_LOGOS } from "@/lib/constants";

interface BookingSummaryProps {
  ticketTypeId: number;
  quantity: number;
  showActions?: boolean;
}

export default function BookingSummary({ ticketTypeId, quantity, showActions = true }: BookingSummaryProps) {
  const { data: ticketType, isLoading: isTicketLoading } = useQuery<TicketType>({
    queryKey: [`/api/ticket-types/${ticketTypeId}`],
    queryFn: () => fetchTicketTypeById(ticketTypeId),
  });

  const { data: match, isLoading: isMatchLoading } = useQuery<Match>({
    queryKey: [`/api/matches/${ticketType?.matchId}`],
    queryFn: () => ticketType ? fetchMatchById(ticketType.matchId) : Promise.resolve(null),
    enabled: !!ticketType,
  });

  const isLoading = isTicketLoading || isMatchLoading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 mb-2">
            <div className="flex justify-between">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!match || !ticketType) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium">Booking Summary</h3>
        </div>
        <div className="p-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Could not load booking details. Please go back and try again.
          </div>
        </div>
      </div>
    );
  }

  const baseAmount = ticketType.price * quantity;
  const { gst, serviceFee, totalAmount } = calculateTotalAmount(baseAmount);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium">Booking Summary</h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={match.team1Logo || TEAM_LOGOS[match.team1] || 'https://via.placeholder.com/60'} 
              alt={match.team1}
              className="w-12 h-12 object-contain"
            />
            <span className="mx-3 font-semibold">vs</span>
            <img 
              src={match.team2Logo || TEAM_LOGOS[match.team2] || 'https://via.placeholder.com/60'} 
              alt={match.team2}
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
        
        <div className="flex items-center mb-2 text-gray-600">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>{match.date}, {match.time}</span>
        </div>
        
        <div className="flex items-center mb-4 text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{match.venue}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 mb-1">Ticket Type:</p>
            <p className="font-medium">{ticketType.name}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Quantity:</p>
            <p className="font-medium">{quantity} tickets</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Base Amount:</p>
            <p className="font-medium">{formatCurrency(baseAmount)}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">GST (18%):</p>
            <p className="font-medium">{formatCurrency(gst)}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Service Fee:</p>
            <p className="font-medium">{formatCurrency(serviceFee)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-2">
          <p className="font-bold text-lg">Total Amount:</p>
          <p className="font-bold text-lg">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
}
