import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';

dotenv.config();

export const firecrawlApp = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});
