export type ProjectCategory = 'tableau' | 'power-bi' | 'analytics' | 'data-viz';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  long_description: string;
  technologies: string[];
  image: string;
  images: string[];
  demo_url?: string | null;
  github_url?: string | null;
  featured: boolean;
  metrics: { label: string; value: string }[];
  challenges: string[];
  solutions: string[];
  outcomes: string[];
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  category: string;
  category_color: string;
  name: string;
  level: number;
  sort_order: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  color: string;
  achievements: string[];
  sort_order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  detail: string;
  sort_order: number;
}

export interface HighlightCard {
  icon: string;
  title: string;
  desc: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  photo_url: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  tableau_public_url: string | null;
  email: string | null;
  open_to_work: boolean;
  stats: { value: string; label: string }[];
  logo_text: string | null;
  highlights: HighlightCard[];
  interests: HighlightCard[];
  location: string | null;
  contact_tagline: string | null;
  availability_text: string | null;
  faqs: FAQ[];
  hero_skill_ids: string[];
}
