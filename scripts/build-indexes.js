// scripts/build-indexes.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Function to get all MD files from a directory
function getFiles(dir) {
  const files = fs.readdirSync(dir);
  let allFiles = [];
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      allFiles = [...allFiles, ...getFiles(filePath)];
    } else if (file.endsWith('.md')) {
      allFiles.push(filePath);
    }
  });
  return allFiles;
}

// Function to process files and extract metadata
function processContent(contentDir, outputJson) {
  const files = getFiles(contentDir);
  const contentIndex = files.map(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent); // Get only metadata

    // Get slug and lang from path
    const parts = filePath.split(path.sep);
    const filename = parts.pop();
    const lang = parts.pop();
    const slug = filename.replace('.md', '');

    return {
      meta: data,
      slug: slug,
      lang: lang
    };
  }).filter(item => item.meta.title && item.meta.date); // Ensure it has basic meta

  fs.writeFileSync(outputJson, JSON.stringify(contentIndex, null, 2));
  console.log(`Successfully built index: ${outputJson}`);
}

function processFrameworks(frameworksDir, outputJson) {
  const entries = fs.readdirSync(frameworksDir, { withFileTypes: true });
  const frameworkSlugs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    // Filter out non-framework directories like 'docs', 'guides', 'tools', etc.
    .filter(slug => !['docs', 'guides', 'tools', 'visuals'].includes(slug)); 
  
  fs.writeFileSync(outputJson, JSON.stringify(frameworkSlugs, null, 2));
  console.log(`Successfully built framework index: ${outputJson}`);
  return frameworkSlugs;
}

// --- Run the script ---
console.log('Building content indexes...');

// Create data directory if it doesn't exist
if (!fs.existsSync('./src/lib/data')) {
  fs.mkdirSync('./src/lib/data');
}

// Process Blog Posts
processContent('./src/lib/posts', './src/lib/data/blog-index.json');

// Process Whitepapers
processContent('./src/lib/content/papers', './src/lib/data/papers-index.json');

// Process Frameworks
processFrameworks('./src/routes/frameworks', './src/lib/data/framework-index.json');

console.log('Content indexes built!');
