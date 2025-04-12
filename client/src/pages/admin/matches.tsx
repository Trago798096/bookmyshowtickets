import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, Plus, RefreshCcw, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchMatches, adminDeleteMatch } from "@/lib/api";
import { Match, TicketType } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MatchForm from "@/components/admin/match-form";
import { fetchTicketTypesByMatchId } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { TEAM_LOGOS } from "@/lib/constants";

export default function AdminMatches() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    data: matches, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<Match[]>({
    queryKey: ['/api/matches'],
    queryFn: () => fetchMatches(),
  });

  const { 
    data: selectedMatchTickets,
    isLoading: isTicketsLoading 
  } = useQuery<TicketType[]>({
    queryKey: [`/api/matches/${selectedMatch?.id}/tickets`],
    queryFn: () => fetchTicketTypesByMatchId(selectedMatch!.id),
    enabled: !!selectedMatch,
  });

  // Delete match mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Match deleted",
        description: "The match has been successfully deleted",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete match. Please try again.",
      });
    },
  });

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setIsAddDialogOpen(true);
  };

  const handleDeleteMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMatch) {
      deleteMutation.mutate(selectedMatch.id);
    }
  };

  const handleViewTickets = (match: Match) => {
    setSelectedMatch(match);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setEditingMatch(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Matches Management</h1>
          <p className="text-gray-500">Manage IPL matches and their ticket types</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Match
          </Button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading matches</p>
            <p>Please try refreshing the page or check your connection.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="matches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matches">All Matches</TabsTrigger>
          <TabsTrigger value="tickets" disabled={!selectedMatch}>Ticket Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : matches && matches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {matches.map((match) => (
                <Card key={match.id} className={`${!match.isActive ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{match.team1} vs {match.team2}</CardTitle>
                        {!match.isActive && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewTickets(match)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Tickets</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMatch(match)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit Match</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMatch(match)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Match</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{match.date}, {match.time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center flex-1 overflow-hidden">
                        <img 
                          src={match.team1Logo || TEAM_LOGOS[match.team1] || 'https://via.placeholder.com/30'} 
                          alt={match.team1}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="mx-2">vs</span>
                        <img 
                          src={match.team2Logo || TEAM_LOGOS[match.team2] || 'https://via.placeholder.com/30'} 
                          alt={match.team2}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{match.venue}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No matches found. Click "Add Match" to create one.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tickets">
          {selectedMatch && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Ticket Types: {selectedMatch.team1} vs {selectedMatch.team2}
                </h2>
                <Button size="sm" variant="outline" onClick={() => setSelectedMatch(null)}>
                  Back to Matches
                </Button>
              </div>
              
              {isTicketsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : selectedMatchTickets && selectedMatchTickets.length > 0 ? (
                <div className="space-y-2">
                  {selectedMatchTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{ticket.name}</h3>
                            <p className="text-sm text-gray-500">{ticket.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(ticket.price)}</div>
                            <div className="text-sm text-gray-500">
                              {ticket.availableSeats} / {ticket.totalSeats} seats
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No ticket types found for this match.
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Match Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Match</DialogTitle>
            <DialogDescription>
              Fill in the match details below.
            </DialogDescription>
          </DialogHeader>
          <MatchForm onSubmit={handleAddMatch} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this match? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Match"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
