import { createClient } from '@sanity/client';

export const backendClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,  // Disable CDN for writes (ensures fresh data)
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
});


console.log("Sanity Client Config:", {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN ? "Token Present" : "Token Missing",
});


