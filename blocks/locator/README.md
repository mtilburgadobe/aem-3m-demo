# Locator

Find an Installer / Dealer search: ZIP or postal code search, product and dealer-type filters, numbered results list, OpenStreetMap (Leaflet) map with matching pins, and a "Get a Quote" lead form.

## Authoring

| Locator | |
| --- | --- |
| Data | `/personal-auto/data/dealers.json` (link or plain text path; default if omitted) |
| Lead endpoint | Optional URL that receives the lead as a JSON `POST`. Leave empty for demo mode (nothing is sent). |
| Radius | Search radius in miles (default `50`). If nothing is within the radius, the 5 nearest are shown. |

## Dealer sheet

Publish a spreadsheet (e.g. `/personal-auto/data/dealers`) with these columns:

`name`, `type` (`3M Authorized Dealer` or `3M Pro Shop Dealer`), `address`, `city`, `region`, `postal`, `country` (`US`/`CA`), `phone`, `website`, `email`, `products` (comma-separated: Automotive Window Film, Ceramic Coating, Color Change Film, Paint Protection Film, Protection Wrap Film), `lat`, `lng`.

## Behavior notes

- Deep link: `find-an-installer?zip=55118` searches on load.
- Geocoding uses `api.zippopotam.us` (US ZIP, Canadian FSA = first 3 characters of the postal code).
- Product filters match dealers offering **any** checked product; no checked filter = all.
- UI is French when the page `lang` metadata starts with `fr`.
- Lead payload: `{ dealer: { name, email, type }, lead: {...}, routing: ["3m", dealerEmail], source, submittedAt }`.
