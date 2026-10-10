# Anish Gorakavi — personal website

React portfolio with a neon-blue workstation aesthetic. Content lives in `src/App.jsx`; styling lives in `src/style.css`.

## Develop

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

## Export for Apache

```sh
npm run build
```

Upload **the contents of `dist/`** to your Apache document root or a subdirectory. The export includes pre-rendered `index.html`, `assets/site.css`, `assets/site.js`, and `favicon.svg`. All assets use relative paths, so root and subdirectory deployments work. No Node server, database, CDN, API, or Apache rewrite rules are required. The complete profile content is in the HTML; React hydrates the project filters and mobile menu.

Example (replace the destination):

```sh
scp -r dist/. username@server:/var/www/html/
```

Preview the production export locally:

```sh
npm run preview
```

Contact links use the supplied LinkedIn profile, GitHub profile (https://github.com/anishgorakavi/), and email (anish.gorakavi@my.utexas.edu). The book links to the supplied Amazon listing. No project repository URLs were provided, so none are invented. Project notes distinguish concepts, proofs of concept, and historical work. Add verified links in `src/App.jsx` when available. The original profile Markdown is not included in the export.
