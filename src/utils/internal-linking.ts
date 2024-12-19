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
    this.currentUrl = currentUrl;
    this.maxLinksPerKeyword = maxLinksPerKeyword;
    this.maxLinksPerParagraph = maxLinksPerParagraph;
    
    // Load internal links data
    const linksPath = path.join(process.cwd(), 'src/content/internal_links.json');
    this.links = JSON.parse(readFileSync(linksPath, 'utf-8'));
  }

  /**
   * Add internal links to a paragraph of text
   */
  public addLinks(text: string): string {
    const paragraphLinks: Set<string> = new Set();
    
    // Find all possible links for this paragraph
    const suggestions = this.findLinkSuggestions(text);
    
    // Sort by keyword length (longer first) to prevent nested links
    suggestions.sort((a, b) => b.keyword.length - a.keyword.length);
    
    // Process each suggestion
    for (const suggestion of suggestions) {
      // Skip if we've reached the max links for this paragraph
      if (paragraphLinks.size >= this.maxLinksPerParagraph) break;
      
      // Skip if we've already used this URL too many times
      if (this.shouldSkipLink(suggestion.url)) continue;
      
      // Skip if it's the current page
      if (suggestion.url === this.currentUrl) continue;
      
      // Add the link
      text = this.replaceKeywordWithLink(
        text,
        suggestion.keyword,
        suggestion.url
      );
      
      // Track usage
      this.usedLinks.add(suggestion.url);
      paragraphLinks.add(suggestion.url);
    }
    
    return text;
  }

  /**
   * Find all possible link suggestions in a text
   */
  private findLinkSuggestions(text: string): LinkSuggestion[] {
    const suggestions: LinkSuggestion[] = [];
    
    for (const [keyword, links] of Object.entries(this.links.keywords)) {
      // Case-insensitive search for the keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
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
   * Replace a keyword with an HTML link
   */
  private replaceKeywordWithLink(
    text: string,
    keyword: string,
    url: string
  ): string {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const match = text.match(regex);
    
    if (!match) return text;
    
    const link = `<a href="${url}" class="text-blue-600 hover:underline">${match[0]}</a>`;
    return text.replace(regex, link);
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
