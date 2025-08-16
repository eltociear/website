// src/lib/utils/markdownProcessor.js
// Enhanced markdown processor that properly handles links and other markdown features

export function processMarkdown(markdownText) {
  if (!markdownText) return '<p>Content not available</p>';
  
  let html = markdownText;
  
  // Remove YAML frontmatter (between --- delimiters)
  html = html.replace(/^---[\s\S]*?---\n*/m, '');
  
  // Process in order of complexity to avoid conflicts
  
  // 1. Code blocks (must be processed before inline code)
  html = html.replace(/```([^`]*?)```/gs, '<pre><code>$1</code></pre>');
  
  // 2. Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 3. Links - CRITICAL: This was missing in the original implementation!
  // Handle [text](url) format links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle <url> format links
  html = html.replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // 4. Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
  
  // 5. Headers (process from h6 to h1 to avoid conflicts)
  html = html.replace(/^#{6}\s+(.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#{5}\s+(.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#{4}\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^#{3}\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{2}\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#{1}\s+(.*)$/gm, '<h1>$1</h1>');
  
  // 6. Bold and italic text
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 7. Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // 8. Blockquotes
  html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
  
  // 9. Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  
  // 10. Lists - Handle nested lists better
  // Unordered lists
  html = html.replace(/^\*\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/^-\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/^\+\s+(.*)$/gm, '<li>$1</li>');
  
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<oli>$1</oli>');
  
  // 11. Paragraphs - Split by double newlines and wrap in <p> tags
  // First, protect elements that shouldn't be wrapped in paragraphs
  const blockElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'hr', 'li', 'oli'];
  const protectedContent = [];
  let placeholder = 0;
  
  blockElements.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, 'gs');
    html = html.replace(regex, (match) => {
      const id = `PROTECTED_${placeholder++}`;
      protectedContent[id] = match;
      return id;
    });
  });
  
  // Also protect self-closing tags
  html = html.replace(/<(hr|img)[^>]*>/g, (match) => {
    const id = `PROTECTED_${placeholder++}`;
    protectedContent[id] = match;
    return id;
  });
  
  // Split into paragraphs and wrap
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      // Don't wrap if it's a protected element
      if (p.startsWith('PROTECTED_')) return p;
      // Don't wrap if it's already a block element
      if (p.match(/^<(h[1-6]|blockquote|pre|hr|div|ul|ol)/)) return p;
      return `<p>${p}</p>`;
    })
    .join('\n');
  
  // Restore protected content
  Object.keys(protectedContent).forEach(id => {
    html = html.replace(id, protectedContent[id]);
  });
  
  // 12. Wrap list items in proper list containers
  // Unordered lists
  html = html.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs, '<ul>$1</ul>');
  
  // Ordered lists (convert oli back to li and wrap in ol)
  html = html.replace(/<oli>/g, '<li>');
  html = html.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs, (match) => {
    // Check if this list came from numbered items (oli)
    if (html.indexOf('<oli>') !== -1) {
      return `<ol>${match}</ol>`;
    }
    return match;
  });
  
  // Clean up any remaining oli tags
  html = html.replace(/<\/?oli>/g, '');
  
  // 13. Clean up extra whitespace and line breaks
  html = html.replace(/\n+/g, '\n');
  html = html.replace(/^\s+|\s+$/g, '');
  
  return html;
}

// Alternative: Use a proper markdown library for more robust processing
// This would be the recommended approach for production
export async function processMarkdownWithLibrary(markdownText) {
  // If you want to use a markdown library instead, you could do:
  // import { marked } from 'marked';
  // return marked(markdownText, {
  //   breaks: true,
  //   gfm: true,
  //   headerIds: false,
  //   sanitize: false
  // });
  
  // For now, fall back to custom processor
  return processMarkdown(markdownText);
}
