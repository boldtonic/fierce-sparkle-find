

## Add 9 New Providers to the FIERCE Catalogue

### What we're doing
Adding 9 new service providers from the 13 April spreadsheet to the catalogue CSV and email mapping.

### Steps

1. **Append 9 rows to `public/data/providers.csv`**
   - Format each provider into the 8-column schema (Name, Website, Country, Coverage, Description, Ideation, Scaleup, Commercialisation)
   - Strip contact email column per established process
   - Normalize coverage values (e.g., "EU-wide" → "Europe", "Global" stays)
   - Wrap names with commas in quotes

2. **Add 9 entries to `providerEmails` in `src/components/ProviderCard.tsx`**
   - Map each provider name (exactly as it appears in CSV) to their contact email from the spreadsheet

3. **Verify via script**
   - Confirm final count is 163
   - Confirm all 9 new names are present and parseable
   - Confirm email mapping keys match CSV names

### Provider-to-email mapping (from spreadsheet)
- B.W.I. (Blue Water Intelligence) → asdevallet@bwi.earth
- GeoSolutions SRL → attilio.vaccaro@geosolutionsgroup.com
- VISTA Geowissenschaftliche Fernerkundung GmbH → migdall@vista-geo.de
- amicaldo GmbH → deters@amicaldo.de
- DREAM DEVELOPMENT SRL → office@dreamdevelopment.ro
- OneSoil LTD → v.paskar@onesoil.ai
- INDE Robotics Oy → elad.bloch@inde-robotics.com
- AssemblyPoint Limited, trading as Zartis → albena@zartis.com
- Geospatial Research Center (Geomakani) → ahmed.elawadly@geomakani.com

### Post-addition report
Will provide a summary confirming the 163-provider count, list all new entries, and verify email mappings.

