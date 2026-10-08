// Comprueba los enlaces internos de la wiki ya construida (npm run build):
// que cada página exista y que cada #ancla apunte a un apartado real.
//   node scripts/enlaces.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const DIST = 'docs/.vitepress/dist';
const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'assets') walk(path);
    else if (entry.name.endsWith('.html')) pages.push(path);
  }
};
walk(DIST);

const idsOf = new Map();
const ids = (file) => {
  if (!idsOf.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsOf.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decodeURIComponent(m[1]))));
  }
  return idsOf.get(file);
};

let broken = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [path, hash] = href.split('#');
    let target = page;
    if (path) {
      const abs = path.startsWith('/') ? join(DIST, path) : resolve(dirname(page), path);
      target = [abs, `${abs}.html`, join(abs, 'index.html')].find((f) => existsSync(f) && f.endsWith('.html'));
      if (!target) {
        console.log(`${relative(DIST, page)}: página inexistente → ${href}`);
        broken++;
        continue;
      }
    }
    if (hash && !ids(target).has(decodeURIComponent(hash))) {
      console.log(`${relative(DIST, page)}: ancla inexistente → ${href}`);
      broken++;
    }
  }
}
console.log(broken === 0 ? `Enlaces correctos en ${pages.length} páginas.` : `${broken} enlaces rotos.`);
process.exitCode = broken === 0 ? 0 : 1;
