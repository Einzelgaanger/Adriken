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

export const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    title: "Professional Nanny & Childcare Specialist",
    skills: ["Childcare", "First Aid Certified", "Meal Preparation", "Tutoring", "Newborn Care"],
    rating: 4.9,
    reviews: 127,
    hourlyRate: 25,
    location: "Brooklyn, NY",
    distance: "1.2 km away",
    bio: "Experienced nanny with 8 years of professional childcare experience. CPR and First Aid certified. I love creating engaging, educational activities for children of all ages.",
    experience: "8 years",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    completedJobs: 340,
    responseTime: "~15 min",
    verified: true,
  },
  {
    id: "2",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    title: "Personal Chef & Culinary Expert",
    skills: ["Cooking", "Meal Planning", "Dietary Specialist", "Event Catering", "Baking"],
    rating: 4.8,
    reviews: 89,
    hourlyRate: 45,
    location: "Manhattan, NY",
    distance: "3.5 km away",
    bio: "Trained at Le Cordon Bleu with expertise in Mediterranean, Asian, and plant-based cuisine. Available for daily meals, dinner parties, and meal prep.",
    experience: "12 years",
    availability: ["Mon", "Wed", "Thu", "Fri", "Sat"],
    completedJobs: 215,
    responseTime: "~30 min",
    verified: true,
  },
  {
    id: "3",
    name: "Aisha Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    title: "House Cleaner & Home Organizer",
    skills: ["Deep Cleaning", "Organization", "Laundry", "Eco-Friendly Products", "Move-in/out"],
    rating: 4.7,
    reviews: 203,
    hourlyRate: 30,
    location: "Queens, NY",
    distance: "2.1 km away",
    bio: "Meticulous and reliable home cleaning professional. I use eco-friendly products and pay attention to every detail. Specializing in deep cleans and home organization.",
    experience: "5 years",
    availability: ["Mon", "Tue", "Wed", "Fri", "Sat"],
    completedJobs: 520,
    responseTime: "~10 min",
    verified: true,
  },
  {
    id: "4",
    name: "James Rodriguez",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    title: "Handyman & Home Repair Specialist",
    skills: ["Plumbing", "Electrical", "Carpentry", "Painting", "Appliance Repair"],
    rating: 4.9,
    reviews: 156,
    hourlyRate: 40,
    location: "Bronx, NY",
    distance: "4.8 km away",
    bio: "Jack of all trades and master of many! 15 years of experience in home repairs. From leaky faucets to full room renovations, I've got you covered.",
    experience: "15 years",
    availability: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
    completedJobs: 890,
    responseTime: "~20 min",
    verified: true,
  },
  {
    id: "5",
    name: "Elena Petrova",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    title: "Personal Fitness Trainer & Yoga Instructor",
    skills: ["Personal Training", "Yoga", "Nutrition", "Weight Loss", "Strength Training"],
    rating: 5.0,
    reviews: 74,
    hourlyRate: 55,
    location: "Manhattan, NY",
    distance: "2.8 km away",
    bio: "Certified personal trainer and 200hr yoga instructor. I create personalized fitness programs that fit your lifestyle and goals. Home or outdoor sessions available.",
    experience: "7 years",
    availability: ["Mon", "Tue", "Wed", "Thu", "Sat"],
    completedJobs: 180,
    responseTime: "~5 min",
    verified: true,
  },
  {
    id: "6",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    title: "Business Consultant & Startup Advisor",
    skills: ["Business Strategy", "Marketing", "Financial Planning", "Startup Mentoring", "Product Development"],
    rating: 4.8,
    reviews: 42,
    hourlyRate: 80,
    location: "Manhattan, NY",
    distance: "5.1 km away",
    bio: "Former VP at a Fortune 500 company, now helping startups and small businesses thrive. I bring 20 years of strategic insight to help you grow.",
    experience: "20 years",
    availability: ["Mon", "Tue", "Wed", "Thu"],
    completedJobs: 95,
    responseTime: "~1 hr",
    verified: true,
  },
];
