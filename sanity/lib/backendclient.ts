import { createClient } from '@sanity/client';

// Check if required environment variables are set
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiToken = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !apiToken) {
  throw new Error("Missing environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN");
}

// Create the backend client
export const backendClient = createClient({
  projectId: projectId, // Sanity project ID from .env
  dataset: dataset, // Sanity dataset from .env (or use a default)
  useCdn: false, // Disable CDN for write operations (to make sure you're always working with the latest data)
  apiVersion: '2023-01-01', // Specify the API version to ensure compatibility
  token: apiToken, // The token for API access, make sure it's provided securely
});

// Debugging: Log client configuration (be cautious with logging sensitive tokens in production)
if (process.env.NODE_ENV !== 'production') {
  console.log("Sanity Project ID:", projectId);
  console.log("Sanity Dataset:", dataset);
  console.log("Sanity API Token:", apiToken ? "Token is set" : "Token is missing");
}
