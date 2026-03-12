import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeNextPath } from "@/lib/auth-redirects";
import { logSignIn } from "@/lib/analytics";

const waitForSession = async (): Promise<Session | null> => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return null;
};

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const completeAuth = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const authType = hashParams.get("type") ?? queryParams.get("type");
        const nextPath = sanitizeNextPath(queryParams.get("next"), "/dashboard");
        const isRecoveryFlow = authType === "recovery" || nextPath.startsWith("/reset-password");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        const session = await waitForSession();
        if (!session) throw new Error("Authentication session could not be restored.");

        if (session.user) void logSignIn(session.user.id, session.user.email);

        if (window.location.hash.includes("access_token")) {
          const cleanUrl = `${window.location.pathname}${window.location.search}`;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        if (!active) return;
        navigate(isRecoveryFlow ? "/reset-password?flow=recovery" : nextPath, { replace: true });
      } catch (error) {
        if (!active) return;
        toast.error("Authentication link is invalid or expired.");
        navigate("/login", { replace: true });
      }
    };

    void completeAuth();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default AuthCallback;
