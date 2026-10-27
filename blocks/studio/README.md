# Studio

Interactive film visualizer: an illustrated coupe (side and front 3/4 views) on a dark full-bleed stage. Users can choose wrap colors, window tint (VLT), Paint Protection Film, and lighting. No image assets are needed.

## Authoring

| Studio (embed) | | |
| --- | --- | --- |
| Heading, intro text, optional links (see below) | | |
| Gloss Hot Rod Red | #c8102e | gloss |
| Satin Dark Gray | #3a3d40 | satin |

- **Row 1**: Rich text such as a heading and intro.
  - A link to `restylingstudio.3m.com` turns into the full-studio action.
  - A link whose text or URL contains "installer" sets the **Find an Installer** target. The default is `/personal-auto/find-an-installer`.
- **Other rows**: Swatches with the columns `name | hex color | finish`. Finish is `gloss`, `satin`, or `matte`; anything else falls back to gloss. Invalid hex values show as gray.
- **`embed` variant**: Adds a **Launch full studio** button that loads the real studio in an iframe on the stage, plus an **Open in new tab** link. The site may refuse framing, so the link is always available. Without the variant, only the link button is shown.

## URL parameters

`?color=Satin%20Dark%20Gray&tint=35&light=studio&angle=front&ppf=1`

- `color`: Swatch name (case-insensitive), slug, or hex value.
- `tint`: One of `70`, `50`, `35`, `20`, `5`.
- `light`: `daylight`, `studio`, or `night`.
- `angle`: `side` or `front`.
- `ppf`: `1` turns on Paint Protection Film.

**Share** writes these parameters into the URL. It uses the native share sheet when one is available; otherwise it copies the URL to the clipboard.

## Notes

- Swatches are labeled "Sample colors". The colors are approximate and are not official 3M product codes.
- UI strings are in English, with French-Canadian strings when `<html lang="fr…">`.
