import Navbar from "@/components/Navbar";
import SearchHero from "@/components/SearchHero";
import SocialProofSection from "@/components/SocialProofSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CategoriesSection from "@/components/CategoriesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // Signed-in users see just the search (AI chat) section
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <SearchHero />
        </main>
      </div>
    );
  }

  // Non-signed-in users see the full homepage
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SearchHero />
        <SocialProofSection />
        <HowItWorksSection />
        <CategoriesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
