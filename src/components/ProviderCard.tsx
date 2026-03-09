import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, CheckCircle2, Zap, Briefcase } from "lucide-react";
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
          {/* Top row: Avatar, Name, Price */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-border/30"
              />
              {provider.verified && (
                <CheckCircle2 className="w-4 h-4 text-accent absolute -bottom-1 -right-1 bg-card rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="font-display font-bold text-foreground text-[15px] truncate">{provider.name}</h3>
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/[0.08] text-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-wide shrink-0">
                    <Zap className="w-3 h-3" /> Top Match
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{provider.title}</p>
              {/* Rating + Meta inline on mobile */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                  <span className="font-bold text-foreground">{provider.rating.toFixed(1)}</span>
                  <span>({provider.reviews})</span>
                </span>
                {provider.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[120px]">{provider.location}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  {provider.completedJobs} jobs
                </span>
              </div>
            </div>
            {/* Price - stacked right */}
            <div className="text-right shrink-0 pl-2">
              <div className="font-display font-extrabold text-foreground text-base sm:text-lg">KSh {provider.hourlyRate.toLocaleString()}</div>
              <div className="text-[11px] text-muted-foreground">/hour</div>
            </div>
          </div>

          {/* AI Match Reason */}
          {matchReason && (
            <div className="mt-3 p-2.5 sm:p-3 rounded-xl bg-accent/[0.05] border border-accent/10 text-[13px] text-accent flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="leading-snug">{matchReason}</span>
            </div>
          )}

          {/* Skills */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {provider.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[11px] font-medium border border-border/40 px-2 py-0.5">
                {skill}
              </Badge>
            ))}
            {provider.skills.length > 4 && (
              <Badge variant="secondary" className="text-[11px] font-medium border border-border/40 px-2 py-0.5">
                +{provider.skills.length - 4}
              </Badge>
            )}
          </div>

          {/* Bottom meta */}
          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              Responds {provider.responseTime}
            </span>
            {provider.availability.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1">
                Available: {provider.availability.slice(0, 3).join(", ")}
                {provider.availability.length > 3 && ` +${provider.availability.length - 3}`}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProviderCard;
