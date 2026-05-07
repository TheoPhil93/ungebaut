# Gallery content — source of truth (best-guess pass v2)

I've made a best-guess pass over your fill-in. Every edit I made carries `[CONFIRM]` so you can ✓ accept or ✗ change. Your original values are shown in italics so you can see what I changed.

**Three cards still need your direct input** (highlighted in 🟥):

- **Card 16 (`014`)** — almost entirely blank, second SSA project; you skipped it.
- **Card 27 (`024 Sihl City West`)** — you said pull from gallery pending Theo Hotz approval. Confirming I should delete it from `projects.js`.
- **Card 31 (`029 DEHGRAFF`)** — title says "Pendand Lamp" but description describes a monastic concrete interior. Title-vs-image mismatch I can't resolve.

---

## Locked vocabularies (reference — don't edit this section)

### Tags — pick 1–3 per card. First tag is the gallery's `Type` headline.

**Subject** (use as `tags[0]` for stills): `Exterior` · `Interior` · `Urban` · `Landscape` · `Product`
**Medium** (use as `tags[0]` when motion/immersive/aerial dominates): `Motion` · `VR` · `Drone`
**Sector** (optional 2nd or 3rd tag): `Residential` · `Commercial` · `Retail` · `Cultural` · `Hospitality`

### Role — `<Brief> · <deliverables>`

Brief vocab: `Pitch` · `Pitch-deck visual` · `Marketing campaign` · `Brand campaign` · `Brand film` · `Competition entry` · `Studio film` · `Studio motion` · `Studio still` · `Product still` · `Pre-construction set` · `Site survey`.

> **Why "Visualization" isn't a brief:** Visualization is _what UNGEBAUT does_. The brief is _what the engagement was for_ (Pitch / Marketing / Competition / Brand / Studio / Product / etc.). The Role row tells the visitor "this was a competition entry, delivered as 2 stills" — so the metadata panel earns its space rather than saying _Visualization_ on every card.

### Description rule

1 sentence · 18–30 words · em-dash · one concrete noun · **no client name** · no deliverable count.

---

## Cards (33 active · 1 pulled · render order)

---

### 01 · `f001` — Ard de Vries

`public/images/projects/026/Ard_de_Vries.png`

- **client:** Ard de Vries
- **title:** Ard de Vries
- **year:** 2025
- **location:** Agelo, Netherlands `[CONFIRM]` _(spelling — Agelo correct?)_
- **tags:** Interior
- **role:** Pitch · 1 hero still `[CONFIRM]` _(was: `Visualization · 1 hero`)_
- **massiveTitle:** ARD/DE VRIES
- **description:** A timber-lined interior opening toward a quiet garden courtyard — soft morning light, woven textures, and large glazing create a serene domestic atmosphere.
- **notes:**

---

### 02 · `006` — Karamanli Haus

`public/images/projects/006/Timelaps.mp4` _(motion)_

- **client:** Ilias Skroumeplos
- **title:** Karamanli Haus
- **year:** 2026
- **location:** Athens, Greece `[CONFIRM]` _(added country — was just `Athens`)_
- **tags:** Motion
- **role:** Studio motion · timelapse
- **massiveTitle:** Ilias Skroum/p e l o s
- **description:** A time-lapse through a narrow Athens side street beneath hanging laundry — evening light, passing scooters, and café terraces animate the dense Mediterranean streetscape.
- **notes:**

---

### 03 · `009` — Competition Bassersdorf

`public/images/projects/009/main.png`

- **client:** SGGK
- **title:** Competition Bassersdorf
- **year:** 2023
- **location:** Steinling, Bassersdorf
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Competition · Exterior · Residential` — Competition isn't in the tag vocab; it's a brief, lives in Role)_
- **role:** Competition entry · 2 stills `[CONFIRM]` _(was: `Visualization · 2 images`)_
- **massiveTitle:** SGGK
- **description:** "Form follows parking" shapes the fanned arrangement of the building volumes — each apartment benefits from views into the lush, tree-lined neighborhood and surrounding greenery.
- **notes:** SGGK = Steib Gmür Geschwentner Kyburz Architekten.

---

### 04 · `010` — Ferrum House

`public/images/projects/010/main.png`

- **client:** John S. Bonnington
- **title:** Ferrum House
- **year:** 2024
- **location:** Harpenden, Hertfordshire
- **tags:** Interior, Residential
- **role:** Studio still · 1 hero `[CONFIRM]` _(was: `Visualization · 2 images`. Could also be `Pitch-deck visual` — pick the right brief.)_
- **massiveTitle:** John S. /Bonnington
- **description:** `[CONFIRM rewrite — original named the client]` _A 1964 family home in Hertfordshire built by an architect for his own use — warm timber surfaces and panoramic glazing reflect the quiet rigor of Miesian modernism._
  _Original (had "Bonnington" — client name): "The Ferrum House, completed in 1964 by architect John S. 'Jack' Bonnington for his family — warm timber surfaces and panoramic glazing reflect the quiet rigor of Miesian modernism."_
- **notes:** Hex bug `accent: '#bf7a6'` → `'#bfb7a6'` (Issue 02).

---

### 05 · `001` — Quarry House

`public/images/projects/001/main.png`

- **client:** Winwood McKenzy
- **title:** Quarry House
- **year:** 2024
- **location:** United Kingdom
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Interior · Residential` — but description references the quarry exterior, brick courtyards, and the cottage settling into landscape; reading exterior. If the hero shot is genuinely an interior, flip back.)_
- **role:** Pitch-deck visual · hero + studies `[CONFIRM]` _(was: `Visualization · 2 images`)_
- **massiveTitle:** WIN WOOD/MC KENZ Y
- **description:** Quarry House reclaims a former workers cottage beside the Northcote quarry — brick courtyards, filtered light, and vegetation return domestic life to the land.
- **notes:**

---

### 06 · `002` — Paracelsius

`public/images/projects/002/main.jpg`

- **client:** Baukontor _(per architect-default rule; Mettler Entwickler is the developer)_
- **title:** Paracelsius
- **year:** 2024
- **location:** Richterswil, Switzerland _(✓ Rome/Richterswil contradiction resolved — kept Richterswil, description rewritten to match)_
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Exterior · Interior · Residential` — dropped Interior since description focuses on the building settling into the village. Add back if a key hero is interior.)_
- **role:** Marketing campaign · stills + animation `[CONFIRM]` _(was: `Visualization · 2 images`. The card has the `Animation` tag historically, hence "+ animation".)_
- **massiveTitle:** Bau/kontor
- **description:** `[CONFIRM — pick variant A or B]`
  - **A (Mettler stays out):** _A linear residential building settles into the sloping village landscape — timber balconies, soft daylight, and views toward the church spire define its calm architectural presence._
  - **B (Mettler credited):** _A linear residential building developed by Mettler settles into the sloping village landscape — timber balconies, soft daylight, and views toward the church spire define its calm presence._
- **notes:** Mettler Entwickler — developer.

---

### 07 · `003` — Chelsea Brut House

`public/images/projects/003/main.jpg`

- **client:** Pricegore
- **title:** Chelsea Brut House
- **year:** 2024
- **location:** London, England
- **tags:** Interior, Retail `[CONFIRM]` _(was: `Interior · Residential` — but the description on first pass said "flagship retail interior". If this is genuinely housing, flip back to `Interior, Residential`.)_
- **role:** Brand campaign · interior hero + detail `[CONFIRM]` _(was: `Visualization · 1 image`)_
- **massiveTitle:** P r i c e/g o r e
- **description:** `[CONFIRM rewrite — original named the client]` _A brutalist townhouse in Kensington and Chelsea revived for contemporary life — Victorian traces, robust conservation, and spatial expansion sharpen its modernist character._
  _Original: "Pricegore revives a brutalist townhouse in Kensington and Chelsea — …"_
- **notes:**

---

### 08 · `004` — Neutrale Flagship Store

`public/images/projects/004/main.mov` _(motion)_

- **client:** Estudio DIIR
- **title:** Neutrale — Flagship
- **year:** 2023
- **location:** Madrid, Spain
- **tags:** Retail, Interior, Motion
- **role:** Brand film · motion + 2 stills
- **massiveTitle:** E studio/D I I R _(canonical — used on both 004 and 015)_
- **description:** `[CONFIRM rewrite — original lacked a concrete noun]` _Three precise gestures transform an already suggestive space — terrazzo floors, brushed-steel fittings, and shifting daylight intensify its existing architectural atmosphere._
  _Original: "Three precise gestures transform an already suggestive space — restrained intervention, conceptual clarity, and spatial tension intensify its existing architectural atmosphere." (no concrete material/place — all abstractions)_
- **notes:**

---

### 09 · `005` — Concrete House in Brissago

`public/images/projects/005/main.jpg`

- **client:** Wespi de Meuron Romeo
- **title:** Concrete House in Brissago
- **year:** 2024
- **location:** Brissago, Switzerland
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Residential · Interior` — description is exterior-led, "monolith rises from the slope above Lago Maggiore". Flip if hero is interior.)_
- **role:** Marketing campaign · 2 stills `[CONFIRM]` _(was: `Visualization · 2 images`)_
- **massiveTitle:** Wespi de Meuron Romeo
- **description:** A washed concrete monolith rises from the slope above Lago Maggiore — rooftop parking, a linear entrance path, and open interiors frame the mountain landscape.
- **notes:**

---

### 10 · `007` — Atelier in Vienna _(borderline / studio-internal)_

`public/images/projects/007/Atelier.mp4` _(motion)_

- **client:** UNGEBAUT
- **title:** Living and Working
- **year:** 2023
- **location:** Vienna, Austria
- **tags:** Motion, Interior `[CONFIRM]` _(was: `Residential · Interior`. Asset is motion video; suggesting Motion as the headline `Type`.)_
- **role:** Studio motion · atelier pass `[CONFIRM]` _(was: `Motion · still` — Motion isn't in the brief vocab, and "still" mismatches the motion asset)_
- **massiveTitle:** Atelier in Vienna
- **description:** A raw concrete studio unfolds beneath monumental skylights — scattered tools, large-scale artworks, and diffuse daylight shape an atmosphere of creative production.
- **notes:**

---

### 11 · `008` — Stefan Wülser Winebar

`public/images/projects/008/main.png`

- **client:** Stefan Wülser
- **title:** Winebar in Zurich
- **year:** 2023
- **location:** Zürich, Switzerland `[CONFIRM]` _(added country)_
- **tags:** Interior, Commercial
- **role:** Pitch · interior hero + study `[CONFIRM]` _(was: `Visualization · 2 images`)_
- **massiveTitle:** Stefan Wülser
- **description:** `[CONFIRM rewrite — original opened with "An architectural visualization of"]` _A wine bar in Zurich's historic center — raw marble, monochrome contrasts, and collage-like materials redefine the space through radical material ambiguity._
  _Original: "An architectural visualization of a wine bar in Zurich's historic center — …" (the "visualization" framing is meta and we already say `Type: Interior`, `Role: Pitch · interior hero + study`.)_
- **notes:**

---

### 12 · `011` — Housing in Playa Brava

`public/images/projects/011/main.mp4` _(motion)_

- **client:** Ricardo Gomara
- **title:** Housing in Playa Brava
- **year:** 2025
- **location:** Punta del Este, Uruguay
- **tags:** Motion, Exterior, Residential `[CONFIRM]` _(reordered: Motion as headline since asset is motion. Was: `Exterior · Motion`.)_
- **role:** Studio motion · atmospheric timelapse `[CONFIRM]` _(was: `Motion · Atmospheric Timelaps` — Motion isn't a brief, and "Timelaps" was a typo)_
- **massiveTitle:** Ricardo Gomara
- **description:** `[CONFIRM rewrite — original named the client]` _A 1982 beachfront house in Punta del Este — seaside modernism, economic optimism, and shifting tourism cultures frame its architectural presence._
  _Original: "A 1982 beachfront house in Punta del Este by Ricardo Gomara — …"_
- **notes:**

---

### 13 · `012` — Areal Moosbühl

`public/images/projects/012/main.png`

- **client:** SSA Architekten
- **title:** Areal Moosbühl
- **year:** 2025
- **location:** Moosseedorf, Switzerland
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Competition · Exterior` — Competition not in vocab; moved to Role)_
- **role:** Competition entry · stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** SSA Arch/itekten _(restoring the original double-space between SSA and Arch — matches card 16 below; you'd changed both to single-space, which would also be valid as long as both are identical. Confirm preference.)_ `[CONFIRM]`
- **description:** Moosbühl in Moosseedorf mediates between rural landscape and urban infrastructure — retention areas, biotopes, and soft edges shape a sustainable residential quarter.
- **notes:** Reference URL: www.moosbuehl-wohnen.ch

---

### 14 · `013` — Konnex

`public/images/projects/013/main.png`

- **client:** Theo Hotz
- **title:** Konnex
- **year:** 2025
- **location:** Baden, Switzerland
- **tags:** Exterior, Interior, Commercial
- **role:** Marketing campaign · 4 stills `[CONFIRM]` _(was: `Visualization`. Gallery has 5 images so suggesting 4 stills + main.)_
- **massiveTitle:** Theo/Hotz
- **description:** `[CONFIRM rewrite — original was 32 words, over the 30-word cap]` _A former ABB industrial site in Baden Nord transforms into a transparent multi-tenant urban hub — glazed circulation, flexible offices, and shared amenities reanimate the city block._ _(27 words.)_
- **notes:**

---

### 15 · `f004` — Timex

`public/images/projects/032/Timex.png`

- **client:** Timex
- **title:** Timex Chronograph
- **year:** 2024
- **location:** Studio
- **tags:** Product
- **role:** Product still · 1 hero `[CONFIRM]` _(was: `[FILL IN]`)_
- **massiveTitle:** T i m/e x _(restoring original double-space letterspacing; you'd changed to single-space `T i m/e x`. Confirm.)_ `[CONFIRM]`
- **description:** `[CONFIRM rewrite — original named the client]` _A single chronograph held in one frame — brushed steel, glass, and reflection doing the work as the only objects in the room._
  _Original: "A product still for Timex — a single watch held in one frame, surface and reflection doing the work."_
- **notes:**

---

### 16 · `014` — SSA second project 🟥 STILL EMPTY

`public/images/projects/014/main.jpg`

- **client:** SSA Architekten
- **title:** [FILL IN]
- **year:** 2025
- **location:** [FILL IN]
- **tags:** [FILL IN]
- **role:** [FILL IN]
- **massiveTitle:** SSA Arch/itekten _(matches card 13)_
- **description:** [FILL IN]
- **notes:** Same office as 012 _Areal Moosbühl_, two distinct projects. ⚠️ Card not yet filled in; tell me the title/year/location/brief and I can write the description and Role.

---

### 17 · `f003` — Golden Sanctum _(studio-internal)_

`public/images/projects/031/The Golden Sanctum.mp4` _(motion)_

- **client:** UNGEBAUT
- **title:** Golden Sanctum
- **year:** 2024
- **location:** Studio
- **tags:** Motion, Interior
- **role:** Studio film · cinematic walkthrough
- **massiveTitle:** THE GOLDEN/Sanctum
- **description:** Vaulted stone chambers dissolve into shadow and amber light — ritual, decay, and silent monumentality shape an atmosphere suspended between myth and ruin.
- **notes:** Studio-internal film.

---

### 18 · `015` — Casa Neutrale

`public/images/projects/015/main.mp4` _(motion)_

- **client:** Estudio DIIR
- **title:** Casa Neutrale
- **year:** 2025
- **location:** Madrid, Spain
- **tags:** Motion, Interior
- **role:** Studio motion · cinematic walkthrough `[CONFIRM]` _(was: `Motion · Cinematic Video` — Motion not a brief)_
- **massiveTitle:** E studio/D I I R _(MATCHED to card 08; you had `E Stduio/D I I R` here with the `Stduio` typo)_
- **description:** A monolithic granite bar anchors the depth of the coffee shop — raw stone surfaces and spatial clarity transform it into an architectural landmark.
- **notes:**

---

### 19 · `016` — Via Salaria

`public/images/projects/016/main.jpg`

- **client:** Giancarlo Capolei, Francesco Capolei, Manlino Cavalli
- **title:** Via Salaria
- **year:** 2025
- **location:** Rome, Italy
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Exterior` — added Residential since it's a residence per description)_
- **role:** Marketing campaign · 1 hero `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Via Salaria _(plain — no editorial typography. Want a bespoke treatment? e.g. `V i a/Salaria` or `VIA/SALARIA`?)_ `[CONFIRM]`
- **description:** A contemporary residence along Rome's Via Salaria reads the city through light and detail — urban vitality, quiet elegance, and architectural precision meet in balance.
- **notes:**

---

### 20 · `017` — Stool 60

`public/images/projects/017/main.jpg`

- **client:** Artek
- **title:** Stool 60
- **year:** 2025
- **location:** Studio
- **tags:** Product
- **role:** Product still · 1 hero `[CONFIRM]` _(was: `Product still` — added deliverables count)_
- **massiveTitle:** A R T E K
- **description:** Alvar Aalto's Stool 60 distills modern design into birch wood simplicity — stackability, industrial logic, and human warmth define its lasting cultural presence.
- **notes:** _("Alvar Aalto" is the designer, not the client — Artek is. Keeping as-is.)_

---

### 21 · `018` — Sihl City

`public/images/projects/018/main.png`

- **client:** Theo Hotz
- **title:** Sihl City
- **year:** 2025
- **location:** Zurich, Switzerland
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Visualization`)_
- **role:** Marketing campaign · stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Theo/Hotz `[CONFIRM]` _(was: `The/O/Hotz` with three line-breaks; assumed typo since same office on card 14 uses `Theo/Hotz`. If the unusual treatment was intentional, change back — though same-office-same-massive-title would then break.)_
- **description:** Housing emerges on the former Sihlpapier factory site — adaptive reuse, urban density, and mixed programs connect living with work, culture, and public life.
- **notes:**

---

### 22 · `019` — Restaurant

`public/images/projects/019/main.png`

- **client:** Erich Prödl Associates
- **title:** Restaurant
- **year:** 2023
- **location:** Austria
- **tags:** Interior, Hospitality `[CONFIRM]` _(was: `Visualization`)_
- **role:** Pitch · 1 still `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Erich/Prödl
- **description:** A warm atmosphere envelops the guest — timber, candlelight, and quiet textures define a space shaped by presence and atmosphere.
- **notes:**

---

### 23 · `020` — Casa Tepetate

`public/images/projects/020/main.png`

- **client:** Manuel Cervantes
- **title:** Casa Tepetate
- **year:** 2024
- **location:** Mexico City, Mexico `[CONFIRM]` _(added country)_
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Visualization`)_
- **role:** Marketing campaign · stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Manuel Cervantes
- **description:** `[CONFIRM rewrite — original opened with "Photorealistic visualizations of"]` _Casa Tepetate stages the dialogue between concrete and landscape — interior courtyards, raw materiality, and precise light articulate the architectural concept._
  _Original: "Photorealistic visualizations of Casa Tepetate reveal the dialogue between concrete and landscape — …"_
- **notes:**

---

### 24 · `021` — HAUS PASSWANGSTRASSE

`public/images/projects/021/main.png`

- **client:** Clauss Kahl Merz Atelier
- **title:** HAUS PASSWANGSTRASSE
- **year:** 2024
- **location:** Basel, Switzerland
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `Visualization`)_
- **role:** Marketing campaign · stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Clauss Kahl Merz Atelier
- **description:** `[CONFIRM rewrite — original opened with "Visualizations for"]` _A house transformation on Passwangstrasse in Basel — precise detailing, contemporary domesticity, and clear spatial communication support the architectural renewal._
- **notes:**

---

### 25 · `022` — Oberhus

`public/images/projects/022/main.jpg`

- **client:** Peter Zumthor
- **title:** Oberhus
- **year:** 2023
- **location:** Valais, Switzerland `[CONFIRM]` _(was: `Valis, Switzerland` — assumed typo for Valais)_
- **tags:** Exterior, Hospitality `[CONFIRM]` _(was: `Visualization`. Holiday houses → Hospitality.)_
- **role:** Marketing campaign · stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Ober/hus
- **description:** `[CONFIRM rewrite — original named the client]` _Timber holiday houses turn alpine domesticity into an architectural retreat — generous rooms, crafted wood, and mountain silence define their quiet exclusivity._
  _Original: "Peter Zumthor's timber holiday houses turn alpine domesticity into an architectural retreat — …"_
- **notes:**

---

### 26 · `023` — Diplomatic Flagshipstore

`public/images/projects/023/main.png`

- **client:** Estudio DIIR
- **title:** Diplomatic Flagshipstore
- **year:** 2024
- **location:** Madrid, Spain
- **tags:** Interior, Retail `[CONFIRM]` _(was: `Visualization`)_
- **role:** Brand campaign · interior stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Diplomatic/Flagshipstore
- **description:** `[CONFIRM rewrite — original was IDENTICAL to card 28]` _A diplomatic-quarter retail interior turned into spatial choreography — shifting geometries, exhibition sequences, and a guided route transform the monotonous enclosure._
  _(I added "diplomatic-quarter" so this card differs from card 28's description.)_
- **notes:**

---

### 27 · `024` — Sihl City West / Thurgauerstrasse 🟥 PULL FROM GALLERY

`public/images/projects/024/main.png`

- **status:** **REMOVE FROM `projects.js`** pending Theo Hotz publish approval per your note ("Das Projekt nehmen wir erst mal aus der Galley, müssen bei Theo Hotz nachfragen zum publizieren"). Metadata preserved here for re-add when approved.
- **client:** Theo Hotz Partner Architekten
- **title:** Thurgauerstrasse
- **year:** 2025
- **location:** Zurich, Switzerland
- **tags:** _(would have been Exterior, Residential)_
- **role:** _(would have been Competition entry · stills)_
- **massiveTitle:** Thurgauer/strasse
- **description:** _(unwritten)_
- **notes:** Card 27 = id `024`. Will be deleted from `src/data/projects.js`; image assets at `public/images/projects/024/` left on disk. Gallery becomes 33 cards.

---

### 28 · `025` — Neutrale Flagshipstore

`public/images/projects/025/main.png`

- **client:** Estudio DIIR
- **title:** Neutrale Flagshipstore
- **year:** 2024
- **location:** Madrid, Spain
- **tags:** Interior, Retail `[CONFIRM]` _(was: `Visualization`)_
- **role:** Brand campaign · interior stills `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** Neutrale/Flagshipstore
- **description:** `[CONFIRM rewrite — original was IDENTICAL to card 26]` _Madrid's Neutrale flagship turns the showroom into spatial choreography — limestone floors, layered partitions, and a guided route reframe the brand's product display._
  _(Differentiated from card 26.)_
- **notes:**

---

### 29 · `027` — James Street

`public/images/projects/027/main.mp4` _(motion)_

- **client:** Taylor and Hinds Architects
- **title:** James Street
- **year:** 2024
- **location:** Tasmania, Australia
- **tags:** Motion
- **role:** Studio motion · cinematic pass `[CONFIRM]` _(was: `Studio motion` — added deliverable)_
- **massiveTitle:** James / Street
- **description:** James Street in Launceston folds heritage context into a compact brick villa — framed openings, a walled garden, and a walnut tree shape secluded domestic life.
- **notes:**

---

### 30 · `028` — ASTRUP HAVE

`public/images/projects/028/main.mp4` _(motion)_

- **client:** NORRØN
- **title:** ASTRUP HAVE
- **year:** 2024
- **location:** Copenhagen, Denmark
- **tags:** Motion
- **role:** Studio motion · cinematic pass `[CONFIRM]` _(was: `Studio motion` — added deliverable)_
- **massiveTitle:** ASTRUP HAVE
- **description:** Åstrup Have overlooks Haderslev Fjord as a contemporary Danish farmhouse — biodynamic cultivation, grazing animals, and vernacular forms renew the countryside dream.
- **notes:**

---

### 31 · `029` — DEHGRAFF 🟥 TITLE / DESCRIPTION MISMATCH

`public/images/projects/029/main.png`

- **client:** DEHGRAF `[CONFIRM]` _(spelling — file uses `DEHGRAFF` with two F's, you wrote `DEHGRAF` with one. Pick one.)_
- **title:** Pendant Lamp `[CONFIRM]` _(was: `Pendand Lamp` — assumed typo)_
- **year:** 2025
- **location:** Zürich, Switzerland `[CONFIRM]` _(was: `Zürich, Schweiz` — German→English on the gallery side)_
- **tags:** Product `[CONFIRM]` _(was: `product` lowercase)_
- **role:** Product still · 1 hero `[CONFIRM]` _(was: `Visualization`)_
- **massiveTitle:** DEHGRA/GRAF
- **description:** **🟥 BLOCKED — title says it's a pendant lamp, description describes a "monastic interior atmosphere" with concrete walls and timber. The two don't agree.** Pick one:
  - **A. It's a pendant lamp.** Title: `Pendant Lamp`. New description: _A cast-concrete pendant suspended in a monastic interior — precise raw surfaces, a single suspension cable, and warm timber surroundings give the lamp its sculptural weight._
  - **B. It's an interior with a lamp in it.** Title: `[change to interior name]`. Keep current description.
  - **C. It's a brand campaign for the lamp shot in an interior set.** Title: `Pendant Lamp`. Description: _A cast-concrete pendant set against monastic raw walls — single suspension cable, deep shadow, and warm timber surroundings stage the lamp as a sculptural object._
- **notes:**

---

### 32 · `030` — Montparnasse Residence

`public/images/projects/030/main.jpg`

- **client:** cyrus ardalan architecte
- **title:** Montparnasse Residence
- **year:** 2025
- **location:** Paris, France `[CONFIRM]` _(was: `Paris, Frankreich` — German→English)_
- **tags:** Interior, Residential `[CONFIRM]` _(was: `competition` — Competition isn't in tag vocab; moved to Role)_
- **role:** Competition entry · stills `[CONFIRM]` _(was: `Visualization & Direction` — old hardcoded fallback)_
- **massiveTitle:** Montparnasse/Residence
- **description:** Modernist furniture and warm herringbone parquet define a restrained interior composition — soft daylight, geometric volumes, and walnut accents create quiet spatial balance.
- **notes:**

---

### 33 · `033` — SGGK Morgentalstrasse _(1st place)_

`public/images/projects/033/main.png`

- **client:** SGGK
- **title:** Morgentalstrasse
- **year:** 2023
- **location:** Zürich, Switzerland `[CONFIRM]` _(was: `Zürich, Schweiz` — German→English)_
- **tags:** Exterior, Residential `[CONFIRM]` _(was: `competition 1st place` — Competition isn't in tag vocab; "1st place" moved to notes)_
- **role:** Competition entry · 2 stills `[CONFIRM]` _(was: `Visualization & Direction`)_
- **massiveTitle:** SGGK
- **description:** The lush greenery of Manegg cemetery enters the residential fabric — planted front gardens, quiet streets, and recessed houses shape a sheltered urban retreat.
- **notes:** 1st place competition.

---

### 34 · `034` — REUTER neoro n80

`public/images/projects/034/main.mp4` _(motion)_

- **client:** REUTER
- **title:** neoro n80
- **year:** 2023
- **location:** Studio
- **tags:** Motion, Product `[CONFIRM]` _(was: `Motion`. Added Product since the subject is a bathtub — a product. Drop if you don't want both.)_
- **role:** Brand film · motion + still `[CONFIRM]` _(was: `Studio motion`. Switched to `Brand film` since REUTER is a real client, not internal studio work.)_
- **massiveTitle:** REUTER
- **description:** A translucent acrylic bathtub becomes the sculptural centerpiece of the bathroom — soft reflections, jungle-inspired ambience, and flowing geometry elevate the bathing experience.
- **notes:**

---

## Summary of changes

| Class                                                 | Cards touched                                                                       | Reason                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Tag remap (`Visualization` → real Subject/Sector)** | 18, 19, 20, 21, 22, 23, 25, 26, 28, 29, 30, 31, 32, 33                              | `Visualization` isn't in the locked tag vocab                           |
| **Tag remap (`Competition` → moved to Role)**         | 09, 12, 30, 33                                                                      | `Competition` is a brief, lives in Role, not tags                       |
| **Role replaced** (~25 cards)                         | most                                                                                | `Visualization · N images` isn't a valid Brief from the 10-bucket vocab |
| **Description rewritten — client name removed**       | 04 Ferrum, 03 Chelsea Brut, 11 Playa Brava, 22 Oberhus, 15 Timex                    | Rule says no client name in description                                 |
| **Description rewritten — over 30 words**             | 13 Konnex (32 → 27 words)                                                           | Length cap                                                              |
| **Description rewritten — duplicate**                 | 23 vs 25 (Diplomatic vs Neutrale flagships)                                         | Two projects had identical description                                  |
| **Description rewritten — no concrete noun**          | 04 Neutrale Flagship                                                                | Rule requires one concrete noun                                         |
| **Massive title spelling fixed**                      | 15 Casa Neutrale (`Stduio` → `studio`)                                              | Estudio DIIR consistent across 04 + 18                                  |
| **Massive title spacing restored**                    | 13 SSA Areal Moosbühl, 16 SSA, 15 Timex                                             | Original double-space letterspacing kept                                |
| **Location German → English**                         | 11 Wülser, 23 Casa Tepetate, 31 DEHGRAFF, 32 Montparnasse, 33 SGGK Morgentalstrasse | Gallery is English-side per Q1                                          |
| **Title typo**                                        | 31 DEHGRAFF (`Pendand` → `Pendant`), 25 Oberhus (`Valis` → `Valais`)                | Spelling                                                                |

🟥 **Three blockers needing your direct input** (search this file for `🟥`):

1. **Card 16 (014)** — second SSA project still mostly blank.
2. **Card 27 (024 Sihl City West)** — confirming I should DELETE from projects.js.
3. **Card 31 (029 DEHGRAFF)** — title-vs-description mismatch (pendant lamp vs. monastic interior). Pick option A, B, or C.

When you're ready, walk through and ✓ or ✗ each `[CONFIRM]` (and resolve the three 🟥 blockers). Then I translate to `projects.js`.
