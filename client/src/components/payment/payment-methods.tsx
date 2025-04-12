import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, CreditCard, Landmark, QrCode, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { fetchActiveUpiDetail } from "@/lib/api";
import { UpiDetail } from "@shared/schema";
import { PAYMENT_METHODS } from "@/lib/constants";
import UpiPayment from "./upi-payment";

interface PaymentMethodsProps {
  amount: number;
  bookingId: string;
  onPaymentComplete: () => void;
}

export default function PaymentMethods({ amount, bookingId, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  
  const { data: upiDetail, isLoading } = useQuery<UpiDetail>({
    queryKey: ['/api/upi-details'],
    queryFn: fetchActiveUpiDetail,
  });

  const getPaymentIcon = (id: string) => {
    switch (id) {
      case 'upi':
        return <QrCode className="h-5 w-5" />;
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'wallet':
        return <Wallet className="h-5 w-5" />;
      case 'netbanking':
        return <Landmark className="h-5 w-5" />;
      default:
        return <QrCode className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">Payment Options</h3>
        <p className="text-sm text-gray-600 mt-1">All Payment Options</p>
      </div>
      
      <div className="p-4">
        <RadioGroup 
          value={selectedMethod} 
          onValueChange={setSelectedMethod}
          className="space-y-4"
        >
          {PAYMENT_METHODS.map((method) => (
            <div 
              key={method.id}
              className={`flex items-center p-3 rounded-lg border ${
                selectedMethod === method.id 
                  ? 'bg-primary/5 border-primary' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <RadioGroupItem 
                value={method.id} 
                id={method.id} 
                className="mr-3"
              />
              <Label 
                htmlFor={method.id}
                className="flex items-center flex-1 cursor-pointer"
              >
                {getPaymentIcon(method.id)}
                <span className="ml-3 font-medium">{method.name}</span>
                {selectedMethod === method.id && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {selectedMethod === 'upi' && (
          <div className="mt-4">
            <UpiPayment 
              upiDetail={upiDetail} 
              isLoading={isLoading}
              amount={amount} 
              bookingId={bookingId}
              onPaymentComplete={onPaymentComplete}
            />
          </div>
        )}
        
        {selectedMethod !== 'upi' && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600">This payment method is currently unavailable.</p>
            <p className="text-gray-600 mt-1">Please use UPI for payment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
