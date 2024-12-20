import { z } from 'zod';
import matter from 'gray-matter';
import { 
  topicSchema, 
  postSchema, 
  articleSchema, 
  configSchema, 
  homeSchema, 
  siteConfigSchema, 
  ctaConfigSchema 
} from './schemas.js';

export type ValidationError = {
  path: string[];
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export function validateFrontmatter(
  filePath: string,
  content: string,
  type: 'topic' | 'post' | 'article' | 'config' | 'home'
): ValidationResult {
  try {
    // Parse frontmatter
    console.log(`Parsing frontmatter for ${filePath}`);
    const { data: frontmatter } = matter(content);
    console.log('Frontmatter:', JSON.stringify(frontmatter, null, 2));

    // Select schema based on content type and file name
    console.log(`Using schema type: ${type}`);
    let schema;
    if (type === 'config') {
      // For config files, select schema based on file name
      if (filePath.endsWith('site.md')) {
        schema = siteConfigSchema;
      } else if (filePath.endsWith('cta.md')) {
        schema = ctaConfigSchema;
      } else {
        throw new Error(`Unknown config file: ${filePath}`);
      }
    } else {
      // For content files, use standard schemas
      schema = {
        topic: topicSchema,
        post: postSchema,
        article: articleSchema,
        home: homeSchema
      }[type];
    }

    if (!schema) {
      throw new Error(`Invalid schema type: ${type}`);
    }

    // Validate against schema
    console.log('Validating against schema...');
    schema.parse(frontmatter);

    return {
      isValid: true,
      errors: []
    };
  } catch (error) {
    console.error('Validation error:', error);
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          path: err.path.map(p => String(p)),
          message: err.message
        }))
      };
    }
    
    return {
      isValid: false,
      errors: [{
        path: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }]
    };
  }
}

// Helper function to determine content type from file path
export function getContentType(filePath: string): 'topic' | 'post' | 'article' | 'config' | 'home' {
  console.log(`Determining content type for: ${filePath}`);
  if (filePath.includes('/topics/')) return 'topic';
  if (filePath.includes('/posts/')) return 'post';
  if (filePath.includes('/articles/')) return 'article';
  if (filePath.includes('/config/')) return 'config';
  if (filePath.endsWith('/home.md')) return 'home';
  throw new Error(`Unable to determine content type for file: ${filePath}`);
}

// Main validation function
export function validateContent(filePath: string, content: string): ValidationResult {
  try {
    console.log(`\nValidating file: ${filePath}`);
    const contentType = getContentType(filePath);
    console.log(`Content type determined: ${contentType}`);
    return validateFrontmatter(filePath, content, contentType);
  } catch (error) {
    console.error('Error in validateContent:', error);
    return {
      isValid: false,
      errors: [{
        path: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }]
    };
  }
}
