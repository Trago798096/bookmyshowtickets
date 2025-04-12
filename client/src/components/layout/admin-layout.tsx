import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Ticket, 
  CreditCard, 
  LogOut, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { admin, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <div className="text-primary font-heading font-bold text-2xl flex items-center">
            <span className="text-white">IPL</span>
            <span className="bg-primary text-white px-1 rounded ml-1">Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/admin") ? "bg-gray-800" : ""}`}
                onClick={() => navigate("/admin")}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant={isActive("/admin/matches") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/admin/matches") ? "bg-gray-800" : ""}`}
                onClick={() => navigate("/admin/matches")}
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                Matches
              </Button>
            </li>
            <li>
              <Button
                variant={isActive("/admin/bookings") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/admin/bookings") ? "bg-gray-800" : ""}`}
                onClick={() => navigate("/admin/bookings")}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Bookings
              </Button>
            </li>
            <li>
              <Button
                variant={isActive("/admin/payment-settings") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/admin/payment-settings") ? "bg-gray-800" : ""}`}
                onClick={() => navigate("/admin/payment-settings")}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Settings
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Header + Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between md:hidden">
          <div className="text-primary font-heading font-bold text-xl flex items-center">
            <span className="text-gray-800">IPL</span>
            <span className="bg-primary text-white px-1 rounded ml-1">Admin</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Menu <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/matches")}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Matches
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/bookings")}>
                <Ticket className="mr-2 h-4 w-4" />
                Bookings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/payment-settings")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
