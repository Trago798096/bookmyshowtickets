import { SPONSORS } from "@/lib/constants";

export default function Sponsors() {
  return (
    <section className="py-8 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Official Partners</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {SPONSORS.map((sponsor) => (
            <div 
              key={sponsor.name}
              className="w-24 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="max-h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
