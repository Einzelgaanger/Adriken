import { Link } from "react-router-dom";
import adrikenLogo from "@/assets/adriken-logo.png";

const Footer = () => (
  <footer className="bg-foreground pt-14 sm:pt-20 pb-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 sm:mb-16">
        <div className="lg:col-span-4">
          <Link to="/" className="inline-flex items-center gap-2.5 font-display font-extrabold text-xl text-background mb-5">
            <img src={adrikenLogo} alt="Adriken" className="w-10 h-10 sm:w-11 sm:h-11" />
            Adriken
          </Link>
          <p className="text-sm text-background/50 leading-relaxed max-w-[280px]">
            The AI-powered marketplace where you search for businesses and services in your own words, and we match you instantly.
          </p>
        </div>
        {[
          { title: "Platform", links: [["Find Services", "/"], ["Sign Up", "/signup"], ["Log In", "/login"]] },
          { title: "Account", links: [["Dashboard", "/dashboard"], ["My Profile", "/profile/edit"], ["Businesses I Checked", "/history"]] },
          { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]] },
        ].map((col, colIdx) => (
          <div key={col.title} className={colIdx === 0 ? "lg:col-span-3" : colIdx === 1 ? "lg:col-span-3" : "lg:col-span-2"}>
            <h4 className="font-display font-semibold text-background/80 mb-4 text-xs uppercase tracking-widest">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-background/40 hover:text-background transition-colors duration-200 py-1 block rounded focus:outline-none focus:ring-2 focus:ring-background/20 focus:ring-offset-2 focus:ring-offset-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-6 sm:pt-8 border-t border-background/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/30">
        <span>© {new Date().getFullYear()} Adriken. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-background/60 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-background/60 transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
