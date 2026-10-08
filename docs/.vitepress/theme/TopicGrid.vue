<script setup lang="ts">
import { withBase } from 'vitepress';

interface Topic {
  slug: string;
  title: string;
  text: string;
  icon: string;
}

const icons = import.meta.glob<string>('./icons/*.svg', { query: '?raw', import: 'default', eager: true });
const svg = (name: string): string => icons[`./icons/${name}.svg`] ?? '';

const groups: { name: string; topics: Topic[] }[] = [
  {
    name: 'El lenguaje',
    topics: [
      { slug: '01-fundamentos', title: 'Fundamentos', text: 'Tipos básicos, inferencia, any, unknown y never.', icon: 'type' },
      { slug: '02-uniones-narrowing', title: 'Uniones y narrowing', text: 'Literales, typeof, in y uniones discriminadas.', icon: 'git-branch' },
      { slug: '03-objetos', title: 'Objetos', text: 'interface, type, opcionales, readonly, Record, as const.', icon: 'braces' },
      { slug: '04-arrays', title: 'Arrays', text: 'Tipado de listas y métodos que mutan o no.', icon: 'list-tree' },
      { slug: '05-funciones', title: 'Funciones', text: 'Firmas, parámetros opcionales y callbacks.', icon: 'function-square' },
      { slug: '06-null-undefined', title: 'null y undefined', text: '?., ??, narrowing y validar unknown.', icon: 'shield-check' },
      { slug: '07-modulos', title: 'Módulos', text: 'import, export e import type.', icon: 'package' },
      { slug: '08-genericos', title: 'Genéricos', text: 'Tipos con hueco: Promise<T>, useState<T>.', icon: 'shapes' },
      { slug: '09-utility-types', title: 'Utility types', text: 'Partial, Pick, Omit, Readonly y compañía.', icon: 'wrench' },
      { slug: '10-clases', title: 'Clases', text: 'Lo justo: campos, constructor y privacidad.', icon: 'box' },
    ],
  },
  {
    name: 'En el navegador',
    topics: [
      { slug: '11-asincronia', title: 'Asincronía', text: 'Promise<T>, async/await y fetch tipado.', icon: 'timer' },
      { slug: '12-dom', title: 'DOM tipado', text: 'querySelector, eventos y formularios.', icon: 'mouse-pointer-click' },
    ],
  },
  {
    name: 'Oficio',
    topics: [
      { slug: '13-clean-code', title: 'Clean code', text: 'Las reglas del curso, juntas y razonadas.', icon: 'square-check' },
      { slug: '14-errores', title: 'Traductor de errores', text: 'Mensaje del compilador, causa y arreglo.', icon: 'bug' },
      { slug: '15-react', title: 'Puente a React', text: 'Props, eventos y useState con tipos.', icon: 'atom' },
    ],
  },
];

// Temas redactados; un tema nuevo sin redactar se muestra atenuado.
const ready = new Set<string>(groups.flatMap((g) => g.topics.map((t) => t.slug)));
</script>

<template>
  <div class="tg">
    <section v-for="group in groups" :key="group.name" class="tg-group">
      <h2 class="tg-title">{{ group.name }}</h2>
      <div class="tg-grid">
        <a
          v-for="t in group.topics"
          :key="t.slug"
          class="tg-card"
          :class="{ 'tg-soon': !ready.has(t.slug) }"
          :href="withBase(`/guia/${t.slug}`)"
        >
          <span class="tg-icon" v-html="svg(t.icon)" />
          <span class="tg-body">
            <span class="tg-name">
              {{ t.title }}
              <span v-if="!ready.has(t.slug)" class="tg-badge">En preparación</span>
            </span>
            <span class="tg-text">{{ t.text }}</span>
          </span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tg { margin-top: 8px; }
.tg-group + .tg-group { margin-top: 36px; }
.tg-title {
  margin: 0 0 14px !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: 13px !important;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}
.tg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}
.tg-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none !important;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.tg-card:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 2px 10px rgba(49, 120, 198, 0.12);
}
.tg-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.tg-icon :deep(svg) { width: 20px; height: 20px; stroke-width: 1.75; }
.tg-soon { opacity: 0.55; }
.tg-soon:hover { opacity: 0.8; }
.tg-badge {
  white-space: nowrap;
  display: inline-block;
  margin-left: 6px;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  vertical-align: 1px;
}
.tg-body { display: flex; flex-direction: column; gap: 3px; }
.tg-name { font-weight: 600; color: var(--vp-c-text-1); }
.tg-text { font-size: 13.5px; line-height: 1.45; color: var(--vp-c-text-2); }
</style>
