export default {
  name: 'scrapedContent',
  type: 'document',
  title: 'Scraped Content',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'url',
      type: 'url',
      title: 'Source URL',
    },
    {
      name: 'content',
      type: 'text',
      title: 'Markdown Content',
    },
    {
      name: 'scrapedAt',
      type: 'datetime',
      title: 'Scraped At',
    },
  ],
};
