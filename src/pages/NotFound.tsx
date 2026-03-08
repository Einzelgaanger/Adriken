import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 flex items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="text-7xl sm:text-8xl font-display font-bold text-gradient mb-4">404</div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Button variant="hero" asChild className="h-12 rounded-xl touch-manipulation">
              <Link to="/"><Home className="w-4 h-4 mr-2" /> Go Home</Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="h-12 rounded-xl touch-manipulation">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
