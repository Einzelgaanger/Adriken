import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Provider } from "@/data/mockProviders";

interface ProviderCardProps {
  provider: Provider;
  index: number;
  matchReason?: string;
}

const ProviderCard = ({ provider, index, matchReason }: ProviderCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        to={`/provider/${provider.id}`}
        className="block rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 overflow-hidden group"
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              {provider.verified && (
                <CheckCircle2 className="w-4 h-4 text-accent absolute -bottom-1 -right-1 bg-card rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-semibold text-foreground truncate">{provider.name}</h3>
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <Zap className="w-3 h-3" /> Best Match
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{provider.title}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display font-bold text-foreground">${provider.hourlyRate}</div>
              <div className="text-xs text-muted-foreground">/hour</div>
            </div>
          </div>

          {matchReason && (
            <div className="mt-3 p-2.5 rounded-lg bg-accent/10 text-sm text-accent flex items-start gap-2">
              <Zap className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{matchReason}</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {provider.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{provider.skills.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="font-medium text-foreground">{provider.rating}</span>
              <span>({provider.reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {provider.distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {provider.responseTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProviderCard;
