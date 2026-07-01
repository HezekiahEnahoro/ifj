import fs from 'fs/promises';
import path from 'path';
import { put, list } from '@vercel/blob';
import type { Profile, Project, Skill, Experience, Education } from './types';

const IS_LOCAL = !process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_FILE = path.join(process.cwd(), 'portfolio-data.json');

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

const KEY = 'portfolio-data.json';

const DEFAULT_DATA: PortfolioData = {
  profile: {
    id: 1,
    name: '',
    title: 'Tableau & Data Visualization Developer',
    tagline: 'Turning complex data into clear, actionable visual stories.',
    bio: ['Write your bio here.'],
    photo_url: null,
    resume_url: null,
    linkedin_url: null,
    github_url: null,
    tableau_public_url: null,
    email: null,
    open_to_work: true,
    stats: [
      { value: '10+', label: 'Dashboards Built' },
      { value: '5+',  label: 'Industries' },
      { value: '100%', label: 'Client Focused' },
    ],
    logo_text: null,
    highlights: [
      { icon: '📊', title: 'Data Visualization',  desc: 'Tableau · Power BI · interactive dashboards'   },
      { icon: '🔍', title: 'Analytics',           desc: 'SQL · Python · turning raw data into insight'  },
      { icon: '📋', title: 'Reporting',           desc: 'Executive reports · automated pipelines'       },
    ],
    interests: [
      { icon: '📊', title: 'Data Storytelling',  desc: 'Making numbers speak through compelling visual narratives' },
      { icon: '🔍', title: 'Business Analytics', desc: 'Connecting data insights to real business decisions'       },
      { icon: '🚀', title: 'Continuous Growth',  desc: 'Always learning new tools and visualization best practices' },
    ],
    location: 'Remote',
    contact_tagline: "Have a project or want to collaborate? Send a message and I'll respond within 24–48 hours.",
    availability_text: 'Open to freelance and full-time data visualization roles.',
    faqs: [
      { q: 'What services do you offer?',         a: 'Tableau dashboard development, data visualization, analytics reporting, and BI consulting.' },
      { q: 'Do you work remotely?',               a: 'Yes — entirely. I work with clients globally and time zones are not a blocker.' },
      { q: 'Do you work with non-technical teams?', a: 'Absolutely. I specialize in making data accessible to stakeholders who aren\'t data experts.' },
      { q: 'What\'s your typical turnaround?',    a: 'A standard dashboard takes 1–2 weeks. Complex multi-source projects may take 3–4 weeks.' },
    ],
    hero_skill_ids: [],
  },
  projects: [],
  skills: [],
  experience: [],
  education: [],
};

export async function readData(): Promise<PortfolioData> {
  if (IS_LOCAL) {
    try {
      return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf-8'));
    } catch {
      return structuredClone(DEFAULT_DATA);
    }
  }
  try {
    const { blobs } = await list({ prefix: KEY });
    if (!blobs.length) {
      console.error('[readData] list() returned no blobs for prefix:', KEY);
      return structuredClone(DEFAULT_DATA);
    }
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('[readData] blob fetch failed:', res.status, res.statusText, blobs[0].url);
      return structuredClone(DEFAULT_DATA);
    }
    return await res.json();
  } catch (e) {
    console.error('[readData] unexpected error:', e);
    return structuredClone(DEFAULT_DATA);
  }
}

export async function writeData(data: PortfolioData): Promise<void> {
  if (IS_LOCAL) {
    await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return;
  }
  await put(KEY, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
