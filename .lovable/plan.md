

# Plan: Add All Missing Provider Email Mappings

## What's Happening Now

The "Ask for quotation" button on provider cards needs an email address to work. Currently, this is handled via a **hardcoded mapping** inside `src/components/ProviderCard.tsx` called `providerEmails`. This mapping connects provider names to their contact emails.

The problem: **32 emails from your list are missing** from this mapping, so clicking "Ask for quotation" for those providers opens an empty email.

---

## What I'll Do

I'll add all the missing email addresses to the `providerEmails` object. Here's the complete list of providers that need to be added:

| Provider Name | Email |
|--------------|-------|
| Deep Focus Unipessoal Lda | geral@deepfocus.pt |
| Satellite Applications Catapult Ltd. | maryia.urazaeva@sa.catapult.org.uk |
| QUANT 3S d.o.o. | damjana.stojnic@quant-3s.com |
| NV5 Geospatial Solutions Italia SRL | infoitalia@nv5.com |
| Offshore Monitoring Limited | info@offshoremonitoring.com |
| Bitrezus PC | ka@bitrezus.com |
| I.S.S.E.A.D. Innovations Ltd | info@issead.eu |
| Natixar | s.cranga@natixar.com |
| Atfield Technologies doo | srdjan@atfield.tech |
| Edurne Suárez Lejardi | edurnesuri@gmail.com |
| Selha Group | julien.vezier@selhagroup.com |
| Devisionx | maziz@devisionx.com |
| Nido de Ideas SL | fernandochico@nidodeideas.es |
| AeroVision B.V. | tamme.vanderwal@aerovision.nl |
| Geokinesia | pavel.pavlovsky@geokinesia.com |
| MPEOS | mperriot@mpeos.fr |
| Envirotrust | bidesman@envirotrust.eu |
| CDXI SA | kkarys@cdxi.gr |
| Kalmia d.o.o. | borut.terpinc@kalmia.si |
| Krakow Research Institute | s.kaczmarek@kri.org.uk |
| Vardevia Oy | info@vardevia.fi |
| Auyan Tech | Alix.leroy@auyan.tech |
| Zirak Italy Srl | davide.mazzucchi@zirak.it |
| Brainnest Institute | brainnestinstitute@gmail.com |
| Svetlana Zikic | svetlanazikic9@gmail.com |
| Botshare Sp z OO | alex@botshare.ai |
| Satsense Solutions Limited | pranav.pasari@satsense.co |
| Metrology LAB | avramov@metrology-lab.com |
| Sefini llc. | svetlanazikic9@gmail.com |
| Wozify Kft. | balazs.slezak@wozify.com |
| constellr GmbH | conner.reinhardt@constellr.com |
| Faculty of Space Technologies, AGH University of Krakow | mlupa@agh.edu.pl |

---

## Technical Details

**File to modify:** `src/components/ProviderCard.tsx`

**Change:** Expand the `providerEmails` object (lines 50-101) to include all 32 missing entries.

**Note:** Some provider names in the CSV may have slight variations (extra spaces, different capitalization). I'll match them exactly as they appear in the CSV to ensure the mapping works correctly.

---

## After This Update

- All 78+ providers will have working "Ask for quotation" buttons
- Clicking the button will open an email client with the correct recipient pre-filled

