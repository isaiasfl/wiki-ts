# Funciones

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U1 · U3</span>
  <span><strong>En React</strong> componentes, manejadores de eventos, callbacks</span>
</div>

Una función tipada declara **qué recibe** y **qué devuelve**. Esa línea, la **firma**, es un contrato con quien la usa: si se llama con datos que no encajan, o si la función devuelve otra cosa de la prometida, el compilador lo señala.

## La firma

::: esencial
Se anotan los **parámetros** y, detrás de los paréntesis, el **tipo de retorno**:

```ts twoslash
function loanDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / 86_400_000);
}
```

Se lee: *«recibe dos fechas y devuelve un número»*. (`getTime()` da la fecha en milisegundos, y `86_400_000` son los milisegundos de un día; los `_` solo separan cifras para leerlas mejor, como los puntos de los millares.)
:::

| Parte | ¿Se anota? | Por qué |
|---|---|---|
| Parámetros | **Siempre** | TypeScript no puede adivinar qué le pasarán |
| Tipo de retorno | En funciones exportadas, sí | Documenta el contrato y detecta retornos equivocados dentro de la función |
| Variables internas | No | Se infieren |

::: tip El retorno como red de seguridad
Si anotas `: number` y en alguna rama devuelves un texto, el error aparece **dentro** de la función, donde está el fallo. Sin anotar, el tipo se deduce de lo que devuelva y el error aparece lejos, donde se usa el resultado.
:::

## Parámetros opcionales y valores por defecto

::: esencial
Un `?` hace que el parámetro se pueda omitir; su tipo incluye `undefined`. Un **valor por defecto** también lo hace opcional, pero dentro de la función ya no puede ser `undefined`:

```ts twoslash
function greet(name: string, greeting?: string): string {
  return `${greeting ?? 'Hola'}, ${name}`;
}

function formatPrice(amount: number, currency = 'EUR'): string {
  // → currency: string
  return amount.toLocaleString('es-ES', { style: 'currency', currency });
}

greet('Ana');
formatPrice(19.9);
formatPrice(19.9, 'USD');
```

Los parámetros opcionales van **al final**.
:::

## Parámetros rest

::: esencial
`...nombre` recoge todos los argumentos restantes en un array:

```ts twoslash
function sumAll(...values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

sumAll(3, 4, 5);
```
:::

## Funciones flecha

::: esencial
Una función flecha se guarda en una constante. El tipo de retorno va **después de los paréntesis y antes de la flecha**:

```ts twoslash
const toCelsius = (fahrenheit: number): number => ((fahrenheit - 32) * 5) / 9;
```

Sin llaves, el valor se **devuelve solo** (retorno implícito). Con llaves, hace falta `return`.
:::

::: error
Devolver un objeto en una flecha sin llaves. Las llaves del objeto se confunden con las del cuerpo de la función. Se envuelve entre paréntesis:

```ts twoslash
const toEntry = (title: string) => ({ title, createdAt: new Date() });
```
:::

| | `function` | Flecha |
|---|---|---|
| Lectura | Muy clara para empezar | Más compacta |
| Uso habitual | Funciones con nombre, componentes de React | Callbacks y funciones pequeñas |
| `this` propio | Sí | No: usa el del contexto |

Las dos son correctas. Dentro de un mismo proyecto, conviene ser coherente.

## Callbacks: funciones como argumento

::: esencial
Cuando una función recibe otra como argumento, el tipo del parámetro describe **su firma**: `(parámetros) => retorno`.

```ts twoslash
function retry(task: () => boolean, attempts: number): boolean {
  for (let i = 0; i < attempts; i++) {
    if (task()) return true;
  }
  return false;
}

retry(() => Math.random() > 0.5, 3);
```

Un **callback** es una función que le pasas a otra para que **ella** la ejecute cuando le toque. Aquí, `retry` recibe la tarea `task` y la ejecuta hasta 3 veces, hasta que salga bien.

`task: () => boolean` se lee «una función que no recibe nada y devuelve un booleano». Al escribir el callback **no hace falta anotar** sus parámetros: como TypeScript ya sabe qué función espera `retry`, deduce los tipos del callback por el sitio donde lo escribes. Es lo que ocurre con `map`, `filter` o `addEventListener`.
:::

Para firmas que se repiten, se les da nombre con `type`. La `<T>` es un hueco para un tipo que se rellena al usarlo: `Comparator<string>` es «una función que compara dos textos». Se explica a fondo en [Genéricos](./08-genericos):

```ts twoslash
type Comparator<T> = (a: T, b: T) => number;

const byLength: Comparator<string> = (a, b) => a.length - b.length;
// → a: string
```

## Funciones que devuelven funciones

::: esencial
Una función puede **fabricar** otras. La función interna recuerda las variables del lugar donde se creó: eso es un **closure**.

```ts twoslash
function createCounter(start = 0): () => number {
  let count = start;
  return () => {
    count += 1;
    return count;
  };
}

const nextTicket = createCounter(100);
nextTicket(); // 101
nextTicket(); // 102
```

Paso a paso:

1. `createCounter(100)` crea la variable `count` con valor 100 y devuelve una función flecha.
2. Esa función se guarda en `nextTicket`. `createCounter` ya ha terminado, pero la flecha **se lleva consigo** la variable `count`.
3. Cada vez que llamas a `nextTicket()`, suma 1 a **esa misma** `count` y la devuelve.

`count` no es accesible desde fuera: solo la función devuelta puede tocarla. Los closures permiten **guardar un estado privado** sin clases, y son la base de los hooks de React.
:::

Otro uso habitual: **configurar** una función una vez y reutilizarla.

```ts twoslash
function discount(percent: number): (price: number) => number {
  return (price) => price * (1 - percent / 100);
}

const blackFriday = discount(30);
blackFriday(200); // 140
```

`discount(30)` devuelve una función que ya «recuerda» el 30 %; `blackFriday` solo necesita el precio.

## Ampliación

### Desestructurar parámetros objeto

::: ampliacion
Cuando una función recibe muchas opciones, es más legible pasar **un objeto**. Se desestructura en la propia firma, y se pueden dar valores por defecto:

```ts twoslash
interface SearchOptions {
  query: string;
  page?: number;
  pageSize?: number;
}

function search({ query, page = 1, pageSize = 20 }: SearchOptions): string {
  return `/api/books?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`;
}

search({ query: 'tolkien', page: 2 });
```

El orden de los argumentos deja de importar, y la llamada se lee sola. Es la misma forma que tienen las **props** de un componente de React.
:::

### `void` en callbacks

::: ampliacion
Un parámetro de tipo `() => void` **acepta** funciones que devuelven algo: simplemente se ignora el valor. Por eso esto es válido:

```ts twoslash
const ids: number[] = [];
[1, 2, 3].forEach((n) => ids.push(n)); // push devuelve un número, pero forEach espera void
```

En cambio, una función **declarada** con `: void` no puede devolver un valor.
:::

### Sobrecargas

::: ampliacion
Una función puede tener **varias firmas** cuando el tipo de retorno depende de los argumentos. Se escriben las firmas públicas y después una implementación compatible con todas:

```ts twoslash
function parse(value: string): number;
function parse(value: string[]): number[];
function parse(value: string | string[]): number | number[] {
  return Array.isArray(value) ? value.map(Number) : Number(value);
}

const one = parse('42');
// → one: number
const many = parse(['1', '2']);
// → many: number[]
```

Úsalas con moderación: a menudo una unión o un genérico expresan lo mismo con menos código.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Funciones pequeñas, con un solo propósito y un nombre que lo diga.

```ts
function isOverdue(loan: Loan, today: Date): boolean {
  return loan.dueDate < today && !loan.returned;
}
```
:::

::: evita
Parámetros booleanos que cambian el comportamiento: la llamada no se entiende.

```ts
render(books, true, false);
```
:::

</div>

<div class="wk-pair">

::: haz
Más de dos o tres parámetros: un objeto con nombres.

```ts
createLoan({ bookId: 7, memberId: 3, days: 15 });
```
:::

::: evita
Listas largas de argumentos posicionales que hay que recordar en orden.

```ts
createLoan(7, 3, 15, false, 'normal');
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Tipar una función | `function f(a: number): string { ... }` |
| Un parámetro que puede faltar | `b?: string` o `b = 'valor'` |
| Recoger varios argumentos | `...values: number[]` |
| Una flecha con retorno tipado | `const f = (a: number): string => ...` |
| Una función como parámetro | `callback: (x: number) => void` |
| Dar nombre a una firma | `type Comparator<T> = (a: T, b: T) => number` |

<PracticeLink topic="05-funciones" />

## Ver también

- [Arrays](./04-arrays): los callbacks de `map`, `filter` y `reduce`.
- [Genéricos](./08-genericos): funciones que sirven para cualquier tipo.
- [Puente a React](./15-react): componentes y manejadores de eventos.
