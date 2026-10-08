# Genéricos

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U4</span>
  <span><strong>En React</strong> useState&lt;T&gt;, respuestas de API, componentes reutilizables</span>
</div>

Piensa en una caja de envío con una etiqueta en blanco. La caja es siempre la misma, pero al usarla escribes en la etiqueta qué contiene: «libros», «tazas»... A partir de ahí, quien la reciba sabe qué hay dentro sin abrirla. Un genérico es eso: un tipo con una **etiqueta en blanco** (un **hueco**) que se rellena al usarlo.

Dicho de forma técnica, un **genérico** es un tipo con un **hueco** que se rellena al usarlo. Permite escribir una función, una interfaz o una clase que sirve para **cualquier tipo** sin perder la información de cuál es. Aunque escribas pocos genéricos propios, los **leerás constantemente**: `Array<T>`, `Promise<T>`, `Map<K, V>`, `useState<T>`.

## El problema que resuelven

::: esencial
Una función que devuelve el último elemento de una lista. Con un tipo fijo, sirve solo para ese tipo; con `any`, sirve para todo pero se pierde la información:

```ts twoslash
function lastNumber(list: number[]): number | undefined {
  return list.at(-1);
}

function lastAny(list: any[]): any {
  return list.at(-1);
}

const word = lastAny(['uno', 'dos']);
// → word: any
```

`word` es `any`: el editor ya no sabe que es un texto, y no avisará de ningún error al usarlo.
:::

## Funciones genéricas

::: esencial
Se declara un **parámetro de tipo** entre `<` y `>`, por convención `T`, y se usa como cualquier otro tipo:

```ts twoslash
function last<T>(list: T[]): T | undefined {
  return list.at(-1);
}

const word = last(['uno', 'dos']);
// → word: string | undefined
const score = last([7, 9, 4]);
// → score: number | undefined
```

Se lee: *«para cualquier tipo `T`, recibe una lista de `T` y devuelve un `T` o `undefined`»*.

Qué pasa en cada llamada:

1. `last(['uno', 'dos'])`: TypeScript ve que la lista es de textos, así que en esta llamada **`T` vale `string`**.
2. Sustituye `T` en la firma: recibe `string[]` y devuelve `string | undefined`.
3. En la llamada con números, `T` vale `number`, y el resultado es `number | undefined`.

`T` no es un tipo concreto: es un nombre provisional, como la `x` de una fórmula, que toma un valor distinto en cada llamada. TypeScript lo **deduce** a partir del argumento: no hace falta escribirlo al llamar.
:::

## Varios parámetros de tipo

::: esencial
Se pueden usar varios, separados por comas. Es habitual llamarlos por su papel: `K` para claves, `V` para valores.

```ts twoslash
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const entry = pair('Dune', 1965);
// → entry: [string, number]
```
:::

## Restricciones con `extends`

::: esencial
Con un `T` libre, dentro de la función no se puede hacer casi nada con los elementos: podrían ser textos, números, cualquier cosa. Si la función necesita leer `item.id`, TypeScript protesta, porque no todo tiene `id`.

La solución es poner una condición al hueco: `T extends { id: number }` se lee «`T` puede ser cualquier tipo, **siempre que tenga** un `id` numérico». Con esa garantía, dentro de la función ya se puede usar `item.id`. Y si alguien llama con algo que no tiene `id`, el error aparece en la llamada:

```ts twoslash
// @errors: 2322
function findById<T extends { id: number }>(list: T[], id: number): T | undefined {
  return list.find((item) => item.id === id);
}

const books = [{ id: 1, title: 'Dune' }];
const book = findById(books, 1);
// → book: { id: number; title: string; } | undefined

findById(['sin', 'id'], 1);
```

La función sirve para libros, socios o canciones: para cualquier cosa con un `id` numérico. Y devuelve el **tipo completo** del elemento, no solo `{ id: number }`.
:::

### `keyof`: restringir a las claves de un objeto

::: esencial
`keyof T` da los **nombres de las propiedades** de `T` como unión de textos. Para `{ title: string; seconds: number }`, `keyof` da `'title' | 'seconds'`.

Combinado con un genérico, permite funciones que reciben un objeto y **el nombre de una de sus propiedades**, de forma que TypeScript rechaza nombres que no existen. La función `pluck` saca una propiedad de cada elemento de una lista:

```ts twoslash
// @errors: 2345
function pluck<T, K extends keyof T>(list: T[], key: K): T[K][] {
  return list.map((item) => item[key]);
}

const songs = [
  { title: 'Mediterráneo', seconds: 207 },
  { title: 'La flaca', seconds: 263 },
];

const titles = pluck(songs, 'title');
// → titles: string[]
pluck(songs, 'artist');
```

Leyendo la firma por partes:

- `T`: el tipo de cada elemento (aquí, `{ title: string; seconds: number }`).
- `K extends keyof T`: el nombre de la propiedad, que tiene que ser una de las de `T` (`'title'` o `'seconds'`).
- `T[K]`: el **tipo de esa propiedad**. Para `'title'`, `string`. Por eso el resultado `T[K][]` es `string[]`.

Con `'artist'` da error porque no es una de las propiedades de las canciones.
:::

## Interfaces y tipos genéricos

::: esencial
Las interfaces y los alias también pueden tener huecos. Es la forma típica de describir respuestas de una API que siempre tienen la misma envoltura:

```ts twoslash
interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
}

interface Book {
  id: number;
  title: string;
}

declare const response: ApiResponse<Book[]>;
const firstTitle = response.data[0]?.title;
// → firstTitle: string
```
:::

Otro patrón muy útil: un **resultado** que puede ser correcto o fallido. Es una [unión discriminada](./02-uniones-narrowing#uniones-discriminadas) con un hueco: si `ok` es `true`, hay un `value` del tipo que se indique; si es `false`, hay un `error`. Quien llama comprueba `ok` y TypeScript sabe qué propiedad existe en cada rama:

```ts twoslash
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseAge(input: string): Result<number> {
  const age = Number(input);
  if (!Number.isInteger(age) || age < 0) {
    return { ok: false, error: `«${input}» no es una edad válida` };
  }
  return { ok: true, value: age };
}

const result = parseAge('42');
if (result.ok) {
  console.log(result.value + 1);
} else {
  console.log(result.error);
}
```

## Leer los genéricos de las librerías

::: esencial
La mayor parte del tiempo no escribirás genéricos: los **leerás** en los tipos de JavaScript y de React. Saber leerlos es lo importante.

| Tipo | Se lee | Ejemplo |
|---|---|---|
| `Array<T>` | Lista de `T` (igual que `T[]`) | `Array<Book>` |
| `Promise<T>` | Promesa que **acabará dando** un `T` | `Promise<Book[]>` |
| `Map<K, V>` | Diccionario de claves `K` a valores `V` | `Map<number, Member>` |
| `Set<T>` | Conjunto de `T` sin repetidos | `Set<string>` |
| `Record<K, V>` | Objeto con claves `K` y valores `V` | `Record<Genre, number>` |
| `useState<T>` | Estado de React de tipo `T` | `useState<Book[]>([])` |
:::

### Cuándo escribir el tipo al llamar

::: esencial
Normalmente TypeScript deduce `T`. Hay que escribirlo cuando el valor inicial **no basta** para deducir todos los casos posibles:

```ts twoslash
interface Book {
  id: number;
  title: string;
}
// ---cut---
const empty = new Map();
// → empty: Map<any, any>
const loans = new Map<number, Book>();
// → loans: Map<number, Book>
```

Un `Map` vacío no tiene de dónde deducir sus tipos. Lo mismo pasa en React con `useState(null)` cuando más adelante el estado será un objeto: se escribe `useState<Book | null>(null)`.
:::

## Ampliación

### Valores por defecto en parámetros de tipo

::: ampliacion
Un parámetro de tipo puede tener un valor por defecto, que se usa si no se indica otro:

```ts twoslash
interface Paginated<T, Meta = { page: number }> {
  items: T[];
  meta: Meta;
}

declare const page: Paginated<string>;
const meta = page.meta;
// → meta: { page: number; }
```
:::

### Genéricos que se restringen entre sí

::: ampliacion
Un parámetro de tipo puede depender de otro. Así se escribe, por ejemplo, una función que actualiza **una propiedad** de un objeto con un valor del tipo correcto:

```ts twoslash
// @errors: 2345
function update<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const book = { title: 'Dune', pages: 412 };
const longer = update(book, 'pages', 600);
const wrong = update(book, 'pages', 'seiscientas');
```

El tercer argumento debe tener el tipo de la propiedad elegida: `number` para `'pages'`. (`[key]: value` entre corchetes significa «la propiedad cuyo nombre está en la variable `key`».)
:::

### Cuándo no usar un genérico

::: ampliacion
Si el parámetro de tipo aparece **una sola vez** en la firma, no aporta nada: no relaciona entradas con salidas.

```ts
function log<T>(value: T): void { console.log(value); } // T no relaciona nada
function log(value: unknown): void { console.log(value); } // equivalente y más claro
```

Un genérico tiene sentido cuando **conecta** tipos: lo que entra con lo que sale, o un parámetro con otro.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Un genérico cuando la función sirve para varios tipos y el resultado depende del de entrada.

```ts
function first<T>(list: T[]): T | undefined {
  return list[0];
}
```
:::

::: evita
`any` para «hacerla genérica»: se pierde todo el tipado del resultado.

```ts
function first(list: any[]): any {
  return list[0];
}
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Una función para cualquier tipo | `function f<T>(x: T): T` |
| Que `T` tenga cierta forma | `<T extends { id: number }>` |
| Recibir el nombre de una propiedad | `<T, K extends keyof T>(obj: T, key: K)` |
| El tipo de una propiedad | `T[K]` |
| Una interfaz con hueco | `interface ApiResponse<T> { data: T }` |
| Indicar el tipo al llamar | `new Map<number, Book>()` · `useState<Book \| null>(null)` |

## Ver también

- [Utility types](./09-utility-types): genéricos que ya vienen con TypeScript.
- [Asincronía](./11-asincronia): `Promise<T>` en la práctica.
- [Puente a React](./15-react): `useState<T>`.
