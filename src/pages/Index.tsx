import Navbar from "@/components/Navbar";
import SearchHero from "@/components/SearchHero";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // Signed-in users see just the search section with warm background
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <Navbar />
        <main>
          <SearchHero />
        </main>
      </div>
    );
  }

  // Non-signed-in users see the streamlined homepage
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SearchHero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
