import { build } from 'esbuild';
import { mkdir, rm, readFile, writeFile, copyFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import React from 'react';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await mkdir('.build', { recursive: true });

// Browser assets hydrate the HTML exported below.
await build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  minify: true,
  outdir: 'dist/assets',
  entryNames: 'site',
  format: 'esm',
  define: { 'process.env.NODE_ENV': '"production"' },
  jsx: 'automatic',
});

// This temporary bundle renders the same React tree during the build.
await build({
  entryPoints: ['src/App.jsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: '.build/app.mjs',
  packages: 'external',
  jsx: 'automatic',
});

const { default: App } = await import('../.build/app.mjs');
const renderedApp = renderToString(React.createElement(App));
const template = await readFile('index.html', 'utf8');

// Relative paths support both an Apache domain root and a subdirectory.
const html = template
  .replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`)
  .replace(
    '<script type="module" src="/src/main.jsx"></script>',
    '<script type="module" src="./assets/site.js"></script>',
  )
  .replace('</head>', '<link rel="stylesheet" href="./assets/site.css"/></head>');

await writeFile('dist/index.html', html);
await copyFile('public/favicon.svg', 'dist/favicon.svg');
await copyFile('public/anish-gorakavi.png', 'dist/anish-gorakavi.png');
await copyFile('public/theme.js', 'dist/theme.js');
await mkdir('dist/thinklab', { recursive: true });
await copyFile('thinklab/index.html', 'dist/thinklab/index.html');
await copyFile('thinklab/style.css', 'dist/thinklab/style.css');
console.log('Static export ready in dist/ — portfolio, Think Lab, CSS, JS, images, and favicon.');
