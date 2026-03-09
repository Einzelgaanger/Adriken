import { Link } from "react-router-dom";
import adrikenLogo from "@/assets/adriken-logo.png";

const Footer = () => (
  <footer className="bg-foreground py-12 sm:py-16 pb-[calc(1rem+env(safe-area-inset-bottom))]">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div className="sm:col-span-2 md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-lg sm:text-xl text-background py-2 -my-2">
            <img src={adrikenLogo} alt="Adriken" className="w-7 h-7 sm:w-8 sm:h-8" />
            Adriken
          </Link>
          <p className="mt-4 text-sm text-background/60 leading-relaxed max-w-xs">
            The AI-powered marketplace where you just say what you need, and we find who.
          </p>
        </div>
        {[
          { title: "For Seekers", links: [["Find Help", "/"], ["How It Works", "/how-it-works"], ["Categories", "/"]] },
          { title: "For Providers", links: [["Offer Services", "/become-provider"], ["Dashboard", "/dashboard"], ["Edit Profile", "/profile/edit"]] },
          { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Contact", "/"]] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-semibold text-background mb-3 sm:mb-4 text-sm sm:text-base">{col.title}</h4>
            <ul className="space-y-1 sm:space-y-2">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-background/50 hover:text-background transition-colors py-2 block rounded focus:outline-none focus:ring-2 focus:ring-background/30 focus:ring-offset-2 focus:ring-offset-foreground -my-1 py-2">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-background/10 text-center text-xs text-background/40">
        © {new Date().getFullYear()} Adriken. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
