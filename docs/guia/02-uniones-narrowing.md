# Uniones y narrowing

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U1 · U4</span>
  <span><strong>En React</strong> estados de carga, variantes de componentes</span>
</div>

Una **unión** describe un valor que puede ser **de un tipo o de otro**: por ejemplo, un identificador que a veces llega como texto (`'A-12'`) y a veces como número (`12`).

El problema es que, mientras no sepas cuál de los dos te ha llegado, TypeScript no te deja usar nada que solo tenga uno de ellos. La solución es **preguntar con un `if`**. TypeScript lee esa pregunta y, dentro del `if`, ya sabe qué tipo tienes. A eso se le llama **narrowing** (en español, *estrechamiento*): el tipo pasa de «puede ser varias cosas» a «es esta cosa».

> Unión = «puede ser esto o aquello». Narrowing = preguntar con un `if` cuál es, para poder usarlo.

## Uniones

::: esencial
Se escriben separando los tipos con `|`, que se lee «o»:

```ts twoslash
// @errors: 2339
function formatId(id: string | number): string {
  return id.toUpperCase();
}
```

Con una unión, TypeScript solo deja usar lo que es válido **para todas** las opciones. `toUpperCase` existe en `string`, pero no en `number`: hay que comprobar cuál es antes.
:::

## Uniones de literales

::: esencial
Un **literal** es un valor concreto usado como tipo. Una unión de literales es una **lista cerrada** de valores permitidos:

```ts twoslash
// @errors: 2345
type Priority = 'low' | 'medium' | 'high';

function setPriority(priority: Priority): void {
  console.log(`Prioridad: ${priority}`);
}

setPriority('high');
setPriority('urgent');
```

Es la forma moderna de expresar opciones fijas: tamaños, estados, categorías, métodos HTTP. El editor además **autocompleta** los valores permitidos.
:::

::: tip Por qué no `enum`
En proyectos Vite actuales, `enum` da error (`erasableSyntaxOnly`). Las uniones de literales hacen lo mismo, no generan código y son más fáciles de leer.
:::

## Narrowing: comprobar para estrechar

::: esencial
Piensa en un paquete que puede contener un libro o una taza. Antes de abrirlo no puedes ponerte a leer ni a beber: primero miras qué hay dentro. Una vez lo sabes, ya puedes usarlo como lo que es.

Con una unión pasa lo mismo, en tres pasos:

**1. El problema.** `id` puede ser `string` o `number`. `toUpperCase` solo existe en los textos, así que TypeScript no deja llamarlo (es el error de la sección anterior).

**2. La pregunta.** Se comprueba el tipo con un `if`, igual que se haría en JavaScript.

**3. La recompensa.** Dentro del `if`, TypeScript ya sabe que `id` es un `string` y deja usar `toUpperCase`. Fuera del `if`, como ese caso ya terminó con `return`, solo queda la otra opción: `number`.

```ts twoslash
function formatId(id: string | number): string {
  // Aquí id puede ser string o number

  if (typeof id === 'string') {
    // Aquí TypeScript sabe que id es string
    return id.toUpperCase();
  }

  // Aquí solo puede ser number: el caso string ya salió con return
  return id.toFixed(0);
}
```

No hay que escribir nada especial para que ocurra: **basta con hacer la comprobación**. TypeScript sigue el código igual que lo leerías tú y ajusta el tipo en cada zona. Si pasas el ratón por `id` en cada línea, el editor te muestra el tipo que tiene en ese punto.
:::

<DiagramNarrowing />

::: tip Dicho de otra forma
El narrowing no cambia el valor ni lo convierte: solo hace que TypeScript **sepa más** sobre él después de una comprobación. Sin comprobación, error; con comprobación, vía libre.
:::

`typeof` no es la única pregunta que TypeScript entiende. Según lo que tengas, se usa una u otra:

| Comprobación | Para | Ejemplo |
|---|---|---|
| `typeof x === '...'` | Primitivos: `string`, `number`, `boolean`... | `typeof id === 'string'` |
| `x === valor` | Literales concretos, `null`, `undefined` | `status === 'done'` |
| `'prop' in x` | Objetos que se distinguen por una propiedad | `'email' in contact` |
| `x instanceof Clase` | Instancias de clases: `Date`, `Error`, elementos del DOM | `error instanceof Error` |
| `Array.isArray(x)` | Arrays | `Array.isArray(tags)` |

### `in`: distinguir objetos por sus propiedades

::: esencial
Cuando los dos tipos son objetos, `typeof` no sirve (los dos darían `'object'`). Pero se puede preguntar si el objeto **tiene una propiedad**: `'email' in contact` es `true` si `contact` tiene la propiedad `email`. Si la tiene, solo puede ser un `EmailContact`:

```ts twoslash
interface EmailContact {
  email: string;
}

interface PhoneContact {
  phone: string;
}

function describe(contact: EmailContact | PhoneContact): string {
  if ('email' in contact) {
    return `Correo: ${contact.email}`;
  }
  return `Teléfono: ${contact.phone}`;
}
```

Fuera del `if` ya no puede ser un `EmailContact` (ese caso salió con `return`), así que TypeScript deja leer `contact.phone`.
:::

### `instanceof`: clases y errores

::: esencial
`instanceof` pregunta si un valor se creó con una clase concreta (`new Date()`, `new Error()`...). Por ejemplo, una fecha que puede llegar ya como `Date` o todavía como texto:

```ts twoslash
function formatDate(date: Date | string): string {
  if (date instanceof Date) {
    // Aquí date es Date: tiene sus métodos
    return date.toLocaleDateString('es-ES');
  }
  // Aquí solo puede ser string
  return date;
}
```
:::

::: info Recuerda: qué es `unknown`
Lo verás en los siguientes ejemplos. `unknown` es el tipo de un valor del que **no se sabe nada**: puede ser un texto, un número, un objeto... Se usa para datos que vienen de fuera (un JSON, el error de un `catch`). TypeScript no deja hacer **nada** con él hasta que se comprueba qué es, y para eso sirve precisamente el narrowing. Está explicado en [Fundamentos](./01-fundamentos#any-frente-a-unknown).
:::

El caso más habitual de `instanceof` es el error de un `catch`. En un `catch` el error es `unknown`, porque en JavaScript se puede lanzar cualquier cosa (`throw 'texto'`, `throw 42`...). Antes de leer `error.message` hay que comprobar que de verdad es un `Error`:

```ts twoslash
function message(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
    // → error: Error
  }
  return 'Error desconocido';
}
```

Lo verás de nuevo en [Asincronía](./11-asincronia).

::: warning Atención: comprobar «si existe»
`if (value)` también estrecha, pero descarta **todos** los valores falsos: `0`, `''`, `false`, `null` y `undefined`. Con números o textos, un `0` o un texto vacío válidos se tratarían como si no existieran. Compara de forma explícita: `if (value !== undefined)`.
:::

## Uniones discriminadas

::: esencial
Piensa en una pantalla que pide el tiempo a un servidor. Puede estar en tres situaciones: **cargando**, **con datos** o **con error**. Y en cada una hay información distinta: los datos solo existen si ha ido bien, y el mensaje de error solo si ha ido mal.

Se modela con una unión de objetos que tienen **todos** una misma propiedad (aquí `status`), con un texto fijo y distinto en cada caso. A esa propiedad se le llama **discriminante**, porque es la que permite distinguir (discriminar) un caso de otro. Y a la unión, **unión discriminada**:

```ts twoslash
interface Weather {
  city: string;
  temperature: number;
}

type WeatherState =
  | { status: 'loading' }
  | { status: 'success'; data: Weather }
  | { status: 'error'; message: string };

function render(state: WeatherState): string {
  switch (state.status) {
    case 'loading':
      return 'Cargando...';
    case 'success':
      return `${state.data.city}: ${state.data.temperature} °C`;
    case 'error':
      return `No se pudo cargar: ${state.message}`;
  }
}
```

El `switch` pregunta por `status`, y eso es narrowing: en cada `case`, TypeScript sabe en qué situación estás y qué propiedades existen. `data` solo se puede leer en `'success'` y `message` solo en `'error'`. Si intentas leer `state.data` en el caso `'loading'`, el compilador lo marca como error.
:::

::: tip Por qué es mejor que varios booleanos
Con `isLoading: boolean; error: string | null; data: Weather | null` se pueden representar combinaciones imposibles (cargando y con error a la vez). Con una unión discriminada, **solo existen los estados válidos**. En React es el patrón recomendado para el estado de una petición.
:::

## `switch` exhaustivo con `never`

::: esencial
El problema: hoy la unión tiene tres casos y el `switch` los trata todos. Mañana alguien añade un cuarto caso a la unión y se olvida de actualizar el `switch`. El programa compila, pero ese caso nuevo no hace nada.

La solución es un truco con `never` (el tipo de «lo que no puede pasar»). En el `default` se guarda el valor en una variable de tipo `never`. Si todos los casos están tratados, al `default` no puede llegar nada y todo va bien. Si falta alguno, ese caso llega al `default`, no encaja en `never`, y TypeScript da error:

```ts twoslash
// @errors: 2322
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    default: {
      const unhandled: never = shape;
      return unhandled;
    }
  }
}
```

Aquí falta el caso `'triangle'`: un triángulo llega al `default` y no se puede guardar en una variable `never`, de ahí el error (el mensaje menciona el triángulo, que es la pista de qué falta). Al añadir el `case 'triangle'`, el error desaparece.
:::

## Ampliación

### Type guards propios

::: ampliacion
A veces la comprobación es larga: para saber si un dato es un `Book` hay que mirar que sea un objeto, que tenga `title`, que sea texto... Si se repite en varios sitios, se mete en una función.

El detalle está en el tipo de retorno: en lugar de `boolean` se escribe `value is Book`. Significa «devuelvo `true` o `false`, y si devuelvo `true`, `value` es un `Book`». Así, al usar la función en un `if`, TypeScript estrecha el tipo igual que con `typeof`. A estas funciones se les llama **type guards** (guardianes de tipo):

```ts twoslash
interface Book {
  title: string;
  isbn: string;
}

function isBook(value: unknown): value is Book {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof value.title === 'string' &&
    'isbn' in value &&
    typeof value.isbn === 'string'
  );
}

const data: unknown = JSON.parse('{"title":"Dune","isbn":"978-0441013593"}');
if (isBook(data)) {
  console.log(data.title);
  // → data: Book
}
```

Es la base para validar datos que llegan de fuera: ver [null y undefined](./06-null-undefined#validar-datos-que-llegan-de-fuera).
:::

::: warning Atención
TypeScript **confía** en lo que dice un type guard. Si la función devuelve `true` sin comprobarlo de verdad, el compilador dará por bueno un tipo falso. La comprobación tiene que ser completa.
:::

### Funciones de aserción

::: ampliacion
Es una variante del type guard que, en lugar de devolver `true` o `false`, **lanza un error** si el dato no es correcto. Si la función termina sin lanzar nada, TypeScript entiende que el dato sí era correcto y lo trata con ese tipo **en todo el código que sigue**, sin necesidad de un `if`. Se indica con `asserts valor is Tipo`:

```ts twoslash
function assertIsString(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`${name} debe ser un texto`);
  }
}

const input: unknown = 'Granada';
assertIsString(input, 'La ciudad');
const city = input;
// → city: string
```
:::

### Inferencia de predicados en `filter`

::: ampliacion
Al filtrar un array para quitar los `undefined`, TypeScript entiende (desde la versión 5.5) que el resultado ya no los contiene:

```ts twoslash
const ratings = [4, undefined, 5, undefined, 3];

const valid = ratings.filter((r) => r !== undefined);
// → valid: number[]
```

El resultado es `number[]`, sin `undefined`. En versiones anteriores había que escribir el predicado a mano.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Modelar los estados con una unión discriminada.

```ts
type Request =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };
```
:::

::: evita
Combinar varios booleanos que pueden contradecirse.

```ts
interface Request {
  isLoading: boolean;
  hasError: boolean;
  message?: string;
}
```
:::

</div>

<div class="wk-pair">

::: haz
Uniones de literales para opciones fijas.

```ts
type Size = 'sm' | 'md' | 'lg';
```
:::

::: evita
`string` para un valor que solo admite unas pocas opciones.

```ts
let size: string = 'medium-ish';
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Un valor de varios tipos | `string \| number` |
| Una lista cerrada de valores | `type Status = 'on' \| 'off'` |
| Saber qué tipo tengo | `typeof`, `===`, `in`, `instanceof`, `Array.isArray` |
| Modelar estados | Unión discriminada con una propiedad común (`status`, `kind`) |
| Que me avisen si olvido un caso | `default` con `const x: never = valor` |
| Encapsular una comprobación | `function isX(v: unknown): v is X` |

## Ver también

- [Fundamentos](./01-fundamentos): `unknown` y `never`.
- [null y undefined](./06-null-undefined): el narrowing más frecuente.
- [Puente a React](./15-react): estados con uniones discriminadas en `useState`.
