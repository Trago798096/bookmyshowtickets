import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { adminCreateMatch, adminUpdateMatch } from "@/lib/api";
import { Match } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const matchFormSchema = z.object({
  team1: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  team2: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  team1Logo: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  team2Logo: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  venue: z.string().min(5, { message: "Venue must be at least 5 characters." }),
  stadium: z.string().min(3, { message: "Stadium name is required." }),
  date: z.string().min(3, { message: "Date is required." }),
  time: z.string().min(3, { message: "Time is required." }),
  isActive: z.boolean().default(true),
});

interface MatchFormProps {
  match?: Match | null;
  onSuccess: () => void;
}

export default function MatchForm({ match, onSuccess }: MatchFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof matchFormSchema>>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      team1: match?.team1 || "",
      team2: match?.team2 || "",
      team1Logo: match?.team1Logo || "",
      team2Logo: match?.team2Logo || "",
      venue: match?.venue || "",
      stadium: match?.stadium || "",
      date: match?.date || "",
      time: match?.time || "",
      isActive: match?.isActive ?? true,
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: adminCreateMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Match created",
        description: "The match has been created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create match. Please try again.",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Match> }) => 
      adminUpdateMatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Match updated",
        description: "The match has been updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update match. Please try again.",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: z.infer<typeof matchFormSchema>) => {
    setIsSubmitting(true);
    if (match) {
      updateMatchMutation.mutate({ id: match.id, data });
    } else {
      createMatchMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="team1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team 1</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Mumbai Indians" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="team2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team 2</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Chennai Super Kings" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="team1Logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team 1 Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="team2Logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team 2 Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="e.g. M. Chinnaswamy Stadium, Bengaluru, Karnataka" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stadium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stadium Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. M. Chinnaswamy Stadium" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 10 April 2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 7:30 PM IST" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Show this match to users for booking
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
            {isSubmitting ? "Saving..." : match ? "Update Match" : "Add Match"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
