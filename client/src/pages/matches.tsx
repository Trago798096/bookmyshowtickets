import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Match } from "@shared/schema";
import { CalendarDays, Clock, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TEAM_LOGOS } from "@/lib/constants";

const fetchMatches = async (activeOnly: boolean = false): Promise<Match[]> => {
  let query = supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: true });
  
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
  
  return data || [];
};

export default function Matches() {
  const { data: matches, isLoading, isError } = useQuery<Match[]>({
    queryKey: ['matches', { active: true }],
    queryFn: () => fetchMatches(true),
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">IPL 2025 - All Matches</h1>
        <p className="text-gray-600 mb-8">
          Book tickets for the Indian Premier League 2025. Select a match below to proceed.
        </p>

        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
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
        )}

        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Failed to load matches. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && matches?.length === 0 && (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
            No matches available at the moment.
          </div>
        )}

        {!isLoading && !isError && matches && matches.length > 0 && (
          <div className="space-y-6">
            {matches.map((match) => (
              <div 
                key={match.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition"
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
                        src={match.team1Logo || TEAM_LOGOS[match.team1] || 'https://via.placeholder.com/100'} 
                        alt={match.team1}
                        className="w-16 h-16 object-contain"
                      />
                      <h3 className="font-medium mt-2 text-center">{match.team1}</h3>
                    </div>
                    
                    <div className="text-xl font-bold my-4">VS</div>
                    
                    <div className="flex flex-col items-center">
                      <img 
                        src={match.team2Logo || TEAM_LOGOS[match.team2] || 'https://via.placeholder.com/100'} 
                        alt={match.team2}
                        className="w-16 h-16 object-contain"
                      />
                      <h3 className="font-medium mt-2 text-center">{match.team2}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                      <span className="text-green-600 font-medium mr-4">Hurry! Seats Selling Out</span>
                      <span className="text-amber-600 font-medium">Only a Few Left!</span>
                    </div>
                    <Link href={`/matches/${match.id}`}>
                      <Button className="w-full sm:w-auto whitespace-nowrap">
                        Book Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
