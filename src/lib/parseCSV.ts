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
  const lines = csvText.split('\n');
  const providers: Provider[] = [];
  
  let currentProvider: Partial<Provider> | null = null;
  let currentDescription = '';
  let inMultilineDescription = false;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a new provider (starts with a company name and has commas)
    const isNewProvider = line.match(/^[^,]+,(https?:\/\/|www\.)/i) || 
                          line.match(/^[^,]+,[^,]*,[A-Z][a-z]+/);
    
    if (isNewProvider && !inMultilineDescription) {
      // Save previous provider
      if (currentProvider && currentProvider.name) {
        currentProvider.description = currentDescription.trim();
        providers.push(currentProvider as Provider);
      }
      
      // Parse new provider
      const parts = parseCSVLine(line);
      if (parts.length >= 8) {
        currentProvider = {
          id: `provider-${providers.length}`,
          name: parts[0]?.trim() || '',
          website: normalizeUrl(parts[1]?.trim() || ''),
          country: parts[2]?.trim() || '',
          coverage: parts[3]?.trim() || '',
          ideation: parseServices(parts[5] || ''),
          scaleup: parseServices(parts[6] || ''),
          commercialisation: parseServices(parts[7] || ''),
        };
        currentDescription = parts[4] || '';
        inMultilineDescription = (currentDescription.match(/"/g) || []).length % 2 !== 0;
      }
    } else if (currentProvider) {
      // Continue multiline description
      currentDescription += '\n' + line;
      if (line.includes('"')) {
        inMultilineDescription = false;
      }
    }
  }
  
  // Save last provider
  if (currentProvider && currentProvider.name) {
    currentProvider.description = currentDescription.trim();
    providers.push(currentProvider as Provider);
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
