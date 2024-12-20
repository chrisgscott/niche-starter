import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateContent } from '../utils/validation/index.js';

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const contentDir = join(process.cwd(), 'src/content');

if (!existsSync(contentDir)) {
  console.error(`\n❌ Content directory not found: ${contentDir}`);
  console.error('Please create the content directory with your markdown files.');
  process.exit(1);
}

async function validateDirectory(dir: string): Promise<boolean> {
  try {
    let isValid = true;
    const files = readdirSync(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        // Recursively validate subdirectories
        isValid = await validateDirectory(filePath) && isValid;
      } else if (file.endsWith('.md')) {
        // Validate markdown files
        try {
          const content = readFileSync(filePath, 'utf-8');
          const result = validateContent(filePath, content);

          if (!result.isValid) {
            console.error(`\n❌ Validation failed for ${filePath}:`);
            result.errors.forEach(error => {
              console.error(`  - ${error.path.join('.')}: ${error.message}`);
            });
            isValid = false;
          } else {
            console.log(`✅ ${filePath}`);
          }
        } catch (error) {
          console.error(`\n❌ Error processing ${filePath}:`, error);
          isValid = false;
        }
      }
    }

    return isValid;
  } catch (error) {
    console.error(`\n❌ Error processing directory ${dir}:`, error);
    return false;
  }
}

// Run validation
console.log('Validating content...\n');

(async () => {
  try {
    const isValid = await validateDirectory(contentDir);

    if (isValid) {
      console.log('\n✅ All content is valid!');
      process.exit(0);
    } else {
      console.error('\n❌ Content validation failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Validation process failed:', error);
    process.exit(1);
  }
})().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
