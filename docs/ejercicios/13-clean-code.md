# Ejercicios · Clean code

Repasa antes: [Clean code en TypeScript](/guia/13-clean-code). Cómo se hacen y se comprueban: [Ejercicios](./).

En el primero y el tercero el código **ya funciona**: las comprobaciones dicen OK desde el principio, y lo que hay que mejorar es cómo está escrito. Al terminar, deben seguir diciendo OK. El segundo es distinto: el código compila, pero esconde fallos que las comprobaciones destapan.

## 1. Nombres y números mágicos <span class="wk-level l1">básico</span>

Este cálculo del precio de una entrada de cine es correcto, pero nadie entiende qué hace. Mejóralo sin cambiar su comportamiento:

- Nombres que expliquen qué es cada cosa (la función, los parámetros y las variables).
- Constantes con nombre para los números.
- Mantén el nombre de la función `calc` para que la comprobación la encuentre, pero añade debajo una función bien nombrada y haz que `calc` la llame.

```ts twoslash playground
function calc(a: number, b: boolean, c: number): number {
  let x = a * 7.5;
  if (b) x = x * 0.8;
  if (c === 3) x = x - 2 * a;
  return x;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('2 entradas normales un lunes', calc(2, false, 1) === 15);
check('2 entradas con carné joven', calc(2, true, 1) === 12);
check('2 entradas un miércoles (día del espectador)', calc(2, false, 3) === 11);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Averigua qué es cada número: 7.5 es el precio, 0.8 un 20 % de descuento, 3 es el miércoles y 2 euros el descuento por entrada ese día.
:::

::: details Solución
```ts twoslash run
const TICKET_PRICE = 7.5;
const YOUTH_DISCOUNT = 0.2;
const WEDNESDAY = 3;
const WEDNESDAY_DISCOUNT_PER_TICKET = 2;

function ticketsTotal(tickets: number, hasYouthCard: boolean, weekday: number): number {
  let total = tickets * TICKET_PRICE;
  if (hasYouthCard) {
    total = total * (1 - YOUTH_DISCOUNT);
  }
  if (weekday === WEDNESDAY) {
    total = total - WEDNESDAY_DISCOUNT_PER_TICKET * tickets;
  }
  return total;
}

function calc(a: number, b: boolean, c: number): number {
  return ticketsTotal(a, b, c);
}

check('2 entradas normales un lunes', calc(2, false, 1) === 15);
check('2 entradas con carné joven', calc(2, true, 1) === 12);
check('2 entradas un miércoles (día del espectador)', calc(2, false, 3) === 11);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Ahora el código se lee como la regla del cine: precio por entrada, 20 % con carné joven y 2 euros menos por entrada los miércoles. Si el precio sube, se cambia en una línea.
:::

## 2. Fuera `any`, `as` y `!` <span class="wk-level l2">medio</span>

Esta función lee de `localStorage` la lista de favoritos de un usuario. Compila, pero tiene tres trampas: `any`, `as` y `!`. Si lo guardado está corrupto, falla de forma imprevisible.

Reescríbela sin ninguna de las tres: recibe el dato como `unknown`, valídalo y, si algo no encaja, devuelve una lista vacía.

```ts twoslash playground
function loadFavourites(raw: string | null): string[] {
  const data: any = JSON.parse(raw!);
  return data.favourites as string[];
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('lee una lista correcta', loadFavourites('{"favourites":["Dune","Coco"]}').join() === 'Dune,Coco');
check('sin nada guardado, lista vacía', safe(() => loadFavourites(null).length === 0));
check('con JSON roto, lista vacía', safe(() => loadFavourites('{roto').length === 0));
check('si no es una lista, lista vacía', safe(() => loadFavourites('{"favourites":"Dune"}').length === 0));
check('ignora lo que no sea texto', safe(() => loadFavourites('{"favourites":["Dune",3]}').join() === 'Dune'));

function safe(test: () => boolean): boolean {
  try {
    return test();
  } catch {
    return false;
  }
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Pasos: si `raw` es `null`, `[]`. `JSON.parse` dentro de `try`/`catch`, guardado como `unknown`. Comprueba que es un objeto con la propiedad `favourites`, que esa propiedad es un array (`Array.isArray`) y quédate solo con los textos: `filter((item) => typeof item === 'string')`.
:::

::: details Solución
```ts twoslash run
function loadFavourites(raw: string | null): string[] {
  if (raw === null) return [];

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }

  if (typeof data !== 'object' || data === null || !('favourites' in data)) return [];
  if (!Array.isArray(data.favourites)) return [];

  return data.favourites.filter((item): item is string => typeof item === 'string');
}

check('lee una lista correcta', loadFavourites('{"favourites":["Dune","Coco"]}').join() === 'Dune,Coco');
check('sin nada guardado, lista vacía', safe(() => loadFavourites(null).length === 0));
check('con JSON roto, lista vacía', safe(() => loadFavourites('{roto').length === 0));
check('si no es una lista, lista vacía', safe(() => loadFavourites('{"favourites":"Dune"}').length === 0));
check('ignora lo que no sea texto', safe(() => loadFavourites('{"favourites":["Dune",3]}').join() === 'Dune'));

function safe(test: () => boolean): boolean {
  try {
    return test();
  } catch {
    return false;
  }
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

El código original suspendía cuatro de las cinco comprobaciones: compilaba porque `any`, `as` y `!` apagaban justo las comprobaciones que habrían avisado. El `(item): item is string` es un pequeño type guard en línea: dice que el resultado del filtro son textos.
:::

## 3. Estados imposibles <span class="wk-level l3">reto</span>

Una subida de ficheros se modela con varios booleanos. El tipo permite combinaciones absurdas, como estar subiendo y haber terminado a la vez, y la función tiene que defenderse de ellas.

Rediseña el tipo `Upload` como una **unión discriminada** con cuatro estados: sin empezar, subiendo (con su porcentaje), terminada (con la URL del fichero) y fallida (con el motivo). Reescribe `uploadMessage` con un `switch`.

```ts twoslash playground
interface Upload {
  isUploading: boolean;
  isDone: boolean;
  progress?: number;
  url?: string;
  error?: string;
}

function uploadMessage(upload: Upload): string {
  if (upload.error) return `Error: ${upload.error}`;
  if (upload.isDone && upload.url) return `Subido: ${upload.url}`;
  if (upload.isUploading) return `Subiendo... ${upload.progress ?? 0} %`;
  return 'Elige un fichero';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
// Cuando cambies el tipo, cambia también estos cuatro objetos al formato nuevo.
check('sin empezar', uploadMessage({ isUploading: false, isDone: false }) === 'Elige un fichero');
check('subiendo', uploadMessage({ isUploading: true, isDone: false, progress: 40 }) === 'Subiendo... 40 %');
check('terminada', uploadMessage({ isUploading: false, isDone: true, url: '/f/1.pdf' }) === 'Subido: /f/1.pdf');
check('fallida', uploadMessage({ isUploading: false, isDone: false, error: 'demasiado grande' }) === 'Error: demasiado grande');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`type Upload = { status: 'idle' } | { status: 'uploading'; progress: number } | ...`. Con el tipo nuevo, cada dato solo existe en el estado donde tiene sentido: `url` solo en `'done'`.
:::

::: details Solución
```ts twoslash run
type Upload =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number }
  | { status: 'done'; url: string }
  | { status: 'failed'; reason: string };

function uploadMessage(upload: Upload): string {
  switch (upload.status) {
    case 'idle':
      return 'Elige un fichero';
    case 'uploading':
      return `Subiendo... ${upload.progress} %`;
    case 'done':
      return `Subido: ${upload.url}`;
    case 'failed':
      return `Error: ${upload.reason}`;
  }
}

check('sin empezar', uploadMessage({ status: 'idle' }) === 'Elige un fichero');
check('subiendo', uploadMessage({ status: 'uploading', progress: 40 }) === 'Subiendo... 40 %');
check('terminada', uploadMessage({ status: 'done', url: '/f/1.pdf' }) === 'Subido: /f/1.pdf');
check('fallida', uploadMessage({ status: 'failed', reason: 'demasiado grande' }) === 'Error: demasiado grande');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Desaparecen el `?? 0` y las comprobaciones defensivas: con la unión, una subida terminada **siempre** tiene URL, y `{ status: 'done' }` sin `url` ni siquiera compila.
:::
