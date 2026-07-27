export interface Course {
  id: string;
  title: string;
  arabicGlyph: string;
  tag: string;
  description: string;
  difficulty: string;
  image: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
}

export interface WhyUsPoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
  image?: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
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
  image?: string;
  imageAltText?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  country: string;
  avatar?: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  image?: string;
  imageAltText?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  arabicVerse?: {
    arabic: string;
    translation: string;
    citation: string;
  };
  content: string;

  // Advanced SEO & Metadata fields
  seoTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  slug?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  featuredImage?: string;
  imageAltText?: string;
  publishDate?: string;
  wordCount?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
  schemaType?: string; // e.g. Article, FAQ, custom
  customSchemaJson?: string;
  status?: "published" | "draft" | "scheduled" | "trash";
  lastUpdated?: string;
  seoScore?: number;
}

export interface WPVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  embedId: string;
  enabled: boolean;
  pages: string[]; // specific page names where video is enabled/embedded, e.g. ["home", "about", "videos"]
}
