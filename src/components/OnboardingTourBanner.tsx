import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const TOUR_STEPS: Record<
  number,
  { message: string; nextLabel: string; nextPath: string; isLast?: boolean }
> = {
  1: {
    message: "This is Nearby — see who's around you. Use location to find businesses and people.",
    nextLabel: "Next: Try search",
    nextPath: "/results?q=services&onboarding_tour=2",
  },
  2: {
    message: "Search for anything — services, goods, or people. Our AI matches you to the right providers.",
    nextLabel: "Next: Your profile",
    nextPath: "/profile/edit?onboarding_tour=3",
  },
  3: {
    message: "Add your details here. Upload goods (photos, price, location) or add your service offering and rates.",
    nextLabel: "Next: Dashboard",
    nextPath: "/dashboard?onboarding_tour=4",
  },
  4: {
    message: "You're all set. Search, browse, and message from here.",
    nextLabel: "Finish",
    nextPath: "/dashboard",
    isLast: true,
  },
};

export default function OnboardingTourBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const tourStep = searchParams.get("onboarding_tour");
  const stepNum = tourStep ? parseInt(tourStep, 10) : 0;

  if (!user || stepNum < 1 || stepNum > 4) return null;
  const step = TOUR_STEPS[stepNum];
  if (!step) return null;

  const handleNext = async () => {
    if (step.isLast) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq("user_id", user.id);
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      queryClient.setQueryData(["profile-onboarding", user.id], { onboarding_completed_at: new Date().toISOString() });
      setSearchParams((prev) => {
        prev.delete("onboarding_tour");
        return prev;
      });
      navigate("/dashboard", { replace: true });
      return;
    }
    navigate(step.nextPath);
  };

  const handleDismiss = () => {
    setSearchParams((prev) => {
      prev.delete("onboarding_tour");
      return prev;
    });
  };

  return (
    <div className="sticky top-14 sm:top-18 z-30 mx-auto max-w-2xl px-3 sm:px-4 py-2">
      <div className="rounded-2xl bg-primary text-primary-foreground shadow-lg border border-primary/20 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm font-medium flex-1 leading-snug">{step.message}</p>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 rounded-xl"
            onClick={handleNext}
          >
            {step.nextLabel}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-primary-foreground/20 text-primary-foreground"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
