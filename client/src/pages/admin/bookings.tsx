import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, AlertTriangle, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminFetchAllBookings } from "@/lib/api";
import { Booking } from "@shared/schema";
import BookingList from "@/components/admin/booking-list";

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    data: bookings, 
    isLoading, 
    isError,
    refetch 
  } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
    queryFn: adminFetchAllBookings,
  });

  // Filter bookings based on status and search term
  const filteredBookings = bookings?.filter((booking) => {
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesSearch = searchTerm 
      ? booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  // Get counts for each status
  const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0;
  const approvedCount = bookings?.filter(b => b.status === 'approved').length || 0;
  const rejectedCount = bookings?.filter(b => b.status === 'rejected').length || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-gray-500">Review and manage ticket bookings</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading bookings</p>
            <p>Please try refreshing the page or check your connection.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, email, ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Bookings {bookings && `(${bookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending {pendingCount > 0 && `(${pendingCount})`}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved {approvedCount > 0 && `(${approvedCount})`}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected {rejectedCount > 0 && `(${rejectedCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <BookingList bookings={filteredBookings} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              No bookings found matching your criteria.
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredBookings && filteredBookings.filter(b => b.status === 'pending').length > 0 ? (
            <BookingList bookings={filteredBookings.filter(b => b.status === 'pending')} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              No pending bookings found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredBookings && filteredBookings.filter(b => b.status === 'approved').length > 0 ? (
            <BookingList bookings={filteredBookings.filter(b => b.status === 'approved')} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              No approved bookings found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredBookings && filteredBookings.filter(b => b.status === 'rejected').length > 0 ? (
            <BookingList bookings={filteredBookings.filter(b => b.status === 'rejected')} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              No rejected bookings found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
