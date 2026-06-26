import axios from 'axios';

async function getRawHtml() {
  try {
    const res = await axios.get('https://chrhenning.com/publications/', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const html = res.data;
    const lines = html.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('scholar.google.com/citations?view_op=view_citation')) {
        console.log(`Line ${i}:`, lines[i]);
        console.log(`Line ${i+1}:`, lines[i+1]);
        console.log(`Line ${i+2}:`, lines[i+2]);
        console.log(`Line ${i-1}:`, lines[i-1]);
        console.log('---');
      }
    }
  } catch (err) {
    console.error('Error fetching raw HTML:', err.message);
  }
}

getRawHtml();
