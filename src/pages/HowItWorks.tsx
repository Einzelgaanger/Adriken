import Navbar from "@/components/Navbar";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

const HowItWorks = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <HowItWorksSection />
    </div>
    <Footer />
  </div>
);

export default HowItWorks;
