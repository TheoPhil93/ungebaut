// UNGEBAUT — Architectural visualisation studio, Zürich.
//
// Locked tag vocabulary (12 tokens):
//   Subject  Exterior · Interior · Urban · Landscape · Product
//   Medium   Motion · VR · Drone
//   Sector   Residential · Commercial · Retail · Cultural · Hospitality
//
// Each card carries 1–3 tags; tags[0] is the headline `Type` shown in the
// home metadata panel.
//
// Locked Role grammar: "<Brief> · <deliverables>". Brief vocab —
//   Pitch · Pitch-deck visual · Marketing campaign · Brand campaign ·
//   Brand film · Competition entry · Studio film · Studio motion ·
//   Studio still · Product still · Pre-construction set · Site survey.
//
// Description rule: 1 sentence · 18–30 words · em-dash · one concrete noun
// (material / place / time of day / light condition) · no client name ·
// no deliverable count.
//
// Massive title: bespoke editorial typography per card. Toolbox — ALL CAPS
// or mixed case · `/` for manual line break · real spaces between letters
// for letterspacing · double spaces for wider gaps.
//
// Cards are listed in render order — single flat array. The featured/rich
// two-array tier was dropped on the 2026-05-07 launch refresh; see
// docs/PRDs/2026-05-06-gallery-text-refresh.md.

const local = (path) => `/images/projects/${path}`;

// Massive-title ink fallback. Each card without an explicit massiveInk
// gets one of these by index, cycling through the palette.
const MASSIVE_TITLE_INKS = [
  '#f6ead8',
  '#f0a1aa',
  '#d19a2d',
  '#f05fbd',
  '#b7d7ff',
  '#d9ff72',
  '#ff7b4a',
  '#c7b8ff',
  '#78f0d4',
  '#fff4a3',
  '#ff8fb8',
  '#d8d1c2',
];

const projectList = [
  // 01 — Ard de Vries (Agelo, Netherlands)
  //
  // LOADER STRIPES — the cold-entry loader shows the first three gallery
  // projects (projects[0..2]) as vertical stripes during its image phase
  // (see docs/PRDs/2026-05-12-willem-loading-animation.md and
  // docs/issues/2026-05-12-03-loader-image-phase.md). Contracts ride on
  // this entry AND the next two:
  //
  //  1. The three `<link rel="preload">` directives in index.html point
  //     at these entries' image URLs — they must stay in sync. If any of
  //     the first three projects' image paths change, update the
  //     corresponding preload href as well.
  //  2. projects[1] is a video in the gallery (mediaType: 'video'); the
  //     loader uses its `006/thumb-1.png` as a still fallback. If you
  //     swap a non-video project into position 1, switch the loader
  //     preload + img src to the new project's `image` field.
  //  3. Each image must read at postage-stamp size — the loader starts
  //     the growth at ~1em wide per stripe. Strong silhouette, no fine
  //     wireframe detail, no small text in the render.
  //  4. Each image must survive `object-fit: cover` inside a narrow
  //     vertical stripe frame. Subject should sit in the central 60%.
  //  5. Reordering this array reorders the loader stripes. If you
  //     intend to promote a different project into positions 0..2,
  //     update BOTH this array order AND the three preload hrefs and
  //     the three `<img src>` values in index.html.
  {
    id: 'f001',
    client: 'Ard de Vries',
    title: 'Ard de Vries',
    tags: ['Interior'],
    year: 2025,
    location: 'Agelo, Netherlands',
    role: 'Pitch · 1 hero still',
    accent: '#b4674a',
    accentSoft: '#1c0f0a',
    detailBg: '#c54e3a',
    detailInk: '#fae6cf',
    description:
      'A timber-lined interior opening toward a quiet garden courtyard — soft morning light, woven textures, and large glazing create a serene domestic atmosphere.',
    massiveTitle: 'ARD/DE VRIES',
    image: local('026/Ard_de_Vries.png'),
    detailImage: local('026/Ard_de_Vries.png'),
    sections: [],
  },

  // 02 — Karamanli Haus (Athens) · motion timelapse
  {
    id: '006',
    client: 'Ilias Skroumeplos',
    title: 'Karamanli Haus',
    tags: ['Motion'],
    year: 2026,
    location: 'Athens, Greece',
    role: 'Studio motion · timelapse',
    accent: '#8c8a86',
    accentSoft: '#161616',
    detailBg: '#0d0f1a',
    detailInk: '#f5f1e6',
    description:
      'A time-lapse through a narrow Athens side street beneath hanging laundry — evening light, passing scooters, and café terraces animate the dense Mediterranean streetscape.',
    massiveTitle: 'Ilias Skroum/p e l o s',
    image: local('006/Timelaps.mp4'),
    video: local('006/Timelaps.mp4'),
    detailImage: local('006/Timelaps.mp4'),
    mediaType: 'video',
    gallery: [local('006/Timelaps.mp4'), local('006/thumb-1.png')],
    sections: [],
  },

  // 03 — Competition Bassersdorf (SGGK)
  {
    id: '009',
    client: 'SGGK',
    title: 'Competition Bassersdorf',
    tags: ['Exterior', 'Residential'],
    year: 2023,
    location: 'Steinling, Bassersdorf',
    role: 'Competition entry · 2 stills',
    accent: '#7a2434',
    accentSoft: '#1c0a0e',
    detailBg: '#6f1d2a',
    detailInk: '#f5dfd1',
    description:
      '"Form follows parking" shapes the fanned arrangement of the building volumes — each apartment benefits from views into the lush, tree-lined neighborhood and surrounding greenery.',
    massiveTitle: 'SGGK',
    image: local('009/main.png'),
    detailImage: local('009/main.png'),
    gallery: [local('009/main.png'), local('009/thumb-1.png')],
    sections: [],
  },

  // 04 — Ferrum House (Harpenden, Hertfordshire)
  {
    id: '010',
    client: 'John S. Bonnington',
    title: 'Ferrum House',
    tags: ['Interior', 'Residential'],
    year: 2024,
    location: 'Harpenden, Hertfordshire',
    role: 'Studio still · 1 hero',
    accent: '#bfb7a6',
    accentSoft: '#1a1814',
    detailBg: '#8d9d96',
    detailInk: '#1c2520',
    description:
      'A 1964 family home in Hertfordshire built by an architect for his own use — warm timber surfaces and panoramic glazing reflect the quiet rigor of Miesian modernism.',
    massiveTitle: 'John S. /Bonnington',
    image: local('010/main.png'),
    detailImage: local('010/main.png'),
    gallery: [local('010/main.png'), local('010/thumb-1.png')],
    sections: [],
  },

  // 05 — Quarry House (Winwood McKenzy, UK)
  {
    id: '001',
    client: 'Winwood McKenzy',
    title: 'Quarry House',
    tags: ['Exterior', 'Residential'],
    year: 2024,
    location: 'United Kingdom',
    role: 'Pitch-deck visual · hero + studies',
    accent: '#a88a6c',
    accentSoft: '#1c1712',
    detailBg: '#7d6242',
    detailInk: '#f4ead7',
    massiveInk: '#FFBCAB',
    description:
      'Quarry House reclaims a former workers cottage beside the Northcote quarry — brick courtyards, filtered light, and vegetation return domestic life to the land.',
    massiveTitle: 'WIN WOOD/MC KENZ Y',
    image: local('001/main.png'),
    detailImage: local('001/detail.png'),
    gallery: [local('001/main.png'), local('001/detail.png'), local('001/thumb-1.png')],
    sections: [],
  },

  // 06 — Paracelsius (Baukontor architect, Mettler Entwickler developer)
  // HIDDEN: Baukontor publication permission pending — flip `hidden` to
  // false (or delete the key) once approval lands.
  {
    id: '002',
    client: 'Baukontor',
    title: 'Paracelsius',
    hidden: true,
    tags: ['Exterior', 'Residential'],
    year: 2024,
    location: 'Richterswil, Switzerland',
    role: 'Marketing campaign · stills + animation',
    accent: '#b4674a',
    accentSoft: '#1c0f0a',
    detailBg: '#c54e3a',
    detailInk: '#fae6cf',
    description:
      'A linear residential building developed by Mettler settles into the sloping village landscape — timber balconies, soft daylight, and views toward the church spire define its calm presence.',
    massiveTitle: 'Bau/kontor',
    image: local('002/main.jpg'),
    detailImage: local('002/detail.jpg'),
    gallery: [local('002/main.jpg'), local('002/detail.jpg'), local('002/thumb-1.jpg')],
    sections: [{ label: 'Detail', image: local('002/thumb-1.jpg') }],
  },

  // 07 — Chelsea Brut House (Pricegore, London)
  {
    id: '003',
    client: 'Pricegore',
    title: 'Chelsea Brut House',
    tags: ['Interior', 'Retail'],
    year: 2024,
    location: 'London, England',
    role: 'Brand campaign · interior hero + detail',
    accent: '#a88c4d',
    accentSoft: '#0f0c08',
    detailBg: '#0d0f1a',
    detailInk: '#f5f1e6',
    description:
      'A brutalist townhouse in Kensington and Chelsea revived for contemporary life — Victorian traces, robust conservation, and spatial expansion sharpen its modernist character.',
    massiveTitle: 'P r i c e/g o r e',
    image: local('003/main.jpg'),
    detailImage: local('003/detail.jpg'),
    gallery: [local('003/main.jpg'), local('003/detail.jpg')],
    sections: [],
  },

  // 08 — Neutrale Flagship (Estudio DIIR, Madrid) · motion
  {
    id: '004',
    client: 'Estudio DIIR',
    title: 'Neutrale — Flagship',
    tags: ['Retail', 'Interior', 'Motion'],
    year: 2023,
    location: 'Madrid, Spain',
    role: 'Brand film · motion + 2 stills',
    accent: '#bfb7a6',
    accentSoft: '#1a1814',
    detailBg: '#3d5d4c',
    detailInk: '#e8e3cf',
    description:
      'Three precise gestures transform an already suggestive space — terrazzo floors, brushed-steel fittings, and shifting daylight intensify its existing architectural atmosphere.',
    massiveTitle: 'E studio/D I I R',
    image: local('004/main.mov'),
    video: local('004/main.mov'),
    detailImage: local('004/main.mov'),
    mediaType: 'video',
    gallery: [local('004/main.mov'), local('004/thumb-1.png'), local('004/thumb-2.png')],
    sections: [],
  },

  // 09 — Concrete House in Brissago (Wespi de Meuron Romeo)
  {
    id: '005',
    client: 'Wespi de Meuron Romeo',
    title: 'Concrete House in Brissago',
    tags: ['Exterior', 'Residential'],
    year: 2024,
    location: 'Brissago, Switzerland',
    role: 'Marketing campaign · 2 stills',
    accent: '#5a89a8',
    accentSoft: '#0c151c',
    detailBg: '#2a3a5a',
    detailInk: '#f1ecdf',
    description:
      'A washed concrete monolith rises from the slope above Lago Maggiore — rooftop parking, a linear entrance path, and open interiors frame the mountain landscape.',
    massiveTitle: 'Wespi de Meuron Romeo',
    image: local('005/main.jpg'),
    detailImage: local('005/main.jpg'),
    gallery: [local('005/main.jpg'), local('005/thumb-1.jpg'), local('005/thumb-3.png')],
    sections: [],
  },

  // 10 — Living and Working / Atelier in Vienna (studio-internal) · motion
  {
    id: '007',
    client: 'UNGEBAUT',
    title: 'Living and Working',
    tags: ['Motion', 'Interior'],
    year: 2023,
    location: 'Vienna, Austria',
    role: 'Studio motion · atelier pass',
    accent: '#a88a6c',
    accentSoft: '#1c1712',
    detailBg: '#7d6242',
    detailInk: '#f4ead7',
    description:
      'A raw concrete studio unfolds beneath monumental skylights — scattered tools, large-scale artworks, and diffuse daylight shape an atmosphere of creative production.',
    massiveTitle: 'Atelier in Vienna',
    image: local('007/Atelier.mp4'),
    video: local('007/Atelier.mp4'),
    detailImage: local('007/Atelier.mp4'),
    mediaType: 'video',
    gallery: [local('007/Atelier.mp4'), local('007/21.png'), local('007/22.png')],
    sections: [],
  },

  // 11 — Winebar in Zurich (Stefan Wülser)
  {
    id: '008',
    client: 'Stefan Wülser',
    title: 'Winebar in Zurich',
    tags: ['Interior', 'Commercial'],
    year: 2023,
    location: 'Zürich, Switzerland',
    role: 'Pitch · interior hero + study',
    accent: '#5d7a5b',
    accentSoft: '#0e1610',
    detailBg: '#3d5d4c',
    detailInk: '#e8e3cf',
    description:
      "A wine bar in Zurich's historic center — raw marble, monochrome contrasts, and collage-like materials redefine the space through radical material ambiguity.",
    massiveTitle: 'Stefan Wülser',
    image: local('008/main.png'),
    detailImage: local('008/main.png'),
    gallery: [local('008/main.png'), local('008/thumb-1.png')],
    sections: [],
  },

  // 12 — Housing in Playa Brava (Ricardo Gomara, Punta del Este) · motion
  {
    id: '011',
    client: 'Ricardo Gomara',
    title: 'Housing in Playa Brava',
    tags: ['Motion', 'Exterior', 'Residential'],
    year: 2025,
    location: 'Punta del Este, Uruguay',
    role: 'Studio motion · atmospheric timelapse',
    accent: '#b4674a',
    accentSoft: '#1c0f0a',
    detailBg: '#c54e3a',
    detailInk: '#fae6cf',
    description:
      'A 1982 beachfront house in Punta del Este — seaside modernism, economic optimism, and shifting tourism cultures frame its architectural presence.',
    massiveTitle: 'Ricardo Gomara',
    image: local('011/main.mp4'),
    video: local('011/main.mp4'),
    detailImage: local('011/main.mp4'),
    mediaType: 'video',
    gallery: [local('011/main.mp4'), local('011/thumb-1.mp4'), local('011/thumb-2.jpg')],
    sections: [],
  },

  // 13 — Areal Moosbühl (SSA Architekten — same massive title as card 16)
  {
    id: '012',
    client: 'SSA Architekten',
    title: 'Areal Moosbühl',
    tags: ['Exterior', 'Residential'],
    year: 2025,
    location: 'Moosseedorf, Switzerland',
    role: 'Competition entry · stills',
    accent: '#a88a6c',
    accentSoft: '#1c1712',
    detailBg: '#7d6242',
    detailInk: '#f4ead7',
    description:
      'Moosbühl in Moosseedorf mediates between rural landscape and urban infrastructure — retention areas, biotopes, and soft edges shape a sustainable residential quarter.',
    massiveTitle: 'SSA  Arch/itekten',
    image: local('012/main.png'),
    detailImage: local('012/main.png'),
    gallery: [local('012/main.png'), local('012/thumb-1.png'), local('012/thumb-2.png')],
    sections: [],
  },

  // 14 — Konnex (Theo Hotz, Baden Nord)
  // HIDDEN: Theo Hotz publication permission pending.
  {
    id: '013',
    client: 'Theo Hotz',
    title: 'Konnex',
    hidden: true,
    tags: ['Exterior', 'Interior', 'Commercial'],
    year: 2025,
    location: 'Baden, Switzerland',
    role: 'Marketing campaign · 4 stills',
    accent: '#5a89a8',
    accentSoft: '#0c151c',
    detailBg: '#2a3a5a',
    detailInk: '#f1ecdf',
    description:
      'A former ABB industrial site in Baden Nord transforms into a transparent multi-tenant urban hub — glazed circulation, flexible offices, and shared amenities reanimate the city block.',
    massiveTitle: 'Theo/Hotz',
    image: local('013/main.png'),
    detailImage: local('013/main.png'),
    gallery: [
      local('013/main.png'),
      local('013/thumb-1.jpg'),
      local('013/thumb-2.jpg'),
      local('013/thumb-3.png'),
      local('013/thumb-4.png'),
      local('013/Konnex Top view.mp4'),
    ],
    sections: [],
  },

  // 15 — Timex Chronograph
  {
    id: 'f004',
    client: 'Timex',
    title: 'Timex Chronograph',
    tags: ['Product'],
    year: 2024,
    location: 'Studio',
    role: 'Product still · 1 hero',
    accent: '#bfb7a6',
    accentSoft: '#1a1814',
    detailBg: '#4A4636',
    detailInk: '#1c2520',
    massiveInk: '#FFBCAB',
    description:
      'A single chronograph held in one frame — brushed steel, glass, and reflection doing the work as the only objects in the room.',
    massiveTitle: 'T  i  m/e  x',
    image: local('032/Timex.png'),
    detailImage: local('032/Timex.png'),
    sections: [],
  },

  // 16 — SSA second project (PARTIAL FILL — title/location/description pending
  // founder input; client + massive title applied for visual consistency
  // with card 13). Same office, distinct project.
  {
    id: '014',
    client: 'SSA Architekten',
    title: 'Project 014',
    tags: ['Exterior'],
    year: 2025,
    location: 'Studio',
    accent: '#8c8a86',
    accentSoft: '#161616',
    detailBg: '#0d0f1a',
    detailInk: '#f5f1e6',
    description: 'An evening pass over the model — daylight pulled almost out of the room.',
    massiveTitle: 'SSA  Arch/itekten',
    image: local('014/main.jpg'),
    detailImage: local('014/main.jpg'),
    gallery: [local('014/main.jpg'), local('014/thumb-1.png')],
    sections: [],
  },

  // 17 — Golden Sanctum (studio-internal film) · motion
  {
    id: 'f003',
    client: 'UNGEBAUT',
    title: 'Golden Sanctum',
    tags: ['Motion', 'Interior'],
    year: 2024,
    location: 'Studio',
    role: 'Studio film · cinematic walkthrough',
    accent: '#a88a6c',
    accentSoft: '#1c1712',
    detailBg: '#7d6242',
    detailInk: '#f4ead7',
    description:
      'Vaulted stone chambers dissolve into shadow and amber light — ritual, decay, and silent monumentality shape an atmosphere suspended between myth and ruin.',
    massiveTitle: 'THE GOLDEN/Sanctum',
    image: local('031/The Golden Sanctum.mp4'),
    video: local('031/The Golden Sanctum.mp4'),
    detailImage: local('031/The Golden Sanctum.mp4'),
    mediaType: 'video',
    sections: [],
  },

  // 18 — Casa Neutrale (Estudio DIIR, Madrid) · motion
  {
    id: '015',
    client: 'Estudio DIIR',
    title: 'Casa Neutrale',
    tags: ['Motion', 'Interior'],
    year: 2025,
    location: 'Madrid, Spain',
    role: 'Studio motion · cinematic walkthrough',
    accent: '#5d7a5b',
    accentSoft: '#0e1610',
    detailBg: '#3d5d4c',
    detailInk: '#e8e3cf',
    description:
      'A monolithic granite bar anchors the depth of the coffee shop — raw stone surfaces and spatial clarity transform it into an architectural landmark.',
    massiveTitle: 'E studio/D I I R',
    image: local('015/main.mp4'),
    video: local('015/main.mp4'),
    detailImage: local('015/main.mp4'),
    mediaType: 'video',
    gallery: [local('015/main.mp4'), local('015/thumb-1.jpg'), local('015/thumb-2.jpg')],
    sections: [],
  },

  // 19 — Via Salaria (Capolei / Cavalli, Rome)
  {
    id: '016',
    client: 'Giancarlo Capolei, Francesco Capolei, Manlino Cavalli',
    title: 'Via Salaria',
    tags: ['Exterior', 'Residential'],
    year: 2025,
    location: 'Rome, Italy',
    role: 'Marketing campaign · 1 hero',
    accent: '#7a2434',
    accentSoft: '#1c0a0e',
    detailBg: '#6f1d2a',
    detailInk: '#f5dfd1',
    description:
      "A contemporary residence along Rome's Via Salaria reads the city through light and detail — urban vitality, quiet elegance, and architectural precision meet in balance.",
    massiveTitle: 'Via Salaria',
    image: local('016/main.jpg'),
    detailImage: local('016/main.jpg'),
    gallery: [local('016/main.jpg'), local('016/thumb-1.jpg'), local('016/thumb-2.jpg')],
    sections: [],
  },

  // 20 — Stool 60 (Artek / Alvar Aalto)
  {
    id: '017',
    client: 'Artek',
    title: 'Stool 60',
    tags: ['Product'],
    year: 2025,
    location: 'Studio',
    role: 'Product still · 1 hero',
    accent: '#bfb7a6',
    accentSoft: '#1a1814',
    detailBg: '#8d9d96',
    detailInk: '#1c2520',
    description:
      "Alvar Aalto's Stool 60 distills modern design into birch wood simplicity — stackability, industrial logic, and human warmth define its lasting cultural presence.",
    massiveTitle: 'A R T E K',
    image: local('017/main.jpg'),
    detailImage: local('017/main.jpg'),
    gallery: [local('017/main.jpg'), local('017/thumb-1.jpg'), local('017/thumb-2.jpg')],
    sections: [],
  },

  // 21 — Sihl City (Theo Hotz, Zurich)
  // HIDDEN: Theo Hotz publication permission pending.
  {
    id: '018',
    client: 'Theo Hotz',
    title: 'Sihl City',
    hidden: true,
    tags: ['Exterior', 'Residential'],
    year: 2025,
    location: 'Zurich, Switzerland',
    role: 'Marketing campaign · stills',
    accent: '#b4674a',
    accentSoft: '#1c0f0a',
    detailBg: '#c54e3a',
    detailInk: '#fae6cf',
    description:
      'Housing emerges on the former Sihlpapier factory site — adaptive reuse, urban density, and mixed programs connect living with work, culture, and public life.',
    massiveTitle: 'Theo/Hotz',
    image: local('018/main.png'),
    detailImage: local('018/main.png'),
    gallery: [local('018/main.png'), local('018/thumb-1.png')],
    sections: [],
  },

  // 22 — Restaurant (Erich Prödl Associates)
  {
    id: '019',
    client: 'Erich Prödl Associates',
    title: 'Restaurant',
    tags: ['Interior', 'Hospitality'],
    year: 2023,
    location: 'Austria',
    role: 'Pitch · 1 still',
    accent: '#a88a6c',
    accentSoft: '#1c1712',
    detailBg: '#7d6242',
    detailInk: '#f4ead7',
    description:
      'A warm atmosphere envelops the guest — timber, candlelight, and quiet textures define a space shaped by presence and atmosphere.',
    massiveTitle: 'Erich/Prödl',
    image: local('019/main.png'),
    detailImage: local('019/main.png'),
    gallery: [local('019/main.png'), local('019/thumb-1.png')],
    sections: [],
  },

  // 23 — Casa Tepetate (Manuel Cervantes, Mexico City)
  {
    id: '020',
    client: 'Manuel Cervantes',
    title: 'Casa Tepetate',
    tags: ['Exterior', 'Residential'],
    year: 2024,
    location: 'Mexico City, Mexico',
    role: 'Marketing campaign · stills',
    accent: '#5a89a8',
    accentSoft: '#0c151c',
    detailBg: '#2a3a5a',
    detailInk: '#f1ecdf',
    description:
      'Casa Tepetate stages the dialogue between concrete and landscape — interior courtyards, raw materiality, and precise light articulate the architectural concept.',
    massiveTitle: 'Manuel Cervantes',
    image: local('020/main.png'),
    detailImage: local('020/main.png'),
    sections: [],
  },

  // 24 — HAUS PASSWANGSTRASSE (Clauss Kahl Merz Atelier, Basel)
  {
    id: '021',
    client: 'Clauss Kahl Merz Atelier',
    title: 'HAUS PASSWANGSTRASSE',
    tags: ['Exterior', 'Residential'],
    year: 2024,
    location: 'Basel, Switzerland',
    role: 'Marketing campaign · stills',
    accent: '#8c8a86',
    accentSoft: '#161616',
    detailBg: '#0d0f1a',
    detailInk: '#f5f1e6',
    description:
      'A house transformation on Passwangstrasse in Basel — precise detailing, contemporary domesticity, and clear spatial communication support the architectural renewal.',
    massiveTitle: 'Clauss Kahl Merz Atelier',
    image: local('021/main.png'),
    detailImage: local('021/main.png'),
    sections: [],
  },

  // 25 — Oberhus (Peter Zumthor, Valais)
  {
    id: '022',
    client: 'Peter Zumthor',
    title: 'Oberhus',
    tags: ['Exterior', 'Hospitality'],
    year: 2023,
    location: 'Valais, Switzerland',
    role: 'Marketing campaign · stills',
    accent: '#5d7a5b',
    accentSoft: '#0e1610',
    detailBg: '#3d5d4c',
    detailInk: '#e8e3cf',
    description:
      'Timber holiday houses turn alpine domesticity into an architectural retreat — generous rooms, crafted wood, and mountain silence define their quiet exclusivity.',
    massiveTitle: 'Ober/hus',
    image: local('022/main.jpg'),
    detailImage: local('022/main.jpg'),
    sections: [],
  },

  // 26 — Diplomatic Flagshipstore (Estudio DIIR, Madrid)
  {
    id: '023',
    client: 'Estudio DIIR',
    title: 'Diplomatic Flagshipstore',
    tags: ['Interior', 'Retail'],
    year: 2024,
    location: 'Madrid, Spain',
    role: 'Brand campaign · interior stills',
    accent: '#7a2434',
    accentSoft: '#1c0a0e',
    detailBg: '#6f1d2a',
    detailInk: '#f5dfd1',
    description:
      'A diplomatic-quarter retail interior turned into spatial choreography — shifting geometries, exhibition sequences, and a guided route transform the monotonous enclosure.',
    massiveTitle: 'Diplomatic/Flagshipstore',
    image: local('023/main.png'),
    detailImage: local('023/main.png'),
    sections: [],
  },

  // 27 — Sihl City West / Thurgauerstrasse — REMOVED PENDING THEO HOTZ APPROVAL.
  // Re-add from docs/gallery-content-source.md when approved. Image assets
  // remain on disk at public/images/projects/024/.

  // 28 — Neutrale Flagshipstore (Estudio DIIR, Madrid)
  {
    id: '025',
    client: 'Estudio DIIR',
    title: 'Neutrale Flagshipstore',
    tags: ['Interior', 'Retail'],
    year: 2024,
    location: 'Madrid, Spain',
    role: 'Brand campaign · interior stills',
    accent: '#bfb7a6',
    accentSoft: '#1a1814',
    detailBg: '#8d9d96',
    detailInk: '#1c2520',
    description:
      "Madrid's Neutrale flagship turns the showroom into spatial choreography — limestone floors, layered partitions, and a guided route reframe the brand's product display.",
    massiveTitle: 'Neutrale/Flagshipstore',
    image: local('025/main.png'),
    detailImage: local('025/main.png'),
    sections: [],
  },

  // 29 — James Street (Taylor and Hinds Architects, Tasmania) · motion
  {
    id: '027',
    client: 'Taylor and Hinds Architects',
    title: 'James Street',
    tags: ['Motion'],
    year: 2024,
    location: 'Tasmania, Australia',
    role: 'Studio motion · cinematic pass',
    accent: '#a88a6c',
    accentSoft: '#1c1712',
    detailBg: '#7d6242',
    detailInk: '#f4ead7',
    description:
      'James Street in Launceston folds heritage context into a compact brick villa — framed openings, a walled garden, and a walnut tree shape secluded domestic life.',
    massiveTitle: 'James / Street',
    image: local('027/main.mp4'),
    video: local('027/main.mp4'),
    detailImage: local('027/main.mp4'),
    mediaType: 'video',
    gallery: [local('027/main.mp4'), local('027/thumb-1.jpg')],
    sections: [],
  },

  // 30 — ASTRUP HAVE (NORRØN, Copenhagen) · motion
  {
    id: '028',
    client: 'NORRØN',
    title: 'ASTRUP HAVE',
    tags: ['Motion'],
    year: 2024,
    location: 'Copenhagen, Denmark',
    role: 'Studio motion · cinematic pass',
    accent: '#5a89a8',
    accentSoft: '#0c151c',
    detailBg: '#2a3a5a',
    detailInk: '#f1ecdf',
    description:
      'Åstrup Have overlooks Haderslev Fjord as a contemporary Danish farmhouse — biodynamic cultivation, grazing animals, and vernacular forms renew the countryside dream.',
    massiveTitle: 'ASTRUP HAVE',
    image: local('028/main.mp4'),
    video: local('028/main.mp4'),
    detailImage: local('028/main.mp4'),
    mediaType: 'video',
    gallery: [local('028/main.mp4')],
    sections: [],
  },

  // 31 — Pendant Lamp (DEHGRAF) · option C: lamp staged in interior set
  {
    id: '029',
    client: 'DEHGRAF',
    title: 'Pendant Lamp',
    tags: ['Product'],
    year: 2025,
    location: 'Zürich, Switzerland',
    role: 'Product still · 1 hero',
    accent: '#8c8a86',
    accentSoft: '#161616',
    detailBg: '#0d0f1a',
    detailInk: '#f5f1e6',
    description:
      'A cast-concrete pendant set against monastic raw walls — single suspension cable, deep shadow, and warm timber surroundings stage the lamp as a sculptural object.',
    massiveTitle: 'DEHGRA/GRAF',
    image: local('029/main.png'),
    detailImage: local('029/main.png'),
    sections: [],
  },

  // 32 — Montparnasse Residence (cyrus ardalan architecte, Paris)
  {
    id: '030',
    client: 'cyrus ardalan architecte',
    title: 'Montparnasse Residence',
    tags: ['Interior', 'Residential'],
    year: 2025,
    location: 'Paris, France',
    role: 'Competition entry · stills',
    accent: '#5d7a5b',
    accentSoft: '#0e1610',
    detailBg: '#3d5d4c',
    detailInk: '#e8e3cf',
    description:
      'Modernist furniture and warm herringbone parquet define a restrained interior composition — soft daylight, geometric volumes, and walnut accents create quiet spatial balance.',
    massiveTitle: 'Montparnasse/Residence',
    image: local('030/main.jpg'),
    detailImage: local('030/main.jpg'),
    sections: [],
  },

  // 33 — Morgentalstrasse (SGGK, 1st place competition)
  {
    id: '033',
    client: 'SGGK',
    title: 'Morgentalstrasse',
    tags: ['Exterior', 'Residential'],
    year: 2023,
    location: 'Zürich, Switzerland',
    role: 'Competition entry · 2 stills',
    accent: '#7a2434',
    accentSoft: '#1c0a0e',
    detailBg: '#6f1d2a',
    detailInk: '#f5dfd1',
    description:
      'The lush greenery of Manegg cemetery enters the residential fabric — planted front gardens, quiet streets, and recessed houses shape a sheltered urban retreat.',
    massiveTitle: 'SGGK',
    image: local('033/main.png'),
    detailImage: local('033/main.png'),
    gallery: [local('033/main.png'), local('033/thumb-1.png'), local('033/thumb-2.png')],
    sections: [],
  },

  // 34 — neoro n80 (REUTER) · motion · brand film
  {
    id: '034',
    client: 'REUTER',
    title: 'neoro n80',
    tags: ['Motion', 'Product'],
    year: 2023,
    location: 'Studio',
    role: 'Brand film · motion + still',
    accent: '#bfb7a6',
    accentSoft: '#1a1814',
    detailBg: '#8d9d96',
    detailInk: '#1c2520',
    description:
      'A translucent acrylic bathtub becomes the sculptural centerpiece of the bathroom — soft reflections, jungle-inspired ambience, and flowing geometry elevate the bathing experience.',
    massiveTitle: 'REUTER',
    image: local('034/main.mp4'),
    video: local('034/main.mp4'),
    detailImage: local('034/main.mp4'),
    mediaType: 'video',
    gallery: [
      local('034/main.mp4'),
      local('034/thumb-1.png'),
      local('034/thumb-2.png'),
      local('034/thumb-3.png'),
    ],
    sections: [],
  },
];

// Hidden projects are kept in the source list (so the data + asset
// paths stay version-controlled) but filtered out of the public export
// so they never render in HomeView / IndexView / GalleryGL. Flip the
// `hidden` flag back off in projectList once publication permission
// lands and the project re-enters the rotation immediately.
export const projects = projectList
  .filter((project) => !project.hidden)
  .map((project, i) => ({
    ...project,
    massiveInk: project.massiveInk || MASSIVE_TITLE_INKS[i % MASSIVE_TITLE_INKS.length],
    role: project.role || 'Visualisation & Direction',
  }));

export function getProject(id) {
  return projects.find((p) => p.id === id);
}
