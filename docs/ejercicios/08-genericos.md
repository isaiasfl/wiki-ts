# Ejercicios · Genéricos

Repasa antes: [Genéricos](/guia/08-genericos). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Los últimos de una lista <span class="wk-level l1">básico</span>

`lastN` devuelve los `n` últimos elementos de una lista. Ahora usa `any`, y el resultado pierde el tipo: el editor ya no sabe que `lastSongs` son textos.

Conviértela en genérica para que sirva para cualquier lista **sin perder el tipo** de sus elementos.

Las comprobaciones ya dicen OK: el código funciona. El ejercicio consiste en que, al pasar el ratón por `lastSongs`, el editor diga `string[]` en lugar de `any[]`.

```ts twoslash playground
function lastN(list: any[], n: number): any[] {
  // Tu código aquí: hazla genérica
  return list.slice(-n);
}

const lastSongs = lastN(['Lucía', 'Mediterráneo', 'Penélope'], 2);
const lastScores = lastN([7, 9, 4, 10], 3);

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('las dos últimas canciones', lastSongs.join('|') === 'Mediterráneo|Penélope');
check('las tres últimas notas', lastScores.join('|') === '9|4|10');
check('pedir más de los que hay da la lista entera', lastN([1, 2], 5).length === 2);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`function lastN<T>(list: T[], n: number): T[]`. Cuando termines, pasa el ratón por `lastSongs`: debe decir `string[]`, no `any[]`.
:::

::: details Solución
```ts twoslash run
function lastN<T>(list: T[], n: number): T[] {
  return list.slice(-n);
}

const lastSongs = lastN(['Lucía', 'Mediterráneo', 'Penélope'], 2);
// → lastSongs: string[]
const lastScores = lastN([7, 9, 4, 10], 3);

check('las dos últimas canciones', lastSongs.join('|') === 'Mediterráneo|Penélope');
check('las tres últimas notas', lastScores.join('|') === '9|4|10');
check('pedir más de los que hay da la lista entera', lastN([1, 2], 5).length === 2);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

En la primera llamada `T` vale `string`; en la segunda, `number`. El código de la función es el mismo.
:::

## 2. Actualizar por id <span class="wk-level l2">medio</span>

Escribe `replaceById`: recibe una lista de **cualquier cosa que tenga un `id` numérico** y un elemento nuevo; devuelve una lista nueva en la que el elemento con ese mismo `id` se sustituye por el nuevo.

Debe servir tanto para tareas como para productos, y devolver el tipo completo (no solo `{ id: number }`).

```ts twoslash playground
interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

function replaceById(list: any[], updated: any): any[] {
  // Tu código aquí: genérico y con restricción
  return list;
}

const tasks: Task[] = [
  { id: 1, title: 'Repasar genéricos', done: false },
  { id: 2, title: 'Entregar práctica', done: false },
];
const products: Product[] = [{ id: 7, name: 'Teclado', price: 30 }];

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const newTasks = replaceById(tasks, { id: 2, title: 'Entregar práctica', done: true });
check('la tarea 2 queda hecha', newTasks[1]?.done === true);
check('la tarea 1 no cambia', newTasks[0] === tasks[0]);
check('sirve también para productos', replaceById(products, { id: 7, name: 'Teclado', price: 25 })[0]?.price === 25);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`<T extends { id: number }>`, y los dos parámetros y el retorno usan `T`. Dentro, un `map`.
:::

::: details Solución
```ts twoslash run
interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

function replaceById<T extends { id: number }>(list: T[], updated: T): T[] {
  return list.map((item) => (item.id === updated.id ? updated : item));
}

const tasks: Task[] = [
  { id: 1, title: 'Repasar genéricos', done: false },
  { id: 2, title: 'Entregar práctica', done: false },
];
const products: Product[] = [{ id: 7, name: 'Teclado', price: 30 }];

const newTasks = replaceById(tasks, { id: 2, title: 'Entregar práctica', done: true });
check('la tarea 2 queda hecha', newTasks[1]?.done === true);
check('la tarea 1 no cambia', newTasks[0] === tasks[0]);
check('sirve también para productos', replaceById(products, { id: 7, name: 'Teclado', price: 25 })[0]?.price === 25);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Como el segundo parámetro también es `T`, TypeScript comprueba que el elemento nuevo sea una tarea completa: si se te olvida `done`, avisa.
:::

## 3. Un resultado que puede fallar <span class="wk-level l3">reto</span>

En lugar de lanzar errores, algunas funciones devuelven un **resultado** que dice si todo fue bien:

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```

1. Escribe `parseAge(text: string): Result<number>`: correcto si el texto es un número entero entre 0 y 120; si no, un error con el mensaje `Edad no válida: TEXTO`.
2. Escribe la función genérica `unwrapOr(result, fallback)`: devuelve el valor si el resultado es correcto, o `fallback` si no. Debe servir para un `Result` de cualquier tipo.

```ts twoslash playground
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseAge(text: string): Result<number> {
  // Tu código aquí
  return { ok: false, error: '' };
}

function unwrapOr(result: any, fallback: any): any {
  // Tu código aquí: hazla genérica
  return fallback;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const good = parseAge('34');
check('"34" es correcto', good.ok && good.value === 34);
const bad = parseAge('treinta');
check('"treinta" da error con su mensaje', !bad.ok && bad.error === 'Edad no válida: treinta');
check('"-3" no es válida', !parseAge('-3').ok);
check('"4.5" no es válida', !parseAge('4.5').ok);
check('unwrapOr con un correcto', unwrapOr(parseAge('20'), 0) === 20);
check('unwrapOr con un error', unwrapOr(parseAge('x'), 18) === 18);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
- `Number.isInteger(age)` descarta `NaN` y decimales a la vez.
- `function unwrapOr<T>(result: Result<T>, fallback: T): T`. Dentro, comprueba `result.ok`: es una unión discriminada, y TypeScript sabe que `value` solo existe si `ok` es `true`.
:::

::: details Solución
```ts twoslash run
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseAge(text: string): Result<number> {
  const age = Number(text);
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    return { ok: false, error: `Edad no válida: ${text}` };
  }
  return { ok: true, value: age };
}

function unwrapOr<T>(result: Result<T>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

const good = parseAge('34');
check('"34" es correcto', good.ok && good.value === 34);
const bad = parseAge('treinta');
check('"treinta" da error con su mensaje', !bad.ok && bad.error === 'Edad no válida: treinta');
check('"-3" no es válida', !parseAge('-3').ok);
check('"4.5" no es válida', !parseAge('4.5').ok);
check('unwrapOr con un correcto', unwrapOr(parseAge('20'), 0) === 20);
check('unwrapOr con un error', unwrapOr(parseAge('x'), 18) === 18);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Prueba `unwrapOr(parseAge('20'), 'nadie')`: da error, porque el valor por defecto debe ser del mismo tipo que el resultado (`number`).
:::
