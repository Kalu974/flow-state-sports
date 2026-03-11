import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GymSection from "@/components/GymSection";
import StadiumSection from "@/components/StadiumSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <GymSection />
      <StadiumSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
