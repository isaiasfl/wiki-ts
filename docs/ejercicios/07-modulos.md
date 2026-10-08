# Ejercicios · Módulos

Repasa antes: [Módulos](/guia/07-modulos). Cómo se hacen y se comprueban: [Ejercicios](./).

El Playground trabaja con un solo fichero, así que estos ejercicios son **de razonar**: se resuelven en papel o en tu proyecto de Vite, y se comparan con la solución.

## 1. ¿En qué capa va cada cosa? <span class="wk-level l1">básico</span>

Una aplicación de reservas de pistas de pádel tiene la estructura `types/`, `domain/`, `services/` y `ui/` (ver [Organizar un proyecto por capas](/guia/07-modulos#organizar-un-proyecto-por-capas)). ¿En qué carpeta pondrías cada pieza?

1. `interface Booking { id: number; court: number; start: Date; player: string }`
2. `function isOverlapping(a: Booking, b: Booking): boolean`
3. `async function fetchBookings(date: string): Promise<Booking[]>`
4. `function renderCalendar(bookings: Booking[], container: HTMLElement): void`
5. `function priceFor(booking: Booking): number`, que aplica la tarifa de tarde
6. `function saveDraft(booking: Booking): void`, que guarda en `localStorage`

::: details Solución
| Pieza | Capa | Por qué |
|---|---|---|
| 1. `Booking` | `types/` | Es una forma de datos que usan todas las capas |
| 2. `isOverlapping` | `domain/` | Regla del negocio: solo calcula, sin DOM ni red |
| 3. `fetchBookings` | `services/` | Habla con un servidor |
| 4. `renderCalendar` | `ui/` | Toca el DOM |
| 5. `priceFor` | `domain/` | Regla del negocio (las tarifas) |
| 6. `saveDraft` | `services/` | Guarda fuera del programa (`localStorage`) |

La pregunta que decide: **¿necesita el navegador o la red?** Si no, va en `domain/` y se puede probar sin nada más.
:::

## 2. Encuentra los errores de importación <span class="wk-level l2">medio</span>

Este proyecto usa la plantilla de Vite (`verbatimModuleSyntax` activado). Hay **cuatro** problemas en las importaciones de `main.ts`. Encuéntralos y escribe la versión correcta.

```ts
// src/types/booking.ts
export interface Booking { id: number; court: number; player: string }

// src/domain/bookings.ts
export function freeCourts(bookings: Booking[], total: number): number[] { /* ... */ }

// src/ui/render.ts
export default function renderList(items: string[]): void { /* ... */ }

// src/main.ts
import { Booking } from './types/Booking.ts';
import { freeCourts } from 'domain/bookings';
import { renderList } from './ui/render';
```

::: details Pista
Revisa en cada línea: ¿es un tipo?, ¿coinciden las mayúsculas del fichero?, ¿lleva extensión?, ¿la ruta empieza por `./`?, ¿la exportación es por defecto o con nombre?
:::

::: details Solución
```ts
// src/main.ts
import type { Booking } from './types/booking';
import { freeCourts } from './domain/bookings';
import renderList from './ui/render';
```

1. `Booking` es un **tipo**: con `verbatimModuleSyntax` hay que usar `import type`.
2. El fichero es `booking.ts`, en minúscula: `Booking.ts` funcionaría en Windows pero fallaría en Linux y en el servidor. Además, en Vite las rutas van **sin extensión**.
3. `'domain/bookings'` sin `./` se buscaría como un **paquete** de `node_modules`. Para un fichero propio, ruta relativa: `'./domain/bookings'`.
4. `renderList` se exporta **por defecto**, así que se importa sin llaves. (Mejor aún: cambiar el fichero a `export function renderList`, como se recomienda en el curso.)

Y un detalle más en `bookings.ts`: usa `Booking` pero no lo importa. Le falta `import type { Booking } from '../types/booking';`.
:::

## 3. Diseña tú los módulos <span class="wk-level l3">reto</span>

Vas a programar una **lista de la compra** con Vite: el usuario añade productos con su cantidad, los marca como comprados y la lista se guarda en `localStorage`. Además se muestra cuántos quedan por comprar.

Propón los ficheros del proyecto: para cada uno, su carpeta, su nombre y qué exporta (solo las firmas, sin el código).

::: details Una solución posible
```text
src/
├── main.ts                  ← lee lo guardado, pinta y conecta los eventos
├── types/
│   └── item.ts              ← export interface ShoppingItem { id; name; quantity; bought }
├── domain/
│   └── shopping-list.ts     ← export function addItem(list, name, quantity): ShoppingItem[]
│                              export function toggleBought(list, id): ShoppingItem[]
│                              export function pendingCount(list): number
├── services/
│   └── storage.ts           ← export function loadList(): ShoppingItem[]
│                              export function saveList(list: ShoppingItem[]): void
└── ui/
    └── render-list.ts       ← export function renderList(list, container): void
```

Lo importante no es acertar los nombres, sino que:

- Las funciones de `domain/` reciben la lista y **devuelven una nueva** (sin `push` ni DOM): se pueden probar solas.
- Solo `services/storage.ts` sabe que existe `localStorage`. Si mañana se guarda en un servidor, solo cambia ese fichero.
- `pendingCount` se **calcula**, no se guarda aparte.
:::
