import { defineLive } from 'next-sanity';
import { client } from './client';

const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error('Missing environment variable: SANITY_API_READ_TOKEN');
}


export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: {
    revalidate: 0, // No caching for live updates
  },
});
