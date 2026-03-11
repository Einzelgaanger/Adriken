import { Link } from "react-router-dom";
import adrikenLogo from "@/assets/adriken-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  const mainLinks = [
    ["Find Services", user ? "/dashboard" : "/"],
    ["Sign Up", "/signup"],
    ["Log In", "/login"],
    ["My Profile", user ? "/profile/edit" : "/login"],
    ["History", user ? "/history" : "/login"],
  ] as const;

  return (
    <footer className="bg-black pt-8 sm:pt-10 pb-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link to={user ? "/dashboard" : "/"} className="inline-flex items-center gap-2 font-extrabold text-white shrink-0">
              <img src={adrikenLogo} alt="Adriken" className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="electrolize-regular text-lg sm:text-xl font-black leading-none">Adriken</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-snug max-w-[260px] sm:max-w-[220px]">
              AI-powered marketplace for services, goods, places &amp; connections.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-6" aria-label="Footer links">
            {mainLinks.map(([label, to]) => (
              <Link
                key={label}
                to={to}
                className="text-xs text-zinc-400 hover:text-primary transition-colors py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-black"
              >
                {label}
              </Link>
            ))}
            <Link to="/privacy" className="text-xs text-zinc-400 hover:text-primary transition-colors py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-black">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-zinc-400 hover:text-primary transition-colors py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-black">
              Terms
            </Link>
          </nav>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <span>© {new Date().getFullYear()} Adriken</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
