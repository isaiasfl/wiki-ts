// Muestra, por cada bloque `twoslash` de los .md indicados, los tipos de las
// consultas `^?` y los errores que produce. Sirve para revisar que el texto de la
// wiki dice lo mismo que el compilador.
//   node scripts/consultas.mjs docs/guia/04-arrays.md
import { readFileSync } from 'node:fs';
import { createTwoslasher } from 'twoslash';

const twoslash = createTwoslasher({
  compilerOptions: {
    target: 99,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    strict: true,
    jsx: 4,
    types: [],
  },
});

for (const file of process.argv.slice(2)) {
  const md = readFileSync(file, 'utf8');
  const blocks = [...md.matchAll(/```(ts|tsx) twoslash\n([\s\S]*?)```/g)];
  console.log(`\n# ${file} · ${blocks.length} bloques`);
  blocks.forEach(([, lang, code], i) => {
    try {
      const result = twoslash(code, lang);
      const expected = code.match(/\/\/ @errors: ([\d ]+)/)?.[1].trim().split(/\s+/) ?? [];
      const got = new Set(result.errors.map((e) => String(e.code)));
      const missing = expected.filter((c) => !got.has(c));
      if (missing.length > 0) console.log(`[${i + 1}] AVISO: se anuncia TS${missing.join(', TS')} pero no se produce`);
      const lines = [
        ...result.queries.map((q) => `  ^? ${q.text.replace(/\n/g, ' ')}`),
        ...result.errors.map((e) => `  TS${e.code}: ${e.text.split('\n')[0]}`),
      ];
      if (lines.length > 0) console.log(`[${i + 1}]\n${lines.join('\n')}`);
    } catch (error) {
      console.log(`[${i + 1}] FALLO: ${String(error).split('\n').slice(0, 6).join(' | ')}`);
    }
  });
}
