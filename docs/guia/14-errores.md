# Traductor de errores

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial</span>
  <span><strong>Uso</strong> consulta rápida</span>
  <span><strong>Buscar</strong> copia el mensaje o su código (TS2322)</span>
</div>

Los mensajes del compilador parecen crípticos, pero siempre siguen el mismo patrón: **qué esperaba** y **qué ha recibido**. Esta página traduce los más frecuentes: qué significan, por qué aparecen y cómo se arreglan.

::: tip Cómo usar esta página
Copia el principio del mensaje (por ejemplo `is possibly 'undefined'`) o su código (`2322`) en el buscador con <kbd>Ctrl</kbd> + <kbd>K</kbd>. Cada error lleva su código entre paréntesis en el título.
:::

## Cómo leer un mensaje

```text
src/data/books.ts(5,74): error TS2322: Type 'string' is not assignable to type 'number'.
```

| Parte | En el ejemplo | Para qué sirve |
|---|---|---|
| Fichero | `src/data/books.ts` | Dónde está el problema |
| Línea y columna | `(5,74)` | El punto exacto; en el editor es el subrayado rojo |
| Código | `TS2322` | Identifica el tipo de error; sirve para buscarlo |
| Explicación | `Type 'string' is not assignable to type 'number'` | Casi siempre dice *«tengo X, esperaba Y»*: lee primero los **tipos entre comillas** |

Si un mensaje ocupa varias líneas, la **última** suele ser la más concreta.

## Asignaciones y tipos

### Type 'X' is not assignable to type 'Y' (2322)

El valor no encaja con el tipo de la variable o propiedad que lo recibe.

```ts twoslash
// @errors: 2322
interface Book {
  title: string;
  pages: number;
}

const book: Book = { title: 'Rayuela', pages: '600' };
```

**Arreglo:** cambia el valor para que encaje (`pages: 600`). Si el dato llega como texto (de un formulario, por ejemplo), conviértelo antes: `Number(input)`.

### Argument of type 'X' is not assignable to parameter of type 'Y' (2345)

Lo mismo que el anterior, pero al **llamar a una función**: el argumento no encaja con el parámetro.

```ts twoslash
// @errors: 2345
function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

addDays(new Date(), '7');
```

**Arreglo:** revisa qué espera la función (pasa el ratón por su nombre) y pasa ese tipo.

### This comparison appears to be unintentional because the types 'X' and 'Y' have no overlap (2367)

Estás comparando con un valor que **nunca** puede coincidir. Casi siempre es una errata.

```ts twoslash
// @errors: 2367
type Status = 'pending' | 'done' | 'cancelled';

function isFinished(status: Status): boolean {
  return status === 'finished';
}
```

**Arreglo:** usa uno de los valores permitidos (`'done'`). Este error es una de las grandes ventajas de las uniones de literales: con `string`, la errata pasaría inadvertida.

## Propiedades

### Property 'X' does not exist on type 'Y' (2339)

Intentas leer una propiedad que el tipo no tiene.

```ts twoslash
// @errors: 2339
interface Task {
  id: number;
  title: string;
}

const task: Task = { id: 1, title: 'Repasar' };
console.log(task.done);
```

**Arreglo:** si la propiedad debe existir, añádela al tipo. Si no, revisa el nombre.

Un caso muy frecuente: leer una propiedad de un **array** creyendo que es un elemento.

```ts twoslash
// @errors: 2339
interface Task {
  id: number;
  title: string;
}
const tasks: Task[] = [];
// ---cut---
const title = tasks.filter((t) => t.id === 1).title;
```

`filter` devuelve una **lista**. Para obtener un solo elemento se usa `find`.

### Property 'X' does not exist on type 'Y'. Did you mean 'Z'? (2551)

Igual que el anterior, pero TypeScript ha encontrado un nombre parecido. Es una errata:

```ts twoslash
// @errors: 2551
const names = ['Ana', 'Luis'];
console.log(names.lenght);
```

**Arreglo:** acepta la sugerencia (`length`). En el editor suele haber una acción rápida que lo corrige.

### Property 'X' is missing in type 'Y' but required in type 'Z' (2741)

Al objeto le falta una propiedad obligatoria.

```ts twoslash
// @errors: 2741
interface Member {
  id: number;
  name: string;
  email: string;
}

const ana: Member = { id: 1, name: 'Ana' };
```

**Arreglo:** añade la propiedad. Si de verdad puede faltar, márcala como opcional en el tipo: `email?: string`.

### Object literal may only specify known properties (2353)

El objeto tiene una propiedad que el tipo no contempla. Si hay un nombre parecido, el mensaje lo sugiere (código **2561**).

```ts twoslash
// @errors: 2353
interface Member {
  id: number;
  name: string;
}

const luis: Member = { id: 2, name: 'Luis', age: 20 };
```

**Arreglo:** quita la propiedad o añádela al tipo. Ver [Objetos · propiedades sobrantes](./03-objetos#comprobacion-de-propiedades-sobrantes).

### Cannot assign to 'X' because it is a read-only property (2540)

Intentas cambiar una propiedad marcada como `readonly`.

```ts twoslash
// @errors: 2540
interface Loan {
  readonly id: number;
  returned: boolean;
}

const loan: Loan = { id: 7, returned: false };
loan.id = 8;
```

**Arreglo:** no la modifiques. Si necesitas un valor distinto, crea un objeto nuevo: `{ ...loan, id: 8 }`.

## null y undefined

### 'X' is possibly 'undefined' (18048)

El valor **puede no existir** y lo usas como si existiera. Es el error más frecuente del curso, y casi siempre viene de `find`, de una propiedad opcional o de un parámetro opcional.

```ts twoslash
// @errors: 18048
interface Book {
  id: number;
  title: string;
}
const books: Book[] = [];
// ---cut---
const found = books.find((b) => b.id === 3);
console.log(found.title);
```

**Arreglo:** decide qué pasa si no está. Tres formas correctas:

```ts twoslash
interface Book {
  id: number;
  title: string;
}
const books: Book[] = [];
const found = books.find((b) => b.id === 3);
// ---cut---
// 1. Comprobar antes de usar (narrowing)
if (found !== undefined) {
  console.log(found.title);
}

// 2. Leer solo si existe
const maybeTitle = found?.title;
// → maybeTitle: string | undefined

// 3. Valor por defecto
const title = found?.title ?? 'Sin título';
// → title: string
```

::: error
Silenciar el error con `found!.title` o `found as Book`. El compilador deja de avisar, pero si el libro no existe el programa falla igualmente al ejecutar: `Cannot read properties of undefined`.
:::

### Object is possibly 'undefined' (2532)

El mismo problema cuando el valor no tiene nombre propio, por ejemplo al encadenar directamente:

```ts twoslash
// @errors: 2532
const scores = [7, 9, 4];
// ---cut---
const best = scores.find((s) => s > 8).toFixed(1);
```

**Arreglo:** igual que el anterior. Lo más claro es guardar el resultado en una variable y comprobarlo, o usar `?.`.

### 'X' is possibly 'null' (18047)

Igual, con `null`. Aparece sobre todo con el DOM: `querySelector` devuelve `null` si no encuentra el elemento.

```ts twoslash
// @errors: 18047
const button = document.querySelector('#save');
button.addEventListener('click', () => console.log('Guardado'));
```

**Arreglo:** comprueba el elemento antes de usarlo y, si falta, lanza un error con un mensaje claro:

```ts twoslash
const button = document.querySelector<HTMLButtonElement>('#save');
if (button === null) {
  throw new Error('No existe el botón #save en el HTML');
}
button.addEventListener('click', () => console.log('Guardado'));
```

## Funciones

### Parameter 'X' implicitly has an 'any' type (7006)

Un parámetro no tiene tipo y TypeScript no puede deducirlo.

```ts twoslash
// @errors: 7006
function formatPrice(price) {
  return `${price.toFixed(2)} €`;
}
```

**Arreglo:** anota el parámetro: `function formatPrice(price: number)`. Regla del curso: los parámetros **siempre** se tipan; los callbacks de `map`, `filter` o `find` no hace falta, porque su tipo se deduce del array.

### Expected N arguments, but got M (2554)

Llamas a una función con más o menos argumentos de los que declara.

```ts twoslash
// @errors: 2554
function greet(name: string, greeting: string): string {
  return `${greeting}, ${name}`;
}

greet('Ana');
```

**Arreglo:** pasa todos los argumentos. Si uno debe poder omitirse, márcalo como opcional o dale un valor por defecto: `greeting = 'Hola'`.

### Function lacks ending return statement and return type does not include 'undefined' (2366)

La función promete devolver un valor, pero hay algún camino en el que no devuelve nada.

```ts twoslash
// @errors: 2366
function grade(score: number): string {
  if (score >= 5) {
    return 'Aprobado';
  }
}
```

**Arreglo:** cubre todos los casos (añade el `return 'Suspenso'` final). TypeScript ha encontrado un fallo de lógica, no de sintaxis.

## Nombres, módulos y configuración

### Cannot find name 'X' (2304)

Usas un nombre que no existe en ese fichero: una errata, una variable de otro ámbito o algo que falta importar.

```ts twoslash
// @errors: 2304
const total = calculateTotal([10, 20]);
```

**Arreglo:** revisa el nombre. Si está en otro fichero, impórtalo; el editor suele ofrecer el `import` automáticamente.

### Cannot find module 'X' or its corresponding type declarations (2307)

La ruta del `import` no lleva a ningún fichero, o la librería no está instalada.

```ts twoslash
// @errors: 2307
import { books } from './data/boks';
```

**Arreglo:** cuenta las carpetas de la ruta (`./` es la carpeta actual; `../` sube una). Si es una librería, instálala con `npm install`.

### 'X' is a type and must be imported using a type-only import (1484)

En proyectos Vite, al importar **solo un tipo** hay que indicarlo con `import type`.

```ts twoslash
// @errors: 1484
// @verbatimModuleSyntax: true
// @module: esnext
// @filename: types.ts
export interface Book {
  title: string;
}
// @filename: main.ts
// ---cut---
import { Book } from './types';

const book: Book = { title: 'Rayuela' };
```

**Arreglo:** `import type { Book } from './types';`. Los tipos desaparecen al compilar; `import type` lo deja claro y permite borrar la línea entera.

### This syntax is not allowed when 'erasableSyntaxOnly' is enabled (1294)

Has usado sintaxis de TypeScript que genera código en ejecución, como `enum`. Los proyectos Vite actuales la prohíben.

```ts twoslash
// @errors: 1294
// @erasableSyntaxOnly: true
enum Status {
  Pending,
  Done,
}
```

**Arreglo:** usa una unión de literales, que cubre lo mismo y no genera código:

```ts twoslash
type Status = 'pending' | 'done';
```

## Si el error no está aquí

1. Lee la **última línea** del mensaje: suele ser la más concreta.
2. Pasa el ratón por las variables implicadas para ver **qué tipo tienen realmente**.
3. Busca el **código** (`TS2xxx`) en esta wiki o en la documentación oficial.
4. Ejecuta `npx tsc --noEmit` para ver **todos** los errores del proyecto, no solo los del fichero abierto.

::: warning Atención
Ante un error que no entiendes, la tentación es silenciarlo con `any`, `as` o `!`. Casi nunca es la solución: el error sigue ahí, solo que ahora aparecerá al ejecutar, delante del usuario.
:::

## Ver también

- [Objetos](./03-objetos): propiedades, opcionales y `readonly`.
- [null y undefined](./06-null-undefined): las formas de tratar un valor que puede faltar.
- [Clean code en TypeScript](./13-clean-code): por qué `any`, `as` y `!` se evitan.
