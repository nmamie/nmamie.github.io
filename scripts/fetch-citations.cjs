const fs = require('fs');
const path = require('path');

const USER_ID = 'JhXjm_sAAAAJ';
const PROFILE_URL = `https://scholar.google.com/citations?user=${USER_ID}&hl=en`;
const OUTPUT_FILE = path.join(__dirname, '../src/data/citations.json');

console.log(`Fetching citations from Google Scholar profile: ${PROFILE_URL}...`);

fetch(PROFILE_URL, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }
    return response.text();
  })
  .then(html => {
    const results = {};
    const rowRegex = /<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g;
    let match;
    let count = 0;

    while ((match = rowRegex.exec(html)) !== null) {
      const rowHtml = match[1];
      const idMatch = new RegExp(`citation_for_view=${USER_ID}:([a-zA-Z0-9_-]+)`).exec(rowHtml);
      if (idMatch) {
        const id = idMatch[1];
        const citesMatch = /<td class="gsc_a_c">[\s\S]*?<a[^>]*class="[^"]*gsc_a_ac[^"]*"[^>]*>([\d*]+)<\/a>/.exec(rowHtml);
        const citations = citesMatch ? parseInt(citesMatch[1].replace('*', ''), 10) : 0;
        results[id] = citations;
        count++;
      }
    }

    if (count === 0) {
      console.warn('Warning: No publication entries found on the parsed page. Google Scholar might be rate-limiting or blocking us.');
      return;
    }

    console.log('Successfully fetched citations:', results);

    let existing = {};
    try {
      if (fs.existsSync(OUTPUT_FILE)) {
        existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      }
    } catch (e) {
      // ignore
    }

    const updated = { ...existing, ...results };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updated, null, 2));
    console.log(`Updated ${OUTPUT_FILE} successfully!`);
  })
  .catch(error => {
    console.error('Error fetching Google Scholar citations:', error.message);
    console.log('Falling back to existing cached citations.');
  });
