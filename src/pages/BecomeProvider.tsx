import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, X, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BecomeProvider = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listingType, setListingType] = useState<string>("service");
  const [hourlyRate, setHourlyRate] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [location, setLocation] = useState("");
  const [liveLocation, setLiveLocation] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You need to sign in first", { description: "Create an account to offer your services." });
      navigate("/signup");
      return;
    }
    if (!title.trim()) {
      toast.error("Please add a title for your listing");
      return;
    }

    setLoading(true);

    // Update profile location
    const profileUpdate: Record<string, unknown> = { location };
    if (liveLocation && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        profileUpdate.latitude = pos.coords.latitude;
        profileUpdate.longitude = pos.coords.longitude;
        profileUpdate.live_location_enabled = true;
      } catch {
        // Location permission denied — continue without coordinates
      }
    }
    await supabase.from("profiles").update(profileUpdate).eq("user_id", user.id);

    // Create listing
    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      listing_type: listingType as "service" | "product" | "property" | "vehicle" | "other",
      title: title.trim(),
      description: description.trim(),
      skills,
      services,
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
      fixed_price: fixedPrice ? parseFloat(fixedPrice) : null,
      location,
      availability,
      experience,
    });

    setLoading(false);
    if (error) {
      toast.error("Failed to create listing", { description: error.message });
    } else {
      toast.success("Listing created!", { description: "You're now visible to people looking for what you offer." });
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-4">
            <div className="inline-flex items-center gap-2 w-14 h-14 justify-center rounded-xl bg-gradient-warm mb-6">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">Sign in to get started</h1>
            <p className="text-muted-foreground mb-6">You need an account before you can offer services, products, or list properties.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="hero" onClick={() => navigate("/signup")}>Create Account</Button>
              <Button variant="outline" onClick={() => navigate("/login")}>Log In</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 font-medium text-sm">
                <Sparkles className="w-4 h-4" /> Create a listing
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                What are you offering?
              </h1>
              <p className="text-muted-foreground text-lg">
                A service, product, property, vehicle — anything. Describe it and AI will match you with the right people.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type & Title */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">What is it?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={listingType} onValueChange={setListingType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="property">Property / House</SelectItem>
                        <SelectItem value="vehicle">Vehicle / Car</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{listingType === "service" ? "Hourly Rate ($)" : "Price ($)"}</Label>
                    {listingType === "service" ? (
                      <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="25" />
                    ) : (
                      <Input type="number" value={fixedPrice} onChange={(e) => setFixedPrice(e.target.value)} placeholder="500" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Professional Nanny, 3-Bedroom House for Rent, Used Toyota Camry" required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe in detail what you're offering, your experience, conditions, etc." rows={4} required />
                </div>
                {listingType === "service" && (
                  <div className="space-y-2">
                    <Label>Experience</Label>
                    <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years" />
                  </div>
                )}
              </div>

              {/* Services (natural language) */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">
                  {listingType === "service" ? "What can you do?" : "Key features"}
                </h2>
                <p className="text-sm text-muted-foreground">Describe in natural language — add as many as you like.</p>
                <div className="flex gap-2">
                  <Input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())} placeholder={listingType === "service" ? "e.g. I can cook Mediterranean meals" : "e.g. 3 bedrooms, garden, parking"} />
                  <Button type="button" variant="soft" onClick={addService}><Plus className="w-4 h-4" /></Button>
                </div>
                {services.length > 0 && (
                  <div className="space-y-2">
                    {services.map((s) => (
                      <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-secondary-foreground">
                        <span className="flex-1">{s}</span>
                        <button type="button" onClick={() => setServices(services.filter((x) => x !== s))}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills/Tags */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Tags & Keywords</h2>
                <div className="flex gap-2">
                  <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="e.g. Cooking, Plumbing, Furnished, Automatic" />
                  <Button type="button" variant="soft" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Location</h2>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" className="pl-9" required />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Live Location</Label>
                    <p className="text-xs text-muted-foreground mt-1">Helps people find you by proximity</p>
                  </div>
                  <Switch checked={liveLocation} onCheckedChange={setLiveLocation} />
                </div>
              </div>

              {/* Availability */}
              {listingType === "service" && (
                <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                  <h2 className="font-display font-bold text-lg text-foreground">Availability</h2>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${availability.includes(day) ? "bg-primary text-primary-foreground shadow-elevated" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Publish Listing"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;
