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
  // First, join multi-line records into single lines
  const rawLines = csvText.split('\n');
  const joinedLines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    
    if (currentLine === '') {
      currentLine = line;
    } else {
      currentLine += '\n' + line;
    }
    
    // Count quotes to determine if we're inside a quoted field
    const quoteCount = (currentLine.match(/"/g) || []).length;
    inQuotes = quoteCount % 2 !== 0;
    
    if (!inQuotes) {
      joinedLines.push(currentLine);
      currentLine = '';
    }
  }
  
  // Don't forget the last line if there's any remaining
  if (currentLine) {
    joinedLines.push(currentLine);
  }
  
  const providers: Provider[] = [];
  
  // Skip header (first line)
  for (let i = 1; i < joinedLines.length; i++) {
    const line = joinedLines[i].trim();
    if (!line) continue;
    
    const parts = parseCSVLine(line);
    
    // Need at least company name
    if (!parts[0]?.trim()) continue;
    
    const provider: Provider = {
      id: `provider-${providers.length}`,
      name: parts[0]?.trim() || '',
      website: normalizeUrl(parts[1]?.trim() || ''),
      country: parts[2]?.trim() || '',
      coverage: parts[3]?.trim() || '',
      description: (parts[4] || '').replace(/^"|"$/g, '').trim(),
      ideation: parseServices(parts[5] || ''),
      scaleup: parseServices(parts[6] || ''),
      commercialisation: parseServices(parts[7] || ''),
    };
    
    providers.push(provider);
  }
  
  // Filter out duplicates and empty entries
  const seen = new Set<string>();
  return providers.filter(p => {
    const key = `${p.name}-${p.country}`;
    if (seen.has(key) || !p.name) return false;
    seen.add(key);
    return true;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
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
