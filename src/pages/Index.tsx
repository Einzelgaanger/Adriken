import Navbar from "@/components/Navbar";
import OnboardingTourBanner from "@/components/OnboardingTourBanner";
import SearchHero from "@/components/SearchHero";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <OnboardingTourBanner />
    <main>
      <SearchHero />
    </main>
    <Footer />
  </div>
);

export default Index;
