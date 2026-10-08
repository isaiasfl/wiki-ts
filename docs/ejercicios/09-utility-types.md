# Ejercicios · Utility types

Repasa antes: [Utility types](/guia/09-utility-types). Cómo se hacen y se comprueban: [Ejercicios](./).

Los ejercicios parten de los libros de una biblioteca:

```ts
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}
```

## 1. Crear un libro <span class="wk-level l1">básico</span>

Cuando un bibliotecario da de alta un libro, rellena el título, el autor y el año. El `id` lo pone el programa y todo libro nuevo empieza disponible.

- Define `NewBook` **a partir de** `Book`, sin volver a escribir las propiedades.
- Escribe `createBook(data: NewBook, id: number): Book`.

```ts twoslash playground
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

// Tu tipo NewBook aquí

function createBook(data: any, id: number): Book {
  // Tu código aquí (cambia any por NewBook)
  return { id: 0, title: '', author: '', year: 0, available: false };
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const dune = createBook({ title: 'Dune', author: 'Frank Herbert', year: 1965 }, 10);
check('tiene el id indicado', dune.id === 10);
check('conserva los datos', dune.title === 'Dune' && dune.year === 1965);
check('empieza disponible', dune.available === true);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`type NewBook = Omit<Book, 'id' | 'available'>;` y en la función, spread: `{ ...data, id, available: true }`.
:::

::: details Solución
```ts twoslash run
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

type NewBook = Omit<Book, 'id' | 'available'>;

function createBook(data: NewBook, id: number): Book {
  return { ...data, id, available: true };
}

const dune = createBook({ title: 'Dune', author: 'Frank Herbert', year: 1965 }, 10);
check('tiene el id indicado', dune.id === 10);
check('conserva los datos', dune.title === 'Dune' && dune.year === 1965);
check('empieza disponible', dune.available === true);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Si mañana se añade `isbn` a `Book`, `NewBook` lo incluye solo, y TypeScript te avisará en cada sitio donde falte.
:::

## 2. Editar un libro <span class="wk-level l2">medio</span>

El formulario de edición envía **solo los campos que cambian**. El `id` no se puede cambiar nunca.

- Escribe `updateBook(book, changes)`: devuelve un libro nuevo con los cambios aplicados.
- Elige el tipo de `changes` para que todo sea opcional **excepto que no admita `id`**. La comprobación comentada debe dar error si quitas las `//`.

```ts twoslash playground
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

function updateBook(book: Book, changes: any): Book {
  // Tu código aquí (cambia any por el tipo correcto)
  return book;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const original: Book = { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965, available: true };
const lent = updateBook(original, { available: false });
check('cambia solo lo indicado', lent.available === false && lent.title === 'Dune');
check('no modifica el original', original.available === true);
const fixed = updateBook(original, { year: 1966, title: 'Dune (ed. revisada)' });
check('admite varios cambios', fixed.year === 1966 && fixed.title === 'Dune (ed. revisada)');
// updateBook(original, { id: 99 }); // al quitar las // debe dar error

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Se combinan dos utilidades: primero se quita el `id` y después se hace todo opcional. Se lee de dentro afuera: `Partial<Omit<...>>`.
:::

::: details Solución
```ts twoslash run
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

type BookChanges = Partial<Omit<Book, 'id'>>;

function updateBook(book: Book, changes: BookChanges): Book {
  return { ...book, ...changes };
}

const original: Book = { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965, available: true };
const lent = updateBook(original, { available: false });
check('cambia solo lo indicado', lent.available === false && lent.title === 'Dune');
check('no modifica el original', original.available === true);
const fixed = updateBook(original, { year: 1966, title: 'Dune (ed. revisada)' });
check('admite varios cambios', fixed.year === 1966 && fixed.title === 'Dune (ed. revisada)');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```
:::

## 3. Contar por cualquier propiedad <span class="wk-level l3">reto</span>

Escribe `countBy(list, key)`: cuenta cuántos elementos hay de cada valor de la propiedad `key`. Por ejemplo, `countBy(books, 'author')` da `{ 'Frank Herbert': 2, 'Ursula K. Le Guin': 1 }`.

- `key` solo debe admitir **propiedades que existan** en los elementos (la comprobación comentada debe dar error).
- Debe servir para listas de cualquier tipo.

```ts twoslash playground
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

const books: Book[] = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965, available: true },
  { id: 2, title: 'El mesías de Dune', author: 'Frank Herbert', year: 1969, available: false },
  { id: 3, title: 'Los desposeídos', author: 'Ursula K. Le Guin', year: 1974, available: true },
];

function countBy(list: any[], key: string): Record<string, number> {
  // Tu código aquí: genérica, con key restringida a las claves
  return {};
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const byAuthor = countBy(books, 'author');
check('dos de Frank Herbert', byAuthor['Frank Herbert'] === 2);
check('uno de Le Guin', byAuthor['Ursula K. Le Guin'] === 1);
const byAvailable = countBy(books, 'available');
check('dos disponibles', byAvailable['true'] === 2);
// countBy(books, 'publisher'); // al quitar las // debe dar error

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`function countBy<T>(list: T[], key: keyof T)`. El valor de cada elemento es `item[key]`; para usarlo como clave del resultado, conviértelo a texto con `String(...)`.
:::

::: details Solución
```ts twoslash run
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

const books: Book[] = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965, available: true },
  { id: 2, title: 'El mesías de Dune', author: 'Frank Herbert', year: 1969, available: false },
  { id: 3, title: 'Los desposeídos', author: 'Ursula K. Le Guin', year: 1974, available: true },
];

function countBy<T>(list: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of list) {
    const value = String(item[key]);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

const byAuthor = countBy(books, 'author');
check('dos de Frank Herbert', byAuthor['Frank Herbert'] === 2);
check('uno de Le Guin', byAuthor['Ursula K. Le Guin'] === 1);
const byAvailable = countBy(books, 'available');
check('dos disponibles', byAvailable['true'] === 2);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

`keyof T` es la unión `'id' | 'title' | 'author' | 'year' | 'available'`: por eso `'publisher'` no se acepta, y el editor autocompleta las claves al escribir la llamada.
:::
