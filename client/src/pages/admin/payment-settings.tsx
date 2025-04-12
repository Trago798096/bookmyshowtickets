import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchActiveUpiDetail, adminUpdateUpiDetail, adminCreateUpiDetail } from "@/lib/api";
import { UpiDetail } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, QrCode, Edit, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import UpiForm from "@/components/admin/upi-form";

export default function PaymentSettings() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: upiDetail, 
    isLoading, 
    isError,
    refetch 
  } = useQuery<UpiDetail>({
    queryKey: ['/api/upi-details'],
    queryFn: fetchActiveUpiDetail,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (detail: Partial<UpiDetail>) => adminUpdateUpiDetail(detail.id!, detail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/upi-details'] });
      toast({
        title: "UPI status updated",
        description: "The UPI details have been updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update UPI status. Please try again.",
      });
    },
  });

  const handleToggleActive = () => {
    if (upiDetail) {
      toggleActiveMutation.mutate({
        id: upiDetail.id,
        isActive: !upiDetail.isActive
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-gray-500">Manage UPI and payment options</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            {upiDetail ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit UPI Details
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Add UPI Details
              </>
            )}
          </Button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading UPI details</p>
            <p>Please try refreshing the page or check your connection.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>UPI Payment Details</CardTitle>
            <CardDescription>
              Manage the UPI ID and QR code used for ticket payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-64 w-64 mx-auto" />
              </div>
            ) : upiDetail ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">UPI ID</p>
                    <p className="text-lg font-bold">{upiDetail.upiId}</p>
                  </div>
                  <Button 
                    variant={upiDetail.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleActive}
                    disabled={toggleActiveMutation.isPending}
                  >
                    {upiDetail.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">QR Code</p>
                  <div className="bg-white p-3 border border-gray-200 rounded-lg inline-block">
                    <img 
                      src={upiDetail.qrCode || "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"} 
                      alt="UPI QR Code" 
                      className="max-w-full h-auto max-h-64"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p className="mt-2">
                    <strong>Note:</strong> This UPI ID and QR code will be shown to users during the payment process.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No UPI details configured yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Add UPI Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
            <CardDescription>
              Guidelines for users during the payment process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Payment Process</h3>
                <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                  <li>User scans the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                  <li>User completes the payment for the ticket amount</li>
                  <li>User enters the UTR number or transaction ID in the booking form</li>
                  <li>Admin verifies the payment and approves the booking</li>
                  <li>Ticket is confirmed and sent to the user's email</li>
                </ol>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Admin Verification</h3>
                <p className="text-sm text-gray-600">
                  As an admin, you'll need to verify the UTR numbers provided by users against actual
                  payments received in your UPI account. Approve or reject bookings based on this verification.
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Important Notes</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>Always ensure the UPI ID is active and working</li>
                  <li>Regularly update the QR code if the UPI ID changes</li>
                  <li>Keep track of all transactions for reconciliation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit UPI Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>UPI Payment Settings</DialogTitle>
            <DialogDescription>
              Configure UPI payment details below.
            </DialogDescription>
          </DialogHeader>
          <UpiForm 
            upiDetail={upiDetail || undefined}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
