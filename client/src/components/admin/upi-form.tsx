import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { adminCreateUpiDetail, adminUpdateUpiDetail } from "@/lib/api";
import { UpiDetail } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const upiFormSchema = z.object({
  upiId: z.string().min(3, { message: "UPI ID must be at least 3 characters." }),
  qrCode: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

interface UpiFormProps {
  upiDetail?: UpiDetail;
  onSuccess: () => void;
}

export default function UpiForm({ upiDetail, onSuccess }: UpiFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: upiDetail?.upiId || "",
      qrCode: upiDetail?.qrCode || "",
      isActive: upiDetail?.isActive ?? true,
    },
  });

  const createUpiMutation = useMutation({
    mutationFn: adminCreateUpiDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/upi-details'] });
      toast({
        title: "UPI details created",
        description: "The UPI details have been added successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create UPI details. Please try again.",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateUpiMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UpiDetail> }) => 
      adminUpdateUpiDetail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/upi-details'] });
      toast({
        title: "UPI details updated",
        description: "The UPI details have been updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update UPI details. Please try again.",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: z.infer<typeof upiFormSchema>) => {
    setIsSubmitting(true);
    if (upiDetail) {
      updateUpiMutation.mutate({ id: upiDetail.id, data });
    } else {
      createUpiMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="upiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPI ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. yourname@upi" {...field} />
              </FormControl>
              <FormDescription>
                This is the UPI ID that users will pay to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qrCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/qrcode.png" {...field} />
              </FormControl>
              <FormDescription>
                URL to the QR code image for scanning
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Enable this UPI payment method for users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : upiDetail ? "Update UPI" : "Add UPI"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
