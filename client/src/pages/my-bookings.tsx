import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CalendarDays, Clock, MapPin, Search, AlertTriangle, RefreshCcw } from "lucide-react";
import { fetchBookingsByEmail, fetchMatchById } from "@/lib/api";
import { Booking, Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingEmailStore } from "@/lib/auth";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import { TEAM_LOGOS } from "@/lib/constants";

interface BookingWithMatch extends Booking {
  match?: Match;
}

export default function MyBookings() {
  const { email, setEmail } = useBookingEmailStore();
  const [searchEmail, setSearchEmail] = useState(email);
  const [isSearching, setIsSearching] = useState(false);
  
  const { 
    data: bookings, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<Booking[]>({
    queryKey: [`/api/bookings?email=${email}`],
    queryFn: () => fetchBookingsByEmail(email),
    enabled: !!email,
  });

  const [bookingsWithMatches, setBookingsWithMatches] = useState<BookingWithMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Fetch match details for each booking
  const loadMatchDetails = async () => {
    if (!bookings || bookings.length === 0) return;
    
    setIsLoadingMatches(true);
    
    try {
      const matchPromises = bookings.map(booking => 
        fetchMatchById(booking.matchId).then(match => ({
          ...booking,
          match
        }))
      );
      
      const results = await Promise.all(matchPromises);
      setBookingsWithMatches(results);
    } catch (error) {
      console.error("Error loading match details:", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };
  
  // Load match details when bookings are available
  if (bookings && bookings.length > 0 && bookingsWithMatches.length === 0 && !isLoadingMatches) {
    loadMatchDetails();
  }

  const handleSearch = async () => {
    if (!searchEmail) return;
    
    setIsSearching(true);
    setEmail(searchEmail);
    
    try {
      await refetch();
      // Clear previous match details to trigger reload
      setBookingsWithMatches([]);
    } catch (error) {
      console.error("Error searching bookings:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Check Your Bookings</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchEmail}
            >
              {isSearching ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Bookings
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Enter the email address you used during booking to see your tickets
          </p>
        </div>
        
        {isLoading && (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  <Skeleton className="h-7 w-48 mb-4" />
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="w-full md:w-2/3">
                      <div className="flex items-center mb-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="w-6 h-6 mx-3" />
                        <Skeleton className="w-12 h-12 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-64 mb-2" />
                      <Skeleton className="h-5 w-48 mb-2" />
                    </div>
                    <div className="w-full md:w-1/3">
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Failed to load bookings. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && email && (!bookings || bookings.length === 0) && (
          <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg text-center">
            <p className="mb-2 font-semibold">No bookings found for this email address.</p>
            <p>If you have recently made a booking, please check your email for confirmation.</p>
          </div>
        )}

        {!isLoading && !isError && bookingsWithMatches.length > 0 && (
          <div className="space-y-6">
            {bookingsWithMatches.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Booking ID: {booking.bookingId}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="w-full md:w-2/3">
                      {booking.match && (
                        <>
                          <div className="flex items-center mb-4">
                            <img 
                              src={booking.match.team1Logo || TEAM_LOGOS[booking.match.team1] || 'https://via.placeholder.com/60'} 
                              alt={booking.match.team1}
                              className="w-12 h-12 object-contain"
                            />
                            <span className="mx-3 font-semibold">vs</span>
                            <img 
                              src={booking.match.team2Logo || TEAM_LOGOS[booking.match.team2] || 'https://via.placeholder.com/60'} 
                              alt={booking.match.team2}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          
                          <div className="flex items-center mb-2 text-gray-600">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            <span>{booking.match.date}, {booking.match.time}</span>
                          </div>
                          
                          <div className="flex items-center mb-4 text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{booking.match.venue}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg">
                      <div className="mb-2">
                        <span className="text-gray-600">Ticket Quantity:</span>
                        <span className="float-right font-medium">{booking.quantity}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="float-right font-medium">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="float-right font-medium">{booking.paymentMethod || 'UPI'}</span>
                      </div>
                      
                      <Link href={`/booking-confirmation/${booking.bookingId}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && !isError && !email && (
          <div className="bg-blue-50 text-blue-700 p-6 rounded-lg text-center">
            <p>Enter your email address above to view your bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
