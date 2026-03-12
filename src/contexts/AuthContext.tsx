import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { buildAuthCallbackUrl } from "@/lib/auth-redirects";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrapHashSession = async () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (!hash.includes("access_token") || !hash.includes("refresh_token")) return;

      try {
        const hashParams = new URLSearchParams(hash.replace("#", ""));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

        if (!access_token || !refresh_token) return;

        await supabase.auth.setSession({ access_token, refresh_token });
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (error) {
        console.error("Failed to restore session from URL hash", error);
      }
    };

    void bootstrapHashSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    // Record consent date on the profile after creation
    if (!error && data.user) {
      await supabase.from("profiles").update({
        data_consent: true,
        consent_date: new Date().toISOString(),
      }).eq("user_id", data.user.id);
    }
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error as Error | null };

    // Enforce confirmed email before allowing password login.
    if (data?.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return { error: new Error("Please confirm your email first before logging in.") };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
