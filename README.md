# 3M Personal Auto pilot

Adobe Edge Delivery Services with Document Authoring (DA) pilot for a personal
auto microsite replacing the existing Car Personalization and Post Factory
Installations sites.

The requested scope is eight pages: five static global-content pages, one
localized training page, a Restyling Studio, and an installer/dealer locator
with lead submission. The French Canadian training version's effect on the
page count remains to be confirmed. Shared requirements include 3M visual
identity, approved cookie-consent behavior/language, and the 3M footer.

Carson Patton (UX/content) and Tim Albright (technical lead) are the day-to-day
3M contacts. The supplied thread identifies
[the existing Restyling Studio and locator](https://restylingstudio.3m.com/en-US#locator);
its supported integration and lead-routing contract still need confirmation.

See [the pilot brief](docs/PILOT.md) for scope, acceptance criteria, dependencies,
and implementation order. This repository currently serves the starter site;
the 3M experience has not been implemented.

## Environments
- Preview: https://main--aem-3m-demo--mtilburgadobe.aem.page/
- Live: https://main--aem-3m-demo--mtilburgadobe.aem.live/
- DA workspace: https://da.live/#/mtilburgadobe/aem-3m-demo
- Homepage editor: https://da.live/edit#/mtilburgadobe/aem-3m-demo/index

Preview and live are separate content environments. A URL listed here does
not mean the 3M pilot is published or accepted.

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Clone this repository and run `npm ci`.
1. Run `npx -y @adobe/aem-cli up` from the repository root.
1. Open `http://localhost:3000`. The server uses local code with previewed content.

Site configuration is managed through [AEM tools](https://tools.aem.live/),
not `fstab.yaml`. Verify the configured content source before making changes.
The existing DA namespace contains `index`, `nav`, and `footer`; do not
overwrite them without reviewing their content and confirming replacement.

Code Sync delivers pushed code independently from DA content preview/publish.
Include a branch preview URL in every pull request. Never commit tokens,
private API keys, dealer lead data, or customer submissions.
