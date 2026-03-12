import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserPlus, LogIn, Search, FileText, Sparkles, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import adrikenLogo from "@/assets/adriken-logo.png";

const nav = [
  { to: "/weareadmins", label: "Overview", icon: LayoutDashboard },
  { to: "/weareadmins/signups", label: "Sign-ups", icon: UserPlus },
  { to: "/weareadmins/signins", label: "Sign-ins", icon: LogIn },
  { to: "/weareadmins/searches", label: "Searches", icon: Search },
  { to: "/weareadmins/pages", label: "Page views", icon: FileText },
  { to: "/weareadmins/prompts", label: "Prompts / AI", icon: Sparkles },
  { to: "/weareadmins/regional", label: "Regional", icon: MapPin },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-56 sm:w-64 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link to="/weareadmins" className="flex items-center gap-2 font-extrabold text-foreground">
            <img src={adrikenLogo} alt="Adriken" className="w-8 h-8" />
            <span className="font-display text-lg">Admin</span>
          </Link>
        </div>
        <nav className="p-2 flex-1 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/weareadmins"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <p className="text-xs text-muted-foreground truncate px-2" title={user?.email ?? ""}>
            {user?.email}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start mt-1 rounded-xl text-muted-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to app
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
