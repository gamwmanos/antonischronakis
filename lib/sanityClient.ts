import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-04-01', // Use the current date or your version
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Set to true for read-only if you want to use the CDN
});
