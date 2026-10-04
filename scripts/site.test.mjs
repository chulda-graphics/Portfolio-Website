import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = ['index.html', 'work/index.html', 'work/project-template/index.html', 'about/index.html', 'contact/index.html', '404.html'];
const read = file => readFileSync(join(root, file), 'utf8');

test('all required routes are independent static documents with accessible navigation', () => {
  for (const file of pages) {
    const html = read(file);
    assert.match(html, /<html lang="en"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, file);
    assert.match(html, /href="#main"/);
    assert.match(html, /id="main"/);
    assert.match(html, /<details class="mobile-menu"/);
    for (const route of ['/', '/work', '/about', '/contact']) assert.ok(html.includes(`href="${route}"`), `${file} missing ${route}`);
  }
});

test('every local link, script, stylesheet and font resolves in the static output', () => {
  for (const file of pages) {
    const html = read(file);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = match[1];
      assert.notEqual(url, '#', `${file} contains a placeholder link`);
      assert.ok(!url.startsWith('javascript:'), file);
      if (url.startsWith('#')) {
        assert.ok(html.includes(`id="${url.slice(1)}"`), `${file}: missing anchor ${url}`);
      } else if (url.startsWith('/')) {
        const path = join(root, url.split(/[?#]/)[0]);
        assert.ok(existsSync(path) || existsSync(join(path, 'index.html')), `${file}: unresolved ${url}`);
      }
    }
  }
  for (const file of readdirSync(join(root, '_astro')).filter(file => file.endsWith('.css'))) {
    for (const match of readFileSync(join(root, '_astro', file), 'utf8').matchAll(/url\(([^)]+)\)/g)) {
      const asset = match[1].replaceAll(/['"]/g, '');
      if (asset.startsWith('/')) assert.ok(existsSync(join(root, asset)), asset);
    }
  }
});

test('unprovided content stays explicit and contact does not submit anywhere', () => {
  assert.match(read('index.html'), /Reel and poster not supplied/);
  assert.ok(!read('index.html').includes('Play Reel'));
  assert.match(read('work/index.html'), /Project titles, films, roles and outcomes have not been supplied/);
  assert.match(read('work/project-template/index.html'), /name="robots" content="noindex, nofollow"/);
  assert.match(read('work/project-template/index.html'), /No results are claimed/);
  assert.match(read('contact/index.html'), /not accepting messages/);
  assert.ok(!read('contact/index.html').includes('mailto:'));
  assert.ok(!read('contact/index.html').includes('<form'));
});

test('static build has no server function entrypoint and preserves Pages headers', () => {
  assert.ok(!existsSync(join(root, '_worker.js')));
  assert.ok(!existsSync(join(root, 'server')));
  assert.ok(!existsSync(join(root, '.prerender')));
  assert.match(read('_headers'), /X-Content-Type-Options: nosniff/);
});

test('text and buttons meet contrast on the actual opaque surfaces', () => {
  const tokens = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
  const token = name => tokens.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`))[1];
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  for (const ink of ['ink', 'muted', 'caption', 'brand-ink']) for (const surface of ['canvas', 'surface', 'fill']) assert.ok(contrast(token(ink), token(surface)) >= 4.5, `${ink} on ${surface}`);
  assert.ok(contrast('#ffffff', token('brand')) >= 4.5, 'primary button');
});

test('production preview serves direct routes and a real 404', { skip: !process.env.PREVIEW_URL }, async () => {
  for (const route of ['/', '/work', '/work/project-template', '/about', '/contact']) {
    const response = await fetch(process.env.PREVIEW_URL + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /<h1\b/); // Content is rendered before client JavaScript.
    assert.match(html, /<details class="mobile-menu"/);
  }
  const missing = await fetch(process.env.PREVIEW_URL + '/this-page-does-not-exist');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /A little/);
});
