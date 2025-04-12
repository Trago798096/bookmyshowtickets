import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Pages
import Home from "@/pages/home";
import Matches from "@/pages/matches";
import MatchBooking from "@/pages/match-booking";
import BookingSummary from "@/pages/booking-summary";
import Payment from "@/pages/payment";
import BookingConfirmation from "@/pages/booking-confirmation";
import MyBookings from "@/pages/my-bookings";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminMatches from "@/pages/admin/matches";
import AdminBookings from "@/pages/admin/bookings";
import AdminPaymentSettings from "@/pages/admin/payment-settings";

// Layouts
import MainLayout from "@/components/layout/main-layout";
import AdminLayout from "@/components/layout/admin-layout";

function Router() {
  return (
    <Switch>
      {/* User Routes */}
      <Route path="/">
        <MainLayout>
          <Home />
        </MainLayout>
      </Route>
      <Route path="/matches">
        <MainLayout>
          <Matches />
        </MainLayout>
      </Route>
      <Route path="/matches/:id">
        {(params) => (
          <MainLayout>
            <MatchBooking matchId={Number(params.id)} />
          </MainLayout>
        )}
      </Route>
      <Route path="/booking-summary/:ticketTypeId/:quantity">
        {(params) => (
          <MainLayout>
            <BookingSummary 
              ticketTypeId={Number(params.ticketTypeId)}
              quantity={Number(params.quantity)}
            />
          </MainLayout>
        )}
      </Route>
      <Route path="/payment/:bookingId">
        {(params) => (
          <MainLayout>
            <Payment bookingId={params.bookingId} />
          </MainLayout>
        )}
      </Route>
      <Route path="/booking-confirmation/:bookingId">
        {(params) => (
          <MainLayout>
            <BookingConfirmation bookingId={params.bookingId} />
          </MainLayout>
        )}
      </Route>
      <Route path="/my-bookings">
        <MainLayout>
          <MyBookings />
        </MainLayout>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/matches">
        <AdminLayout>
          <AdminMatches />
        </AdminLayout>
      </Route>
      <Route path="/admin/bookings">
        <AdminLayout>
          <AdminBookings />
        </AdminLayout>
      </Route>
      <Route path="/admin/payment-settings">
        <AdminLayout>
          <AdminPaymentSettings />
        </AdminLayout>
      </Route>
      
      {/* 404 Route */}
      <Route>
        <MainLayout>
          <NotFound />
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
