import Navbar from "@/components/Navbar";
import SearchHero from "@/components/SearchHero";
import HowItWorksSection from "@/components/HowItWorksSection";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SearchHero />
      <HowItWorksSection />
      <CategoriesSection />
      <Footer />
    </div>
  );
};

export default Index;
