import { useState } from "react";
import { STADIUM_SECTIONS } from "@/lib/constants";

interface StadiumMapProps {
  matchName: string;
  venue: string;
}

export default function StadiumMap({ matchName, venue }: StadiumMapProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Select a section from the stadium map</h3>
      <p className="text-gray-600 mb-4">Click on a section to select your preferred seating area</p>
      
      <div className="flex justify-center mb-6">
        <div className="relative max-w-md">
          <svg 
            viewBox="0 0 300 300" 
            className="w-full h-auto rounded-lg border border-gray-200"
          >
            {/* Stadium Outline */}
            <ellipse cx="150" cy="150" rx="145" ry="120" fill="#f0f0f0" stroke="#ccc" strokeWidth="1" />
            <ellipse cx="150" cy="150" rx="100" ry="75" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
            
            {/* Field */}
            <ellipse cx="150" cy="150" rx="50" ry="30" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
            <ellipse cx="150" cy="150" rx="5" ry="3" fill="#16a34a" />
            <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fill="#16a34a" fontWeight="bold" fontSize="10">PITCH</text>
            
            {/* Sections - North Pavilion */}
            <path 
              d="M 70,70 A 100,100 0 0,1 230,70 L 210,95 A 70,70 0 0,0 90,95 Z" 
              fill={activeSection === 'north' ? '#fbbf24' : '#fcd34d'} 
              stroke="#eab308" 
              strokeWidth="1"
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleSectionClick('north')}
            />
            
            {/* Sections - Premium Blocks */}
            <path 
              d="M 45,120 A 120,120 0 0,1 45,180 L 80,170 A 80,80 0 0,0 80,130 Z" 
              fill={activeSection === 'premium' ? '#f472b6' : '#f9a8d4'} 
              stroke="#db2777" 
              strokeWidth="1"
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleSectionClick('premium')}
            />
            <path 
              d="M 255,120 A 120,120 0 0,0 255,180 L 220,170 A 80,80 0 0,1 220,130 Z" 
              fill={activeSection === 'premium' ? '#f472b6' : '#f9a8d4'} 
              stroke="#db2777" 
              strokeWidth="1"
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleSectionClick('premium')}
            />
            
            {/* Sections - Club House */}
            <path 
              d="M 70,230 A 100,100 0 0,0 230,230 L 210,205 A 70,70 0 0,1 90,205 Z" 
              fill={activeSection === 'club' ? '#60a5fa' : '#93c5fd'} 
              stroke="#2563eb" 
              strokeWidth="1"
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleSectionClick('club')}
            />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {STADIUM_SECTIONS.map((section) => (
          <div key={section.id} className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${section.color} mr-2`}></div>
            <span className="text-sm">{section.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Match Information:</h4>
        <p className="text-sm text-gray-600 mb-1">{matchName}</p>
        <p className="text-sm text-gray-600">Venue: {venue}</p>
      </div>
    </div>
  );
}
