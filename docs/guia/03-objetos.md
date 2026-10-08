# Objetos

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U1 §8 · U3</span>
  <span><strong>En React</strong> props, estado, respuestas de API</span>
</div>

Un objeto agrupa varios datos relacionados bajo un mismo nombre: un libro tiene título, autor y número de páginas. TypeScript permite describir **la forma** de esos objetos para que el editor avise cuando falta una propiedad, sobra otra o un valor no tiene el tipo esperado.

La idea que recorre todo el tema:

> Un tipo de objeto es un **contrato**: dice qué propiedades debe tener un objeto y de qué tipo es cada una. Se comprueba mientras escribes y **desaparece** al ejecutar.

## Inferencia en objetos

::: esencial
Si creas un objeto directamente, TypeScript deduce su forma sin que escribas nada:

```ts twoslash
// @errors: 2322
const book = {
  title: 'Cien años de soledad',
  author: 'Gabriel García Márquez',
  pages: 471,
};

book.pages = '471';
```

La forma deducida es `{ title: string; author: string; pages: number }`. A partir de ahí, `book.pages` solo admite números.
:::

La inferencia basta para un objeto suelto. En cuanto la misma forma se repite (una lista de libros, una función que recibe un libro), conviene **ponerle nombre** con `interface` o `type`.

## `interface`

::: esencial
`interface` da nombre a la forma de un objeto. Por convención, el nombre empieza en mayúscula.

```ts twoslash
interface Book {
  title: string;
  author: string;
  pages: number;
}

const novel: Book = {
  title: 'Rayuela',
  author: 'Julio Cortázar',
  pages: 600,
};
```

Las propiedades se separan con **punto y coma** (o con salto de línea), no con comas como en un objeto.
:::

Al anotar `const novel: Book`, TypeScript comprueba que el objeto cumple el contrato completo:

```ts twoslash
// @errors: 2741
interface Book {
  title: string;
  author: string;
  pages: number;
}
// ---cut---
const incomplete: Book = {
  title: 'Ficciones',
  author: 'Jorge Luis Borges',
};
```

## `type` para objetos

::: esencial
`type` crea un **alias**: un nombre para cualquier tipo. Para un objeto, el resultado es equivalente a una `interface`:

```ts twoslash
type Member = {
  id: number;
  name: string;
  email: string;
};
```
:::

La diferencia real está en lo que puede nombrar cada uno:

| | `interface` | `type` |
|---|---|---|
| Forma de un objeto | Sí | Sí |
| Unión de opciones: `'a' \| 'b'` | No | Sí |
| Nombre para un tipo básico: `type Id = number` | No | Sí |
| Ampliar otro tipo | `extends` | intersección `&` |
| Declararse dos veces y fusionarse | Sí | No (error) |

::: tip Criterio de este curso
`interface` para describir objetos; `type` para todo lo demás (uniones, alias, combinaciones). Es la convención más extendida y la que encontrarás en la mayoría de proyectos. Lo importante es ser **coherente** dentro de un mismo proyecto.
:::

## Propiedades opcionales

::: esencial
Un signo `?` detrás del nombre indica que la propiedad **puede no estar**:

```ts twoslash
interface Task {
  id: number;
  title: string;
  dueDate?: string;
}

const today: Task = { id: 1, title: 'Repasar Record' };
const withDate: Task = { id: 2, title: 'Entregar práctica', dueDate: '2026-10-16' };

const due = withDate.dueDate;
// → due: string | undefined
```

Al leer una propiedad opcional, su tipo incluye `undefined`. Hay que tratar ese caso antes de usarla: ver [null y undefined](./06-null-undefined).
:::

::: warning Atención
Opcional no es lo mismo que «puede valer `null`». `dueDate?: string` significa que la propiedad puede **faltar**. Si un dato existe pero está vacío a propósito, se expresa así: `dueDate: string | null`.
:::

## Propiedades de solo lectura

::: esencial
`readonly` impide reasignar una propiedad después de crear el objeto. Es ideal para identificadores y datos que no deben cambiar:

```ts twoslash
// @errors: 2540
interface Loan {
  readonly id: number;
  bookTitle: string;
  returned: boolean;
}

const loan: Loan = { id: 7, bookTitle: 'Rayuela', returned: false };
loan.returned = true;
loan.id = 8;
```
:::

::: info Nota
`readonly` solo existe para el compilador: en ejecución el objeto se puede modificar igual. Su valor está en que **el editor avisa** antes de que cometas el error.
:::

## Objetos anidados y listas de objetos

::: esencial
Una propiedad puede ser otro objeto o una lista. Lo habitual es darle nombre a cada pieza:

```ts twoslash
interface Address {
  street: string;
  city: string;
}

interface Library {
  name: string;
  address: Address;
  openDays: string[];
}

const central: Library = {
  name: 'Biblioteca Central',
  address: { street: 'Calle Mayor 1', city: 'Granada' },
  openDays: ['lunes', 'martes', 'jueves'],
};

const city = central.address.city;
// → city: string
```

Para una **lista de objetos** se añaden corchetes al tipo: `Book[]` se lee «lista de `Book`».
:::

## `Record`: objetos que funcionan como diccionario

::: esencial
`Record<Claves, Valor>` describe un objeto en el que **todas las claves son del mismo tipo de cosa** y **todos los valores también**. Es una tabla de búsqueda.

Los signos `< >` son la forma de pasarle información a un tipo, igual que los paréntesis le pasan datos a una función. `Record<Genre, number>` se lee: «un objeto cuyas claves son los géneros y cuyos valores son números». Este tipo de herramientas se llaman *genéricos* y se explican en [su tema](./08-genericos); para usar `Record` basta con esta lectura.

```ts twoslash
type Genre = 'novel' | 'poetry' | 'essay';

const shelves: Record<Genre, number> = {
  novel: 120,
  poetry: 35,
  essay: 48,
};
```

Equivale a escribir `{ novel: number; poetry: number; essay: number }`, pero se mantiene solo: si mañana se añade un género a `Genre`, TypeScript marca todos los `Record<Genre, ...>` a los que les falta.
:::

Si falta una clave o se escribe una que no existe, el compilador lo detecta:

```ts twoslash
// @errors: 2741 2353
type Genre = 'novel' | 'poetry' | 'essay';
// ---cut---
const incomplete: Record<Genre, number> = { novel: 120, poetry: 35 };
const unknownKey: Record<Genre, number> = { novel: 120, poetry: 35, essay: 48, comic: 3 };
```

**Cuándo usar cada uno:**

| Las claves son... | Usa | Ejemplo |
|---|---|---|
| Campos distintos, cada uno con su tipo | `interface` | Un libro: `title` es texto, `pages` es número |
| Valores de una misma lista, con el mismo tipo de valor | `Record` | Libros por género, etiqueta de cada estado |
| Desconocidas o cambian mucho en ejecución | `Map` | Caché de búsquedas, contadores dinámicos |

Un uso muy frecuente en interfaces de usuario es traducir un valor interno a un texto visible:

```ts twoslash
type Status = 'pending' | 'done' | 'cancelled';

const statusLabel: Record<Status, string> = {
  pending: 'Pendiente',
  done: 'Completada',
  cancelled: 'Cancelada',
};

const label = statusLabel['done'];
// → label: string
```

## Comprobación de propiedades sobrantes

::: esencial
Si escribes de más una propiedad que el tipo no tiene, TypeScript lo marca. Así detecta erratas como `emial` en lugar de `email`:

```ts twoslash
// @errors: 2561
interface Member {
  id: number;
  name: string;
  email?: string;
}

const ana: Member = { id: 1, name: 'Ana', emial: 'ana@example.com' };
```
:::

::: warning Atención
Esta comprobación solo ocurre cuando escribes las llaves `{ ... }` **justo donde se espera el tipo**, como en el ejemplo. Si el objeto ya estaba guardado en otra variable y luego lo pasas, TypeScript solo comprueba que estén las propiedades necesarias y no protesta por las que sobran:

```ts
const data = { id: 1, name: 'Ana', emial: 'ana@example.com' };
const ana: Member = data; // sin error: tiene id y name, lo demás se ignora
```

El motivo se explica en [Tipado estructural](#tipado-estructural), en la ampliación.
:::

## Ampliación

### Ampliar tipos: `extends` e intersección

::: ampliacion
Una `interface` puede **heredar** las propiedades de otra con `extends`. Con `type`, el equivalente es la **intersección** `&`:

```ts twoslash
interface Person {
  name: string;
  email: string;
}

interface Librarian extends Person {
  employeeId: number;
}

type Reader = Person & { cardNumber: string };

const lucia: Librarian = { name: 'Lucía', email: 'lucia@example.com', employeeId: 33 };
const pablo: Reader = { name: 'Pablo', email: 'pablo@example.com', cardNumber: 'L-2041' };
```

`extends` da mensajes de error más claros cuando hay conflicto entre propiedades; por eso es la opción preferida para jerarquías de objetos.
:::

### Firmas de índice

::: ampliacion
Si las claves son **cualquier texto** y no una lista cerrada, existen dos escrituras equivalentes:

```ts twoslash
const stockByIsbn: Record<string, number> = {};
const sameThing: { [isbn: string]: number } = {};

stockByIsbn['978-8437604947'] = 3;
const copies = stockByIsbn['978-0000000000'];
// → copies: number
```

Fíjate en el tipo de `copies`: TypeScript dice `number`, aunque esa clave no exista y el valor real sea `undefined`. Con claves abiertas, el compilador no puede saber cuáles existen. La opción `noUncheckedIndexedAccess` del `tsconfig` corrige esto añadiendo `| undefined`; en proyectos con datos dinámicos, `Map` suele ser más seguro.
:::

### `as const`: valores literales y de solo lectura

::: ampliacion
Por defecto, en un objeto TypeScript guarda el tipo general de cada valor (`string`, `number`) y no el valor exacto, porque las propiedades se pueden cambiar después. Si añades `as const` al final, le dices «esto no va a cambiar nunca»: el objeto conserva los valores exactos y todo se vuelve `readonly`. En el ejemplo, `typeof` sirve para ver el tipo de cada variable ([explicado en Fundamentos](./01-fundamentos#el-operador-typeof-en-los-tipos)):

```ts twoslash
const config = {
  apiUrl: 'https://api.example.com',
  retries: 3,
};
type A = typeof config;
// → A = { apiUrl: string; retries: number; }

const frozen = {
  apiUrl: 'https://api.example.com',
  retries: 3,
} as const;
type B = typeof frozen;
// → B = { readonly apiUrl: "https://api.example.com"; readonly retries: 3; }
```

Es útil para listas de opciones de las que quieres obtener un tipo:

```ts twoslash
const GENRES = ['novel', 'poetry', 'essay'] as const;
type Genre = (typeof GENRES)[number];
// → Genre = "novel" | "poetry" | "essay"
```

`(typeof GENRES)[number]` se lee: «el tipo de cualquier elemento de `GENRES`» (el `[number]` significa «en cualquier posición»). Como la lista es `as const`, sus elementos son los tres textos exactos, y el resultado es su unión.

Así la lista existe en ejecución (para pintar un desplegable) y el tipo se deriva de ella: un solo sitio que mantener.
:::

### `satisfies`: comprobar sin perder precisión

::: ampliacion
Cuando anotas `const x: Tipo = ...`, TypeScript comprueba el objeto y, a partir de ahí, **olvida** lo que sabía de él y solo recuerda `Tipo`. A veces eso hace perder información útil.

En el ejemplo, cada género puede tener un texto o una lista de textos (`string | string[]`). Con la anotación, aunque `novel` sea claramente un texto, TypeScript solo recuerda que «es texto o lista». Con `satisfies`, comprueba lo mismo pero **recuerda** lo que hay de verdad en cada propiedad:

```ts twoslash
type Genre = 'novel' | 'poetry' | 'essay';

const annotated: Record<Genre, string | string[]> = {
  novel: 'Narrativa',
  poetry: ['Lírica', 'Verso'],
  essay: 'Ensayo',
};
const a = annotated.novel;
// → a: string | string[]

const checked = {
  novel: 'Narrativa',
  poetry: ['Lírica', 'Verso'],
  essay: 'Ensayo',
} satisfies Record<Genre, string | string[]>;
const b = checked.novel;
// → b: string
```

Con `satisfies`, `checked.novel` se sabe que es `string`, y puedes usar sus métodos sin comprobaciones extra. Si falta una clave o un valor no encaja, el error aparece igual.
:::

### Tipado estructural

::: ampliacion
TypeScript compara tipos por su **forma**, no por su nombre. Un objeto es compatible con un tipo si tiene, al menos, las propiedades que ese tipo exige:

```ts twoslash
interface HasTitle {
  title: string;
}

function printTitle(item: HasTitle): void {
  console.log(item.title.toUpperCase());
}

const album = { title: 'Mediterráneo', artist: 'Joan Manuel Serrat', year: 1971 };
printTitle(album);
```

`album` nunca dice que sea un `HasTitle`, pero tiene `title: string`, así que encaja. Por eso las propiedades sobrantes solo se rechazan en objetos escritos en el sitio: en el resto de casos, TypeScript solo pregunta *«¿tiene lo que necesito?»*.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Nombrar con `interface` cada forma que se repite y anotar los parámetros de las funciones con ese nombre.

```ts
function summary(book: Book): string {
  return `${book.title} (${book.pages} págs.)`;
}
```
:::

::: evita
Repetir la forma del objeto en cada firma. Si cambia, hay que corregirla en todos los sitios.

```ts
function summary(book: { title: string; pages: number }): string {
  return `${book.title} (${book.pages} págs.)`;
}
```
:::

</div>

<div class="wk-pair">

::: haz
Usar una unión de literales para valores con pocas opciones y `Record` para asociar algo a cada una.

```ts
type Status = 'pending' | 'done';
const color: Record<Status, string> = { pending: 'orange', done: 'green' };
```
:::

::: evita
Usar `string` para todo. Las erratas solo se descubren al ejecutar.

```ts
const color: Record<string, string> = { pending: 'orange', dnoe: 'green' };
```
:::

</div>

<div class="wk-pair">

::: haz
Marcar como `readonly` los identificadores y los datos que no deben cambiar.
:::

::: evita
Usar `any` para «salir del paso» con un objeto complicado. Se pierden todas las comprobaciones de este tema.
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Describir la forma de un objeto | `interface Book { title: string }` |
| Una propiedad que puede faltar | `dueDate?: string` |
| Una propiedad que no se reasigna | `readonly id: number` |
| Una tabla «algo por cada opción» | `Record<Genre, number>` |
| Un tipo a partir de otro | `interface B extends A` · `A & { ... }` |
| Valores exactos e inmutables | `{ ... } as const` |
| Comprobar sin perder el tipo exacto | `{ ... } satisfies Tipo` |

## Ver también

- [Uniones y narrowing](./02-uniones-narrowing): las uniones de literales que se usan como claves de `Record`.
- [null y undefined](./06-null-undefined): cómo tratar las propiedades opcionales.
- [Utility types](./09-utility-types): `Partial`, `Pick` y `Omit`, tipos de objeto a partir de otros.
- [Traductor de errores](./14-errores): los mensajes de este tema explicados uno a uno.
