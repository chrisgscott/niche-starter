import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

interface ContentFile {
  path: string;
  type: 'topic' | 'post' | 'article';
  data: {
    title: string;
    keywords: string[];
    slug: string;
    parent_topic?: string;
    [key: string]: any;
  };
}

interface InternalLinks {
  keywords: {
    [key: string]: {
      primary: string;
      related: string[];
    };
  };
  urls: {
    [key: string]: {
      title: string;
      type: 'topic' | 'post' | 'article';
      keywords: string[];
      outbound: string[];
    };
  };
}

function getContentFiles(contentDir: string): ContentFile[] {
  console.log('\n=== Reading Content Files ===');
  console.log('Content directory:', contentDir);
  
  const files: ContentFile[] = [];
  const types = ['topics', 'posts', 'articles'] as const;

  for (const type of types) {
    const dir = join(contentDir, type);
    console.log(`\nChecking directory: ${dir}`);
    
    if (!existsSync(dir)) {
      console.log(`❌ Directory not found: ${dir}`);
      continue;
    }

    const mdFiles = readdirSync(dir).filter(file => file.endsWith('.md'));
    console.log(`Found ${mdFiles.length} markdown files in ${type}:`, mdFiles);

    const items = mdFiles.map(file => {
      const fullPath = join(dir, file);
      console.log(`\nProcessing ${file}:`);
      
      const { data } = matter(readFileSync(fullPath, 'utf-8'));
      console.log('Frontmatter:', JSON.stringify(data, null, 2));
      
      // Ensure required properties exist
      if (!data.title || !data.slug) {
        console.log(`❌ Missing required frontmatter in ${file}`);
        return null;
      }
      
      // Convert plural directory name to singular for URL path
      const urlType = type.slice(0, -1) as 'topic' | 'post' | 'article';
      
      const contentFile: ContentFile = {
        path: `/${urlType}/${data.slug}`,
        type: urlType,
        data: {
          ...data,
          title: data.title,
          slug: data.slug,
          keywords: data.keywords || [],
          parent_topic: data.parent_topic
        }
      };
      
      console.log('Created content file:', contentFile);
      return contentFile;
    }).filter((item): item is ContentFile => item !== null);

    files.push(...items);
  }

  console.log('\n=== Content File Summary ===');
  console.log(`Total content files found: ${files.length}`);
  console.log('Paths:', files.map(f => f.path));
  
  return files;
}

function generateInternalLinks(files: ContentFile[]): InternalLinks {
  console.log('\n=== Generating Internal Links ===');
  
  const internalLinks: InternalLinks = {
    keywords: {},
    urls: {}
  };

  // First, create the urls section
  console.log('\nCreating URLs section:');
  for (const file of files) {
    console.log(`\nProcessing ${file.path}:`);
    
    internalLinks.urls[file.path] = {
      title: file.data.title,
      type: file.type,
      keywords: file.data.keywords,
      outbound: [] // We'll fill this in later
    };
    console.log('Added URL entry:', internalLinks.urls[file.path]);

    // Add each keyword from the file's frontmatter
    console.log('Processing keywords:', file.data.keywords);
    for (const keyword of file.data.keywords) {
      if (!internalLinks.keywords[keyword]) {
        console.log(`Creating new keyword entry for "${keyword}"`);
        internalLinks.keywords[keyword] = {
          primary: file.path,
          related: []
        };
      } else if (internalLinks.keywords[keyword].primary !== file.path) {
        console.log(`Adding related link for "${keyword}"`);
        if (!internalLinks.keywords[keyword].related.includes(file.path)) {
          internalLinks.keywords[keyword].related.push(file.path);
        }
      }
    }
  }

  // Now add outbound links based on parent topics and keywords
  console.log('\nAdding outbound links:');
  for (const file of files) {
    console.log(`\nProcessing outbound links for ${file.path}:`);
    const outbound = new Set<string>();

    // Add parent topic if it exists
    if (file.data.parent_topic) {
      const parentPath = `/topic/${file.data.parent_topic}`;
      console.log(`Checking parent topic: ${parentPath}`);
      if (internalLinks.urls[parentPath]) {
        outbound.add(parentPath);
        console.log('Added parent topic to outbound links');
      }
    }

    // Add pages that share keywords
    const fileKeywords = new Set(file.data.keywords);
    console.log('Looking for pages with shared keywords:', Array.from(fileKeywords));
    
    for (const otherFile of files) {
      if (otherFile.path === file.path) continue;
      
      const otherKeywords = new Set(otherFile.data.keywords);
      const commonKeywords = Array.from(fileKeywords).filter(k => otherKeywords.has(k));
      
      if (commonKeywords.length > 0) {
        outbound.add(otherFile.path);
        console.log(`Found shared keywords with ${otherFile.path}:`, commonKeywords);
      }
    }

    internalLinks.urls[file.path].outbound = Array.from(outbound);
    console.log('Final outbound links:', internalLinks.urls[file.path].outbound);
  }

  console.log('\n=== Internal Links Summary ===');
  console.log(`Keywords created: ${Object.keys(internalLinks.keywords).length}`);
  console.log(`URLs processed: ${Object.keys(internalLinks.urls).length}`);
  
  return internalLinks;
}

// Main execution
console.log('\n=== Starting Internal Links Generation ===');
const contentDir = join(process.cwd(), 'src/content');
const outputPath = join(contentDir, 'internal_links.json');

console.log('Content directory:', contentDir);
console.log('Output path:', outputPath);

console.log('Reading content files...');
const files = getContentFiles(contentDir);
console.log(`Found ${files.length} content files`);

console.log('Generating internal links...');
const internalLinks = generateInternalLinks(files);
console.log(`Generated ${Object.keys(internalLinks.keywords).length} keyword mappings`);
console.log(`Generated ${Object.keys(internalLinks.urls).length} URL mappings`);

console.log('\n=== Writing Output ===');
writeFileSync(outputPath, JSON.stringify(internalLinks, null, 2));
console.log('✅ Successfully wrote internal_links.json');
console.log('Done!');
