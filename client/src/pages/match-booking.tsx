import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin, AlertTriangle } from "lucide-react";
import { fetchMatchById } from "@/lib/api";
import { Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import BookingProgress from "@/components/booking/booking-progress";
import StadiumMap from "@/components/booking/stadium-map";
import TicketTypes from "@/components/booking/ticket-types";
import { TEAM_LOGOS } from "@/lib/constants";

interface MatchBookingProps {
  matchId: number;
}

export default function MatchBooking({ matchId }: MatchBookingProps) {
  const [activeTab, setActiveTab] = useState("map");
  
  const { data: match, isLoading, isError } = useQuery<Match>({
    queryKey: [`/api/matches/${matchId}`],
    queryFn: () => fetchMatchById(matchId),
  });

  const matchName = match ? `${match.team1} vs ${match.team2}` : '';

  return (
    <div>
      <BookingProgress step={1} title="Select Your Seats" backLink="/matches" />
      
      <div className="container mx-auto px-4 py-6">
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                <div className="flex items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="w-6 h-6 mx-3" />
                  <Skeleton className="w-12 h-12 rounded-full" />
                </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start mb-6">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Failed to load match details. Please try again later.</p>
          </div>
        )}

        {match && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
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
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
                    <CalendarDays className="h-4 w-4 text-gray-600" />
                    <span>{match.date}, {match.time}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap -mx-3">
          {/* Left Column - Map or Ticket Categories */}
          <div className="w-full lg:w-2/3 px-3 mb-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b border-gray-200">
                  <TabsList className="h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="map" 
                      className="px-4 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                    >
                      Stadium Map
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tickets" 
                      className="px-4 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                    >
                      Ticket Types
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="map" className="m-0">
                  {match && (
                    <StadiumMap 
                      matchName={matchName} 
                      venue={match.venue} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="tickets" className="m-0">
                  <TicketTypes matchId={matchId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right Column - Booking Summary */}
          <div className="w-full lg:w-1/3 px-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium">Booking Help</h3>
              </div>
              
              <div className="p-4">
                <div className="mb-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    <strong>How to book tickets:</strong>
                  </p>
                  <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                    <li>Select a section from the stadium map or choose a ticket type</li>
                    <li>Select the quantity of tickets you want to book</li>
                    <li>Fill in your contact details</li>
                    <li>Make payment using UPI</li>
                    <li>Verify your booking in the "My Bookings" section</li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Tickets are subject to availability and will be confirmed only after successful payment.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveTab("tickets")} 
                    className="w-full"
                  >
                    View Available Tickets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
