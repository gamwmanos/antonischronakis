import { sanityClient } from '../lib/sanityClient';
import { firecrawlApp } from '../lib/firecrawlService';

/**
 * Demonstrate an end-to-end workflow: 
 * Using Firecrawl to scrape a URL, then uploading to Sanity.
 */
export async function scrapeAndSync(url: string) {
  try {
    console.log(`Starting scrape for URL: ${url}...`);

    // 1. Scrape the URL using Firecrawl
    const scrapeResponse = await firecrawlApp.scrape(url, {
      formats: ['markdown', 'html'],
    });

    const { markdown, metadata } = scrapeResponse;

    // 2. Prepare the Sanity document
    const doc = {
      _type: 'scrapedContent', // Adjust this to match your Sanity schema
      title: metadata?.title || 'Scraped Document',
      url: url,
      content: markdown,
      scrapedAt: new Date().toISOString(),
    };

    // 3. Create the document in Sanity
    console.log('Uploading to Sanity...');
    const result = await sanityClient.create(doc);
    
    console.log(`Successfully created document in Sanity with ID: ${result._id}`);
    return result;

  } catch (error) {
    console.error('Error in scrapeAndSync:', error);
    throw error;
  }
}

// Example usage
const targetUrl = 'https://example.com'; 
scrapeAndSync(targetUrl).then(() => console.log('Done!')).catch(err => console.error('Final Error:', err));
