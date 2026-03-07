import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProviderCard from "@/components/ProviderCard";
import { mockProviders } from "@/data/mockProviders";
import { Button } from "@/components/ui/button";

const matchReasons = [
  "Closest to you with 8 years childcare experience & top ratings",
  "Expert chef with dietary specialization, available this week",
  "Eco-friendly cleaning with 500+ completed jobs nearby",
  "Jack-of-all-trades handyman — plumbing, electrical, carpentry",
  "Perfect 5.0 rating — specializes in home fitness sessions",
  "20 years strategic consulting, ideal for startups",
];

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-primary mb-2 font-medium">
              <Sparkles className="w-4 h-4" />
              AI-powered results
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Results for: "{query}"
            </h1>
            <p className="text-muted-foreground">
              Found {mockProviders.length} service providers near you, ranked by best match.
            </p>
          </motion.div>

          <div className="space-y-4">
            {mockProviders.map((provider, i) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                index={i}
                matchReason={matchReasons[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
