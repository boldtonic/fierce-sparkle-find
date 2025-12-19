export type ServiceCategory = 'technical' | 'business' | 'social' | 'funding';

export interface ServiceItem {
  category: ServiceCategory;
  name: string;
  fullLabel: string;
}

export interface Provider {
  id: string;
  name: string;
  website: string;
  country: string;
  coverage: string;
  description: string;
  services: {
    technical: ServiceItem[];
    business: ServiceItem[];
    social: ServiceItem[];
    funding: ServiceItem[];
  };
  voucherTypes: ('ideation' | 'scaleup' | 'commercialisation')[];
}

export function parseCSV(csvText: string): Provider[] {
  const rows = parseCSVRows(csvText);
  const providers: Provider[] = [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const parts = rows[i];
    if (!parts || parts.length === 0) continue;
    if (!parts[0]?.trim()) continue;

    // Collect all services from all voucher columns (5, 6, 7)
    const ideationServices = parseServicesWithCategories(parts[5] || '');
    const scaleupServices = parseServicesWithCategories(parts[6] || '');
    const commercialisationServices = parseServicesWithCategories(parts[7] || '');

    // Merge all services and deduplicate
    const allServices = [...ideationServices, ...scaleupServices, ...commercialisationServices];
    const uniqueServices = deduplicateServices(allServices);

    // Group by category
    const services = {
      technical: uniqueServices.filter(s => s.category === 'technical'),
      business: uniqueServices.filter(s => s.category === 'business'),
      social: uniqueServices.filter(s => s.category === 'social'),
      funding: uniqueServices.filter(s => s.category === 'funding'),
    };

    // Determine which voucher types this provider supports
    const voucherTypes: ('ideation' | 'scaleup' | 'commercialisation')[] = [];
    if (ideationServices.length > 0) voucherTypes.push('ideation');
    if (scaleupServices.length > 0) voucherTypes.push('scaleup');
    if (commercialisationServices.length > 0) voucherTypes.push('commercialisation');

    const provider: Provider = {
      id: `provider-${providers.length}`,
      name: (parts[0] || '').trim(),
      website: normalizeUrl((parts[1] || '').trim()),
      country: (parts[2] || '').trim(),
      coverage: (parts[3] || '').trim(),
      description: (parts[4] || '').trim(),
      services,
      voucherTypes,
    };

    providers.push(provider);
  }

  // Filter out duplicates
  const seen = new Set<string>();
  return providers.filter((p) => {
    const key = `${p.name}-${p.country}`;
    if (seen.has(key) || !p.name) return false;
    seen.add(key);
    return true;
  });
}

function parseCSVRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
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

  row.push(field);
  rows.push(row);

  return rows;
}

function parseServicesWithCategories(servicesString: string): ServiceItem[] {
  if (!servicesString?.trim()) return [];

  const items: ServiceItem[] = [];
  
  // Split by comma, but handle the "Category | Service" format
  const parts = servicesString.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Parse "Category | Service name" format
    const pipeIndex = trimmed.indexOf('|');
    if (pipeIndex > 0) {
      const categoryPart = trimmed.substring(0, pipeIndex).trim();
      const serviceName = trimmed.substring(pipeIndex + 1).trim();
      const category = mapToServiceCategory(categoryPart);
      
      if (serviceName) {
        items.push({
          category,
          name: serviceName,
          fullLabel: trimmed,
        });
      }
    } else {
      // Fallback: try to determine category from content
      items.push({
        category: guessCategory(trimmed),
        name: trimmed,
        fullLabel: trimmed,
      });
    }
  }

  return items;
}

function mapToServiceCategory(categoryString: string): ServiceCategory {
  const lower = categoryString.toLowerCase();
  if (lower.includes('technical')) return 'technical';
  if (lower.includes('business')) return 'business';
  if (lower.includes('social') || lower.includes('environmental')) return 'social';
  if (lower.includes('funding') || lower.includes('financing')) return 'funding';
  return 'business'; // Default
}

function guessCategory(service: string): ServiceCategory {
  const lower = service.toLowerCase();
  if (lower.includes('technical') || lower.includes('mvp') || lower.includes('prototype') || lower.includes('lab') || lower.includes('system')) return 'technical';
  if (lower.includes('social') || lower.includes('environmental') || lower.includes('sustainability') || lower.includes('lifecycle')) return 'social';
  if (lower.includes('funding') || lower.includes('grant') || lower.includes('investment') || lower.includes('seed') || lower.includes('vc')) return 'funding';
  return 'business';
}

function deduplicateServices(services: ServiceItem[]): ServiceItem[] {
  const seen = new Set<string>();
  return services.filter(s => {
    const key = `${s.category}-${s.name.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('www.')) return `https://${url}`;
  return url.includes('.') ? `https://${url}` : '';
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

export function hasServiceCategory(provider: Provider, category: ServiceCategory): boolean {
  return provider.services[category].length > 0;
}

export function getAllServiceCategories(provider: Provider): ServiceCategory[] {
  const categories: ServiceCategory[] = [];
  if (provider.services.technical.length > 0) categories.push('technical');
  if (provider.services.business.length > 0) categories.push('business');
  if (provider.services.social.length > 0) categories.push('social');
  if (provider.services.funding.length > 0) categories.push('funding');
  return categories;
}

export type CoverageType = 'local' | 'eu' | 'global';

export function getCoverageType(coverage: string): CoverageType {
  const lower = coverage.toLowerCase();
  if (lower.includes('global') || lower.includes('worldwide') || lower.includes('international')) return 'global';
  if (lower.includes('eu') || lower.includes('europe')) return 'eu';
  return 'local';
}
