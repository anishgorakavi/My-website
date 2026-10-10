# Future Maintainer Handoff

This document explains how this website was built and how future Codex or Claude Code instances should change it without losing its design, content accuracy, accessibility, or static-hosting behavior.

## Project purpose

This is Anish Gorakavi's personal portfolio. It positions him as a University of Texas at Austin Computer Science + Neuroscience student building across cybersecurity, AI, open source, Internet infrastructure, and systems.

The original biographical source is [`anish-gorakavi-profile.md`](./anish-gorakavi-profile.md). Treat that document as factual context, not as copy that must appear verbatim. Do not invent repositories, metrics, rankings, deployments, customers, awards, email addresses, or professional claims. Keep prototypes and concepts labeled honestly.

The website is intentionally a single-page React experience that exports to ordinary static HTML, CSS, and JavaScript. It is designed to be copied to an Apache document root with `scp`; no Node.js process runs in production.

## Visual direction

The aesthetic combines:

- a near-black technical workstation background;
- neon blue borders, highlights, terminal details, and restrained glow;
- dark, flat controls rather than glossy Bootstrap-style buttons;
- selective 2000s hardware skeuomorphism in the hero terminal enclosure;
- modern neomorphic depth through subtle inset highlights and soft shadows;
- monospace metadata paired with large, direct sans-serif typography;
- burnt orange only inside the Bevo terminal, framed by neon blue window chrome.

The design should remain technical, personal, and readable. Avoid generic SaaS layouts, excessive gradients, skill bars, logo clouds, bright filled buttons, decorative AI imagery, and invented statistics.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | All page content, project data, React state, navigation, disclosures, and the ASCII Bevo frames. |
| `src/style.css` | The complete visual system, responsive layout, animations, and reduced-motion behavior. |
| `src/main.jsx` | React entry point. It hydrates server-rendered markup when present and otherwise mounts normally during development. |
| `index.html` | Development HTML shell and document metadata. |
| `scripts/build.mjs` | Custom static-export pipeline. It bundles the browser code, renders `App` to HTML, rewrites asset paths, and copies the favicon. |
| `public/favicon.svg` | Site-specific `AG_` favicon. |
| `README.md` | Short development and Apache deployment instructions. |
| `dist/` | Generated production export. Never edit it directly. Rebuild it with `npm run build`. |
| `output/pdf/` | Conversation transcript artifacts. These are not part of the website export. |

## Technology and rendering model

The project uses React 19, ReactDOM, Vite, and esbuild. It deliberately avoids routers, UI component libraries, databases, APIs, and runtime services.

The production build is more than a normal client-only Vite build:

1. esbuild bundles `src/main.jsx` and imported CSS into `dist/assets/site.js` and `dist/assets/site.css`.
2. esbuild creates a temporary Node-compatible bundle of `src/App.jsx` at `.build/app.mjs`.
3. `renderToString` pre-renders the React tree into the root element in `index.html`.
4. The development script reference is replaced with a relative production asset path.
5. A relative stylesheet link is inserted and the favicon is copied.

This produces readable HTML before JavaScript loads while preserving interactive hydration. Relative `./assets/...` URLs allow deployment at either an Apache domain root or a subdirectory.

## Current page structure

The single page contains these surfaces, in order:

1. Header navigation and contact link.
2. Hero with name, positioning, calls to action, and a hardware-like terminal visualization.
3. Interest strip.
4. Selected Work with category filters and expandable project notes.
5. About section.
6. Academic Goals & Successes disclosure with the animated ASCII Bevo terminal.
7. Experience / journey rows.
8. Publication section with a CSS-rendered book cover and Amazon link.
9. LinkedIn, GitHub, and email contact section and footer.

Navigation is intentionally lightweight and anchor-based. There are no separate routes.

## Content model

The `projects` array at the top of `src/App.jsx` controls the six project cards. Each item includes:

- `id`: visible two-digit index;
- `type`: accuracy label such as `OPEN SOURCE`, `CONCEPT`, or `PROOF OF CONCEPT`;
- `name` and `description`;
- `tags`;
- `category`: must match one of the filter labels;
- `glyph`: small text symbol used as the project icon;
- `detail`: expandable project notes.

When adding a project, update the `All work` count shown in the filter control. Preserve honest lifecycle labels. Add external links only when a verified URL is available.

The only verified outbound links currently used are:

- LinkedIn: `https://www.linkedin.com/in/anish-gorakavi-0a3390104`
- GitHub: `https://github.com/anishgorakavi/`
- Email: `mailto:anish.gorakavi@my.utexas.edu`
- Amazon book listing: `https://www.amazon.com/dp/B0FH1SCD16`

Do not reintroduce the removed sentence about growing roses. Keep the `AG` monogram capitalized everywhere.

## Important custom components

### Hero terminal

The right side of the hero is built entirely with semantic HTML and CSS. It includes a system map connecting cybersecurity, artificial intelligence, and neuroscience. It is decorative except for its accessible descriptive label.

Keep its effects restrained. The enclosure may retain depth and hardware details, but primary actions should remain flat, dark, and neon-edged.

### Academic Goals & Successes

`AcademicSection` uses a native `<details>` element so the copy works without custom disclosure state. The Bevo animation has separate React state only for pause/resume.

The section includes the user's supplied academic goals verbatim in substance. If editing it, preserve the emphasis on:

- UT Austin's CS community;
- systems, cybersecurity, networking, and computing + neuroscience;
- data structures and algorithms;
- understanding the computing stack from algorithms through hardware;
- research and ambitious technical projects.

### ASCII Bevo

`bevoFrames` contains four fixed-width ASCII frames. Bevo faces the viewer and runs forward in place. The illusion comes from alternating leg positions and a subtle vertical bounce.

Constraints for future changes:

- keep Bevo horizontally centered;
- do not translate the character left or right;
- retain recognizable wide Longhorn horns, head, muzzle, body, and front legs;
- keep the character and terminal text burnt orange;
- keep the terminal border, header divider, footer divider, and subtle outer glow neon blue;
- keep the motion playful and quiet;
- preserve the pause/resume button;
- preserve the `prefers-reduced-motion` fallback, which freezes the first frame and hides the pause button.

### Book cover

The book is CSS-rendered and links to Amazon. Its visual language comes from the user-supplied reference:

- dark navy cover;
- cyan grid and scanline texture;
- large glowing `CYBER ESSENTIALS` title;
- monospace system labels;
- a blinking neon cursor after `for teenagers`;
- a narrow page edge, perspective transform, and shadow for depth.

Both the cover and the `View on Amazon` button point to the verified Amazon URL. Preserve useful focus states and the new-tab accessibility label.

## Interaction and accessibility requirements

- The skip link must remain functional.
- Every interactive control needs a visible keyboard focus state.
- Project filters use `aria-pressed` and must be keyboard operable.
- Project notes and academic goals use native `<details>` / `<summary>` behavior.
- The mobile menu exposes `aria-expanded` and targets `#navigation`.
- Bevo's pause button exposes its state through `aria-pressed` and switches its accessible label.
- Decorative symbols should remain `aria-hidden` where appropriate.
- The page must remain usable at a 390-pixel viewport without horizontal overflow.
- Respect `prefers-reduced-motion` for every animation and transition.
- Keep body copy comfortably readable; do not shrink important text to create space.

## Styling guidance

`src/style.css` is currently a compact single stylesheet written in layers. Later rules intentionally override earlier foundation rules for the book, dark neon controls, and academic terminal.

Before refactoring, compare the computed styles and screenshots at desktop and mobile sizes. A cleanup that merely removes apparent duplication can silently restore the older glossy button treatment or change the custom book geometry.

The primary palette is approximately:

- page background: `#080c13`;
- dark surfaces: `#09121e` to `#151e2b`;
- neon blue: `#389fff` / `#39baff`;
- bright cyan: `#78e7ff`;
- body copy: `#e7edf7`;
- muted copy: `#8b98ac`;
- Bevo orange: `#ff9d48` / `#ffac5e`.

Buttons should use dark fills, thin blue borders, and a glow that appears mainly on hover or focus. Do not restore bright blue gradient fills or beveled button chrome.

## Development workflow

Install dependencies:

```sh
npm ci
```

Start the development server:

```sh
npm run dev
```

Create the production export:

```sh
npm run build
```

Preview the export:

```sh
npm run preview
```

The project requires Node.js 20.19+ or 22.12+.

## Verification checklist

After any meaningful change:

1. Run `npm run build` and require a successful static export.
2. Load the production preview rather than relying only on the development server.
3. Check the browser console for runtime errors.
4. Verify the hero, project filtering, project disclosures, academic disclosure, Bevo pause/resume, mobile menu, Amazon links, LinkedIn links, and back-to-top link.
5. Test at a normal desktop viewport and at 390 x 844.
6. Confirm `document.documentElement.scrollWidth` does not exceed `window.innerWidth` on mobile.
7. Test keyboard activation and visible focus for buttons, links, and summary elements.
8. Check reduced-motion behavior.
9. Inspect `dist/index.html` to ensure meaningful content is pre-rendered and all local asset references resolve.

There is no unit-test suite. Browser behavior, accessibility state, static asset resolution, and visual inspection are the meaningful checks for this project.

## Apache deployment

Deploy the contents of `dist/`, not the directory itself:

```sh
scp -r dist/. username@server:/var/www/html/
```

No rewrite rules, environment variables, database, Node.js server, CDN, or server-side runtime are required. If deploying into a subdirectory, retain the relative asset paths produced by the custom build script.

## Safe workflow for future coding agents

1. Read this file, `README.md`, `anish-gorakavi-profile.md`, `src/App.jsx`, `src/style.css`, and `scripts/build.mjs` before editing.
2. Check the worktree before making changes. Preserve user work and unrelated files.
3. Edit source files only. Do not patch generated files in `dist/`.
4. Keep facts traceable to the profile document or a user-supplied verified URL.
5. Make the smallest coherent change that satisfies the request and carries the visual language through desktop, mobile, hover, focus, and reduced-motion states.
6. Rebuild and visually verify the result.
7. Leave `dist/` ready to upload when the task changes the website.

## Known limitations and sensible future improvements

- The stylesheet is intentionally compact but difficult to maintain. A future refactor could split it into clearly named sections or files, provided computed styles remain unchanged.
- Most portfolio content is embedded directly in `App.jsx`. If the project list grows substantially, move content to a local data module while keeping the static-rendering path dependency-free.
- Project repository, demo, and article links are absent because verified URLs were not provided. GitHub and email were supplied by Anish and are included in the contact section and footer.
- The page is a single route. Add routes only when content depth justifies them and confirm Apache deployment behavior before changing the export model.
- The current font stack uses system fonts to avoid external network dependencies and layout shifts.

The site's strongest quality is the combination of factual restraint, technical detail, and a specific visual personality. Preserve all three.
