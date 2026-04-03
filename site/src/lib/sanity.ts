import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'hp2p0iij',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export function sanityImageUrl(ref: string): string {
  if (!ref) return '';
  const [, id, dims, ext] = ref.split('-');
  return `https://cdn.sanity.io/images/hp2p0iij/production/${id}-${dims}.${ext}`;
}

export function sanityFileUrl(ref: string): string {
  if (!ref) return '';
  // ref format: "file-{id}-{ext}"
  const parts = ref.split('-');
  const ext = parts[parts.length - 1];
  const id = parts.slice(1, -1).join('-');
  return `https://cdn.sanity.io/files/hp2p0iij/production/${id}.${ext}`;
}
