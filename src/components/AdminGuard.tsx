import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = ["binfred.ke@gmail.com", "adriankenadams@gmail.com"];
const LOGOUT_GRACE_MS = 600;

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((a) => a.toLowerCase() === lower);
}

/** Protects /weareadmins: requires login, then checks admin list. Avoids redirect on brief auth flicker. */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (user) {
      setShouldRedirectToLogin(false);
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
      if (isAdminEmail(user.email ?? undefined)) {
        setAdminStatus(true);
        return;
      }
      let mounted = true;
      supabase.rpc("get_my_admin_status").then(({ data, error }) => {
        if (!mounted) return;
        if (error) setAdminStatus(false);
        else setAdminStatus(data === true);
      });
      return () => {
        mounted = false;
      };
    }
    // User is null: wait before treating as logged out (avoids kick-out on auth flicker/token refresh)
    if (graceTimerRef.current) return;
    graceTimerRef.current = setTimeout(() => {
      graceTimerRef.current = null;
      setAdminStatus(false);
      setShouldRedirectToLogin(true);
    }, LOGOUT_GRACE_MS);
    return () => {
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
    };
  }, [user]);

  if (authLoading || (user && adminStatus === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (shouldRedirectToLogin) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!adminStatus) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
