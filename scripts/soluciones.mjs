// Ejecuta las soluciones de los ejercicios (bloques ```ts ... run) con Node y
// comprueba que todas sus comprobaciones digan OK.
//   node scripts/soluciones.mjs                 -> todos los ejercicios
//   node scripts/soluciones.mjs docs/ejercicios/04-arrays.md
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = 'docs/ejercicios';
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f)).map((f) => join(dir, f));

const tmp = mkdtempSync(join(tmpdir(), 'wiki-sol-'));
let total = 0;
let failed = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const blocks = [...text.matchAll(/```ts[^\n]*\brun\b[^\n]*\n([\s\S]*?)```/g)].map((m) => m[1]);
  blocks.forEach((code, i) => {
    total += 1;
    const path = join(tmp, `s${total}.ts`);
    writeFileSync(path, code);
    let out = '';
    try {
      out = execFileSync('node', ['--no-warnings', path], { encoding: 'utf8', timeout: 15000 });
    } catch (error) {
      out = `${error.stdout ?? ''}\n${error.stderr ?? ''}\nFALLA (el programa terminó con error)`;
    }
    const oks = out.split('\n').filter((l) => l.startsWith('OK')).length;
    const bad = out.split('\n').filter((l) => l.startsWith('FALLA'));
    const ok = oks > 0 && bad.length === 0;
    if (!ok) failed += 1;
    console.log(`${ok ? 'bien ' : 'MAL  '} ${file} · solución ${i + 1} (${oks} OK)`);
    for (const line of bad) console.log(`      ${line}`);
  });
}

rmSync(tmp, { recursive: true, force: true });
console.log(`\n${total - failed}/${total} soluciones correctas.`);
process.exit(failed ? 1 : 0);
