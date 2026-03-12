import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = ["binfred.ke@gmail.com", "adriankenadams@gmail.com"];

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((a) => a.toLowerCase() === lower);
}

/** Protects /weareadmins: requires login, then checks admin list (client + optional RPC). Non-admins redirect to dashboard. */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setAdminStatus(false);
      return;
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
  }, [user]);

  if (authLoading || (user && adminStatus === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!adminStatus) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
