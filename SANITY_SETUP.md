# Sanity & Firecrawl Integration Setup

Follow these steps to initialize your Sanity project and run the automated scraping script.

## 1. Local Environment Setup
Since this project uses modern TypeScript/Node.js utilities, ensure you have Node.js installed. Open your terminal and run:

```bash
# Install all required dependencies
npm install @sanity/client firecrawl-js dotenv
npm install --save-dev typescript tsx @types/node
```

## 2. Sanity Project Initialization
If you haven't already initialized a Sanity project for these keys, run:

```bash
# Log in to Sanity
npx sanity login

# Initialize (if not already done)
npx sanity init --env .env
```

## 3. Running the Scraper
To run the demonstration script (which scrapes a URL and uploads to Sanity):

```bash
# Run the script using tsx
npx tsx scripts/scrapeToSanity.ts
```

## 4. Running Sanity Studio
To view your scraped data in a professional UI:

```bash
# Start the studio locally
npx sanity dev
```

---
> [!TIP]
> **Customizing the Scraper**:
> You can modify the `targetUrl` in [scripts/scrapeToSanity.ts](file:///d:/ANTONISCHRONAKIS/scripts/scrapeToSanity.ts) to point to any chemistry resource you want to extract data from.
