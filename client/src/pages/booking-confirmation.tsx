import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Download, MapPin, AlertTriangle, CheckCircle, HeadphonesIcon } from "lucide-react";
import { fetchBookingByBookingId, fetchMatchById, fetchTicketTypeById } from "@/lib/api";
import { Booking, Match, TicketType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { TEAM_LOGOS } from "@/lib/constants";

interface BookingConfirmationProps {
  bookingId: string;
}

export default function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const { data: booking, isLoading: isBookingLoading, isError: isBookingError } = useQuery<Booking>({
    queryKey: [`/api/bookings/${bookingId}`],
    queryFn: () => fetchBookingByBookingId(bookingId),
  });

  const { data: match, isLoading: isMatchLoading } = useQuery<Match>({
    queryKey: [`/api/matches/${booking?.matchId}`],
    queryFn: () => booking ? fetchMatchById(booking.matchId) : Promise.resolve(null),
    enabled: !!booking,
  });

  const { data: ticketType, isLoading: isTicketTypeLoading } = useQuery<TicketType>({
    queryKey: [`/api/ticket-types/${booking?.ticketTypeId}`],
    queryFn: () => booking ? fetchTicketTypeById(booking.ticketTypeId) : Promise.resolve(null),
    enabled: !!booking,
  });

  const isLoading = isBookingLoading || isMatchLoading || isTicketTypeLoading;
  const isError = isBookingError;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center">
        {isLoading && (
          <div className="space-y-6 text-center">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-full max-w-md mx-auto" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start mb-6">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Failed to load booking confirmation. Please check "My Bookings" to verify your ticket status.</p>
          </div>
        )}

        {!isLoading && !isError && booking && match && ticketType && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold font-heading mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Your payment has been successfully processed and your tickets are confirmed.
            </p>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium">Booking Details</h3>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
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
                  <div className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
                    Confirmed
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600 mb-1">Booking ID:</p>
                    <p className="font-medium">{booking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Payment Method:</p>
                    <p className="font-medium">{booking.paymentMethod || 'UPI'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Match:</p>
                    <p className="font-medium">{match.team1} vs {match.team2}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Date & Time:</p>
                    <p className="font-medium">{match.date}, {match.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Venue:</p>
                    <p className="font-medium">{match.venue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Ticket Type:</p>
                    <p className="font-medium">{ticketType.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Quantity:</p>
                    <p className="font-medium">{booking.quantity} tickets</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Amount Paid:</p>
                    <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Your tickets have been sent to your registered email address.
                    You can also access them in the "My Bookings" section.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Download className="mr-2 h-4 w-4" /> Download Tickets
                    </Button>
                    <Link href="/">
                      <Button variant="secondary">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold font-heading mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-6">If you have any questions or need assistance, please contact our support team.</p>
              <Button variant="outline" className="mx-auto">
                <HeadphonesIcon className="mr-2 h-4 w-4" /> Contact Support
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
