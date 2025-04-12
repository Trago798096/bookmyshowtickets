import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Ticket, Clock, Users, Percent, AlertCircle, RefreshCcw } from "lucide-react";
import { adminFetchAllBookings, fetchMatches } from "@/lib/api";
import { Booking, Match } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { 
    data: bookings, 
    isLoading: isBookingsLoading, 
    isError: isBookingsError,
    refetch: refetchBookings 
  } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
    queryFn: adminFetchAllBookings,
  });

  const { 
    data: matches, 
    isLoading: isMatchesLoading, 
    isError: isMatchesError,
    refetch: refetchMatches
  } = useQuery<Match[]>({
    queryKey: ['/api/matches'],
    queryFn: () => fetchMatches(),
  });

  const isLoading = isBookingsLoading || isMatchesLoading;
  const isError = isBookingsError || isMatchesError;

  // Calculate dashboard metrics
  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
  const approvedBookings = bookings?.filter(b => b.status === 'approved').length || 0;
  const totalMatches = matches?.length || 0;
  const activeMatches = matches?.filter(m => m.isActive).length || 0;
  
  // Calculate total revenue from approved bookings
  const totalRevenue = bookings
    ?.filter(b => b.status === 'approved')
    .reduce((sum, booking) => sum + booking.totalAmount, 0) || 0;

  // Calculate ticket utilization (simple version)
  const ticketUtilization = approvedBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0;

  // Handle refresh
  const handleRefresh = () => {
    refetchBookings();
    refetchMatches();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Overview of IPL ticket sales and bookings</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading dashboard data</p>
            <p>Please try refreshing the page or check your connection.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{totalBookings}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              All time bookings
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{pendingBookings}</div>
                <Badge variant="outline" className="ml-2">
                  {pendingBookings > 0 ? "Action Required" : "All Clear"}
                </Badge>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Waiting for approval
            </p>
          </CardContent>
        </Card>

        {/* Total Matches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPL Matches</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{totalMatches}</div>
                <span className="text-sm text-muted-foreground ml-1">
                  ({activeMatches} active)
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total scheduled matches
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              From approved bookings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Bookings Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Last {Math.min(5, totalBookings)} bookings from all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium truncate max-w-[200px]">{booking.fullName}</div>
                      <div className="text-sm text-gray-500">#{booking.bookingId.slice(-8)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                      <div>
                        <Badge variant={booking.status === 'approved' ? 'success' : booking.status === 'pending' ? 'outline' : 'destructive'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No bookings found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              Performance metrics for ticket sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Approval Rate</span>
                  </div>
                  <span className="font-bold">{ticketUtilization}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${ticketUtilization}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <div className="text-sm font-medium">Approved</div>
                    <div className="text-2xl font-bold">{approvedBookings}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Pending</div>
                    <div className="text-2xl font-bold">{pendingBookings}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Total</div>
                    <div className="text-2xl font-bold">{totalBookings}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
