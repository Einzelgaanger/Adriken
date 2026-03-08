import { Link } from "react-router-dom";
import adrikenLogo from "@/assets/adriken-logo.png";

const Footer = () => (
  <footer className="bg-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-background">
            <img src={adrikenLogo} alt="Adriken" className="w-8 h-8" />
            Adriken
          </Link>
          <p className="mt-4 text-sm text-background/60 leading-relaxed">
            The AI-powered marketplace where you just say what you need, and we find who.
          </p>
        </div>
        {[
          { title: "For Seekers", links: [["Find Help", "/"], ["How It Works", "/how-it-works"], ["Categories", "/"]] },
          { title: "For Providers", links: [["Offer Services", "/become-provider"], ["Pricing", "/"], ["Success Stories", "/"]] },
          { title: "Company", links: [["About", "/"], ["Contact", "/"], ["Privacy", "/"], ["Terms", "/"]] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-semibold text-background mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-background/50 hover:text-background transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-background/10 text-center text-xs text-background/40">
        © {new Date().getFullYear()} Adriken. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
