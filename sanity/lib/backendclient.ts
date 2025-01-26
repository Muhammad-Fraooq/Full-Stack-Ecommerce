import { createClient } from '@sanity/client';

export const backendClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Check .env file
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // Default dataset
  useCdn: false, // Disable CDN for write operations
  apiVersion: '2023-01-01', // Use a valid API version
  token: process.env.SANITY_API_TOKEN, // API token with proper permissions
});

// Debugging: Log client config (don't log sensitive tokens in production)
console.log("Sanity Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log("Sanity Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log("Sanity Token:", process.env.SANITY_API_TOKEN ? "Token is set" : "Token is missing");
