import Navbar from "@/components/Navbar";
import SearchHero from "@/components/SearchHero";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <SearchHero />
    </main>
    <Footer />
  </div>
);

export default Index;
