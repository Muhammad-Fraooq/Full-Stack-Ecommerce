import { createClient } from '@sanity/client';

export const backendClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,  // Disable CDN for writes (ensures fresh data)
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
});
