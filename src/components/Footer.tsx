import { Link } from "react-router-dom";
import adrikenLogo from "@/assets/adriken-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { Instagram, Youtube, Facebook } from "lucide-react";

const linkClass =
  "text-xs text-zinc-400 hover:text-primary transition-colors py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-black";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const Footer = () => {
  const { user } = useAuth();
  if (user) return null;

  return (
    <footer className="bg-black pt-8 sm:pt-10 pb-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-white shrink-0">
              <img src={adrikenLogo} alt="Adriken" className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="electrolize-regular text-lg sm:text-xl font-black leading-none">Adriken</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-snug max-w-[260px] sm:max-w-[220px]">
              AI-powered marketplace for services, goods, places &amp; connections.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-6" aria-label="Footer links">
            <Link to="/terms" className={linkClass}>
              Terms of Service
            </Link>
            <Link to="/privacy" className={linkClass}>
              Privacy Policy
            </Link>
            <a
              href="https://www.youtube.com/channel/UCxa1mb5Fhwk1WLfIZD59yog"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${linkClass}`}
              aria-label="Adriken on YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61582226006407"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${linkClass}`}
              aria-label="Adriken on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/OfficialAdriken"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${linkClass}`}
              aria-label="Adriken on X"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/adriken.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${linkClass}`}
              aria-label="Adriken on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@adriken499"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${linkClass}`}
              aria-label="Adriken on TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
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
