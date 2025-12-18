export interface Provider {
  id: string;
  name: string;
  website: string;
  country: string;
  coverage: string;
  description: string;
  ideation: string[];
  scaleup: string[];
  commercialisation: string[];
}

export function parseCSV(csvText: string): Provider[] {
  const rows = parseCSVRows(csvText);
  const providers: Provider[] = [];

  // Skip header
  for (let i = 1; i < rows.length; i++) {
    const parts = rows[i];
    if (!parts || parts.length === 0) continue;

    // Need at least company name
    if (!parts[0]?.trim()) continue;

    const provider: Provider = {
      id: `provider-${providers.length}`,
      name: (parts[0] || '').trim(),
      website: normalizeUrl((parts[1] || '').trim()),
      country: (parts[2] || '').trim(),
      coverage: (parts[3] || '').trim(),
      description: cleanCsvField(parts[4] || '').trim(),
      ideation: parseServices(parts[5] || ''),
      scaleup: parseServices(parts[6] || ''),
      commercialisation: parseServices(parts[7] || ''),
    };

    providers.push(provider);
  }

  // Filter out duplicates and empty entries
  const seen = new Set<string>();
  return providers.filter((p) => {
    const key = `${p.name}-${p.country}`;
    if (seen.has(key) || !p.name) return false;
    seen.add(key);
    return true;
  });
}

/**
 * RFC4180-ish CSV parser:
 * - Commas split fields only when not inside quotes
 * - Newlines split records only when not inside quotes
 * - Escaped quotes inside quoted fields are represented as ""
 */
function parseCSVRows(csvText: string): string[][] {
  const rows: string[][] = [];

  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  // Normalize line endings
  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        // Escaped quote
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if (char === '\n' && !inQuotes) {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  // Flush last field/row
  row.push(field);
  rows.push(row);

  return rows;
}

function cleanCsvField(value: string): string {
  // At this point quotes are already removed by the parser;
  // this keeps legacy cleanup for safety.
  return value.replace(/\uFEFF/g, '').trim();
}


function parseServices(servicesString: string): string[] {
  if (!servicesString) return [];
  
  return servicesString
    .replace(/"/g, '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('www.')) {
    return `https://${url}`;
  }
  return url.includes('.') ? `https://${url}` : '';
}

export function getServiceCategory(service: string): 'technical' | 'business' | 'social' | 'funding' {
  const lower = service.toLowerCase();
  if (lower.startsWith('technical')) return 'technical';
  if (lower.startsWith('business')) return 'business';
  if (lower.startsWith('social') || lower.startsWith('environmental')) return 'social';
  return 'funding';
}

export function getUniqueCountries(providers: Provider[]): string[] {
  const countries = new Set<string>();
  providers.forEach(p => {
    if (p.country) countries.add(p.country);
  });
  return Array.from(countries).sort();
}

export function getUniqueCoverages(providers: Provider[]): string[] {
  const coverages = new Set<string>();
  providers.forEach(p => {
    if (p.coverage) coverages.add(p.coverage);
  });
  return Array.from(coverages).sort();
}
