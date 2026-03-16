import { useState } from 'react';
import { Provider, ServiceCategory, getAllServiceCategories, getCoverageType } from '@/lib/parseCSV';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { 
  MapPin, 
  ExternalLink,
  Wrench,
  Briefcase,
  Leaf,
  Coins,
  Lightbulb,
  Rocket,
  TrendingUp,
  Globe2,
  Building2,
  Earth,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ProviderDetailModal } from './ProviderDetailModal';

interface ProviderCardProps {
  provider: Provider;
  index: number;
}

const categoryConfig: Record<ServiceCategory, { label: string; icon: LucideIcon; colorClass: string }> = {
  technical: { label: 'Technical', icon: Wrench, colorClass: 'bg-tag-technical/15 text-tag-technical border-tag-technical/30' },
  business: { label: 'Business', icon: Briefcase, colorClass: 'bg-tag-business/15 text-tag-business border-tag-business/30' },
  social: { label: 'Social/Environmental', icon: Leaf, colorClass: 'bg-tag-social/15 text-tag-social border-tag-social/30' },
  funding: { label: 'Funding', icon: Coins, colorClass: 'bg-tag-funding/15 text-tag-funding border-tag-funding/30' },
};

const voucherConfig = {
  ideation: { label: 'Ideation', icon: Lightbulb, amount: '€25K' },
  scaleup: { label: 'Scale-up', icon: Rocket, amount: '€50K' },
  commercialisation: { label: 'Commercialisation', icon: TrendingUp, amount: '€25K' },
};

const coverageIcons: Record<string, { icon: LucideIcon; color: string }> = {
  local: { icon: Building2, color: 'text-amber-500' },
  eu: { icon: Globe2, color: 'text-blue-500' },
  global: { icon: Earth, color: 'text-emerald-500' },
};

const providerEmails: Record<string, string> = {
  // Authoritative list from fierce_contacts CSV
  "Deep Focus Unipessoal Lda": "jrcarvalho@deepfocus.pt",
  "Satellite Applications Catapult Ltd.": "maryia.urazaeva@sa.catapult.org.uk",
  "QUANT 3S d.o.o.": "damjana.stojnic@quant-3s.com",
  "NV5 Geospatial Solutions Italia SRL": "andrea.marchesi@nv5.com",
  "Offshore Monitoring Limited": "info@offshoremonitoring.com",
  "Bitrezus PC": "ka@bitrezus.com",
  "I.S.S.E.A.D. Innovations Ltd": "jk@issead.eu",
  "Natixar": "s.cranga@natixar.com",
  "Atfield Technologies doo": "srdjan@atfield.tech",
  "Edurne Suárez Lejardi": "edurnesuri@gmail.com",
  "Selha Group": "julien.vezier@selhagroup.com",
  "DevisionX LTD": "maziz@devisionx.com",
  "Nido de Ideas Avanzadas, s.l.": "fernandochico@nidodeideas.es",
  "AeroVision": "tamme.vanderwal@aerovision.nl",
  "GeoKinesia S.L.": "pavel.pavlovsky@geokinesia.com",
  "MPEOS": "mperriot@mpeos.fr",
  "Clarity AI - EnviroTrust": "bidesman@envirotrust.eu",
  "CDXi Solutions P.C.": "kkarys@cdxi.gr",
  "Kalmia": "borut.terpinc@kalmia.si",
  "KRI": "s.kaczmarek@kri.org.uk",
  "Värdevia Oy": "ntheng@vardevia.fi",
  "Auyan SAS": "Alix.leroy@auyan.tech",
  "Zirak s.r.l.": "davide.mazzucchi@zirak.it",
  "Brain Nest Consulting": "brainnestinstitute@gmail.com",
  "Sefini llc.": "svetlanazikic9@gmail.com",
  "UIV Urban Innovation Vienna GmbH": "ViennaGeospace@urbaninnovation.at",
  "Space : Quo Vadis ?": "space.quovadis@yahoo.com",
  "Metrology LAB": "avramov@metrology-lab.com",
  "Botshare Sp z OO": "alex@botshare.ai",
  "Satsense Solutions Limited": "pranav.pasari@satsense.co",
  "Octovus P.C.": "nikolaos@octovus.ai",
  "28DIGITAL (ex EIT Digital)": "georgia.papadopoulou@28digital.eu",
  "Fanny Robayo": "contact@bernabeucg.com",
  "Stalowowolska Agencja Rozwoju Regionalnego Sp. z o.o. (Stalowa Wola Regional Development Agency Ltd.)": "asiwek@starr.pl",
  "N3XTCODER": "stegemann@n3xtcoder.org",
  "Verhaert New Products and Services NV": "aoife.oneill@verhaert.com",
  "Sylva Germany UG": "michael@sylva.earth",
  "EarthPulse": "judith@earthpulse.ai",
  "NOVANOV": "florence.ghiron@novanov.fr",
  "Agile Innovative Manufacturing SRL": "simonel.david@aim-space.com",
  "constellr GmbH": "max.gulde@constellr.com",
  "RAIL SAS": "romain.fau@kanop.io",
  "Tampere Startup Support Association (Tampereen startuptukiyhdistys ry))": "dipxr08@gmail.com",
  "stichting dotSPACE": "martijn.seijger@groundstation.space",
  "Remote Sensing Business Solutions SP Z O.O.": "marek.wilgucki@terraeye.co",
  "TRE ALTAMIRA s.r.l.": "emanuele.passera@tre-altamira.com",
  "28DIGITAL": "Georgia.Papadopoulou@28digital.eu",
  "Podkarpackie Centrum Innowacji Sp. z o.o.": "m.dygon@pcinn.org",
  "Data Science Europe Kft.": "gerzson.boros@datascienceeurope.ai",
  "Planet Partners Sp. z o.o.": "lukasz@planetpartners.pl",
  "Flanders Make vzw": "koen.vandenboer@flandersmake.be",
  "Raw Materials Technological Center": "elena.lopez@ctmarmol.es",
  "Space Quo Vadis": "space.quovadis@yahoo.com",
  "Wozify Engineering Group Kft": "balazs.slezak@wozify.com",
  "Composite Solutions Hungary Kft.": "mkaracsony@composite.hu",
  "World from Space s.r.o.": "labohy@worldfrom.space",
  "Karen Ramírez Lázaro": "karenrl82@icloud.com",
  "Geo Engine GmbH": "info@geoengine.de",
  "Faculty of Space Technologies, AGH University of Krakow": "ppichor@agh.edu.pl",
  "Geospatial Ventures Limited": "paul.bhatia@geospatialventures.co.uk",
  "CETMA - CENTRO DI RICERCHE EUROPEO DI TECNOLOGIE DESIGN E MATERIALI": "sonia.saracino@cetma.it",
  "CNRS / Data Terra ": "francois.danhiez@data-terra.org",
  "Sparkgeo Consulting Inc.": "ahouse@sparkgeo.com",
  "Baltic Satellite Service": "ilze@baltsat.lv",
  "Creative Space SRL": "sorin@cspace.ro",
  "Digital Spaces Living Lab": "stavri.nikolov@digitalspaces.info",
  "LLcloud Ltd": "stavri.nikolov@llcloud.eu",
  "SoftCO2 SRL": "adrian@co2later.com",
  "Neuralio AI P.C.": "skotsopoulos@neuralio.ai",
  "Ecoloop srl SB": "m.daipre@eco-loop.it",
  "Building Blocks": "hgil@buildingblocks.es",
  "Space4Good B.V.": "alex@space4good.com",
  "CoreToBe S.r.l.": "r.piparo@coretobe.com",
  "Nuria Carrillo Martin": "carrillomartinnuria@gmail.com",
  "Javier Benito Bilbao - DeepTech2Scale.com": "javier@deeptech2scale.com",
  "Dikalia": "msantalena@gmail.com",
  "CBO Consulting": "christophe.bodin@cbo-consulting.eu",
  "Astrobitit Technologies  LTD": "me@astrobit.co.uk",
  "Space Business Innovation Centre Noordwijk": "m.leinweber@sbicnoordwijk.nl",
  "SENSORBITE P.S.A.": "marcin@sensorbite.com",
  // New providers added 2026-02-09
  "GRAS Global Risk Assessment Services GmbH": "connect@gras-system.org",
  "Nazka Mapps bv": "ides@nazka.be",
  "AIRMO G.m.b.H": "eduardo@airmo.io",
  "Geocledian GmbH": "stefan.scherer@geocledian.com",
  "CAIUS E.E.": "info@caius.gr",
  "Weatherwise SAS": "florian@weatherwise.fr",
  "Marple GmbH": "ds@marple.info",
  "Lanz GmbH": "daniel@lanz.ai",
  "Tilebox Technologies Ltd": "laura.costa@tilebox.com",
  "thriveGEO GmbH": "sabrina@thrivegeo.com",
  "Eyecon - Software Lda.": "mcorreia@eyecon-group.com",
  "Astro42": "attila.nemethy@astro42.com",
  // New providers added 2026-02-16
  "Advance Insight BV": "bernard@advanceinsight.dev",
  "Blue Dot Solutions": "krzysztof.kanawka@bluedotsolutions.eu",
  "3Bee S.r.l": "elisa.bertesago@3bee.com",
  "ROAD HR DOO": "ugljesa@road.rs",
  "Plan 9": "ollie@olliewalsh.com",
  "UNIVERSITAT POLITECNICA DE CATALUNYA": "joaquin.del.rio@upc.edu",
  "TheSpaceBuilder": "hugo@thespacebuilder.com",
  "ARIDEX LTD": "a.zographos@outlook.com",
  // New providers added 2026-02-23
  "France Geomatique": "contact@fgeo.fr",
  "USTUN ENERJI MUHENDISLIK LTD. STI.": "ferhatbingol@ustunenerji.com",
  "Berzen Co. Ltd": "dannyisraeli539@gmail.com",
  "K.P. INNOSERV LTD": "info@kpinnoserv.com",
  "Business Ready Now Limited": "E.gill@businessreadynow.com",
  "SM GEODIM S.L.": "lfernandez@geodim.es",
  "Another Earth EOD FlexCo": "hello@anotherearth.ai",
  "P. Hacklander Unternehmensberatung": "philipp.hacklaender@gmail.com",
  "Kolibree-Tech": "innovation@kolibree-tech.com",
  "Regio OU": "geospatial@regio.ee",
  "Eco Modeling Solutions di Dallera Davide": "davide.dallera@ecomodeling.it",
  "Manteo AI P.C.": "ioannis@manteo.ai",
  "The SpaceLead": "contact@thespacelead.com",
  "VB-Informatika d.o.o.": "valter.bratkovic@vb-informatika.com",
  "AGROTECNOLOGIAS CANARIAS": "info@agrotecan.com",
  // New providers added 2026-03-04
  "SIXPHERE TECHNOLOGIES SL": "innovation@sixphere.com",
  "Urban Impact Berlin GmbH": "marina@urbanimpact.agency",
  "Guiders OU": "w.rashidy@guidersconsult.com",
  "Go Bridge The Gap S.L.": "laura@gobridgethegap.com",
  "NU4SPACE s.r.o.": "john.z@volny.cz",
  "Mirai SRL": "caterina.calefato@miraidigital.io",
  "Nissatech Innovation Centre": "Nenad.Stojanovic@nissatech.com",
  // New providers added 2026-03-08
  "Philopater macavious": "michel.qlini@gmail.com",
  "Sanabil": "esalma2010@gmail.com",
  "Giscout S.L": "j.recarte@giscout.com",
  "Anofa Engineering, Planning, Informatics Ltd.": "emin.mentese@anofa.co",
  // New providers added 2026-03-16
  "Trabajos Catastrales S.A.U (Tracasa Global)": "bbasterra@tracasa.es",
  "Leo Investments UG": "florian@wunderfunds.de",
  "Missionware PC": "Info@missionware.com",
  "Datonika Limited": "abhishek_upadhyay@datonika.com",
  "DOMINA SRL": "cristina.vercellino@domina-biella.it",
  "Griffin Software Solutions P.C.": "info@griffinware.gr",
  "AlongRoute": "team@alongroute.com",
  "Ingedata Pte Ltd": "eric.feddal@ingedata.ai",
  "OroraTech GmbH": "georgios.fotopoulos@ororatech.com",
};

export function ProviderCard({ provider, index }: ProviderCardProps) {
  const [open, setOpen] = useState(false);
  
  const serviceCategories = getAllServiceCategories(provider);
  const hasServices = serviceCategories.length > 0;
  const hasVouchers = provider.voucherTypes.length > 0;
  
  const coverageType = getCoverageType(provider.coverage);
  const CoverageIcon = coverageIcons[coverageType]?.icon || Globe2;
  const coverageColor = coverageIcons[coverageType]?.color || 'text-muted-foreground';

  const delayClass = `animate-fade-in [animation-delay:${index * 50}ms] [animation-fill-mode:backwards]`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card 
        className={cn(
          'group relative overflow-hidden bg-gradient-card border-border/50',
          'shadow-card hover:shadow-card-hover',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-1',
          delayClass
        )}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {provider.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                {provider.country && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {provider.country}
                  </span>
                )}
                {provider.coverage && (
                  <span className={cn('flex items-center gap-1.5', coverageColor)}>
                    <CoverageIcon className="w-3.5 h-3.5" />
                    <span className="text-muted-foreground">{provider.coverage}</span>
                  </span>
                )}
              </div>
            </div>
            
          </div>
          
          {/* Service Category Badges */}
          {hasServices && (
            <div className="flex flex-wrap gap-2 mt-3">
              {serviceCategories.map(cat => {
                const config = categoryConfig[cat];
                const count = provider.services[cat].length;
                return (
                  <Badge 
                    key={cat}
                    variant="outline"
                    className={cn('flex items-center gap-1.5 px-2.5 py-1 font-medium', config.colorClass)}
                  >
                    <config.icon className="w-3.5 h-3.5" />
                    {config.label}
                    <span className="text-xs opacity-70">({count})</span>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Voucher Types */}
          {hasVouchers && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {provider.voucherTypes.map(type => {
                const config = voucherConfig[type];
                return (
                  <Badge 
                    key={type}
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 opacity-80"
                  >
                    <config.icon className="w-3 h-3 mr-1" />
                    {config.label}: Up to {config.amount}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Description - truncated */}
          {provider.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {provider.description}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-muted-foreground hover:text-foreground hover:bg-primary/10"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View details
              </Button>
            </DialogTrigger>
            {provider.website && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(provider.website, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Website
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                const email = providerEmails[provider.name] || '';
                window.open(`mailto:${email}?subject=Quotation Request - ${provider.name}&body=Hello,%0D%0A%0D%0AI would like to request a quotation for your services.%0D%0A%0D%0AThank you.`, '_blank');
              }}
            >
              Ask for quotation
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ProviderDetailModal provider={provider} />
    </Dialog>
  );
}
