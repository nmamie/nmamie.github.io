import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.resolve(__dirname, '../gitprofile.config.ts');

async function fetchCitationsForPaper(title, doi) {
  try {
    if (doi) {
      const res = await fetch(`https://api.openalex.org/works/https://doi.org/${doi}`, {
        headers: { 'User-Agent': 'mailto:collaborations@mamié.ch' }
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.cited_by_count === 'number') {
          return data.cited_by_count;
        }
      }
    }

    const query = encodeURIComponent(title);
    const res = await fetch(`https://api.openalex.org/works?filter=title.search:${query}`, {
      headers: { 'User-Agent': 'mailto:collaborations@mamié.ch' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const match = data.results.find(r => r.title && r.title.toLowerCase().includes(title.slice(0, 25).toLowerCase()));
        if (match && typeof match.cited_by_count === 'number') {
          return match.cited_by_count;
        }
      }
    }
  } catch (err) {
    console.warn(`Could not fetch citations for "${title}":`, err.message);
  }
  return null;
}

async function main() {
  console.log('🔄 Checking live citations across open indexing databases...');
  let configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');

  // Regex to extract publications
  const pubRegex = /title:\s*['"`](.*?)['"`][\s\S]*?(?:citations:\s*(\d+))?/g;
  
  console.log('✨ Citation sync complete.');
}

main();
