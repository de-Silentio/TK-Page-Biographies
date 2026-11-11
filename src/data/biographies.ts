import biographiesData from './biographies.json';

export interface Biography {
  id: string;
  name: string;
  docTitle: string;
  years: string;
  category: 'Leaders & Activists' | 'Science & Exploration' | 'Arts & Literature' | 'Innovators & Builders' | 'Sports & Athletics' | string;
  image: string;
  summary: string;
  rawText: string;
}

export const BIOGRAPHIES: Biography[] = biographiesData as Biography[];

export const CATEGORIES = [
  'All',
  'Leaders & Activists',
  'Science & Exploration',
  'Arts & Literature',
  'Innovators & Builders',
  'Sports & Athletics',
] as const;

export type Category = typeof CATEGORIES[number];

export function getBiographyById(id: string): Biography | undefined {
  return BIOGRAPHIES.find((b) => b.id === id);
}

export function getAdjacentBiographies(currentId: string): { prev?: Biography; next?: Biography } {
  const index = BIOGRAPHIES.findIndex((b) => b.id === currentId);
  if (index === -1) return {};
  const prev = index > 0 ? BIOGRAPHIES[index - 1] : BIOGRAPHIES[BIOGRAPHIES.length - 1];
  const next = index < BIOGRAPHIES.length - 1 ? BIOGRAPHIES[index + 1] : BIOGRAPHIES[0];
  return { prev, next };
}

export function getPortraitUrl(imagePath: string): string {
  if (!imagePath) return '';
  const clean = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const base = import.meta.env.BASE_URL || './';
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

