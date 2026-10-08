# Clases

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U8</span>
  <span><strong>En React</strong> casi no se usan: componentes y hooks son funciones</span>
</div>

Una **clase** agrupa datos y las funciones que trabajan con ellos en una sola pieza, y permite crear muchos objetos con la misma forma. TypeScript añade a las clases de JavaScript la comprobación de tipos y el control de qué es público y qué privado.

En el desarrollo web moderno las clases se usan **lo justo**: React trabaja con funciones, y la mayoría de los datos se manejan como objetos simples. Siguen siendo la mejor opción en dos casos: **errores propios** y piezas que **guardan estado interno** con reglas que hay que proteger.

## Campos, constructor y métodos

::: esencial
```ts twoslash
class Timer {
  readonly label: string;
  seconds = 0;
  #intervalId: number | undefined;

  constructor(label: string) {
    this.label = label;
  }

  start(): void {
    this.#intervalId = setInterval(() => {
      this.seconds += 1;
    }, 1000);
  }

  stop(): void {
    clearInterval(this.#intervalId);
  }
}

const reading = new Timer('Lectura');
reading.start();
```

Qué ocurre:

1. `new Timer('Lectura')` crea un objeto nuevo y ejecuta el `constructor`, que guarda la etiqueta.
2. Dentro de la clase, `this` es **el objeto concreto** con el que se está trabajando: `this.seconds` es el contador de `reading`, no el de otro temporizador.
3. `reading.start()` arranca un intervalo que suma 1 a `seconds` cada segundo. El identificador del intervalo se guarda en `#intervalId` para poder pararlo después con `stop()`. La `#` lo hace **privado**: solo la propia clase puede usarlo (se explica más abajo).
:::

| Parte | Para qué |
|---|---|
| Campos (`seconds = 0`) | Los datos de cada objeto, con su tipo y su valor inicial |
| `constructor` | Se ejecuta al hacer `new`: recibe los datos iniciales |
| Métodos (`start()`) | Funciones que trabajan con los datos del objeto a través de `this` |
| `readonly` | El campo no se puede reasignar después del constructor |

::: error
Declarar los campos en los parámetros del constructor, una sintaxis antigua muy habitual en tutoriales. En proyectos Vite actuales **no está permitida**, porque genera código al compilar:

```ts twoslash
// @errors: 1294
// @erasableSyntaxOnly: true
class Timer {
  constructor(private readonly label: string) {}
}
```

Declara los campos de forma explícita, como en el ejemplo anterior.
:::

## Privacidad: `#privado` frente a `private`

::: esencial
Hay dos formas de que un campo no sea accesible desde fuera:

```ts twoslash
// @errors: 2341 18013
class Account {
  private balance = 0;
  #pin = '1234';
}

const account = new Account();
account.balance;
account.#pin;
```

| | `private` | `#campo` |
|---|---|---|
| Quién lo impone | Solo TypeScript, al compilar | JavaScript, también **en ejecución** |
| ¿Se puede saltar? | Sí, desde JavaScript | No |
| Recomendado | Código antiguo | **Código nuevo** |
:::

## Getters

::: esencial
Un `get` se usa como una propiedad, pero se **calcula** cada vez que se lee. Ideal para datos derivados:

```ts twoslash
class Cart {
  #items: { name: string; price: number; quantity: number }[] = [];

  add(name: string, price: number, quantity = 1): void {
    this.#items = [...this.#items, { name, price, quantity }];
  }

  get total(): number {
    return this.#items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }
}

const cart = new Cart();
cart.add('Cuaderno', 3.5, 2);
cart.total; // 7: se lee sin paréntesis
```
:::

## Implementar una interfaz

::: esencial
`implements` obliga a la clase a cumplir un contrato. Si falta algún método, el error aparece en la propia clase:

```ts twoslash
// @errors: 2420
interface KeyValueStore {
  save(key: string, value: string): void;
  load(key: string): string | null;
}

class MemoryStore implements KeyValueStore {
  #data = new Map<string, string>();

  save(key: string, value: string): void {
    this.#data.set(key, value);
  }
}
```

Permite tener varias implementaciones intercambiables del mismo contrato: en memoria para las pruebas, con `localStorage` en el navegador.
:::

## Errores propios

::: esencial
Es el uso de clases que verás en todos los proyectos. Heredar de `Error` permite crear tipos de error con nombre y datos extra, y distinguirlos con `instanceof`:

```ts twoslash
class ValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateEmail(email: string): string {
  if (!email.includes('@')) {
    throw new ValidationError('email', 'El correo no es válido');
  }
  return email.trim().toLowerCase();
}

try {
  validateEmail('ana.example.com');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Campo ${error.field}: ${error.message}`);
    // → error: ValidationError
  } else {
    throw error;
  }
}
```

- `super(message)` llama al constructor de `Error`.
- Asignar `this.name` hace que el error se identifique bien en la consola.
- En el `catch`, `instanceof` estrecha el tipo y da acceso a `field`.
:::

## Ampliación

### Miembros estáticos

::: ampliacion
Un miembro `static` pertenece a la **clase**, no a cada objeto. Se usa para constantes y para funciones que crean objetos:

```ts twoslash
class Money {
  static readonly CURRENCY = 'EUR';
  readonly cents: number;

  constructor(cents: number) {
    this.cents = cents;
  }

  static fromEuros(euros: number): Money {
    return new Money(Math.round(euros * 100));
  }
}

const price = Money.fromEuros(19.99);
```
:::

### Herencia y composición

::: ampliacion
`extends` permite que una clase herede de otra, pero las jerarquías profundas se vuelven rígidas: un cambio en la clase base afecta a todas las hijas. En código moderno se prefiere la **composición**: objetos que **contienen** a otros y les delegan trabajo.

```ts twoslash
interface Notifier {
  send(message: string): void;
}

class LoanService {
  readonly #notifier: Notifier;

  constructor(notifier: Notifier) {
    this.#notifier = notifier;
  }

  lend(title: string): void {
    this.#notifier.send(`Has tomado prestado «${title}»`);
  }
}

const service = new LoanService({ send: (m) => console.log(m) });
```

`LoanService` no sabe si el aviso va por consola, por correo o por una notificación del navegador: solo necesita **algo que tenga un método `send`**, que se lo pasan al crearlo. Para cambiar el tipo de aviso no hay que tocar `LoanService`, solo pasarle otro `Notifier`. (En los libros de diseño esto se llama *inversión de dependencias*.)
:::

### Clase u objeto con funciones

::: ampliacion
Muchas veces una clase se puede sustituir por un **closure** ([explicado en Funciones](./05-funciones#funciones-que-devuelven-funciones)) que devuelve un objeto con funciones, sin `this` ni `new`:

```ts twoslash
function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    get value() {
      return count;
    },
  };
}

const counter = createCounter();
counter.increment();
```

Es el estilo de los hooks de React. Ninguno es «mejor»: elige el que exprese más claramente la idea.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Errores propios con `extends Error` y comprobación con `instanceof`.

```ts
if (error instanceof ValidationError) { /* ... */ }
```
:::

::: evita
Lanzar textos o comparar mensajes para saber qué ha fallado.

```ts
throw 'error de validación';
if (error.message.includes('correo')) { /* ... */ }
```
:::

</div>

<div class="wk-pair">

::: haz
Campos privados con `#` y declaración explícita.

```ts
#items: Item[] = [];
```
:::

::: evita
Clases solo para agrupar funciones sin estado: un módulo con exportaciones hace lo mismo.

```ts
class MathUtils {
  static double(n: number) { return n * 2; }
}
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Un campo con valor inicial | `seconds = 0;` |
| Un campo privado | `#campo` |
| Un campo que no cambie | `readonly campo: Tipo;` |
| Un dato calculado | `get total(): number { ... }` |
| Cumplir un contrato | `class X implements Interfaz` |
| Un error propio | `class MiError extends Error` + `instanceof` |

<PracticeLink topic="10-clases" />

## Ver también

- [Uniones y narrowing](./02-uniones-narrowing#instanceof-clases-y-errores): `instanceof`.
- [Asincronía](./11-asincronia): tratar errores en `try/catch`.
- [Funciones](./05-funciones#funciones-que-devuelven-funciones): closures.
