import { readFileSync } from 'fs';
import path from 'path';

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

interface LinkSuggestion {
  keyword: string;
  url: string;
  isRelated: boolean;
}

export class InternalLinker {
  private links: InternalLinks;
  private currentUrl: string;
  private usedLinks: Set<string> = new Set();
  private maxLinksPerKeyword: number;
  private maxLinksPerParagraph: number;

  constructor(
    currentUrl: string,
    maxLinksPerKeyword = 1,
    maxLinksPerParagraph = 2
  ) {
    console.log('InternalLinker constructor called with:', { currentUrl, maxLinksPerKeyword, maxLinksPerParagraph });
    this.currentUrl = currentUrl;
    this.maxLinksPerKeyword = maxLinksPerKeyword;
    this.maxLinksPerParagraph = maxLinksPerParagraph;
    
    // Load internal links data
    const linksPath = path.join(process.cwd(), 'src/content/internal_links.json');
    console.log('Loading internal links from:', linksPath);
    try {
      this.links = JSON.parse(readFileSync(linksPath, 'utf-8'));
      console.log('Loaded internal links:', {
        keywordCount: Object.keys(this.links.keywords).length,
        urlCount: Object.keys(this.links.urls).length
      });
    } catch (error) {
      console.error('Error loading internal links:', error);
      this.links = { keywords: {}, urls: {} };
    }
  }

  /**
   * Add internal links to a paragraph of text
   */
  public addLinks(text: string): string {
    console.log('InternalLinker.addLinks called with text:', text.substring(0, 100) + '...');
    let result = text;
    let linksAdded = 0;
    
    // Find all possible links for this paragraph
    const suggestions = this.findLinkSuggestions(text);
    console.log('Link suggestions found:', suggestions);
    
    // Sort by keyword length (longer first) to prevent nested links
    suggestions.sort((a, b) => b.keyword.length - a.keyword.length);
    
    // Process each suggestion
    for (const suggestion of suggestions) {
      // Skip if we've reached the max links for this paragraph
      if (linksAdded >= this.maxLinksPerParagraph) {
        console.log('Max links per paragraph reached:', this.maxLinksPerParagraph);
        break;
      }
      
      // Skip if we've already used this URL too many times
      if (this.shouldSkipLink(suggestion.url)) {
        console.log('Skipping link due to max usage:', suggestion.url);
        continue;
      }
      
      // Skip if it's the current page
      if (suggestion.url === this.currentUrl) {
        console.log('Skipping link to current page:', suggestion.url);
        continue;
      }
      
      // Use the matched keyword text as the link text, not the title
      const linkText = `<a href="${suggestion.url}" class="internal-link">${suggestion.keyword}</a>`;
      
      // Replace the keyword with the link, but only once per keyword
      const regex = new RegExp(`\\b${suggestion.keyword}\\b`, 'i');
      if (regex.test(result)) {
        console.log('Adding link:', { keyword: suggestion.keyword, url: suggestion.url });
        result = result.replace(regex, linkText);
        this.usedLinks.add(suggestion.url);
        linksAdded++;
      }
    }
    
    console.log('Final text after adding links:', result.substring(0, 100) + '...');
    return result;
  }

  /**
   * Find all possible link suggestions in a text
   */
  private findLinkSuggestions(text: string): LinkSuggestion[] {
    console.log('Finding link suggestions for text:', text.substring(0, 100) + '...');
    const suggestions: LinkSuggestion[] = [];
    
    for (const [keyword, links] of Object.entries(this.links.keywords)) {
      // Case-insensitive search for the keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
        console.log('Found keyword match:', keyword);
        // Add primary link
        suggestions.push({
          keyword,
          url: links.primary,
          isRelated: false
        });
        
        // Add related links
        for (const related of links.related) {
          suggestions.push({
            keyword,
            url: related,
            isRelated: true
          });
        }
      }
    }
    
    console.log('Total suggestions found:', suggestions.length);
    return suggestions;
  }

  /**
   * Check if we should skip adding this link based on usage
   */
  private shouldSkipLink(url: string): boolean {
    const urlCount = Array.from(this.usedLinks).filter(u => u === url).length;
    return urlCount >= this.maxLinksPerKeyword;
  }

  /**
   * Get related content suggestions for the current page
   */
  public getRelatedContent(): Array<{url: string; title: string; type: string}> {
    const currentPage = this.links.urls[this.currentUrl];
    if (!currentPage) return [];
    
    return currentPage.outbound
      .map(url => ({
        url,
        title: this.links.urls[url].title,
        type: this.links.urls[url].type
      }))
      .slice(0, 3); // Limit to 3 related items
  }

  processText(text: string): string {
    // TODO: Implement proper internal linking logic
    return text;
  }
}

// Example usage in a React component:
/*
import { InternalLinker } from '@/utils/internal-linking';
import ReactMarkdown from 'react-markdown';

export default function ContentRenderer({ content, currentUrl }) {
  // Initialize linker
  const linker = new InternalLinker(currentUrl);
  
  // Custom renderer for paragraphs
  const renderers = {
    p: ({ children }) => {
      const text = children.toString();
      const linkedText = linker.addLinks(text);
      return <p dangerouslySetInnerHTML={{ __html: linkedText }} />;
    }
  };
  
  return (
    <div>
      <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
      
      {/* Related content section *\/}
      <div className="mt-8">
        <h2>Related Content</h2>
        <ul>
          {linker.getRelatedContent().map(({ url, title, type }) => (
            <li key={url}>
              <a href={url}>{title}</a> ({type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/
