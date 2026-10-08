# Ejercicios · Objetos

Repasa antes: [Objetos](/guia/03-objetos). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Ficha de una receta <span class="wk-level l1">básico</span>

Una web de recetas guarda de cada una: el título, los minutos que lleva, si es vegetariana y, **opcionalmente**, una lista de etiquetas.

- Crea la interfaz `Recipe` con `title`, `minutes`, `vegetarian` y `tags` (opcional).
- Escribe `summary(recipe: Recipe): string`, que devuelva por ejemplo `Gazpacho · 15 min · vegetariana · fría, verano`. Si no es vegetariana, esa parte no aparece. Si no tiene etiquetas, tampoco.

```ts twoslash playground
// Tu interfaz Recipe aquí

function summary(recipe: any): string {
  // Tu código aquí (cambia any por Recipe)
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('receta completa', summary({ title: 'Gazpacho', minutes: 15, vegetarian: true, tags: ['fría', 'verano'] }) === 'Gazpacho · 15 min · vegetariana · fría, verano');
check('sin etiquetas', summary({ title: 'Tortilla', minutes: 30, vegetarian: true }) === 'Tortilla · 30 min · vegetariana');
check('no vegetariana', summary({ title: 'Paella', minutes: 50, vegetarian: false, tags: ['arroz'] }) === 'Paella · 50 min · arroz');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Ve metiendo las partes en un array y únelas al final con `parts.join(' · ')`. Como `tags` es opcional, su tipo es `string[] | undefined`: compruébalo antes de usarlo. Las etiquetas se unen con `tags.join(', ')`.
:::

::: details Solución
```ts twoslash run
interface Recipe {
  title: string;
  minutes: number;
  vegetarian: boolean;
  tags?: string[];
}

function summary(recipe: Recipe): string {
  const parts = [recipe.title, `${recipe.minutes} min`];
  if (recipe.vegetarian) {
    parts.push('vegetariana');
  }
  if (recipe.tags !== undefined && recipe.tags.length > 0) {
    parts.push(recipe.tags.join(', '));
  }
  return parts.join(' · ');
}

check('receta completa', summary({ title: 'Gazpacho', minutes: 15, vegetarian: true, tags: ['fría', 'verano'] }) === 'Gazpacho · 15 min · vegetariana · fría, verano');
check('sin etiquetas', summary({ title: 'Tortilla', minutes: 30, vegetarian: true }) === 'Tortilla · 30 min · vegetariana');
check('no vegetariana', summary({ title: 'Paella', minutes: 50, vegetarian: false, tags: ['arroz'] }) === 'Paella · 50 min · arroz');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

`parts` es un array local creado dentro de la función: añadirle elementos con `push` no modifica nada de fuera.
:::

## 2. Horario de un gimnasio <span class="wk-level l2">medio</span>

Un gimnasio guarda cuántas horas abre cada día de la semana, de lunes a viernes.

- Crea el tipo `Day` con `'mon' | 'tue' | 'wed' | 'thu' | 'fri'`.
- Anota `schedule` con `Record` para que **falte un día o sobre uno** sea un error.
- Escribe `totalHours(schedule)`, que sume las horas de todos los días.

```ts twoslash playground
// Tu tipo Day aquí

const schedule = {
  mon: 12,
  tue: 12,
  wed: 10,
  thu: 12,
  fri: 8,
};

function totalHours(week: any): number {
  // Tu código aquí (cambia any por el tipo correcto)
  return 0;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('el total de la semana es 54', totalHours(schedule) === 54);
check('un horario de 1 hora diaria suma 5', totalHours({ mon: 1, tue: 1, wed: 1, thu: 1, fri: 1 }) === 5);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`const schedule: Record<Day, number> = { ... }`. Para sumar: `Object.values(week)` da un array con las horas.
:::

::: details Solución
```ts twoslash run
type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

const schedule: Record<Day, number> = {
  mon: 12,
  tue: 12,
  wed: 10,
  thu: 12,
  fri: 8,
};

function totalHours(week: Record<Day, number>): number {
  return Object.values(week).reduce((acc, hours) => acc + hours, 0);
}

check('el total de la semana es 54', totalHours(schedule) === 54);
check('un horario de 1 hora diaria suma 5', totalHours({ mon: 1, tue: 1, wed: 1, thu: 1, fri: 1 }) === 5);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Prueba a borrar `fri` del objeto o a añadir `sat`: los dos casos son ahora un error.
:::

## 3. Niveles de un curso <span class="wk-level l3">reto</span>

Una academia tiene tres niveles, en este orden: `'basic'`, `'medium'` y `'advanced'`. Se quiere **una sola lista** que sirva para pintar un desplegable y, a la vez, para obtener el tipo.

- Declara `LEVELS` con `as const`.
- Obtén de ella el tipo `Level` (sin volver a escribir los tres textos).
- Escribe `nextLevel(level: Level): Level`, que devuelva el siguiente nivel. Del último no se pasa: `'advanced'` devuelve `'advanced'`.

```ts twoslash playground
const LEVELS = ['basic', 'medium', 'advanced'];

// Tu tipo Level aquí

function nextLevel(level: string): string {
  // Tu código aquí (cambia los dos string por Level)
  return level;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('después de basic va medium', nextLevel('basic') === 'medium');
check('después de medium va advanced', nextLevel('medium') === 'advanced');
check('advanced se queda en advanced', nextLevel('advanced') === 'advanced');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
El tipo de cualquier elemento de la lista es `(typeof LEVELS)[number]` (ver [as const](/guia/03-objetos#as-const-valores-literales-y-de-solo-lectura)). Para el siguiente: busca la posición con `indexOf` y lee la siguiente con `LEVELS[i + 1]`, que puede no existir.
:::

::: details Solución
```ts twoslash run
const LEVELS = ['basic', 'medium', 'advanced'] as const;

type Level = (typeof LEVELS)[number];

function nextLevel(level: Level): Level {
  const index = LEVELS.indexOf(level);
  return LEVELS[index + 1] ?? level;
}

check('después de basic va medium', nextLevel('basic') === 'medium');
check('después de medium va advanced', nextLevel('medium') === 'advanced');
check('advanced se queda en advanced', nextLevel('advanced') === 'advanced');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

`LEVELS[index + 1]` vale `undefined` cuando ya no hay siguiente, y el `??` lo cambia por el nivel actual. Si mañana se añade `'expert'` a la lista, el tipo `Level` lo incluye solo.
:::
