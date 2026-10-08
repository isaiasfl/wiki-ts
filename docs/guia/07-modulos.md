# Módulos

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U1 · U4</span>
  <span><strong>En React</strong> un componente por fichero, servicios, tipos compartidos</span>
</div>

Un **módulo** es un fichero que decide qué comparte con el resto del proyecto. Lo que se **exporta** se puede importar desde otros ficheros; lo demás queda privado. Dividir el código en módulos permite que cada fichero tenga una sola responsabilidad y que el proyecto crezca sin convertirse en un único fichero enorme.

## `export` e `import`

::: esencial
Se exporta poniendo `export` delante de la declaración, y se importa por su nombre entre llaves:

```ts twoslash
// @filename: format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES');
}

export const LOAN_DAYS = 15;

// @filename: main.ts
import { formatDate, LOAN_DAYS } from './format';

console.log(formatDate(new Date()), LOAN_DAYS);
```

Sin `export`, una función o constante solo existe dentro de su fichero.
:::

::: info Nota
Los fragmentos con varios ficheros muestran cada uno con su nombre en un comentario (`// @filename: ...`). En un proyecto real, cada parte es un fichero distinto.
:::

## Exportación con nombre frente a por defecto

::: esencial
Un módulo puede tener, además, **una** exportación por defecto, que se importa sin llaves y con el nombre que quiera quien la importa:

```ts
// BookCard.ts
export default function BookCard() { /* ... */ }

// main.ts
import BookCard from './BookCard'; // sin llaves
import Card from './BookCard'; // también válido: el nombre lo elige quien importa
```

| | Con nombre | Por defecto |
|---|---|---|
| Cuántas por fichero | Las que quieras | Una |
| Al importar | `import { formatDate }` | `import formatDate` |
| Renombrar | Explícito: `import { formatDate as fmt }` | Libre, sin avisar |
| El editor puede autoimportar | Sí, de forma fiable | Peor |

En este curso se usan **exportaciones con nombre**: el nombre es el mismo en todo el proyecto y renombrar con el editor actualiza todos los usos.
:::

## `import type`

::: esencial
Los tipos desaparecen al compilar. Cuando importas **solo un tipo**, se indica con `import type`, y la línea entera se borra al generar JavaScript:

```ts twoslash
// @filename: types.ts
export interface Book {
  id: number;
  title: string;
}

// @filename: catalog.ts
import type { Book } from './types';

export const catalog: Book[] = [{ id: 1, title: 'Dune' }];
```

¿Por qué hace falta? Vite no analiza los tipos: simplemente borra lo que es de TypeScript y deja el resto. Si no le avisas de que `Book` es un tipo, intentaría importarlo como si fuera código real, y en ejecución no existe. Por eso, en proyectos Vite (que activan la opción `verbatimModuleSyntax`) es **obligatorio**. Si se olvida, error:
:::

```ts twoslash
// @errors: 1484
// @verbatimModuleSyntax: true
// @module: esnext
// @filename: types.ts
export interface Book {
  id: number;
  title: string;
}

// @filename: catalog.ts
// ---cut---
import { Book } from './types';

export const catalog: Book[] = [{ id: 1, title: 'Dune' }];
```

Si en la misma línea se importan valores y tipos, se marca cada tipo:

```ts
import { type Book, catalog } from './catalog';
```

## Rutas

::: esencial
| Ruta | Significa |
|---|---|
| `'./format'` | `format.ts` en **la misma carpeta** |
| `'../types/book'` | Sube una carpeta, entra en `types/`, fichero `book.ts` |
| `'./components'` | La carpeta `components/`: se carga su `index.ts` |
| `'react'` | Un paquete instalado en `node_modules` |

- En Vite, las rutas se escriben **sin extensión**: `'./format'`, no `'./format.ts'`.
- Para contar los `../`, cuenta cuántas carpetas tienes que subir desde **el fichero que importa**.
:::

::: error
`Cannot find module './types/Book'`: los nombres de fichero distinguen mayúsculas en Linux y en el servidor. `Book.ts` y `book.ts` son ficheros distintos, aunque en Windows funcione.
:::

## Organizar un proyecto por capas

::: esencial
Una estructura habitual separa **qué son los datos**, **qué se hace con ellos** y **cómo se muestran**:

```text
src/
├── main.ts              ← punto de entrada: conecta las piezas
├── types/               ← interfaces y tipos compartidos
│   └── book.ts
├── domain/              ← lógica pura: cálculos y reglas, sin DOM ni red
│   └── loans.ts
├── services/            ← comunicación con el exterior: API, localStorage
│   └── catalog-api.ts
└── ui/                  ← todo lo que toca el DOM
    └── render-books.ts
```

<DiagramLayers />

La regla que hace que funcione: **las dependencias van hacia dentro**. `ui/` puede importar de `domain/`, pero `domain/` no importa nada de `ui/` ni de `services/`. Dicho de otra forma: las reglas del negocio (cuántos días dura un préstamo, cómo se calcula un total) no saben nada de botones ni de servidores. Así la lógica se puede probar sin navegador y la interfaz se puede cambiar sin tocar las reglas.
:::

## Reexportar

::: esencial
Un fichero puede reunir y volver a exportar lo de otros. Es útil para ofrecer un único punto de entrada a una carpeta:

```ts
// ui/index.ts
export { renderBooks } from './render-books';
export { renderLoans } from './render-loans';

// main.ts
import { renderBooks, renderLoans } from './ui';
```
:::

::: warning Atención
No abuses de estos ficheros índice. Si todo se importa a través de ellos, es fácil acabar con dos ficheros que se importan **mutuamente** (A importa de B y B importa de A). Eso se llama *dependencia circular* y provoca errores raros, como valores que aparecen como `undefined` sin motivo aparente. Úsalos solo como «puerta» pública de una carpeta.
:::

## Ampliación

### Importaciones con efecto

::: ampliacion
Algunas importaciones no traen nombres: solo **ejecutan** el módulo. Vite las usa para cargar CSS:

```ts
import './style.css';
```
:::

### Importación dinámica

::: ampliacion
`import()` carga un módulo **cuando se necesita** y devuelve una promesa. Vite lo separa en un fichero aparte, así que no pesa en la carga inicial:

```ts
const button = document.querySelector('#export');
button?.addEventListener('click', async () => {
  const { exportToCsv } = await import('./export-csv');
  exportToCsv();
});
```

Es la base de la carga diferida de páginas en las aplicaciones grandes.
:::

### Variables de entorno en Vite

::: ampliacion
Vite expone en `import.meta.env` las variables que empiezan por `VITE_`, definidas en un fichero `.env`:

```text
# .env
VITE_API_URL=https://api.example.com
```

```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

Todo lo que se expone así **acaba en el JavaScript que descarga el navegador**: nunca pongas ahí contraseñas ni claves privadas.
:::

### Alias de rutas

::: ampliacion
Para evitar cadenas como `'../../../types/book'`, se puede definir un alias. Hace falta configurarlo en dos sitios, porque TypeScript y Vite resuelven las rutas por separado:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
```

Después: `import type { Book } from '@/types/book';`
:::

## Haz y evita

<div class="wk-pair">

::: haz
Exportaciones con nombre y `import type` para los tipos.

```ts
import type { Book } from './types/book';
import { formatDate } from './format';
```
:::

::: evita
Mezclar lógica, acceso a datos y DOM en el mismo fichero.

```ts
// main.ts con fetch, cálculos y innerHTML
// en 300 líneas
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Compartir algo | `export function ...` · `export const ...` |
| Usarlo en otro fichero | `import { nombre } from './fichero'` |
| Importar solo un tipo | `import type { Tipo } from './fichero'` |
| Valores y tipos juntos | `import { type Tipo, valor } from './fichero'` |
| Cargar CSS | `import './style.css'` |
| Cargar un módulo bajo demanda | `await import('./modulo')` |

<PracticeLink topic="07-modulos" />

## Ver también

- [Clean code en TypeScript](./13-clean-code): organización y responsabilidades.
- [Traductor de errores](./14-errores#nombres-modulos-y-configuracion): errores de rutas y de `import type`.
