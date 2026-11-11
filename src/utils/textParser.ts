export interface ParsedSection {
  title: string;
  paragraphs: string[];
}

export interface ParsedFact {
  label: string;
  value: string;
}

export interface ParsedBiography {
  title: string;
  subtitle: string;
  byline: string;
  sections: ParsedSection[];
  quickFacts: ParsedFact[];
  quotes: string[];
  rawText: string;
}

export function parseBiographyText(rawText: string): ParsedBiography {
  const lines = rawText.split('\n').map((l) => l.trim());

  let title = '';
  let subtitle = '';
  let byline = '';
  const quickFacts: ParsedFact[] = [];
  const quotes: string[] = [];
  const sections: ParsedSection[] = [];

  let currentSectionTitle = 'Biography Overview';
  let currentParagraphs: string[] = [];

  let inQuickFacts = false;
  let inQuotes = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // First line is title
    if (!title) {
      title = line.replace(/^\uFEFF/, '').trim();
      continue;
    }

    // Second line is often subtitle/summary
    if (!subtitle && !line.startsWith('By ') && !line.startsWith('Updated:')) {
      subtitle = line;
      continue;
    }

    // Byline / update date
    if (line.startsWith('By ') || line.startsWith('Updated:') || line.includes('Biography.com Editors')) {
      byline = line;
      continue;
    }

    // Check for Quick Facts header
    if (line.toUpperCase() === 'QUICK FACTS' || line.toUpperCase() === 'QUICK FACTS:') {
      inQuickFacts = true;
      inQuotes = false;
      continue;
    }

    // Check for Quotes header
    if (line.toUpperCase() === 'QUOTES' || line.toUpperCase() === 'QUOTES:') {
      inQuotes = true;
      inQuickFacts = false;
      continue;
    }

    // In Quick facts
    if (inQuickFacts) {
      if (line.startsWith('_____') || line.toUpperCase().startsWith('CITATION') || line.toUpperCase() === 'QUOTES') {
        inQuickFacts = false;
        if (line.toUpperCase() === 'QUOTES') {
          inQuotes = true;
        }
        continue;
      }

      const match = line.match(/^([A-Z\s]+):\s*(.+)$/);
      if (match) {
        quickFacts.push({
          label: match[1].trim(),
          value: match[2].trim(),
        });
        continue;
      }
    }

    // In Quotes
    if (inQuotes) {
      if (line.startsWith('_____') || line.toUpperCase().startsWith('CITATION') || line.startsWith('Fact Check')) {
        inQuotes = false;
        continue;
      }
      if (line.startsWith('*')) {
        const q = line.replace(/^\*\s*/, '').trim();
        if (q) quotes.push(q);
        continue;
      }
    }

    // Check if line looks like a major section heading
    // Usually short line (< 60 chars), title case, doesn't end with a period, or starts with 'Who Is/Was'
    const isHeading =
      (line.length < 65 &&
        !line.endsWith('.') &&
        !line.endsWith(',') &&
        !line.endsWith(';') &&
        !line.startsWith('*') &&
        (line.startsWith('Who Was') ||
          line.startsWith('Who Is') ||
          line.includes('Early Life') ||
          line.includes('Career') ||
          line.includes('Olympic') ||
          line.includes('Presidency') ||
          line.includes('Awards') ||
          line.includes('Legacy') ||
          line.includes('Death') ||
          line.includes('Marriage') ||
          line.includes('Children') ||
          line.includes('Inventions') ||
          line.includes('World Cup') ||
          line.includes('Championship') ||
          line.includes('Accomplishments') ||
          line.includes('Discovery') ||
          line.includes('Foundation') ||
          line.includes('News') ||
          line.includes('Movies') ||
          line.includes('Books') ||
          line.includes('Personal Life') ||
          /^[A-Z][a-zA-Z0-9\s'–—:]{3,45}$/.test(line))) &&
      !line.toLowerCase().includes('getty images') &&
      !line.toLowerCase().includes('advertisement') &&
      !line.toLowerCase().includes('photo:');

    // Skip advertisement or photo credit placeholders from raw docs
    if (
      line.toLowerCase().includes('advertisement - continue reading below') ||
      line.toLowerCase().includes('we may earn commission from links') ||
      line === '*' ||
      line === '* *'
    ) {
      continue;
    }

    if (isHeading && currentParagraphs.length > 0) {
      sections.push({
        title: currentSectionTitle,
        paragraphs: currentParagraphs,
      });
      currentSectionTitle = line;
      currentParagraphs = [];
      continue;
    }

    currentParagraphs.push(line);
  }

  // Push remaining section
  if (currentParagraphs.length > 0) {
    sections.push({
      title: currentSectionTitle,
      paragraphs: currentParagraphs,
    });
  }

  return {
    title,
    subtitle,
    byline,
    sections,
    quickFacts,
    quotes,
    rawText,
  };
}
