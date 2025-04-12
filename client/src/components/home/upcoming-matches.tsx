import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CalendarDays, Clock, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMatches } from "@/lib/api";
import { Match } from "@shared/schema";
import { TEAM_LOGOS } from "@/lib/constants";

export default function UpcomingMatches() {
  const [limit, setLimit] = useState(4);
  
  const { data: matches, isLoading, isError, refetch, isFetching } = useQuery<Match[]>({
    queryKey: ['matches-active'],
    queryFn: () => fetchMatches(true),
    staleTime: 30000, // 30 seconds
    retry: 3,
    refetchOnWindowFocus: false,
    refetchInterval: 60000 // Automatically refetch every minute
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-6 w-full max-w-xl mb-8" />
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <div className="flex flex-col items-center mb-4 md:mb-0">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="h-5 w-40 mt-2" />
                  </div>
                  <Skeleton className="h-8 w-8 my-4" />
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="h-5 w-40 mt-2" />
                  </div>
                </div>
                <Skeleton className="h-6 w-full max-w-md mx-auto mb-4" />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-12 w-full sm:w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900">Upcoming Matches</h2>
          </div>
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p>Failed to load upcoming matches. Please try again later.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 flex items-center gap-1" 
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Refreshing...' : 'Try Again'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const displayedMatches = (matches || []).slice(0, limit);
  
  return (
    <section id="matches" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900">Upcoming Matches</h2>
          <Link href="/matches" className="text-primary font-semibold hover:underline">
            View All Matches
          </Link>
        </div>
        <p className="text-gray-600 mb-8">Book tickets for upcoming matches through the match list below</p>
        
        {displayedMatches.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg text-center">
            <p className="text-lg font-medium mb-2">No upcoming matches available at the moment.</p>
            <p className="text-sm">Please check back later for new matches.</p>
          </div>
        ) : (
          <>
            {displayedMatches.map((match) => (
              <div 
                key={match.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarDays className="h-4 w-4" />
                      <span>{match.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{match.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div className="flex flex-col items-center mb-4 md:mb-0">
                      <img 
                        src={match.team1Logo || TEAM_LOGOS[match.team1] || '/images/placeholder-team.png'} 
                        alt={match.team1}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-team.png';
                        }}
                      />
                      <h3 className="font-medium mt-2 text-center">{match.team1}</h3>
                    </div>
                    
                    <div className="text-xl font-bold my-4">VS</div>
                    
                    <div className="flex flex-col items-center">
                      <img 
                        src={match.team2Logo || TEAM_LOGOS[match.team2] || '/images/placeholder-team.png'} 
                        alt={match.team2}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-team.png';
                        }}
                      />
                      <h3 className="font-medium mt-2 text-center">{match.team2}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center flex-wrap justify-center sm:justify-start gap-3">
                      <span className="text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full text-sm">Selling Fast</span>
                      <span className="text-amber-600 font-medium px-2 py-1 bg-amber-50 rounded-full text-sm">Limited Seats</span>
                    </div>
                    <Link href={`/matches/${match.id}`}>
                      <Button className="w-full sm:w-auto whitespace-nowrap bg-primary hover:bg-primary/90">
                        Book Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {matches && matches.length > limit && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setLimit(matches.length)} 
                  className="px-6 py-3 border border-gray-300 font-semibold rounded-md hover:bg-gray-50 transition"
                >
                  View All Matches
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
