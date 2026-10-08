# Fundamentos

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U1</span>
  <span><strong>En React</strong> todo lo demás se apoya en esto</span>
</div>

TypeScript es **JavaScript con tipos**. Todo el JavaScript que conoces sigue valiendo; lo que se añade son **anotaciones** que describen qué clase de valor es cada cosa. Con esa información, el compilador revisa el código **antes de ejecutarlo** y avisa de los errores mientras escribes.

> TypeScript no cambia lo que hace tu programa. Cambia **cuándo** descubres sus errores: en el editor, en lugar de delante del usuario.

## Qué aporta TypeScript

::: esencial
El mismo error, en JavaScript y en TypeScript:

```js
// JavaScript: no protesta. El fallo aparece al ejecutar.
function total(price, quantity) {
  return price * quantity;
}
total('20', 3); // 60 por casualidad (conversión implícita)
total('veinte', 3); // NaN
```

```ts twoslash
// @errors: 2345
function total(price: number, quantity: number): number {
  return price * quantity;
}

total('veinte', 3);
```

En TypeScript el error se ve **al escribir** la llamada, con el sitio exacto subrayado.
:::

Lo que gana un proyecto con TypeScript:

| Ventaja | En la práctica |
|---|---|
| Errores antes de ejecutar | Erratas en propiedades, argumentos que no encajan, valores que pueden faltar |
| Autocompletado fiable | El editor sabe qué propiedades y métodos tiene cada valor |
| Documentación viva | La firma de una función dice qué recibe y qué devuelve |
| Cambios seguros | Si renombras una propiedad, el compilador señala todos los sitios afectados |

## Del `.ts` al navegador

::: esencial
El navegador **solo ejecuta JavaScript**. Los tipos se **borran** antes de llegar a él: son información para el compilador, no código.

| Herramienta | Qué hace con los tipos | Cuándo se usa |
|---|---|---|
| **Vite** (`npm run dev`) | Los **borra** y ejecuta, **sin comprobarlos** | Mientras desarrollas: es instantáneo |
| **El editor** | Los comprueba en el fichero abierto | Mientras escribes |
| **`tsc`** (`npx tsc --noEmit`) | Los comprueba en **todo** el proyecto | Antes de entregar o publicar |

Por eso una página puede funcionar en el navegador y tener errores de tipos a la vez: **Vite enseña la página; `tsc` dice si está bien hecha**.
:::

::: warning Atención
`npm run build` en una plantilla de Vite ejecuta `tsc && vite build`: no deja construir para producción si hay errores de tipos. Comprueba con `npx tsc --noEmit` antes de dar algo por terminado.
:::

## Tipos básicos

::: esencial
Los tipos primitivos se escriben en **minúscula**:

```ts twoslash
const title: string = 'Dune';
const year: number = 1965;
const available: boolean = true;
```

| Tipo | Valores | Ejemplos |
|---|---|---|
| `string` | Texto | `'hola'`, `"hola"`, `` `hola ${name}` `` |
| `number` | Cualquier número: enteros y decimales | `42`, `3.14`, `-1`, `NaN` |
| `boolean` | Verdadero o falso | `true`, `false` |
| `null` | Vacío a propósito | `null` |
| `undefined` | Sin valor asignado | `undefined` |

No hay tipos distintos para enteros y decimales: todo es `number`.
:::

::: error
Escribir los tipos con mayúscula: `String`, `Number`, `Boolean`. Con mayúscula no son los tipos de un texto o un número normales, sino de unos objetos especiales de JavaScript (los que crea `new String('hola')`) que en la práctica no se usan nunca. Usa siempre la minúscula.
:::

## Inferencia: TypeScript deduce casi todo

::: esencial
No hace falta anotar todo. Si una variable se inicializa con un valor, TypeScript **deduce** su tipo:

```ts twoslash
// @errors: 2322
let pages = 412;
// → pages: number
pages = 'cuatrocientas';
```

La regla del curso:

> **Se anota en las fronteras; dentro se deja inferir.**

- **Fronteras** (se anotan): parámetros de funciones, tipo de retorno de funciones exportadas, datos que llegan de fuera (una API, un formulario).
- **Dentro** (se infiere): variables locales inicializadas, callbacks de `map` o `filter`, resultados de llamadas.
:::

<div class="wk-pair">

::: haz
Dejar que TypeScript deduzca lo evidente.

```ts
const books = ['Dune', 'Fundación'];
const total = books.length;
```
:::

::: evita
Repetir lo que el compilador ya sabe. Es ruido y hay que mantenerlo.

```ts
const books: string[] = ['Dune', 'Fundación'];
const total: number = books.length;
```
:::

</div>

### `const` frente a `let`

::: esencial
Con `const`, la variable nunca cambiará de valor, así que TypeScript se queda con **ese valor exacto como tipo**: `format` no es «un texto cualquiera», es justamente `'pdf'`. A esto se le llama **tipo literal**. Con `let` el valor puede cambiar más adelante, así que TypeScript deduce el tipo general, `string`:

```ts twoslash
const format = 'pdf';
// → format: "pdf"
let mode = 'pdf';
// → mode: string
```

De momento basta con saber que existe. Se vuelve importante cuando una función solo acepta unos pocos textos concretos (por ejemplo `'pdf' | 'epub'`): ver [Uniones de literales](./02-uniones-narrowing#uniones-de-literales).
:::

## Los tipos especiales

::: esencial
Cuatro tipos no describen datos normales, sino situaciones:

| Tipo | Significa | Cuándo aparece |
|---|---|---|
| `any` | «Desactiva las comprobaciones» | Nunca a propósito en este curso |
| `unknown` | «Puede ser cualquier cosa; compruébalo antes de usarlo» | Datos de fuera: JSON, `catch`, APIs |
| `void` | «Esta función no devuelve nada útil» | Funciones que solo hacen algo: pintar, guardar, mostrar |
| `never` | «Esto no puede ocurrir» | Casos imposibles y comprobaciones exhaustivas |
:::

### `any` frente a `unknown`

::: esencial
Los dos admiten cualquier valor, pero se comportan al revés:

```ts twoslash
// @errors: 18046
declare const fromApi: any;
declare const safe: unknown;
// ---cut---
fromApi.toUpperCase(); // any: el compilador no comprueba nada

safe.toUpperCase(); // unknown: obliga a comprobar primero

if (typeof safe === 'string') {
  safe.toUpperCase(); // ahora sí: dentro del if es string
}
```

Imagina que `fromApi` y `safe` son datos que han llegado de un servidor y no sabes qué contienen.

- `any` **apaga** TypeScript para ese valor y para todo lo que se calcula a partir de él. Te deja llamar a `toUpperCase` aunque el dato sea un número, y el error aparece al ejecutar.
- `unknown` es la versión **segura**: acepta cualquier valor, pero no deja usarlo hasta comprobar qué es.

El `if (typeof safe === 'string')` es esa comprobación: pregunta si es un texto y, dentro del `if`, TypeScript ya lo trata como `string`. Esta técnica se llama **narrowing** y se explica en el [siguiente tema](./02-uniones-narrowing#narrowing-comprobar-para-estrechar).
:::

::: tip Regla
Si no sabes qué tipo tiene algo, usa `unknown` y compruébalo. `any` está prohibido en el curso salvo indicación expresa.
:::

### `void`

::: esencial
Se usa como tipo de retorno de funciones que hacen algo pero no devuelven un resultado:

```ts twoslash
function logLoan(title: string): void {
  console.log(`Préstamo registrado: ${title}`);
}
```
:::

### `never`

::: esencial
Describe algo que **no puede pasar**. El caso más sencillo es una función que **nunca termina normalmente** porque siempre lanza un error: no devuelve nada, ni siquiera `undefined`, así que su retorno es `never`.

```ts twoslash
function fail(message: string): never {
  throw new Error(message);
}
```

No lo escribirás a menudo. Su uso más útil es que el compilador te avise cuando un `switch` se olvida de un caso; se ve en [switch exhaustivo](./02-uniones-narrowing#switch-exhaustivo-con-never), cuando ya conozcas las uniones.
:::

## Ampliación

### Ensanchamiento de tipos

::: ampliacion
Al inferir, TypeScript **ensancha** los literales a su tipo general cuando el valor puede cambiar. Ocurre con `let` y con las propiedades de los objetos, que se pueden reasignar:

```ts twoslash
const settings = { theme: 'dark', fontSize: 16 };
// → settings: { theme: string; fontSize: number; }
```

`theme` es `string`, no `'dark'`, porque `settings.theme` podría cambiar. Para conservar los literales existe `as const`: ver [Objetos](./03-objetos#as-const-valores-literales-y-de-solo-lectura).
:::

### El operador `typeof` en los tipos

::: ampliacion
Si escribes `typeof variable` **donde va un tipo** (después de `type X =` o de los dos puntos), TypeScript te da el tipo de esa variable. Sirve para no escribir dos veces la misma forma:

```ts twoslash
const defaultUser = { name: 'Invitado', role: 'reader', active: true };

type User = typeof defaultUser;
// → User = { name: string; role: string; active: boolean; }
```

No confundir con el `typeof` de JavaScript, que se ejecuta y devuelve un texto (`'string'`, `'number'`...). TypeScript usa ese segundo `typeof` para el narrowing.
:::

### Las opciones estrictas

::: ampliacion
`"strict": true` (activo por defecto desde TypeScript 6) agrupa varias comprobaciones. Las más importantes:

| Opción | Qué exige |
|---|---|
| `strictNullChecks` | `null` y `undefined` no encajan en otros tipos: obliga a tratarlos |
| `noImplicitAny` | Prohíbe los `any` deducidos (por ejemplo, parámetros sin tipo) |
| `strictFunctionTypes` | Comprueba con rigor los tipos de las funciones que se pasan como argumento |
| `useUnknownInCatchVariables` | El error de un `catch` es `unknown`, no `any` |

Las plantillas de Vite añaden otras útiles: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` y `erasableSyntaxOnly`.
:::

### TypeScript sin compilar

::: ampliacion
Las versiones recientes de Node.js ejecutan ficheros `.ts` directamente (`node script.ts`): **borran** los tipos al vuelo, igual que Vite, sin comprobarlos. Por eso solo admiten sintaxis que se pueda borrar sin generar código, y por eso las plantillas actuales activan `erasableSyntaxOnly`, que prohíbe `enum` y otras construcciones antiguas.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Anotar parámetros y retornos, y dejar que el resto se infiera.

```ts
function average(scores: number[]): number {
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return sum / scores.length;
}
```
:::

::: evita
Usar `any` para que «desaparezca el rojo». El error no se arregla: se esconde hasta que el programa falla.

```ts
function average(scores: any): any {
  return scores.reduce((acc: any, s: any) => acc + s) / scores.length;
}
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Un texto, un número, un booleano | `string`, `number`, `boolean` |
| Que TypeScript deduzca el tipo | Inicializar la variable, sin anotar |
| Un dato que puede ser cualquier cosa | `unknown`, y comprobarlo antes de usarlo |
| Una función que no devuelve nada | `: void` |
| Comprobar todo el proyecto | `npx tsc --noEmit` |

<PracticeLink topic="01-fundamentos" />

## Ver también

- [Uniones y narrowing](./02-uniones-narrowing): combinar tipos y comprobar cuál es.
- [null y undefined](./06-null-undefined): los valores que pueden faltar.
- [Clean code en TypeScript](./13-clean-code): por qué se evitan `any`, `as` y `!`.
