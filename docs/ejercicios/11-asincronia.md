# Ejercicios · Asincronía

Repasa antes: [Asincronía](/guia/11-asincronia). Cómo se hacen y se comprueban: [Ejercicios](./).

Para no depender de un servidor real, los ejercicios usan una **API simulada**: `fakeWeatherApi(city)` tarda 100 ms y devuelve una promesa con la temperatura. Si la ciudad no existe, la promesa se **rechaza** con un error. Se usa igual que se usaría `fetch`.

## 1. Esperar una respuesta <span class="wk-level l1">básico</span>

Escribe `weatherLabel(city)`: pide la temperatura a la API y devuelve un texto como `Granada: 21 °C`. Piensa qué tipo de retorno tiene una función `async`.

```ts twoslash playground
function fakeWeatherApi(city: string): Promise<{ temp: number }> {
  const temps: Record<string, number> = { Granada: 21, Sevilla: 27, Soria: 9 };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temp = temps[city];
      if (temp === undefined) reject(new Error(`Ciudad desconocida: ${city}`));
      else resolve({ temp });
    }, 100);
  });
}

function weatherLabel(city: string) {
  // Tu código aquí: hazla async y anota su retorno
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
async function runChecks(): Promise<void> {
  check('Granada a 21', (await weatherLabel('Granada')) === 'Granada: 21 °C');
  check('Soria a 9', (await weatherLabel('Soria')) === 'Soria: 9 °C');
}
runChecks();

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`async function weatherLabel(city: string): Promise<string>`. Dentro: `const data = await fakeWeatherApi(city);`.
:::

::: details Solución
```ts twoslash run
function fakeWeatherApi(city: string): Promise<{ temp: number }> {
  const temps: Record<string, number> = { Granada: 21, Sevilla: 27, Soria: 9 };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temp = temps[city];
      if (temp === undefined) reject(new Error(`Ciudad desconocida: ${city}`));
      else resolve({ temp });
    }, 100);
  });
}

async function weatherLabel(city: string): Promise<string> {
  const data = await fakeWeatherApi(city);
  return `${city}: ${data.temp} °C`;
}

async function runChecks(): Promise<void> {
  check('Granada a 21', (await weatherLabel('Granada')) === 'Granada: 21 °C');
  check('Soria a 9', (await weatherLabel('Soria')) === 'Soria: 9 °C');
}
runChecks();

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Sin el `await`, `data` sería una promesa y `data.temp` daría error de tipos: así te avisa TypeScript del olvido más frecuente.
:::

## 2. Cuando la API falla <span class="wk-level l2">medio</span>

Escribe `safeWeatherLabel(city)`: igual que el anterior, pero si la API falla **no** debe lanzar el error, sino devolver `Sin datos de CIUDAD (MENSAJE DEL ERROR)`.

```ts twoslash playground
function fakeWeatherApi(city: string): Promise<{ temp: number }> {
  const temps: Record<string, number> = { Granada: 21, Sevilla: 27, Soria: 9 };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temp = temps[city];
      if (temp === undefined) reject(new Error(`Ciudad desconocida: ${city}`));
      else resolve({ temp });
    }, 100);
  });
}

async function safeWeatherLabel(city: string): Promise<string> {
  // Tu código aquí
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
async function runChecks(): Promise<void> {
  check('Sevilla funciona', (await safeWeatherLabel('Sevilla')) === 'Sevilla: 27 °C');
  check('Atlantis no existe', (await safeWeatherLabel('Atlantis')) === 'Sin datos de Atlantis (Ciudad desconocida: Atlantis)');
}
runChecks();

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`try { ... } catch (error) { ... }`. En el `catch`, `error` es `unknown`: para leer su mensaje, comprueba antes `error instanceof Error`.
:::

::: details Solución
```ts twoslash run
function fakeWeatherApi(city: string): Promise<{ temp: number }> {
  const temps: Record<string, number> = { Granada: 21, Sevilla: 27, Soria: 9 };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temp = temps[city];
      if (temp === undefined) reject(new Error(`Ciudad desconocida: ${city}`));
      else resolve({ temp });
    }, 100);
  });
}

async function safeWeatherLabel(city: string): Promise<string> {
  try {
    const data = await fakeWeatherApi(city);
    return `${city}: ${data.temp} °C`;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido';
    return `Sin datos de ${city} (${message})`;
  }
}

async function runChecks(): Promise<void> {
  check('Sevilla funciona', (await safeWeatherLabel('Sevilla')) === 'Sevilla: 27 °C');
  check('Atlantis no existe', (await safeWeatherLabel('Atlantis')) === 'Sin datos de Atlantis (Ciudad desconocida: Atlantis)');
}
runChecks();

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```
:::

## 3. Varias ciudades a la vez <span class="wk-level l3">reto</span>

Escribe `allLabels(cities)`: devuelve las etiquetas de todas las ciudades, en el mismo orden. Las peticiones deben ir **en paralelo**: con tres ciudades de 100 ms cada una, todo debe tardar unos 100 ms, no 300 (la comprobación lo mide).

Si alguna ciudad falla, su etiqueta debe ser la de error del ejercicio anterior, y las demás deben salir igual.

```ts twoslash playground
function fakeWeatherApi(city: string): Promise<{ temp: number }> {
  const temps: Record<string, number> = { Granada: 21, Sevilla: 27, Soria: 9 };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temp = temps[city];
      if (temp === undefined) reject(new Error(`Ciudad desconocida: ${city}`));
      else resolve({ temp });
    }, 100);
  });
}

async function safeWeatherLabel(city: string): Promise<string> {
  try {
    const data = await fakeWeatherApi(city);
    return `${city}: ${data.temp} °C`;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido';
    return `Sin datos de ${city} (${message})`;
  }
}

async function allLabels(cities: string[]): Promise<string[]> {
  // Tu código aquí
  return [];
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
async function runChecks(): Promise<void> {
  const start = Date.now();
  const labels = await allLabels(['Granada', 'Atlantis', 'Soria']);
  const elapsed = Date.now() - start;
  check('tres etiquetas en orden', labels.join(' | ') === 'Granada: 21 °C | Sin datos de Atlantis (Ciudad desconocida: Atlantis) | Soria: 9 °C');
  check(`en paralelo (${elapsed} ms, menos de 250)`, elapsed < 250);
}
runChecks();

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`cities.map(safeWeatherLabel)` crea **todas** las promesas a la vez (todas empiezan ya). `Promise.all` espera a que terminen y devuelve los resultados en el mismo orden. Como `safeWeatherLabel` nunca rechaza, un fallo no tumba a las demás.
:::

::: details Solución
```ts twoslash run
function fakeWeatherApi(city: string): Promise<{ temp: number }> {
  const temps: Record<string, number> = { Granada: 21, Sevilla: 27, Soria: 9 };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temp = temps[city];
      if (temp === undefined) reject(new Error(`Ciudad desconocida: ${city}`));
      else resolve({ temp });
    }, 100);
  });
}

async function safeWeatherLabel(city: string): Promise<string> {
  try {
    const data = await fakeWeatherApi(city);
    return `${city}: ${data.temp} °C`;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido';
    return `Sin datos de ${city} (${message})`;
  }
}

async function allLabels(cities: string[]): Promise<string[]> {
  return Promise.all(cities.map((city) => safeWeatherLabel(city)));
}

async function runChecks(): Promise<void> {
  const start = Date.now();
  const labels = await allLabels(['Granada', 'Atlantis', 'Soria']);
  const elapsed = Date.now() - start;
  check('tres etiquetas en orden', labels.join(' | ') === 'Granada: 21 °C | Sin datos de Atlantis (Ciudad desconocida: Atlantis) | Soria: 9 °C');
  check(`en paralelo (${elapsed} ms, menos de 250)`, elapsed < 250);
}
runChecks();

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Compáralo con un `for...of` con `await` dentro: también funciona, pero espera cada ciudad antes de pedir la siguiente y tarda 300 ms. La comprobación de tiempo fallaría.
:::
