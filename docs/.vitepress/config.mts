import { defineConfig } from 'vitepress';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import container from 'markdown-it-container';
import type MarkdownIt from 'markdown-it';
import LZString from 'lz-string';

const { compressToEncodedURIComponent } = LZString;

// Modo examen (WIKI_EXAM=1): sin ejercicios, soluciones ni enlaces al Playground.
const exam = process.env.WIKI_EXAM === '1';

// Bloques propios: ::: esencial / ::: ampliacion / ::: haz / ::: evita / ::: error
const customBlocks: Record<string, string> = {
  esencial: 'Esencial',
  ampliacion: 'Ampliación',
  haz: 'Haz',
  evita: 'Evita',
  error: 'Error típico',
};

// Bloques ```ts playground: añade debajo un enlace que abre el código en el
// Playground oficial de TypeScript (ESNext, estricto; JSX si es tsx).
function registerPlayground(md: MarkdownIt): void {
  const fence = md.renderer.rules.fence;
  if (fence === undefined) return;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const html = fence(tokens, idx, options, env, self);
    const token = tokens[idx];
    if (exam || token === undefined || !/\bplayground\b/.test(token.info)) return html;
    const tsx = token.info.startsWith('tsx');
    const query = tsx ? '?target=99&jsx=4' : '?target=99';
    const url = `https://www.typescriptlang.org/play/${query}#code/${compressToEncodedURIComponent(token.content.split('\n').filter((line) => !/^\s*\/\/ @\w+/.test(line)).join('\n'))}`;
    return `${html}<p class="wk-play"><a href="${url}" target="_blank" rel="noopener">Abrir en el Playground</a></p>\n`;
  };
}

function registerBlocks(md: MarkdownIt): void {
  registerPlayground(md);
  for (const [name, defaultTitle] of Object.entries(customBlocks)) {
    md.use(container, name, {
      render(tokens: { nesting: number; info: string }[], idx: number): string {
        const token = tokens[idx];
        if (token === undefined || token.nesting !== 1) return '</div>\n';
        const title = token.info.trim().slice(name.length).trim() || defaultTitle;
        return `<div class="wk-block wk-${name}"><p class="wk-block-title">${md.utils.escapeHtml(title)}</p>\n`;
      },
    });
  }
}

const topics = [
  ['01-fundamentos', '1. Fundamentos'],
  ['02-uniones-narrowing', '2. Uniones y narrowing'],
  ['03-objetos', '3. Objetos'],
  ['04-arrays', '4. Arrays'],
  ['05-funciones', '5. Funciones'],
  ['06-null-undefined', '6. null y undefined'],
  ['07-modulos', '7. Módulos'],
  ['08-genericos', '8. Genéricos'],
  ['09-utility-types', '9. Utility types'],
  ['10-clases', '10. Clases'],
  ['11-asincronia', '11. Asincronía'],
  ['12-dom', '12. DOM tipado'],
  ['13-clean-code', '13. Clean code en TypeScript'],
  ['14-errores', '14. Traductor de errores'],
  ['15-react', '15. Puente a React'],
] as const;

// Temas redactados. Uno nuevo que aún no esté listo aparece marcado como «pronto».
const ready = new Set<string>(topics.map(([slug]) => slug));

const exercises = topics.filter(([slug]) => slug !== '14-errores');

const item = ([slug, text]: readonly [string, string]) => ({
  text: ready.has(slug) ? text : `${text} <span class="wk-soon">pronto</span>`,
  link: `/guia/${slug}`,
});

const exerciseSidebar = [
  {
    text: 'Ejercicios',
    items: [
      { text: 'Cómo funcionan', link: '/ejercicios/' },
      ...exercises.map(([slug, text]) => ({ text, link: `/ejercicios/${slug}` })),
    ],
  },
  { text: 'Volver a la guía', items: [{ text: 'Cómo usar esta wiki', link: '/guia/00-como-usar' }] },
];

export default defineConfig({
  // GitHub Pages sirve la web en /wiki-ts/; en local o en un contenedor, en la raíz.
  base: process.env.WIKI_BASE ?? '/',
  lang: 'es-ES',
  srcExclude: exam ? ['ejercicios/**'] : [],
  vite: { define: { __WIKI_EXAM__: JSON.stringify(exam) } },
  title: 'Wiki TS',
  description: 'TypeScript para el módulo DWEC (Desarrollo Web en Entorno Cliente): de los primeros tipos a React.',
  cleanUrls: true,
  // Arranca en modo claro; el interruptor de la barra permite pasar a oscuro.
  // @ts-expect-error initialValue no figura en el tipo público, pero VitePress lo lee.
  appearance: { initialValue: 'light' },
  // La fecha de «Actualizado» sale del historial de git; la imagen Docker no lo tiene.
  lastUpdated: process.env.WIKI_NO_GIT !== '1',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${process.env.WIKI_BASE ?? '/'}logo.svg` }]],

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          // Misma base que un proyecto Vite + TypeScript actual
          compilerOptions: {
            target: 99,
            lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
            strict: true,
            jsx: 4,
            types: [],
          },
        },
      }),
    ],
    languages: ['ts', 'tsx', 'js', 'json', 'sh'],
    config: registerBlocks,
    container: {
      tipLabel: 'Consejo',
      warningLabel: 'Atención',
      dangerLabel: 'Peligro',
      infoLabel: 'Nota',
      detailsLabel: 'Detalles',
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Wiki TS',
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guía', link: '/guia/00-como-usar' },
      ...(exam ? [] : [{ text: 'Ejercicios', link: '/ejercicios/' }]),
      { text: 'Errores', link: '/guia/14-errores' },
      { text: 'Glosario', link: '/guia/glosario' },
    ],
    sidebar: {
      ...(exam ? {} : { '/ejercicios/': exerciseSidebar }),
      '/': [
        {
          text: 'Empezar',
          items: [
            { text: 'Cómo usar esta wiki', link: '/guia/00-como-usar' },
            { text: 'Glosario', link: '/guia/glosario' },
          ],
        },
        {
          text: 'El lenguaje',
          items: topics.slice(0, 10).map(item),
        },
        {
          text: 'En el navegador',
          items: topics.slice(10, 12).map(item),
        },
        {
          text: 'Oficio',
          items: topics.slice(12).map(item),
        },
      ],
    },
    outline: { level: [2, 3], label: 'En esta página' },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    lastUpdated: { text: 'Actualizado' },
    returnToTopLabel: 'Volver arriba',
    sidebarMenuLabel: 'Menú',
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Cambiar a tema claro',
    darkModeSwitchTitle: 'Cambiar a tema oscuro',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
          modal: {
            displayDetails: 'Mostrar detalles',
            resetButtonTitle: 'Borrar búsqueda',
            backButtonTitle: 'Cerrar',
            noResultsText: 'Sin resultados para',
            footer: { selectText: 'abrir', navigateText: 'moverse', closeText: 'cerrar' },
          },
        },
      },
    },
    footer: {
      message: 'Material del módulo Desarrollo Web en Entorno Cliente · 2.º DAW',
      copyright: 'Isaías Fernández Lozano · 2026',
    },
  },
});
