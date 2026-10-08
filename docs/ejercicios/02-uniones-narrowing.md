# Ejercicios · Uniones y narrowing

Repasa antes: [Uniones y narrowing](/guia/02-uniones-narrowing). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Tallas de camiseta <span class="wk-level l1">básico</span>

Una tienda de camisetas solo tiene tres tallas: `'S'`, `'M'` y `'L'`. Ahora la talla es un `string` cualquiera, así que se acepta `'XXL'` sin ningún aviso.

- Crea el tipo `Size` con las tres tallas permitidas.
- Úsalo en `priceFor`. Precios: S = 12, M = 14, L = 16.
- La última comprobación está **comentada**: quita las `//` del principio. Debe aparecer un error rojo, porque `'XXL'` no es una talla. Es la prueba de que tu tipo funciona; vuelve a comentarla para que no quede rojo.

```ts twoslash playground
function priceFor(size: string): number {
  // Tu código aquí
  return 0;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('una S cuesta 12', priceFor('S') === 12);
check('una M cuesta 14', priceFor('M') === 14);
check('una L cuesta 16', priceFor('L') === 16);
// priceFor('XXL'); // al quitar las // debe dar error

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`type Size = 'S' | 'M' | 'L';` y un `switch (size)` con un `case` por talla.
:::

::: details Solución
```ts twoslash run
type Size = 'S' | 'M' | 'L';

function priceFor(size: Size): number {
  switch (size) {
    case 'S':
      return 12;
    case 'M':
      return 14;
    case 'L':
      return 16;
  }
}

check('una S cuesta 12', priceFor('S') === 12);
check('una M cuesta 14', priceFor('M') === 14);
check('una L cuesta 16', priceFor('L') === 16);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Fíjate en que no hace falta un `return` después del `switch`: TypeScript sabe que los tres casos cubren todas las tallas posibles.
:::

## 2. Mostrar un valor de un formulario <span class="wk-level l2">medio</span>

Un campo de configuración puede guardar un texto, un número o un booleano. Escribe `formatValue` para mostrarlo así:

| Valor | Resultado |
|---|---|
| texto | entre comillas: `"Granada"` |
| número | con dos decimales: `3.50` |
| `true` / `false` | `sí` / `no` |

```ts twoslash playground
function formatValue(value: string | number | boolean): string {
  // Tu código aquí
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('un texto va entre comillas', formatValue('Granada') === '"Granada"');
check('un número con dos decimales', formatValue(3.5) === '3.50');
check('true es sí', formatValue(true) === 'sí');
check('false es no', formatValue(false) === 'no');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Pregunta con `typeof value === 'string'` y `typeof value === 'number'`. Lo que queda después de esos dos `if` solo puede ser un booleano. Para los decimales: `value.toFixed(2)`.
:::

::: details Solución
```ts twoslash run
function formatValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value ? 'sí' : 'no';
}

check('un texto va entre comillas', formatValue('Granada') === '"Granada"');
check('un número con dos decimales', formatValue(3.5) === '3.50');
check('true es sí', formatValue(true) === 'sí');
check('false es no', formatValue(false) === 'no');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

En la última línea, `value` ya es `boolean`: los otros dos casos salieron con `return`.
:::

## 3. Formas de pago <span class="wk-level l3">reto</span>

Una tienda acepta tres formas de pago, y cada una tiene datos distintos:

- **Tarjeta** (`'card'`): los cuatro últimos dígitos, `last4`.
- **Efectivo** (`'cash'`): nada más.
- **Bizum** (`'bizum'`): un teléfono, `phone`.

Tareas:

1. Crea la unión discriminada `Payment`, con la propiedad `method` como discriminante.
2. Escribe `describePayment` para que devuelva: `Tarjeta acabada en 1234`, `Efectivo` o `Bizum al 600111222`.
3. Añade un `default` con `never` para que, si un día se añade otra forma de pago, el compilador avise.

```ts twoslash playground
// 1. Tu tipo Payment aquí

function describePayment(payment: unknown): string {
  // 2 y 3. Tu código aquí (cambia también el tipo del parámetro)
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('tarjeta', describePayment({ method: 'card', last4: '1234' }) === 'Tarjeta acabada en 1234');
check('efectivo', describePayment({ method: 'cash' }) === 'Efectivo');
check('bizum', describePayment({ method: 'bizum', phone: '600111222' }) === 'Bizum al 600111222');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Mira el ejemplo de [switch exhaustivo con never](/guia/02-uniones-narrowing#switch-exhaustivo-con-never). Cada miembro de la unión es un objeto: `{ method: 'card'; last4: string }`.
:::

::: details Solución
```ts twoslash run
type Payment =
  | { method: 'card'; last4: string }
  | { method: 'cash' }
  | { method: 'bizum'; phone: string };

function describePayment(payment: Payment): string {
  switch (payment.method) {
    case 'card':
      return `Tarjeta acabada en ${payment.last4}`;
    case 'cash':
      return 'Efectivo';
    case 'bizum':
      return `Bizum al ${payment.phone}`;
    default: {
      const unhandled: never = payment;
      return unhandled;
    }
  }
}

check('tarjeta', describePayment({ method: 'card', last4: '1234' }) === 'Tarjeta acabada en 1234');
check('efectivo', describePayment({ method: 'cash' }) === 'Efectivo');
check('bizum', describePayment({ method: 'bizum', phone: '600111222' }) === 'Bizum al 600111222');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Prueba a añadir `| { method: 'paypal'; email: string }` al tipo: el `default` se pone en rojo hasta que añades su `case`.
:::
