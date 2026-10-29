# 3M Personal Auto pilot brief

## Status and evidence

Prepared on 2026-10-27 from the initial email and the subsequently supplied
August-September 2026 email thread. This is a delivery plan, not a claim that
the microsite or its integrations are complete.

| Item | Observed state |
|---|---|
| Platform | Edge Delivery Services with Document Authoring, confirmed by the project owner |
| Repository | https://github.com/mtilburgadobe/aem-3m-demo |
| Local checkout | `/Users/mtilburg/Github/aem-3m-demo` |
| Existing preview | Homepage and `/scripts/aem.js` return HTTP 200; homepage contains boilerplate content |
| DA access | Adobe sign-in refreshed; authenticated namespace listing returns HTTP 200 |
| Existing DA documents | `/index.html`, `/nav.html`, `/footer.html` |
| Design access | Figma MCP connected as `mtilburg@adobe.com`; metadata requests for both files and a Personal Auto screenshot request were denied with a missing-edit-access error. This does not establish that editor access is generally required for read tools |
| Screenshot references | Two user-supplied canvas overviews reviewed on 2026-10-27; useful for preliminary structure, not detailed copy, tokens, or final page mapping |
| Restyling Studio reference | URL supplied in the thread; public fetch and header request returned HTTP 403 from Akamai on 2026-10-27. Application behavior and embed support remain unverified |
| Code Sync installation | Not independently confirmed; GitHub installation lookup requires app-level authentication. Code is currently delivered by the preview host |
| Live publishing | Not performed |

This brief is excluded from EDS delivery by the repository's existing `*.md`
rule in `.hlxignore`. Do not add credentials or personal lead data to it.

## Build status (first pass, 2026-10-27)

Built ahead of answers to the open questions below. Every page carries a
yellow "Pilot draft" note stating what is placeholder. Preview only; nothing
is published. Root `/index`, `/nav`, `/footer` were not touched.

| Page (DA path) | State |
|---|---|
| `/personal-auto/` (home) | Figma "Frame 16" structure; provisional copy; no imagery |
| `/personal-auto/installers` | "Join the network" structure; template testimonial placeholder |
| `/personal-auto/installers/training` | Placeholder body (no design) |
| `/personal-auto/training-schedule` + `/personal-auto/fr-ca/training-schedule` | USAC sample sessions; draft French Canadian translation; `lang` metadata drives page language |
| `/personal-auto/color-management` | Links to existing 3M selector; relevance unconfirmed |
| `/personal-auto/coverage-options` | Text cards; gallery images pending |
| `/personal-auto/fleet` | Placeholder (no design) |
| `/personal-auto/restyling-studio` | `studio` block: illustrated car with wrap color/finish, tint VLT, PPF, angle, lighting, share link; optional iframe of the real studio (framing untested) |
| `/personal-auto/find-an-installer` | `locator` block: ZIP/postal search (zippopotam.us), product and dealer-type filters, Leaflet/OSM map, quote dialog in demo mode |
| `/personal-auto/data/dealers.json` | DA sheet with 14 fictional "(Demo)" dealers (MN, ON, QC) |

Shared work: provisional 3M theme tokens (`--brand-red` etc.) in
`styles/styles.css`, text "3M" wordmark, dark footer, consent banner in
`scripts/consent-check.js` (provisional copy, stores choice in localStorage,
footer `#cookie-preferences` link reopens it). New blocks: `banner` (with `zip`
variant), `testimonial`, `swatch-promo`, `table`, `locator`, `studio`; `hero`
(`compact`) and `cards` (`tiles`, `icons`) variants.

To swap in real data or routing: replace rows in the DA `dealers` sheet (same
columns) and set the locator's `Lead endpoint` row to a POST endpoint that
fans out to 3M and the dealer.

## Business context and sources

The initial email reports Adobe account-team buy-in and an intended meeting
with IT leader April Wyland. The additional thread records Heather Musman's
reported alignment with April on working toward a viable plan. Neither is
evidence of technical integration approval or a completed workshop.

The microsite is intended to replace two existing 3m.com sites:
Car Personalization and Post Factory Installations. The project owner
confirmed that no sitemap was attached; the additional reference was this
email thread. Although the thread says "see sitemap below," no sitemap content
is present in the supplied text. Define the page inventory with Carson from
the design/source content rather than continue requesting a nonexistent
attachment. Exact legacy-site URLs and the referenced 3M visual-identity PDF
remain unavailable.

| Reference | Intended use | Review status |
|---|---|---|
| [Figma drop 1: Personal Auto, updated link from Carson](https://www.figma.com/design/oULneVdVJRfu1xsJWc3R1b/Personal-Auto-Site?node-id=0-1&t=LdKWzoKXN9bqx2ms-1) | Design for the eight-page microsite; same file key as the original link | MCP access denied; apparent matching canvas overview supplied, pending readable frame exports and canonical selection |
| [Figma drop 2: MDS for AEM Pilot](https://www.figma.com/design/X0upsCzpV0pO1TcPfmYcCw/MDS-for-AEM-PIlot?node-id=0-1) | Broader TEBD design reference | MCP access denied; apparent matching component/template overview supplied; not authorization to expand the eight-page scope |
| [Restyling Studio / locator](https://restylingstudio.3m.com/en-US#locator) | Existing customer tool explicitly referenced by Jen | Server-side requests blocked with HTTP 403; review with Tim in an authorized browser |
| Architectural & Glass Finishes Visualizer | Additional experience mentioned in the thread | No URL supplied; reference only, not an additional pilot deliverable |

Both links select node `0:1`, not a confirmed individual page frame. Desktop,
mobile, and alternate frames must be mapped to canonical pages before building.

## Preliminary screenshot analysis

The original screenshots remain outside the served repository:

| File | Resolution | Visible evidence |
|---|---|---|
| `/Users/mtilburg/Desktop/Screenshot 2026-10-27 at 11.52.26.png` | 2104 x 1668 | Personal Auto canvas overview: a small sitemap-like diagram at left, a composed automotive landing page near the top, studio and locator references near the center, and further page frames to the right |
| `/Users/mtilburg/Desktop/Screenshot 2026-10-27 at 11.52.40.png` | 1472 x 1680 | Component/template overview: component examples at left and two long page templates at right, with substantial checkerboard media placeholders and generic copy |

These are screenshots of a zoomed-out canvas, not individual full-resolution
pages. Most page frames are only roughly 100-200 pixels wide in the images.
Enlarging them cannot recover missing text or asset detail. Neither screenshot
provides a verified mobile design or exact font, spacing, color, or breakpoint
values.

Visible patterns suitable for a preliminary component inventory include:

- Shared white header/footer treatments, red brand/CTA accents, dark automotive
  hero/campaign bands, image-card groups, and icon/benefit rows.
- In the component overview: multi-column links, alternating image/text
  content, tabs, accordions, comparison-table patterns, and carousel controls.
- Separate studio and locator references on the Personal Auto canvas; these
  are visual references, not evidence that an integration API is available.

Interactions, keyboard/focus states, validation, and consent behavior cannot
be established from these still images. Checkerboard media and generic template
headings must not be interpreted as final approved content.

The sitemap-like diagram means page-mapping information may already exist
inside the Personal Auto file, despite no sitemap being attached to the email.
Obtain a readable export or zoomed-in capture of that diagram first, then
individual page frames (PDF or PNG at original frame width, including lower
sections). Use separate original media/SVG assets and approved copy for the
build, not crops from these overview screenshots.

No final eight-page list, precise design tokens, existing-block reuse decision,
or deployable content is inferred from these low-resolution overviews.

## Figma sitemap and page frames (screenshots, 2026-10-27)

The Personal Auto file contains a "Personal Auto AEM - Site Map" frame:
"L2: Personal Auto. Looking to reimagine the Car Personalization and Post
Factory Installations L2s into a single experience. Scope for AEM Pilot would
be the pages highlighted in green/red."

| Sitemap page | Key category | In pilot | Design frame observed |
|---|---|---|---|
| Car Personalization - Consumer (home) | Global static | Yes | "Frame 16": full composed page |
| Installer / Dealer | Global static | Yes | "Join the network": full composed page |
| Training (child of Installer / Dealer) | Global static | Yes | "Installer and dealer training": hero only, no body |
| Localized Training Offering Schedule | Localized | Yes | "UK Training Schedule": hero + Axure link `https://zw7k6p.axshare.com/#id=2bjfso&p=endorsed_landing_page` |
| ICC Color Management | Global static | Yes | "ICC Color Profiles": hero + note "Determine business relevance", reference `https://www.3m.com/3M/en_US/graphics-signage-us/resources/color-profiles/color-profiles-selector/` |
| Coverage Options Gallery | Global static | Yes | Hero + note to use `https://www.3m.com/3M/en_US/car-personalization-us/resources/coverage-options/` "but expand and add gallery capability" |
| Fleet | Global static | Yes | No frame observed |
| Restyling Studio | Tool | Yes | Full-bleed dark studio landing (five vehicles, Start, Find an Installer, Share) |
| Find an Installer | Tool | Yes | Locator with zip search, filters, results list, map |
| Protection Wrap / Wrap / Window Tint / Paint Protection Wrap Film PCPs | Product category | No | Not in pilot scope |

### Discrepancies to confirm with Carson

1. **Six green static pages vs. five in the email** (home, Installer/Dealer,
   Training, ICC, Coverage Gallery, Fleet). Confirm which is dropped or whether
   scope is nine pages.
2. **UK vs. USAC/French CA.** The email specifies a USAC schedule with a
   French Canadian version; the frame is titled "UK Training Schedule".
3. **Two header patterns.** The home frame uses a minimal dark header (Find an
   Installer, Products, For Business, 3M Pro Shops); all other frames use the
   3M global header (search, US-EN locale, Account, Products/Industries/Brands,
   breadcrumb, "Car Personalization" L2 title).
4. **Missing designs/copy.** Training, ICC, Coverage Gallery, and the localized
   schedule are hero-only; Fleet has no frame. ICC is flagged "determine business
   relevance". Body copy on composed pages still includes template placeholder
   text (e.g., "Optional description in paragraph format...").
5. **Home hero.** Two hero options appear: F1 car with Cadillac/3M lockup, and
   "Get inspired" red car with swatch picker linking to the studio. Confirm which,
   and whether F1/Cadillac imagery is cleared for use.

### Composed page sections

**Home ("Frame 16")**: dark header + F1 hero; three image tiles (Your car your
way, Branding the fleet, Join the network); "Answer the call to customize" with
four icon cards (Protection wrap film, Wrap film, Window tint, Paint protection)
and a coverage-options link; "Find an installer" image banner with zip prompt and
red CTA; two cards (Contact 3M, Installers and Distributors); 3M footer.

**Installer / Dealer ("Join the network")**: hero "Become the shop customers
trust" with "Apply to become a dealer"; "Partnership to help you get the job done"
four cards (Training, Marketing support, COSMO app, Pattern marketplace); studio
promo band "Help customers visualize your impact" with swatch picker and
"Open the Restyling Studio"; "Join our community of installers and dealers" three
cards (Win more business, Work with confidence, Expand what's possible);
testimonial ("John Doe from WrapX", placeholder); "Contact us" image banner.

**Restyling Studio**: full-viewport dark stage, five white vehicles, Start control,
Location selector, Find an Installer and Share buttons, product nav (Protection
Wrap, Wrap, Window Film, Paint Protection, Contact Us), compact 3M footer.

**Find an Installer**: back button and zip search (example `55118`); filters by
product (Automotive Window Film, Ceramic Coating, Color Change Film, Paint
Protection Film, Protection Wrap Film) and dealer type (3M Authorized Dealer,
3M Pro Shop Dealer); numbered results with dealer type, name, distance, address,
phone, website, product tags, and "Get a Quote"; Google map with numbered pins.
A reference capture of the 3m.co.uk service locator shows map/list views and
Get Directions. "Get a Quote" is the presumed entry to the dual-recipient lead
form; the form itself is not designed.

### Shared components implied

3M global header with breadcrumb/L2 title; dark image hero with red CTA; image
banner CTA; image-title tiles; icon link cards; image cards with title, text,
bullets; testimonial; swatch-picker promo band; 3M footer with legal row and
cookie preferences link.

## Stakeholders and delivery expectations

| Person | Role stated in the thread | Coordination need |
|---|---|---|
| Carson Patton | Global UX Specialist; UX/content strategist and day-to-day 3M contact | Confirm pages, frames, content, visual identity, and authoring/localization expectations |
| Tim Albright | 3M technical lead and day-to-day contact | Identify tool/API owners, integration constraints, sandbox access, and technical acceptance |
| Jennifer Pengra-Wagner | Director, Global Marketing Center, TEBG | Align business scope, workshop outcomes, and acceptance ownership |
| April Wyland | IT leader identified in the initial email | Align IT sponsorship, governance, and technical/logistical decisions |
| Heather Musman | Adobe account director | Confirm Adobe engagement, staffing, workshop schedule, and delivery expectations |

The thread contains two distinct expectations that need reconciliation:

- Carson wanted the site as complete as possible before a two-day IT-leader
  workshop; the workshop date was not confirmed in his supplied message.
- Jen proposed a one-to-two-day working session during the week of September
  21, 2026 to define the POC and success criteria, with a tangible prototype/demo
  targeted for mid-November to early December.

As of this brief's date, the proposed September week is in the past. Confirm
whether that session happened, obtain any decisions, and establish the current
demo date. The email's target is not an agreed engineering delivery commitment.
Heather also proposed 25-minute Tuesday/Thursday preparatory sessions; the
thread does not confirm an accepted cadence or current meeting schedule.

The original F1/Cadillac brand-awareness proposal and optional full-journey
storyboard provide context, not authorization for extra pages or features.

## Scope and page inventory

| Slot | Required experience | Missing source or decision |
|---|---|---|
| 1-5 | Five static global-content pages | Sitemap lists six candidates (home, Installer/Dealer, Training, ICC, Coverage Gallery, Fleet); confirm which five, plus copy, images, and paths |
| 6 | USAC training schedule with French Canadian version | Figma frame says "UK Training Schedule"; confirm locale, schedule source, and approved French copy |
| 7 | Restyling Studio | URL supplied; integration owner, supported embed/API contract, and licensed assets still needed |
| 8 | Find an Installer / Dealer | `#locator` supplied as an existing reference; data/API owner, geographic coverage, certification data, and lead-routing contract still needed |

Eight logical pages are requested. Whether French Canadian training is an
additional delivered URL beyond the eight is unresolved. No final paths or
page names are invented in this brief. Navigation and footer are shared content
documents, not additional microsite pages. Applying 3M visual identity and the
approved cookie-consent language/footer are explicit requirements from Carson,
not optional polish.

## Critical path: installer/dealer discovery and lead delivery

The email explicitly makes this page essential to pilot success. Deliver a
real integration before treating visual completion of other pages as readiness.
A static dealer list, fake success message, or email link does not satisfy it.

Obtain from the 3M integration owner:

- The approved dealer source or supported locator embed/API, usage rights,
  authentication model, rate limits, test environment, and CORS/embed policy.
- Postal-code coverage and validation rules, geocoding/distance behavior,
  search radius, result ordering, and certification/product filters.
- Stable dealer identifiers, certification status, display names, addresses,
  phone numbers, websites, and authorized lead destinations.
- The form schema, required consent/privacy text, anti-abuse requirements,
  submission endpoint, and the system where both 3M and the selected dealer
  can see the same lead.
- An approved test dealer and synthetic test identities, delivery receipts or
  audit evidence, duplicate/retry handling, retention rules, and support owner.

Choose the integration approach only after these inputs are reviewed. Public
browser-safe configuration may be authored in DA. Private credentials and lead
routing must remain in an approved backend, never in block code, DA documents,
URLs, or committed files. If a backend is needed, its hosting and ownership
must be agreed; this static EDS repository is not a private API server.

### Acceptance criteria: locator and lead form

- [ ] An accepted postal code returns nearby eligible 3M certified installers
  or dealers using the approved data source and agreed geographic rules.
- [ ] Each result exposes the available website and phone contact correctly;
  missing optional fields do not create broken links or blank controls.
- [ ] The user can select a dealer and submit the approved form against that
  dealer's stable identifier.
- [ ] A synthetic test lead is visible to both 3M and the selected dealer,
  with evidence from the receiving system rather than just an HTTP 200.
- [ ] Success is shown only when the agreed receiving system acknowledges
  acceptance. Downstream delivery status is not overstated.
- [ ] Empty/invalid postal codes, unsupported regions, no results, slow
  responses, service errors, and rejected submissions have explicit states.
- [ ] Double clicks and retries do not create unintended duplicate leads;
  failed submissions preserve safe user input for correction.
- [ ] Consent, data minimization, anti-abuse controls, and retention meet
  the approved integration contract; personal data is absent from analytics.
- [ ] Mobile below 768px has usable stacked results and form controls;
  tablet 768-1199px and desktop at least 1200px retain readable layouts.
- [ ] Keyboard users can search, select a dealer, correct errors, and submit;
  loading, result counts, and submission outcomes are announced accessibly.
- [ ] Authors can edit explanatory text and approved public configuration
  without altering dealer records, secrets, or routing logic.
- [ ] Definition of done: all above scenarios pass against the approved test
  integration, responsive/browser review passes, and 3M accepts the evidence.

## Restyling Studio

Source reference: https://restylingstudio.3m.com/en-US#locator. The fragment
identifies a client-side destination, not a documented locator API. HTTP 403
from the current environment does not establish that the tool is unavailable
to normal users or that embedding is forbidden. Do not infer either from
the blocked response or attempt to circumvent the site's access controls.

Reuse the existing approved studio if its supported integration permits it;
do not assume iframe embedding is allowed or rebuild a renderer without
assets and explicit scope. Confirm framing headers, allowed origins,
cross-origin messaging, cookies/consent, and asset licensing.

### Acceptance criteria: studio

- [ ] Users can view approved 3M tint/wrap films on a model car.
- [ ] Multiple viewing angles and lighting conditions work as required by
  the source studio and the email.
- [ ] Loading and unavailable states are explicit; any approved external
  fallback is labelled as a link rather than presented as a working embed.
- [ ] An integration failure does not block the rest of the page.
- [ ] Controls work by touch and keyboard; the layout does not overflow
  mobile, tablet, or desktop widths defined above.
- [ ] Authors can maintain the approved studio reference and supporting
  content without editing code or inserting arbitrary executable markup.
- [ ] Definition of done: real licensed assets and supported integration
  work in the target browsers, with responsive and accessibility review.

## Training localization

Demonstrate an author making an English content update and maintaining a
French Canadian equivalent in DA. Do not equate creating two documents with
providing an automated translation workflow.

### Acceptance criteria: localized training

- [ ] The USAC schedule uses supplied, current training content and approved
  improvements rather than invented courses, dates, locations, or prices.
- [ ] French Canadian content is reviewed and approved; the page declares
  the correct document language.
- [ ] Locale switching retains the corresponding training-page context.
- [ ] Local dates, time zones, links, and registration destinations are
  correct; empty schedules and missing optional fields are handled clearly.
- [ ] Missing translations follow an explicitly agreed fallback, not an
  unlabelled switch back to English.
- [ ] Locale-specific metadata and alternate-language links reflect the
  confirmed URL scheme.
- [ ] Longer French strings, diacritics, and schedule layouts work on
  mobile, tablet, and desktop without clipping or horizontal overflow.
- [ ] Authors can update schedules and localized copy in DA without code
  changes; shared and locale-specific content ownership is documented.
- [ ] Definition of done: the English update and French review/preview
  workflow are demonstrated and the localized content is accepted.

## Static pages and shared experience

### Acceptance criteria: 3M identity, cookie consent, and footer

- [ ] Carson supplies the referenced visual-identity PDF or an approved
  equivalent, including permitted logo/font assets and web usage rights.
- [ ] Design tokens, typography, logos, and components follow the approved
  3M identity and canonical Figma designs; no brand values are guessed.
- [ ] The approved 3M cookie-consent platform/configuration, banner language,
  preference controls, legal links, and footer content are supplied.
- [ ] Nonessential tags and third-party experiences respect the approved
  consent categories; essential behavior is classified with 3M rather than
  assumed by the implementation.
- [ ] Accept, reject, preference changes, and returning-visitor behavior
  follow the approved policy. Declining consent does not silently activate
  the studio, tracking, or other consent-gated integrations.
- [ ] Applicable locale-specific banner/footer text and legal destinations
  are approved; missing content is surfaced instead of fabricated.
- [ ] Banner and preferences are keyboard accessible and usable on mobile,
  tablet, and desktop without obscuring essential controls.
- [ ] Authors can maintain approved copy and footer links through the agreed
  workflow without introducing scripts or changing consent enforcement.
- [ ] Definition of done: 3M's designated brand/privacy owners approve the
  rendered identity, consent behavior, and footer in the pilot environment.

### Acceptance criteria: five global-content pages

- [ ] Exactly five approved global pages map to confirmed sitemap entries
  and canonical Figma frames; mobile variants do not become extra pages.
- [ ] Each design section maps to default content, a visually suitable
  existing block, or a new isolated block with an agreed authoring model.
- [ ] Real approved text, images, alt text, destinations, and page metadata
  replace boilerplate; placeholder content is not published.
- [ ] Shared navigation and footer link to the approved pages and locale
  destinations, with no dead links or duplicated page chrome.
- [ ] Missing optional media or CTAs do not leave broken layouts; long
  headings, absent optional cells, and external links are handled safely.
- [ ] Layouts match the approved design on mobile, tablet, and desktop;
  keyboard navigation, focus visibility, and readable contrast work.
- [ ] Authors can edit required headings/copy and optional media/links in
  DA without changing code; author instructions cover each new block.
- [ ] Definition of done: real browser comparison to Figma passes, links
  and media resolve, existing behavior is preserved, and content is accepted.

## Delivery sequence and gates

1. **Unblock inputs.** Resolve Figma read access or obtain readable exports,
   starting with the sitemap-like diagram visible in the Personal Auto overview.
   Agree the page inventory with Carson, obtain source URLs and the
   visual-identity PDF, select canonical frames,
   confirm locale counting and consent requirements, and have Tim identify
   locator/lead and studio integration owners. Reconfirm the demo date and
   any decisions from the proposed September workshop.
2. **Prove the locator integration.** Resolve approved data access, postal
   search, and synthetic lead visibility for both recipients. Agree any
   required backend before building a form around an assumed API.
3. **Confirm design and content mapping.** Inspect the existing block palette,
   review each Figma section, agree uncertain mappings and content models,
   and identify approved assets and copy.
4. **Build the page experiences.** Implement isolated blocks as needed,
   integrate the studio, author the five static pages and training variants,
   then assemble shared navigation/footer.
5. **Preview and verify.** Push code through the normal branch/PR process;
   verify JS/CSS delivery and browser decoration. Preview DA content and
   compare real mobile/tablet/desktop renders to the approved designs.
6. **Accept and publish separately.** Demonstrate authoring/localization,
   studio interactions, postal search, and confirmed dual-recipient lead
   visibility. Publish only after explicit authorization and completed gates.

Review current DA documents before any write. Any existing page, including
the starter homepage, requires explicit overwrite approval. An inferred
Figma-to-block plan also requires confirmation before DA deployment.

## Decisions required before implementation

| Decision/input | Requested from | Why it blocks |
|---|---|---|
| Page inventory and exact live source URLs; no sitemap attachment exists | Carson / 3M content team | Defines the five static pages and real content sources |
| Figma read permissions or readable page/diagram exports, canonical frames | Project owner / Carson | MCP is connected but file reads are denied; overview screenshots cannot supply detailed copy or assets |
| Visual-identity PDF and approved logo/font assets | Carson / 3M brand team | Enables brand-correct components |
| Consent platform/configuration, approved banner language and footer | Tim / 3M privacy and web-platform owners | Enables compliant shared chrome and third-party loading |
| Locale URLs and whether French counts beyond eight pages | Carson / 3M content team | Determines inventory, routing, and navigation |
| Locator data and lead system contract | Tim / 3M dealer operations | Essential search and dual-recipient lead behavior |
| Studio integration permission and licensed assets; URL now supplied | Tim / 3M studio owner | Determines feasible implementation |
| Approved privacy text and synthetic submission procedure | 3M privacy / IT | Prevents unsafe or unintended customer-data handling |
| Homepage/nav/footer replacement approval | Project owner | Existing DA content must not be silently overwritten |
| Acceptance owner and publishing authorization | Project owner / 3M stakeholder | Separates working preview from approved release |
| Current demo date, workshop outcomes, Adobe staffing and meeting cadence | Jen / Heather / project owner | Reconciles historical proposals with the current delivery plan |

The account-team meeting should prioritize the locator/lead owner and the
supported studio integration with Tim, followed by Carson's page/design inventory,
brand materials, consent/footer requirements, and localization expectations.
No timeline or delivery commitment is assumed until these dependencies and
the current stakeholder expectations are resolved.
