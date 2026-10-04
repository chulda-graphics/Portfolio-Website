export const site = {
  name: 'Dhrex',
  discipline: 'SaaS motion designer',
  // Add only owner-verified contact details. Empty values never generate links.
  email: '',
  socials: [] as { label: string; url: string }[],
};

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export interface Project {
  slug: string;
  title: string;
  summary: string;
  role: string;
  date: string;
  poster: string;
  posterAlt: string;
  idea: string;
  approach: string;
  outcome: string;
}

// No portfolio projects have been supplied or approved for publication yet.
export const projects: Project[] = [];

export const projectTemplate: Project = {
  slug: 'project-template',
  title: 'A story, in motion.',
  summary: 'A preview of the case-study layout. Project content and media have not been supplied yet.',
  role: '', date: '', poster: '', posterAlt: '', idea: '', approach: '', outcome: '',
};
