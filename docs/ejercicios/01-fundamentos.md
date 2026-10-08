# Ejercicios · Fundamentos

Repasa antes: [Fundamentos](/guia/01-fundamentos). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Ponle tipos a un programa de JavaScript <span class="wk-level l1">básico</span>

Este código funciona en JavaScript, pero en TypeScript estricto da errores: los parámetros no tienen tipo y TypeScript no puede adivinarlos.

- Anota los **parámetros** y el **tipo de retorno** de las tres funciones.
- No anotes las variables de dentro: que las deduzca TypeScript.

Las comprobaciones ya dicen OK, porque el JavaScript es correcto. Aquí el ejercicio está resuelto cuando **desaparece todo el rojo**.

```ts twoslash playground
// @errors: 7006
function average(scores) {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return sum / scores.length;
}

function isPassed(score) {
  return score >= 5;
}

function gradeLabel(studentName, score) {
  return `${studentName}: ${score} (${isPassed(score) ? 'aprobado' : 'suspenso'})`;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('la media de [5, 7, 9] es 7', average([5, 7, 9]) === 7);
check('la media de una lista vacía es 0', average([]) === 0);
check('un 5 aprueba', isPassed(5) === true);
check('un 4.9 suspende', isPassed(4.9) === false);
check('la etiqueta de Ana con un 8', gradeLabel('Ana', 8) === 'Ana: 8 (aprobado)');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`scores` es una lista de números: `number[]`. Pregúntate qué devuelve cada función: un número, un booleano o un texto.
:::

::: details Solución
```ts twoslash run
function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return sum / scores.length;
}

function isPassed(score: number): boolean {
  return score >= 5;
}

function gradeLabel(studentName: string, score: number): string {
  return `${studentName}: ${score} (${isPassed(score) ? 'aprobado' : 'suspenso'})`;
}

check('la media de [5, 7, 9] es 7', average([5, 7, 9]) === 7);
check('la media de una lista vacía es 0', average([]) === 0);
check('un 5 aprueba', isPassed(5) === true);
check('un 4.9 suspende', isPassed(4.9) === false);
check('la etiqueta de Ana con un 8', gradeLabel('Ana', 8) === 'Ana: 8 (aprobado)');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

`sum` no se anota: TypeScript deduce que es `number` porque el valor inicial de `reduce` es `0`. Lo mismo con `acc` y `s`.
:::

## 2. De `any` a `unknown` <span class="wk-level l2">medio</span>

La función `describe` recibe un dato que llega de fuera y no se sabe qué es. Ahora usa `any`, así que TypeScript no comprueba nada: compila, pero falla con un número.

- Cambia `any` por `unknown`. Aparecerán errores: es lo que se busca.
- Corrígelos **comprobando el tipo** antes de usarlo. Debe devolver:
  - si es un texto: `texto de N letras`
  - si es un número: `número X`
  - en cualquier otro caso: `otra cosa`

```ts twoslash playground
function describe(value: any): string {
  // Tu código aquí: cambia any por unknown y comprueba el tipo
  return `texto de ${value.length} letras`;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('un texto', describe('hola') === 'texto de 4 letras');
check('un número', describe(42) === 'número 42');
check('un booleano', describe(true) === 'otra cosa');
check('null', describe(null) === 'otra cosa');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`typeof value === 'string'` es una comprobación que TypeScript entiende: dentro de ese `if`, `value` ya es un `string`. Ver [any frente a unknown](/guia/01-fundamentos#any-frente-a-unknown).
:::

::: details Solución
```ts twoslash run
function describe(value: unknown): string {
  if (typeof value === 'string') {
    return `texto de ${value.length} letras`;
  }
  if (typeof value === 'number') {
    return `número ${value}`;
  }
  return 'otra cosa';
}

check('un texto', describe('hola') === 'texto de 4 letras');
check('un número', describe(42) === 'número 42');
check('un booleano', describe(true) === 'otra cosa');
check('null', describe(null) === 'otra cosa');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Con `any`, `describe(42)` compilaba y devolvía `texto de undefined letras`. Con `unknown`, TypeScript obliga a tratar cada caso.
:::

## 3. Una función que nunca termina bien <span class="wk-level l3">reto</span>

Hay que convertir un texto como `'19.90'` en un número. Si el texto no es un número válido, el programa debe parar con un error claro.

- Escribe `fail(message: string)`: lanza un `Error` con ese mensaje. Piensa cuál es su **tipo de retorno**.
- Escribe `parsePrice(text: string): number`: convierte con `Number(text)`; si el resultado es `NaN`, llama a `fail` con el mensaje `Precio no válido: TEXTO`.

```ts twoslash playground
function fail(message: string) {
  // Tu código aquí
}

function parsePrice(text: string): number {
  // Tu código aquí
  return 0;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('"19.90" es 19.9', parsePrice('19.90') === 19.9);
check('"0" es 0', parsePrice('0') === 0);
check('"gratis" lanza un error', throwsWith(() => parsePrice('gratis'), 'Precio no válido: gratis'));

function throwsWith(fn: () => unknown, message: string): boolean {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof Error && error.message === message;
  }
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Una función que **siempre** lanza un error nunca llega a devolver nada, ni siquiera `undefined`: su retorno es `never`. Para comprobar `NaN`, usa `Number.isNaN(valor)` (`valor === NaN` siempre es falso).
:::

::: details Solución
```ts twoslash run
function fail(message: string): never {
  throw new Error(message);
}

function parsePrice(text: string): number {
  const price = Number(text);
  if (Number.isNaN(price)) {
    fail(`Precio no válido: ${text}`);
  }
  return price;
}

check('"19.90" es 19.9', parsePrice('19.90') === 19.9);
check('"0" es 0', parsePrice('0') === 0);
check('"gratis" lanza un error', throwsWith(() => parsePrice('gratis'), 'Precio no válido: gratis'));

function throwsWith(fn: () => unknown, message: string): boolean {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof Error && error.message === message;
  }
}

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Gracias a `never`, TypeScript sabe que después de `fail(...)` el código no continúa.
:::
