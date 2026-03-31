import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'hp2p0iij',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export function sanityImageUrl(ref: string): string {
  if (!ref) return '';
  const [, id, dims, ext] = ref.split('-');
  return `https://cdn.sanity.io/images/hp2p0iij/production/${id}-${dims}.${ext}`;
}
