import {
  Archive,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Github,
  Instagram,
  LayoutGrid,
  Library,
  Mail,
  NotebookText,
  Rocket,
  Sparkles,
} from 'lucide-astro';

export const iconKeys = [
  'archive',
  'book-open',
  'bot',
  'briefcase',
  'calendar',
  'file-text',
  'github',
  'instagram',
  'layout-grid',
  'library',
  'mail',
  'notebook',
  'rocket',
  'sparkles',
] as const;

export type IconKey = (typeof iconKeys)[number];

export const iconMap = {
  archive: Archive,
  'book-open': BookOpen,
  bot: Bot,
  briefcase: BriefcaseBusiness,
  calendar: CalendarDays,
  'file-text': FileText,
  github: Github,
  instagram: Instagram,
  'layout-grid': LayoutGrid,
  library: Library,
  mail: Mail,
  notebook: NotebookText,
  rocket: Rocket,
  sparkles: Sparkles,
} satisfies Record<IconKey, unknown>;
