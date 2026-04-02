import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import scrapedContent from './schema/scrapedContent';

/**
 * Standard Sanity Studio configuration. 
 * This can be used to run the Studio locally.
 */
export default defineConfig({
  name: 'default',
  title: 'Chemistry Data Studio',

  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [deskTool()],

  schema: {
    types: [scrapedContent],
  },
});
