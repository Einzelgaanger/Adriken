import Navbar from "@/components/Navbar";
import { Ghost404Page } from "@/components/ui/ghost-404-page";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <Ghost404Page />
      </div>
    </div>
  );
};

export default NotFound;
