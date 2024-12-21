import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { globby } from 'globby'

interface InternalLink {
  primary: string
  related: string[]
}

interface InternalLinks {
  keywords: {
    [key: string]: InternalLink
  }
  urls: {
    [key: string]: {
      title: string
      type: 'topic' | 'post' | 'article'
      keywords: string[]
    }
  }
}

async function generateInternalLinks() {
  try {
    // Initialize the structure
    const internalLinks: InternalLinks = {
      keywords: {},
      urls: {}
    }

    // Get all content files
    const contentDir = path.join(process.cwd(), 'src/content')
    const files = await globby([
      'topics/**/*.md',
      'posts/**/*.md',
      'articles/**/*.md'
    ], {
      cwd: contentDir,
      ignore: ['config/**', 'home.md'] // Explicitly ignore config and home
    })

    // Process each file
    for (const file of files) {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf8')
      const { data: frontMatter } = matter(content)
      
      // Determine content type and URL
      const type = file.split('/')[0].slice(0, -1) // Remove 's' from folders name
      const url = `/${type}/${frontMatter.slug}`
      
      // Add to urls mapping
      internalLinks.urls[url] = {
        title: frontMatter.title,
        type: type as 'topic' | 'post' | 'article',
        keywords: frontMatter.keywords || []
      }

      // Process keywords
      const keywords = frontMatter.keywords || []
      keywords.forEach((keyword: string) => {
        if (!internalLinks.keywords[keyword]) {
          internalLinks.keywords[keyword] = {
            primary: url,
            related: []
          }
        } else if (!internalLinks.keywords[keyword].related.includes(url) && 
                   internalLinks.keywords[keyword].primary !== url) {
          internalLinks.keywords[keyword].related.push(url)
        }
      })

      // Process links from frontmatter if they exist
      const links = frontMatter.links || {}
      Object.entries(links).forEach(([linkType, urls]: [string, any]) => {
        if (Array.isArray(urls)) {
          urls.forEach((linkedUrl: string) => {
            // Add this URL as a related link to all keywords of the linked content
            const linkedKeywords = internalLinks.urls[linkedUrl]?.keywords || []
            linkedKeywords.forEach(keyword => {
              if (!internalLinks.keywords[keyword]) {
                internalLinks.keywords[keyword] = {
                  primary: linkedUrl,
                  related: [url]
                }
              } else if (!internalLinks.keywords[keyword].related.includes(url) &&
                        internalLinks.keywords[keyword].primary !== url) {
                internalLinks.keywords[keyword].related.push(url)
              }
            })
          })
        }
      })
    }

    // Sort related links for consistency
    Object.values(internalLinks.keywords).forEach(link => {
      link.related.sort()
    })

    // Write to file
    const outputPath = path.join(contentDir, 'internal_links.json')
    fs.writeFileSync(
      outputPath,
      JSON.stringify(internalLinks, null, 2)
    )

    console.log('Internal links generated successfully!')
  } catch (error) {
    console.error('Error generating internal links:', error)
  }
}

generateInternalLinks()
