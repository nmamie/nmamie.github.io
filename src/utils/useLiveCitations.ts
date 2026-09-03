import { useState, useEffect } from 'react';
import { SanitizedPublication } from '../interfaces/sanitized-config';

interface CitationCache {
  [title: string]: {
    count: number;
    timestamp: number;
  };
}

const CACHE_KEY = 'publication_citations_cache_v2';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const useLiveCitations = (publications: SanitizedPublication[]) => {
  const [citationCounts, setCitationCounts] = useState<{ [title: string]: number }>(() => {
    // Initialize with configured citation counts
    const initial: { [title: string]: number } = {};
    publications.forEach((p) => {
      if (p.citations !== undefined) {
        initial[p.title] = p.citations;
      }
    });

    // Check localStorage cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CitationCache = JSON.parse(cached);
        const now = Date.now();
        Object.keys(parsed).forEach((title) => {
          if (now - parsed[title].timestamp < CACHE_TTL) {
            initial[title] = Math.max(initial[title] ?? 0, parsed[title].count);
          }
        });
      }
    } catch (e) {
      /* ignore storage errors */
    }

    return initial;
  });

  useEffect(() => {
    let isMounted = true;

    const fetchLiveCitation = async (pub: SanitizedPublication) => {
      try {
        // 1. Try DOI via OpenAlex
        const doiMatch = pub.bibtex?.match(/doi\s*=\s*[{"]?([^}"]+)[}"]?/i) ||
                         pub.link?.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
        
        let foundCount: number | null = null;

        if (doiMatch) {
          const cleanDoi = doiMatch[1] || doiMatch[0];
          const res = await fetch(`https://api.openalex.org/works/https://doi.org/${cleanDoi}`, {
            headers: { 'User-Agent': 'mailto:collaborations@mamié.ch' },
          });
          if (res.ok) {
            const data = await res.json();
            if (typeof data.cited_by_count === 'number') {
              foundCount = data.cited_by_count;
            }
          }
        }

        // 2. If no DOI or count is 0, try OpenAlex search by title
        if (foundCount === null) {
          const query = encodeURIComponent(pub.title);
          const res = await fetch(`https://api.openalex.org/works?filter=title.search:${query}`, {
            headers: { 'User-Agent': 'mailto:collaborations@mamié.ch' },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              // Find matching title
              const match = data.results.find((r: any) => 
                r.title && r.title.toLowerCase().includes(pub.title.slice(0, 30).toLowerCase())
              );
              if (match && typeof match.cited_by_count === 'number') {
                foundCount = match.cited_by_count;
              }
            }
          }
        }

        if (foundCount !== null && isMounted) {
          // If live count is higher or available, update state and cache
          setCitationCounts((prev) => {
            const updatedCount = Math.max(prev[pub.title] ?? 0, foundCount!);
            const next = { ...prev, [pub.title]: updatedCount };

            try {
              const cached: CitationCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
              cached[pub.title] = { count: updatedCount, timestamp: Date.now() };
              localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
            } catch (e) {
              /* ignore */
            }

            return next;
          });
        }
      } catch (err) {
        // Fallback silently to configured citations
      }
    };

    publications.forEach((p) => {
      fetchLiveCitation(p);
    });

    return () => {
      isMounted = false;
    };
  }, [publications]);

  return citationCounts;
};
