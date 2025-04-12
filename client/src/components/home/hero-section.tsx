import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <div className="h-16 md:h-20 bg-primary bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold">IPL 2025</h2>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">
            INDIA - Indian Premier League 2025
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Sat 22 March 2025 Onwards • Multiple Venues
          </p>
          <p className="text-gray-200 mb-8 text-lg">
            The biggest cricket league is back! Book your tickets now and witness the action live.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/matches">
              <Button size="lg" className="text-lg font-bold transition transform hover:-translate-y-1">
                Book Tickets
              </Button>
            </Link>
            <Link href="/matches">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg font-bold text-white border-white hover:bg-white hover:text-gray-900 transition transform hover:-translate-y-1"
              >
                View All Matches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
