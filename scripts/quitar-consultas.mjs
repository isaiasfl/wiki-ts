// Sustituye cada consulta `^?` de los bloques twoslash por un comentario fijo con el
// tipo que calcula el compilador. Así el tipo se lee sin cajas flotantes que tapen código.
//   node scripts/quitar-consultas.mjs docs/guia/*.md
import { readFileSync, writeFileSync } from 'node:fs';
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
  let changed = 0;
  const out = md.replace(/```(ts|tsx) twoslash\n([\s\S]*?)```/g, (block, lang, code) => {
    if (!code.includes('^?')) return block;
    const texts = twoslash(code, lang).queries.map((q) => q.text.replace(/\s+/g, ' ').trim());
    let i = 0;
    const fixed = code.replace(/^([ \t]*)\/\/\s*\^\?[ \t]*$/gm, (_line, indent) => {
      const text = texts[i++] ?? '';
      changed++;
      return `${indent}// → ${text.replace(/^(const|let|var|type) /, '')}`;
    });
    return `\`\`\`${lang} twoslash\n${fixed}\`\`\``;
  });
  if (changed > 0) {
    writeFileSync(file, out);
    console.log(`${file}: ${changed} consultas convertidas`);
  }
}
