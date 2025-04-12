import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/auth";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, admin } = useAuthStore();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Matches", href: "/matches" },
    { name: "My Bookings", href: "/my-bookings" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  // If we're on the admin pages and not authenticated, redirect to login
  useEffect(() => {
    if (location.startsWith('/admin') && location !== '/admin/login' && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [location, isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-primary font-heading font-bold text-2xl flex items-center">
            <span className="text-gray-800">book</span>
            <span className="bg-primary text-white px-1 rounded">my</span>
            <span className="text-gray-800">show</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-gray-800 hover:text-primary transition ${
                isActive(link.href) ? "font-semibold text-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated && admin && (
            <Link href="/admin/dashboard">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Admin Dashboard
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-2 md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col gap-6 mt-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-xl ${
                    isActive(link.href) ? "font-semibold text-primary" : "text-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && admin && (
                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
