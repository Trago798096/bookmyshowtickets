import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useBookingEmailStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createBooking } from "@/lib/api";
import { calculateTotalAmount, generateBookingId } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
});

interface CustomerFormProps {
  ticketTypeId: number;
  matchId: number;
  quantity: number;
  baseAmount: number;
}

export default function CustomerForm({ ticketTypeId, matchId, quantity, baseAmount }: CustomerFormProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { setEmail } = useBookingEmailStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { gst, serviceFee, totalAmount } = calculateTotalAmount(baseAmount);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const bookingId = generateBookingId();
      
      const booking = {
        bookingId,
        matchId,
        ticketTypeId,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        quantity,
        baseAmount,
        gst,
        serviceFee,
        totalAmount,
        status: "pending",
      };

      const response = await createBooking(booking);
      const createdBooking = await response.json();
      
      // Save the email for later use in my bookings
      setEmail(values.email);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${matchId}/tickets`] });
      
      toast({
        title: "Booking created",
        description: "Proceeding to payment...",
      });
      
      navigate(`/payment/${createdBooking.bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium">Customer Information</h3>
      </div>
      
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
