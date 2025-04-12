import HeroSection from "@/components/home/hero-section";
import UpcomingMatches from "@/components/home/upcoming-matches";
import Sponsors from "@/components/home/sponsors";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingMatches />
      <Sponsors />
    </div>
  );
}
