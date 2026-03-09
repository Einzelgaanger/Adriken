import { Link } from "react-router-dom";
import adrikenLogo from "@/assets/adriken-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  const footerColumns = [
    {
      title: "Platform",
      links: [
        ["Find Services", "/"],
        ["Sign Up", "/signup"],
        ["Log In", "/login"],
      ],
    },
    {
      title: "Account",
      links: [
        ["My Profile", user ? "/profile/edit" : "/login"],
        ["Businesses I Checked", user ? "/history" : "/login"],
      ],
    },
    {
      title: "Legal",
      links: [
        ["Privacy Policy", "/privacy"],
        ["Terms of Service", "/terms"],
      ],
    },
  ] as const;

  return (
    <footer className="bg-black pt-14 sm:pt-20 pb-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 sm:mb-16">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 font-extrabold text-xl text-white mb-5">
              <img src={adrikenLogo} alt="Adriken" className="w-10 h-10 sm:w-11 sm:h-11" />
              <span className="electrolize-regular text-[1.5rem] sm:text-[1.75rem] font-black leading-none">Adriken</span>
            </Link>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-[280px]">
              The AI-powered marketplace where you search for businesses and services in your own words, and we match you instantly.
            </p>
          </div>
          {footerColumns.map((col, colIdx) => (
            <div key={col.title} className={colIdx === 0 ? "lg:col-span-3" : colIdx === 1 ? "lg:col-span-3" : "lg:col-span-2"}>
              <h4 className="font-display font-semibold text-primary/90 mb-4 text-xs uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-zinc-400 hover:text-primary transition-colors duration-200 py-1 block rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-black">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Adriken. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
