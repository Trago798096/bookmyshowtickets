import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Copy, QrCode, Bolt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { updateBookingPayment } from "@/lib/api";
import { UpiDetail } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface UpiPaymentProps {
  upiDetail?: UpiDetail;
  isLoading: boolean;
  amount: number;
  bookingId: string;
  onPaymentComplete: () => void;
}

export default function UpiPayment({ 
  upiDetail, 
  isLoading, 
  amount, 
  bookingId,
  onPaymentComplete 
}: UpiPaymentProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const { toast } = useToast();
  
  const updatePaymentMutation = useMutation({
    mutationFn: () => updateBookingPayment(bookingId, "UPI", utrNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/${bookingId}`] });
      toast({
        title: "Payment successful",
        description: "Your UTR number has been submitted successfully",
      });
      onPaymentComplete();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "Failed to update payment information. Please try again.",
      });
    },
  });

  const handleCopyUpiId = () => {
    if (upiDetail?.upiId) {
      navigator.clipboard.writeText(upiDetail.upiId);
      toast({
        title: "UPI ID copied",
        description: "UPI ID has been copied to clipboard",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (utrNumber.trim().length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid UTR",
        description: "Please enter a valid UTR/Transaction number",
      });
      return;
    }
    updatePaymentMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg mb-6">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-40 w-40 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!upiDetail) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg mb-6 text-center">
        <QrCode className="h-10 w-10 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No UPI details available. Please try another payment method.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-6">
      <div className="flex justify-center mb-4">
        <div className="bg-white p-3 border border-gray-200 rounded-lg inline-block">
          <img 
            src={upiDetail.qrCode || "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"} 
            alt="QR Code" 
            className="w-40 h-40"
          />
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 mb-2">Scan the QR using any UPI App</p>
        <div className="flex justify-center space-x-1">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Google_Pay_%28GPay%29_Logo.svg/512px-Google_Pay_%28GPay%29_Logo.svg.png" 
            alt="GPay" 
            className="w-6 h-6"
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" 
            alt="Paytm" 
            className="w-6 h-6"
          />
          <img 
            src="https://www.phonepe.com/webstatic/static/favicon-76x76-02a17320.png"
            alt="PhonePe" 
            className="w-6 h-6"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-4 text-sm">
        <span className="mr-2 bg-gray-100 px-3 py-1 rounded-md">{upiDetail.upiId}</span>
        <Button variant="outline" size="sm" onClick={handleCopyUpiId}>
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 flex items-center justify-center">
          Pay with GPay & grab up to ₹400 instantly!
          <Bolt className="h-3 w-3 ml-1 text-yellow-500" />
        </p>
        <p className="text-xs text-gray-500">Amount to be Paid: {formatCurrency(amount)}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-4">
        <div className="mb-4">
          <Label htmlFor="utrNumber" className="block text-sm text-gray-600 mb-2">
            UTR No/Transaction Number
          </Label>
          <Input 
            id="utrNumber" 
            placeholder="Enter UTR or transaction number"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You'll find this in your UPI app payment history
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="font-medium">{formatCurrency(amount)}</span>
            {amount < 1000 && (
              <span className="text-xs text-green-600">(₹400 off)</span>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={updatePaymentMutation.isPending || !utrNumber}
          >
            {updatePaymentMutation.isPending ? "Processing..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
