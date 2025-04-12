import { Link } from "wouter";
import { ExternalLink, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { SPONSORS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <div className="text-primary font-heading font-bold text-2xl flex items-center mb-4">
              <span className="text-white">book</span>
              <span className="bg-primary text-white px-1 rounded">my</span>
              <span className="text-white">show</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Your one-stop destination for IPL tickets. Experience the thrill live!
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="text-gray-400 hover:text-white transition">
                    Matches
                  </Link>
                </li>
                <li>
                  <Link href="/my-bookings" className="text-gray-400 hover:text-white transition">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
              <p className="text-gray-400">Download our mobile app</p>
              <div className="flex space-x-2 mt-2">
                <a href="#" className="block">
                  <div className="h-10 bg-gray-800 text-white rounded px-3 py-2 flex items-center">
                    <span>App Store</span>
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </div>
                </a>
                <a href="#" className="block">
                  <div className="h-10 bg-gray-800 text-white rounded px-3 py-2 flex items-center">
                    <span>Google Play</span>
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-4 mb-6">
            {SPONSORS.map((sponsor) => (
              <div key={sponsor.name} className="flex flex-col items-center">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name} 
                  className="h-10 object-contain mb-2 opacity-70 hover:opacity-100 transition"
                />
                <span className="text-xs text-gray-500">{sponsor.role}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm">&copy; 2025 BookMyShow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
