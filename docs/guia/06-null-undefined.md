# null y undefined

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U1 · U6 · U7</span>
  <span><strong>En React</strong> datos que aún no han llegado, elementos sin seleccionar</span>
</div>

Muchos errores en JavaScript vienen de usar un valor que **no existe**: `Cannot read properties of undefined`. TypeScript, en modo estricto, trata `null` y `undefined` como tipos aparte y **obliga a decidir qué pasa** cuando un valor puede faltar. Este tema reúne todas las formas de hacerlo.

## `null` frente a `undefined`

::: esencial
| | Significa | Quién lo pone | Ejemplo |
|---|---|---|---|
| `undefined` | **Nadie le ha dado valor** | El lenguaje | Propiedad opcional ausente, `find` sin resultado, parámetro omitido |
| `null` | **Vacío a propósito** | El programador o una API | `querySelector` sin resultado, «sin fecha de devolución», un campo vacío en una base de datos |

> `undefined` = nadie lo ha puesto. `null` = alguien ha decidido que está vacío.
:::

## Dónde aparecen

::: esencial
Conviene reconocer las situaciones típicas, porque en todas el tipo incluye `undefined` o `null`. (El `?.` de la segunda línea se explica [más abajo](#encadenamiento-opcional): de momento, léelo como «si existe».)

```ts twoslash
interface Member {
  id: number;
  name: string;
  phone?: string;
}
declare const members: Member[];
declare const cache: Map<number, Member>;
// ---cut---
const found = members.find((m) => m.id === 3);
// → found: Member | undefined
const phone = members[0]?.phone;
// → phone: string | undefined
const cached = cache.get(3);
// → cached: Member | undefined
const button = document.querySelector('button');
// → button: HTMLButtonElement | null
const saved = localStorage.getItem('theme');
// → saved: string | null
```
:::

En todos estos casos, usar el valor directamente es un error:

```ts twoslash
// @errors: 18048
interface Member {
  id: number;
  name: string;
}
declare const members: Member[];
// ---cut---
const found = members.find((m) => m.id === 3);
console.log(found.name);
```

## Comprobar antes de usar

::: esencial
La forma más clara: un `if` que descarta el caso vacío. Dentro de la rama, TypeScript sabe que el valor existe (narrowing):

```ts twoslash
interface Member {
  id: number;
  name: string;
}
declare const members: Member[];
// ---cut---
const found = members.find((m) => m.id === 3);

if (found !== undefined) {
  console.log(found.name);
  // → found: Member
}
```
:::

Cuando una función no puede continuar sin el valor, la **salida temprana** evita anidar:

```ts twoslash
interface Member {
  id: number;
  name: string;
}
// ---cut---
function welcome(members: Member[], id: number): string {
  const member = members.find((m) => m.id === id);
  if (member === undefined) {
    return 'Socio no encontrado';
  }
  return `Bienvenido, ${member.name}`;
}
```

## Encadenamiento opcional: `?.`

::: esencial
`?.` accede a una propiedad **solo si** lo de la izquierda existe. Si es `null` o `undefined`, se detiene y devuelve `undefined`, sin lanzar errores:

```ts twoslash
interface Member {
  id: number;
  name: string;
  address?: { city: string };
}
declare const members: Member[];
// ---cut---
const name = members.find((m) => m.id === 3)?.name;
// → name: string | undefined
const city = members[0]?.address?.city;
```

También sirve para llamar a funciones que pueden no existir: `onClose?.()`.
:::

::: info Nota
`?.` no elimina el `undefined`: lo **propaga**. El resultado sigue pudiendo faltar, y en algún momento habrá que decidir qué hacer con él.
:::

## Valor por defecto: `??`

::: esencial
`??` devuelve el valor de la derecha **solo si** el de la izquierda es `null` o `undefined`. Combinado con `?.`, resuelve el caso en una línea:

```ts twoslash
interface Member {
  id: number;
  name: string;
}
declare const members: Member[];
// ---cut---
const label = members.find((m) => m.id === 3)?.name ?? 'Socio desconocido';
// → label: string
```

Se lee de izquierda a derecha: *busca el socio → si existe, su nombre → si no, «Socio desconocido»*. Como el `??` garantiza un texto, el tipo final es `string`.
:::

### `??` frente a `||`

::: esencial
`||` también da un valor por defecto, pero salta con **cualquier valor falso**: `0`, `''`, `false`, `NaN`, `null` y `undefined`.

```ts twoslash
const stock = 0;

const withOr = stock || 10;
const withNullish = stock ?? 10;
```

| Expresión | Resultado | Por qué |
|---|---|---|
| `0 \|\| 10` | `10` | `0` es falso: lo trata como si no hubiera dato |
| `0 ?? 10` | `0` | `0` es un valor válido: solo `null`/`undefined` activan el `??` |
| `'' \|\| 'Anónimo'` | `'Anónimo'` | El texto vacío es falso |
| `'' ?? 'Anónimo'` | `''` | El texto vacío es un valor |

Para valores por defecto, usa **`??`**. Reserva `||` para condiciones lógicas.
:::

### Asignación por defecto: `??=`

::: esencial
`a ??= b` asigna `b` solo si `a` es `null` o `undefined`:

```ts twoslash
interface Settings {
  theme?: 'light' | 'dark';
}
const settings: Settings = {};

settings.theme ??= 'light';
```
:::

## Lo que no se hace: `!` y `as`

::: esencial
TypeScript ofrece dos formas de **silenciar** el aviso:

```ts
const found = members.find((m) => m.id === 3)!; // «no es undefined, confía en mí»
const same = members.find((m) => m.id === 3) as Member; // «trátalo como Member»
```

Ninguna de las dos **comprueba** nada. Si el socio no existe, el programa falla igualmente al ejecutar, con el mismo `Cannot read properties of undefined` que TypeScript intentaba evitar. Por eso en este curso están **prohibidas** salvo indicación expresa.
:::

::: tip Si de verdad «no puede faltar»
Compruébalo y lanza un error con un mensaje claro. Si alguna vez falta, sabrás exactamente qué y dónde. (El `<HTMLUListElement>` le dice a `querySelector` qué tipo de elemento buscas: ver [DOM tipado](./12-dom).)

```ts twoslash
const list = document.querySelector<HTMLUListElement>('#loans');
if (list === null) {
  throw new Error('Falta el elemento #loans en el HTML');
}
list.append('...');
```
:::

## Validar datos que llegan de fuera

::: esencial
Los datos que vienen de fuera del programa (una API, `localStorage`, un fichero JSON) **no tienen tipo garantizado**. Anotarlos no los convierte en correctos: hay que **comprobarlos**.

`JSON.parse` devuelve `any`, que apagaría las comprobaciones. Recógelo como `unknown` (el tipo de «no sé qué es», ver [Fundamentos](./01-fundamentos#any-frente-a-unknown)) y valida.

La validación se hace con una función `isPreferences` que mira, paso a paso, que el dato sea un objeto, que tenga `theme` con uno de los dos valores válidos y que tenga `fontSize` numérico. Su retorno `value is Preferences` significa «si devuelvo `true`, el dato es un `Preferences`»: es un *type guard*, explicado en [Uniones y narrowing](./02-uniones-narrowing#type-guards-propios).

```ts twoslash
interface Preferences {
  theme: 'light' | 'dark';
  fontSize: number;
}

function isPreferences(value: unknown): value is Preferences {
  return (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    (value.theme === 'light' || value.theme === 'dark') &&
    'fontSize' in value &&
    typeof value.fontSize === 'number'
  );
}

function loadPreferences(): Preferences {
  const fallback: Preferences = { theme: 'light', fontSize: 16 };
  const raw = localStorage.getItem('preferences');
  if (raw === null) return fallback;

  try {
    const data: unknown = JSON.parse(raw);
    return isPreferences(data) ? data : fallback; // si es válido, el dato; si no, el de reserva
  } catch {
    return fallback; // el texto guardado no era JSON válido
  }
}
```

La idea clave: **los tipos terminan en la frontera**. Dentro del programa confías en ellos; en el punto donde entran datos de fuera, se validan.
:::

## Ampliación

### Opcional frente a «puede ser `undefined`»

::: ampliacion
`phone?: string` y `phone: string | undefined` parecen iguales, pero no lo son: con la primera la propiedad **puede no estar**; con la segunda **debe estar**, aunque su valor sea `undefined`.

```ts twoslash
// @errors: 2741
interface A {
  phone?: string;
}
interface B {
  phone: string | undefined;
}

const a: A = {};
const b: B = {};
```

La opción `exactOptionalPropertyTypes` del `tsconfig` va más allá y prohíbe asignar `undefined` explícitamente a una propiedad opcional.
:::

### `NonNullable`

::: ampliacion
El utility type `NonNullable<T>` quita `null` y `undefined` de un tipo:

```ts twoslash
type MaybeName = string | null | undefined;
type Name = NonNullable<MaybeName>;
// → Name = string
```
:::

### Bibliotecas de validación

::: ampliacion
En proyectos grandes, escribir type guards a mano para cada respuesta de una API se vuelve pesado. Librerías como **Zod** o **Valibot** permiten describir el esquema una vez y obtener a la vez la validación en ejecución y el tipo de TypeScript. La idea es la misma de este tema: validar en la frontera.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Decidir qué pasa si falta el valor.

```ts
const title = book?.title ?? 'Sin título';
```
:::

::: evita
Silenciar el aviso sin comprobar.

```ts
const title = book!.title;
```
:::

</div>

<div class="wk-pair">

::: haz
Recibir los datos externos como `unknown` y validarlos.

```ts
const data: unknown = JSON.parse(raw);
if (isPreferences(data)) { /* ... */ }
```
:::

::: evita
Afirmar el tipo de datos externos sin comprobarlos.

```ts
const data = JSON.parse(raw) as Preferences;
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Usar un valor que puede faltar | `if (x !== undefined) { ... }` |
| Leer una propiedad si existe | `x?.prop` |
| Un valor por defecto | `x ?? 'por defecto'` |
| Asignar solo si está vacío | `x ??= valor` |
| Un dato externo sin tipo garantizado | `const data: unknown = ...` + type guard |
| Quitar `null` y `undefined` de un tipo | `NonNullable<T>` |

<PracticeLink topic="06-null-undefined" />

## Ver también

- [Uniones y narrowing](./02-uniones-narrowing): cómo estrecha TypeScript los tipos.
- [DOM tipado](./12-dom): `querySelector` y los elementos que pueden no existir.
- [Traductor de errores](./14-errores#x-is-possibly-undefined-18048): `is possibly 'undefined'`.
