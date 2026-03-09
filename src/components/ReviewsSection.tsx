import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewsSectionProps {
  listingId: string;
  providerId: string;
}

const ReviewsSection = ({ listingId, providerId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles:reviewer_id(full_name, avatar_url)")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be signed in");
      if (rating === 0) throw new Error("Please select a rating");
      const { error } = await supabase.from("reviews").insert({
        listing_id: listingId,
        reviewer_id: user.id,
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      toast.success("Review submitted!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to submit review"),
  });

  const canReview = user && user.id !== providerId;
  const alreadyReviewed = reviews?.some((r: any) => r.reviewer_id === user?.id);

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
      <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" /> Reviews & Feedback
      </h2>

      {/* Submit Review */}
      {canReview && !alreadyReviewed && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Leave a review</p>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 touch-manipulation"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    s <= (hoverRating || rating)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            maxLength={500}
            className="mb-3"
          />
          <Button
            variant="hero"
            size="sm"
            className="rounded-xl min-h-[44px]"
            onClick={() => submitReview.mutate()}
            disabled={submitReview.isPending || rating === 0}
          >
            {submitReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r: any) => {
            const profile = r.profiles as any;
            const reviewerName = profile?.full_name || "Anonymous";
            const reviewerAvatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${reviewerName}`;
            return (
              <div key={r.id} className="flex gap-3">
                <img src={reviewerAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">{reviewerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "text-primary fill-primary" : "text-muted-foreground/20"}`}
                      />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to leave feedback!</p>
      )}
    </div>
  );
};

export default ReviewsSection;
