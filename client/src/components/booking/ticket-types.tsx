import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { matchesApi } from "@/lib/api";
import { TicketType } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface TicketTypesProps {
  matchId: number;
}

export default function TicketTypes({ matchId }: TicketTypesProps) {
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: ticketTypes, isLoading, isError } = useQuery<TicketType[]>({
    queryKey: [`/api/matches/${matchId}/tickets`],
    queryFn: () => matchesApi.getTicketTypes(matchId),
  });

  const selectedTicketType = selectedTicketTypeId 
    ? ticketTypes?.find(t => t.id === selectedTicketTypeId) 
    : null;

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-60 mb-4" />
        <Skeleton className="h-5 w-full max-w-md mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Select a ticket type</h3>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Failed to load ticket types. Please try again later.
        </div>
      </div>
    );
  }

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Select a ticket type</h3>
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
          No ticket types available for this match.
        </div>
      </div>
    );
  }

  const handleIncreaseQuantity = () => {
    if (selectedTicketType && quantity < selectedTicketType.availableSeats) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Select a ticket type</h3>
      <p className="text-gray-600 mb-4">Choose from our available ticket categories</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {ticketTypes.map((ticket) => (
          <div 
            key={ticket.id}
            className={`border rounded-lg p-4 cursor-pointer transition hover:border-primary ${
              selectedTicketTypeId === ticket.id ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
            onClick={() => setSelectedTicketTypeId(ticket.id)}
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">Price: {formatCurrency(ticket.price)}</span>
              <span className={`text-sm ${ticket.availableSeats < 50 ? 'text-amber-600' : 'text-gray-600'}`}>
                {ticket.availableSeats} seats available
              </span>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">{ticket.name}</h4>
              {ticket.description && (
                <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTicketType && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-3">Booking Details</h4>

          <div className="flex justify-between items-center mb-3">
            <span>Ticket Type:</span>
            <span className="font-medium">{selectedTicketType.name}</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span>Price per Ticket:</span>
            <span className="font-medium">{formatCurrency(selectedTicketType.price)}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span>Quantity:</span>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-r-none" 
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <div className="w-12 h-8 flex items-center justify-center border-y border-input bg-white">
                {quantity}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-l-none" 
                onClick={handleIncreaseQuantity}
                disabled={selectedTicketType.availableSeats <= quantity}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-3 mb-4">
            <span>Total:</span>
            <span>{formatCurrency(selectedTicketType.price * quantity)}</span>
          </div>

          <Link href={`/booking-summary/${selectedTicketType.id}/${quantity}`}>
            <Button className="w-full">Proceed to Booking</Button>
          </Link>
        </div>
      )}
    </div>
  );
}