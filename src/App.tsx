import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Results from "./pages/Results";
import ProviderDetail from "./pages/ProviderDetail";
import Nearby from "./pages/Nearby";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import CheckEmail from "./pages/CheckEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ViewingHistory from "./pages/ViewingHistory";
import ProfileEdit from "./pages/ProfileEdit";
import Onboarding from "./pages/Onboarding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import { supabase } from "./integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <Index />;
};

const DashboardRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-onboarding", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("onboarding_completed_at").eq("user_id", user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.onboarding_completed_at == null) return <Navigate to="/onboarding" replace />;
  return <Index />;
};

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/results" element={<Results />} />
      <Route path="/nearby" element={<Nearby />} />
      <Route path="/provider/:id" element={<ProviderDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/history" element={<ViewingHistory />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <CookieConsent />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
