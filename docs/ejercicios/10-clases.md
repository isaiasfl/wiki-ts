# Ejercicios · Clases

Repasa antes: [Clases](/guia/10-clases). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Un monedero <span class="wk-level l1">básico</span>

Crea la clase `Wallet`:

- Un campo **privado** con el saldo, que empieza en el valor que se pasa al crearlo.
- `deposit(amount)`: suma al saldo.
- `pay(amount)`: resta del saldo. Si no hay bastante, lanza un `Error` con el mensaje `Saldo insuficiente` y **no** cambia el saldo.
- Un getter `balance` para leer el saldo desde fuera (pero no cambiarlo).

Al abrirlo verás errores en las comprobaciones, porque la clase aún está vacía. Desaparecen a medida que la escribes.

```ts twoslash playground
// @errors: 2554 2339
class Wallet {
  // Tu código aquí
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
runChecks();

function runChecks(): void {
  const wallet = new Wallet(20);
  check('empieza con 20', wallet.balance === 20);
  wallet.deposit(15);
  check('tras ingresar 15, tiene 35', wallet.balance === 35);
  wallet.pay(30);
  check('tras pagar 30, tiene 5', wallet.balance === 5);
  let failed = false;
  try {
    wallet.pay(10);
  } catch (error) {
    failed = error instanceof Error && error.message === 'Saldo insuficiente';
  }
  check('pagar 10 sin saldo lanza un error', failed);
  check('y el saldo sigue en 5', wallet.balance === 5);
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Campo privado con `#`: `#balance: number;`. Se asigna en el `constructor(initial: number)`. El getter: `get balance(): number { return this.#balance; }`.
:::

::: details Solución
```ts twoslash run
class Wallet {
  #balance: number;

  constructor(initial: number) {
    this.#balance = initial;
  }

  get balance(): number {
    return this.#balance;
  }

  deposit(amount: number): void {
    this.#balance += amount;
  }

  pay(amount: number): void {
    if (amount > this.#balance) {
      throw new Error('Saldo insuficiente');
    }
    this.#balance -= amount;
  }
}

runChecks();

function runChecks(): void {
  const wallet = new Wallet(20);
  check('empieza con 20', wallet.balance === 20);
  wallet.deposit(15);
  check('tras ingresar 15, tiene 35', wallet.balance === 35);
  wallet.pay(30);
  check('tras pagar 30, tiene 5', wallet.balance === 5);
  let failed = false;
  try {
    wallet.pay(10);
  } catch (error) {
    failed = error instanceof Error && error.message === 'Saldo insuficiente';
  }
  check('pagar 10 sin saldo lanza un error', failed);
  check('y el saldo sigue en 5', wallet.balance === 5);
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Como solo hay getter, `wallet.balance = 1000` da error: el saldo solo cambia con `deposit` y `pay`, que aplican las reglas.
:::

## 2. Error de «no encontrado» <span class="wk-level l2">medio</span>

- Crea la clase `NotFoundError`, que herede de `Error`, con un campo de solo lectura `resource` (qué se buscaba). Su mensaje: `No existe RESOURCE con id ID`.
- Escribe `findOrThrow(list, id, resource)`: devuelve el elemento con ese `id` o lanza un `NotFoundError`.
- Escribe `describeSearch(list, id)`: llama a `findOrThrow` y devuelve el título encontrado o, si salta un `NotFoundError`, su mensaje. Cualquier otro error se vuelve a lanzar.

```ts twoslash playground
interface Film {
  id: number;
  title: string;
}

const films: Film[] = [{ id: 1, title: 'Origen' }];

// Tu clase NotFoundError aquí

function findOrThrow(list: Film[], id: number, resource: string): Film {
  // Tu código aquí
  return { id: 0, title: '' };
}

function describeSearch(list: Film[], id: number): string {
  // Tu código aquí
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('encuentra la película 1', describeSearch(films, 1) === 'Origen');
check('la 5 no existe', describeSearch(films, 5) === 'No existe la película con id 5');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Mira [Errores propios](/guia/10-clases#errores-propios): `super(mensaje)` en el constructor y `this.name = 'NotFoundError'`. En el `catch`, `error instanceof NotFoundError`. Al llamar: `findOrThrow(list, id, 'la película')`.
:::

::: details Solución
```ts twoslash run
interface Film {
  id: number;
  title: string;
}

const films: Film[] = [{ id: 1, title: 'Origen' }];

class NotFoundError extends Error {
  readonly resource: string;

  constructor(resource: string, id: number) {
    super(`No existe ${resource} con id ${id}`);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

function findOrThrow(list: Film[], id: number, resource: string): Film {
  const found = list.find((item) => item.id === id);
  if (found === undefined) {
    throw new NotFoundError(resource, id);
  }
  return found;
}

function describeSearch(list: Film[], id: number): string {
  try {
    return findOrThrow(list, id, 'la película').title;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return error.message;
    }
    throw error;
  }
}

check('encuentra la película 1', describeSearch(films, 1) === 'Origen');
check('la 5 no existe', describeSearch(films, 5) === 'No existe la película con id 5');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```
:::

## 3. Figuras con un contrato <span class="wk-level l3">reto</span>

- Escribe la interfaz `Shape`: un `label` de texto y un método `area()` que devuelve un número.
- Escribe las clases `Circle` (con `radius`) y `Rectangle` (con `width` y `height`) que **implementen** `Shape`. Los `label` son `'círculo'` y `'rectángulo'`.
- Escribe `totalArea(shapes: Shape[])`, que sume las áreas. No debe saber nada de círculos ni rectángulos.

Los errores iniciales («Cannot find name») desaparecen cuando existan las dos clases.

```ts twoslash playground
// @errors: 2304
// Tu interfaz Shape y tus clases aquí

function totalArea(shapes: any[]): number {
  // Tu código aquí (cambia any por Shape)
  return 0;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
runChecks();

function runChecks(): void {
  const shapes = [new Rectangle(2, 3), new Circle(1)];
  check('el rectángulo 2x3 mide 6', shapes[0]?.area() === 6);
  check('la etiqueta del círculo', shapes[1]?.label === 'círculo');
  check('el total es 6 + π', Math.abs(totalArea(shapes) - (6 + Math.PI)) < 1e-9);
  check('sin figuras, 0', totalArea([]) === 0);
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`class Circle implements Shape { readonly label = 'círculo'; readonly radius: number; constructor(radius: number) { ... } area(): number { ... } }`. El área del círculo es `Math.PI * radius ** 2`.
:::

::: details Solución
```ts twoslash run
interface Shape {
  readonly label: string;
  area(): number;
}

class Circle implements Shape {
  readonly label = 'círculo';
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  readonly label = 'rectángulo';
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

function totalArea(shapes: Shape[]): number {
  return shapes.reduce((acc, shape) => acc + shape.area(), 0);
}

runChecks();

function runChecks(): void {
  const shapes = [new Rectangle(2, 3), new Circle(1)];
  check('el rectángulo 2x3 mide 6', shapes[0]?.area() === 6);
  check('la etiqueta del círculo', shapes[1]?.label === 'círculo');
  check('el total es 6 + π', Math.abs(totalArea(shapes) - (6 + Math.PI)) < 1e-9);
  check('sin figuras, 0', totalArea([]) === 0);
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Para añadir un triángulo basta una clase nueva que implemente `Shape`: `totalArea` no cambia. La comprobación con `< 1e-9` evita comparar decimales con `===`, que puede fallar por redondeo.
:::
