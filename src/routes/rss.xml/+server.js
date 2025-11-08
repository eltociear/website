// src/routes/rss.xml/+server.js

// 1. Import both types of content
const rawPosts = import.meta.glob('/src/lib/posts/**/*.md', { eager: true });
const rawPapers = import.meta.glob('/src/lib/content/papers/**/*.md', { eager: true });

export async function GET() {
  const siteUrl = 'https://www.globalgovernanceframework.org';

  // 2. Process Blog Posts
  const posts = Object.entries(rawPosts)
    .map(([path, post]) => {
      const parts = path.split('/');
      const filename = parts.pop();
      const langDir = parts.pop();
      const slug = filename.replace('.md', '');

      return {
        meta: post.metadata,
        slug: slug,
        lang: langDir,
        // Create a full, language-specific link
        link: `${siteUrl}/blog/${slug}?lang=${langDir}`
      };
    })
    // Filter for valid posts that have metadata and a date
    .filter(item => item.meta && item.meta.date);

  // 3. Process Whitepapers
  const papers = Object.entries(rawPapers)
    .map(([path, paper]) => {
      const parts = path.split('/');
      const filename = parts.pop();
      const langDir = parts.pop();
      const slug = filename.replace('.md', '');

      return {
        meta: paper.metadata,
        slug: slug,
        lang: langDir,
        // Create a full, language-specific link
        link: `${siteUrl}/resources/whitepapers/${slug}?lang=${langDir}`
      };
    })
    // Filter for valid papers that have metadata and a date
    .filter(item => item.meta && item.meta.date);

  // 4. Combine, Sort, and Slice
  const allContent = [...posts, ...papers]
    .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
    .slice(0, 25); // Get the 25 most recent items, regardless of type or language

  // 5. Build the RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Global Governance Framework Blog & White Papers</title>
    <description>Latest insights, blog posts, and research white papers on global governance and planetary citizenship</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${allContent.map(item => `
    <item>
      <title><![CDATA[${item.meta.title}]]></title>
      <description><![CDATA[${item.meta.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${new Date(item.meta.date).toUTCString()}</pubDate>
      <author>${item.meta.author}</author>
    </item>`).join('')}
  </channel>
</rss>`;

  // 6. Return the response
  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'max-age=3600' // Cache for 1 hour
    }
  });
}
