import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skills: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  distance: string;
  bio: string;
  experience: string;
  availability: string[];
  completedJobs: number;
  responseTime: string;
  verified: boolean;
}

interface ProviderCardProps {
  provider: Provider;
  index: number;
  matchReason?: string;
}

const ProviderCard = ({ provider, index, matchReason }: ProviderCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/provider/${provider.id}`}
        className="block rounded-2xl bg-card border border-border/60 hover:border-primary/20 hover:shadow-card active:scale-[0.995] transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-border/30"
              />
              {provider.verified && (
                <CheckCircle2 className="w-4 h-4 text-accent absolute -bottom-1 -right-1 bg-card rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-display font-bold text-foreground truncate text-[15px]">{provider.name}</h3>
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/[0.08] text-primary text-[11px] font-bold uppercase tracking-wide">
                    <Zap className="w-3 h-3" /> Top Match
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{provider.title}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display font-extrabold text-foreground text-lg">KSh {provider.hourlyRate.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">/hour</div>
            </div>
          </div>

          {matchReason && (
            <div className="mt-3.5 p-3 rounded-xl bg-accent/[0.06] border border-accent/10 text-sm text-accent flex items-start gap-2.5">
              <Zap className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{matchReason}</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs font-medium border border-border/40">
                {skill}
              </Badge>
            ))}
            {provider.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs font-medium border border-border/40">
                +{provider.skills.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
              <span className="font-bold text-foreground">{provider.rating}</span>
              <span>({provider.reviews})</span>
            </span>
            {provider.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {provider.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {provider.responseTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProviderCard;
