import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BecomeProvider = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [location, setLocation] = useState("");
  const [liveLocation, setLiveLocation] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile created successfully!", {
      description: "You're now visible to people looking for your services.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 font-medium text-sm">
                <Sparkles className="w-4 h-4" />
                Start earning today
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Create your provider profile
              </h1>
              <p className="text-muted-foreground text-lg">
                Describe what you do in your own words — AI will match you with the right clients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Hourly Rate ($)</Label>
                    <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="25" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Professional Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Personal Chef & Meal Prep Specialist" required />
                </div>
                <div className="space-y-2">
                  <Label>About You</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe yourself, your experience, and what makes you great at what you do..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Services */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">What Can You Do?</h2>
                <p className="text-sm text-muted-foreground">
                  Describe your services in natural language — add as many as you like.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                    placeholder="e.g. I can cook Mediterranean meals for families"
                  />
                  <Button type="button" variant="soft" onClick={addService}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {services.length > 0 && (
                  <div className="space-y-2">
                    {services.map((s) => (
                      <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-secondary-foreground">
                        <span className="flex-1">{s}</span>
                        <button type="button" onClick={() => setServices(services.filter((x) => x !== s))}>
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Skills & Tags</h2>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="e.g. First Aid, Cooking, Python"
                  />
                  <Button type="button" variant="soft" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Location</h2>
                <div className="space-y-2">
                  <Label>Your Location</Label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Live Location</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Helps clients find you based on real-time proximity
                    </p>
                  </div>
                  <Switch checked={liveLocation} onCheckedChange={setLiveLocation} />
                </div>
              </div>

              {/* Availability */}
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Availability</h2>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        availability.includes(day)
                          ? "bg-primary text-primary-foreground shadow-elevated"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="hero" size="lg" className="w-full" type="submit">
                Create My Profile
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;
