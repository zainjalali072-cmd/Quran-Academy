export interface Course {
  id: string;
  title: string;
  arabicGlyph: string;
  tag: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string; // High quality course image URL
}

export interface WhyUsPoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  country: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or simple HTML paragraphs
  category: string;
  coverImage: string; // High quality banner image URL
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  arabicVerse?: {
    arabic: string;
    translation: string;
    citation: string;
  };
  tags: string[];
}
