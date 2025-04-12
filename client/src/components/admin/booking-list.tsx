import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { adminUpdateBookingStatus } from "@/lib/api";
import { Booking } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { 
  CalendarDays, 
  Clock, 
  Mail, 
  Phone, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  ChevronDown,
  CreditCard,
  Tag
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BookingListProps {
  bookings: Booking[];
}

export default function BookingList({ bookings }: BookingListProps) {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"approved" | "rejected" | null>(null);
  const [openBookingId, setOpenBookingId] = useState<number | null>(null);

  const statusUpdateMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      adminUpdateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({
        title: "Status updated",
        description: `Booking has been ${newStatus}`,
      });
      setIsStatusDialogOpen(false);
      setSelectedBooking(null);
      setNewStatus(null);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status. Please try again.",
      });
    },
  });

  const handleApprove = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus("approved");
    setIsStatusDialogOpen(true);
  };

  const handleReject = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus("rejected");
    setIsStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedBooking && newStatus) {
      statusUpdateMutation.mutate({
        bookingId: selectedBooking.bookingId,
        status: newStatus,
      });
    }
  };

  const toggleBookingDetails = (bookingId: number) => {
    setOpenBookingId(openBookingId === bookingId ? null : bookingId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No bookings found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Collapsible
          key={booking.id}
          open={openBookingId === booking.id}
          onOpenChange={() => toggleBookingDetails(booking.id)}
          className="border rounded-lg overflow-hidden"
        >
          <div className="bg-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="font-medium">{booking.fullName}</div>
                <div className="text-sm text-gray-500">#{booking.bookingId.slice(-8)}</div>
                {getStatusBadge(booking.status)}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${openBookingId === booking.id ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">Toggle details</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <div className="flex flex-wrap justify-between mt-2">
              <div className="text-sm text-gray-600 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>Match ID: {booking.matchId}</span>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                <span>{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <CollapsibleContent>
            <Card className="m-0 rounded-none border-t">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" /> {booking.fullName}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" /> {booking.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" /> {booking.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Booking Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="h-4 w-4 mr-2" /> Created: {new Date(booking.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Tag className="h-4 w-4 mr-2" /> Ticket Type: ID {booking.ticketTypeId}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="h-4 w-4 mr-2" /> Quantity: {booking.quantity} tickets
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2 text-gray-900">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-500">Base Amount:</div>
                      <div className="font-medium">{formatCurrency(booking.baseAmount)}</div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-500">GST + Service Fee:</div>
                      <div className="font-medium">{formatCurrency(booking.gst + booking.serviceFee)}</div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-500">Total Amount:</div>
                      <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm mb-4">
                    <div className="text-gray-500">Payment Method:</div>
                    <div className="font-medium">{booking.paymentMethod || "UPI"}</div>
                    {booking.utrNumber && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">UTR Number:</span>
                        <span className="font-medium break-all">{booking.utrNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {booking.status === 'pending' && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleReject(booking)}
                      className="border-red-200 hover:bg-red-50 text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleApprove(booking)}
                      className="border-green-200 hover:bg-green-50 text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'approved' ? 'Approve Booking' : 'Reject Booking'}
            </DialogTitle>
            <DialogDescription>
              {newStatus === 'approved'
                ? 'Are you sure you want to approve this booking? This will confirm the user\'s tickets.'
                : 'Are you sure you want to reject this booking? The user will need to make a new booking.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Booking ID:</span>
                <span>{selectedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Customer:</span>
                <span>{selectedBooking.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <span>{formatCurrency(selectedBooking.totalAmount)}</span>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={newStatus === 'approved' ? 'default' : 'destructive'}
              onClick={confirmStatusChange}
              disabled={statusUpdateMutation.isPending}
            >
              {statusUpdateMutation.isPending
                ? 'Processing...'
                : newStatus === 'approved'
                ? 'Yes, Approve'
                : 'Yes, Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
