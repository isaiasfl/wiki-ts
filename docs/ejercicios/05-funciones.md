# Ejercicios · Funciones

Repasa antes: [Funciones](/guia/05-funciones). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Formatear precios <span class="wk-level l1">básico</span>

Escribe `formatPrice` con tres parámetros:

- `amount`: el importe, obligatorio.
- `currency`: la moneda; si no se indica, `'EUR'`.
- `decimals`: los decimales; si no se indica, `2`.

Devuelve el importe con esos decimales y la moneda detrás: `formatPrice(5)` da `5.00 EUR`.

Al abrirlo verás errores en las comprobaciones: la función aún no tiene parámetros. Desaparecen al escribirlos.

```ts twoslash playground
// @errors: 2554
function formatPrice() {
  // Tu código aquí: escribe los parámetros y el tipo de retorno
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('solo el importe', formatPrice(5) === '5.00 EUR');
check('con otra moneda', formatPrice(19.9, 'USD') === '19.90 USD');
check('sin decimales', formatPrice(1200, 'JPY', 0) === '1200 JPY');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Con valor por defecto no hace falta el `?`: `currency = 'EUR'`. Los decimales: `amount.toFixed(decimals)`.
:::

::: details Solución
```ts twoslash run
function formatPrice(amount: number, currency = 'EUR', decimals = 2): string {
  return `${amount.toFixed(decimals)} ${currency}`;
}

check('solo el importe', formatPrice(5) === '5.00 EUR');
check('con otra moneda', formatPrice(19.9, 'USD') === '19.90 USD');
check('sin decimales', formatPrice(1200, 'JPY', 0) === '1200 JPY');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

`currency` y `decimals` no se anotan: el valor por defecto ya dice que son `string` y `number`.
:::

## 2. Validar una contraseña <span class="wk-level l2">medio</span>

Un formulario de registro comprueba la contraseña con varias reglas. Cada regla es una **función** que recibe el texto y dice si lo cumple.

- Crea el tipo `Rule` para esas funciones.
- Escribe `failedRules(password, rules)`: devuelve los **nombres** de las reglas que no se cumplen.

```ts twoslash playground
// Tu tipo Rule aquí

const rules = {
  'al menos 8 caracteres': (text: string) => text.length >= 8,
  'algún número': (text: string) => /\d/.test(text),
  'alguna mayúscula': (text: string) => /[A-Z]/.test(text),
};

function failedRules(password: string, ruleSet: Record<string, any>): string[] {
  // Tu código aquí (cambia también any por Rule)
  return [];
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('una contraseña buena no falla nada', failedRules('Secreta123', rules).length === 0);
check('"abc" falla las tres', failedRules('abc', rules).length === 3);
check('"abcdefgh1" solo falla la mayúscula', failedRules('abcdefgh1', rules).join() === 'alguna mayúscula');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`type Rule = (text: string) => boolean;`. `Object.entries(ruleSet)` da pares `[nombre, regla]`: filtra los que dan `false` y quédate con el nombre.
:::

::: details Solución
```ts twoslash run
type Rule = (text: string) => boolean;

const rules: Record<string, Rule> = {
  'al menos 8 caracteres': (text) => text.length >= 8,
  'algún número': (text) => /\d/.test(text),
  'alguna mayúscula': (text) => /[A-Z]/.test(text),
};

function failedRules(password: string, ruleSet: Record<string, Rule>): string[] {
  return Object.entries(ruleSet)
    .filter(([, rule]) => !rule(password))
    .map(([ruleName]) => ruleName);
}

check('una contraseña buena no falla nada', failedRules('Secreta123', rules).length === 0);
check('"abc" falla las tres', failedRules('abc', rules).length === 3);
check('"abcdefgh1" solo falla la mayúscula', failedRules('abcdefgh1', rules).join() === 'alguna mayúscula');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Al anotar `rules` con `Record<string, Rule>`, ya no hace falta poner `(text: string)` en cada regla: TypeScript lo deduce por el tipo `Rule`. En `([, rule])` la coma inicial salta el primer elemento del par.
:::

## 3. Limitar intentos <span class="wk-level l3">reto</span>

Para evitar ataques a un formulario de acceso, solo se permiten unos pocos intentos.

Escribe `createAttemptLimiter(max)`: devuelve una **función** que, cada vez que se llama, dice si ese intento está permitido (`true`) o ya se han agotado (`false`). Cada limitador lleva su propia cuenta.

```ts twoslash playground
function createAttemptLimiter(max: number): () => boolean {
  // Tu código aquí
  return () => false;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const tryLogin = createAttemptLimiter(3);
const results = [tryLogin(), tryLogin(), tryLogin(), tryLogin()];
check('los tres primeros intentos valen', results.slice(0, 3).every((r) => r === true));
check('el cuarto ya no', results[3] === false);
const other = createAttemptLimiter(1);
check('cada limitador cuenta por separado', other() === true && other() === false);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Es un closure, como `createCounter` en [Funciones que devuelven funciones](/guia/05-funciones#funciones-que-devuelven-funciones): una variable `let used = 0` dentro de `createAttemptLimiter`, y la función devuelta la consulta y la incrementa. Fíjate en el tipo de retorno, `() => boolean`: «una función sin parámetros que devuelve un booleano».
:::

::: details Solución
```ts twoslash run
function createAttemptLimiter(max: number): () => boolean {
  let used = 0;
  return () => {
    if (used >= max) return false;
    used += 1;
    return true;
  };
}

const tryLogin = createAttemptLimiter(3);
const results = [tryLogin(), tryLogin(), tryLogin(), tryLogin()];
check('los tres primeros intentos valen', results.slice(0, 3).every((r) => r === true));
check('el cuarto ya no', results[3] === false);
const other = createAttemptLimiter(1);
check('cada limitador cuenta por separado', other() === true && other() === false);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Cada llamada a `createAttemptLimiter` crea su propia variable `used`, por eso `tryLogin` y `other` no se mezclan.
:::
