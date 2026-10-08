# Asincronía

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U7</span>
  <span><strong>En React</strong> cargar datos, estados de carga, cancelar peticiones</span>
</div>

Las operaciones que tardan (pedir datos a un servidor, esperar un temporizador, leer un fichero) no bloquean el programa: se lanzan, y su resultado llega **más tarde**.

Es como pedir en un restaurante de comida rápida: pagas y te dan un **ticket con un número**. El ticket no es la comida, pero te asegura que llegará (o que te avisarán si no queda). Mientras tanto puedes sentarte. Una **promesa** es ese ticket: representa un resultado que aún no está. TypeScript describe con `Promise<T>` **qué dará** la promesa cuando se resuelva, y obliga a tratar los errores con cuidado.

Los ejemplos usan una API del tiempo.

## `Promise<T>`

::: esencial
`Promise<T>` se lee *«una promesa que acabará dando un `T`»*. No es el dato: es la **promesa** de que llegará.

```ts twoslash
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const response = fetch('https://api.example.com/weather?city=Granada');
// → response: Promise<Response>
```

`fetch` no devuelve la respuesta, sino una `Promise<Response>`: el ticket de una respuesta que llegará.

`wait` muestra cómo se crea una promesa a mano: `new Promise` recibe una función con `resolve`, que es «el aviso de que ya está». Aquí se llama a `resolve` pasados `ms` milisegundos. `Promise<void>` indica que la promesa avisa de que ha terminado, pero no entrega ningún dato. Crear promesas a mano es poco habitual: lo normal es usar las que devuelven `fetch` y otras funciones.
:::

## `async` y `await`

::: esencial
- Una función `async` **siempre devuelve una promesa**: si devuelve un `T`, su tipo es `Promise<T>`.
- `await` **espera** a que la promesa se resuelva y da el valor de dentro.

```ts twoslash
async function getTemperature(city: string): Promise<number> {
  const response = await fetch(`https://api.example.com/weather?city=${city}`);
  const data: unknown = await response.json();
  if (typeof data === 'object' && data !== null && 'temp' in data && typeof data.temp === 'number') {
    return data.temp;
  }
  throw new Error('La respuesta no trae la temperatura');
}

const temperature = getTemperature('Granada');
// → temperature: Promise<number>
```

Línea a línea: `await fetch(...)` espera a que llegue la respuesta; `await response.json()` espera a que se lea su contenido, que se recibe como `unknown` porque no sabemos qué ha enviado el servidor; el `if` comprueba que traiga una temperatura numérica ([narrowing](./02-uniones-narrowing#narrowing-comprobar-para-estrechar)).

Fíjate: dentro de la función se devuelve un `number`, pero fuera se recibe una `Promise<number>`. Para obtener el número hay que hacer `await getTemperature('Granada')` dentro de otra función `async`.
:::

::: error
Olvidar el `await`. El código no falla al escribirlo, pero se trabaja con la **promesa** en lugar del dato:

```ts twoslash
// @errors: 2365
declare function getTemperature(city: string): Promise<number>;
// ---cut---
async function isHot(city: string): Promise<boolean> {
  const temp = getTemperature(city); // falta await
  return temp > 30;
}
```
:::

## Tratar errores: `try` / `catch`

::: esencial
Si una promesa falla, `await` lanza el error. Se captura con `try` / `catch`. En el `catch`, el error es **`unknown`**: cualquier cosa puede haberse lanzado, así que hay que comprobarlo antes de usarlo.

```ts twoslash
async function loadForecast(city: string): Promise<string> {
  try {
    const response = await fetch(`https://api.example.com/forecast?city=${city}`);
    if (!response.ok) {
      throw new Error(`El servidor respondió ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    // → error: unknown
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return `No se pudo cargar la previsión: ${message}`;
  }
}
```
:::

::: warning Atención: `fetch` no falla con los errores HTTP
`fetch` **solo rechaza** la promesa si no hay conexión. Una respuesta `404` o `500` llega como una respuesta normal. Comprueba **siempre** `response.ok` (o `response.status`) y lanza tú el error.
:::

## `fetch` tipado: de `unknown` a datos fiables

::: esencial
`response.json()` devuelve `Promise<any>`. Si se asigna directamente a un tipo, TypeScript **se lo cree sin comprobar nada**:

```ts
const weather: Weather = await response.json(); // compila, pero no garantiza nada
```

La forma segura tiene tres pasos: **recibir como `unknown`**, **validar** y **adaptar** al formato que usa la aplicación.

¿Por qué dos interfaces? La API manda los datos a su manera (la ciudad se llama `name`, la temperatura está dentro de `main`...). En lugar de usar ese formato raro por toda la aplicación, se define el nuestro (`Weather`) y una función que traduce de uno a otro. La función `isWeatherDto` es un [type guard](./02-uniones-narrowing#type-guards-propios): revisa propiedad por propiedad que la respuesta tenga lo que esperamos y, si algo falla, devuelve `false`.

```ts twoslash
// 1. Lo que la aplicación necesita
interface Weather {
  city: string;
  temperature: number;
  description: string;
}

// 2. Lo que envía la API (su formato, no el nuestro)
interface WeatherDto {
  name: string;
  main: { temp: number };
  weather: { description: string }[];
}

function isWeatherDto(value: unknown): value is WeatherDto {
  if (typeof value !== 'object' || value === null) return false;
  if (!('name' in value) || typeof value.name !== 'string') return false;
  if (!('main' in value) || typeof value.main !== 'object' || value.main === null) return false;
  if (!('temp' in value.main) || typeof value.main.temp !== 'number') return false;
  return 'weather' in value && Array.isArray(value.weather);
}

// 3. Adaptador: del formato de la API al nuestro
function toWeather(dto: WeatherDto): Weather {
  return {
    city: dto.name,
    temperature: Math.round(dto.main.temp),
    description: dto.weather[0]?.description ?? 'sin datos',
  };
}

async function fetchWeather(city: string): Promise<Weather> {
  const response = await fetch(`https://api.example.com/weather?q=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al pedir el tiempo de ${city}`);
  }
  const data: unknown = await response.json();
  if (!isWeatherDto(data)) {
    throw new Error('La respuesta de la API no tiene el formato esperado');
  }
  return toWeather(data);
}
```

- **DTO** (*Data Transfer Object*): el tipo de los datos **tal como llegan**.
- **Adaptador**: la función que los convierte al formato de la aplicación.

Si la API cambia, solo se tocan el DTO y el adaptador; el resto del programa sigue igual.
:::

## Varias peticiones a la vez

::: esencial
`Promise.all` lanza varias promesas **en paralelo** y espera a todas. TypeScript conserva el tipo de cada posición:

```ts twoslash
declare function fetchTemperature(city: string): Promise<number>;
declare function fetchAlerts(region: string): Promise<string[]>;
// ---cut---
async function dashboard(): Promise<void> {
  const [temperature, alerts] = await Promise.all([
    fetchTemperature('Granada'),
    fetchAlerts('Andalucía'),
  ]);
  console.log(temperature, alerts);
  // → alerts: string[]
}
```

Si **una** falla, `Promise.all` falla entera. Si quieres los resultados de todas aunque alguna falle, usa `Promise.allSettled`.
:::

::: error
Esperar una detrás de otra peticiones que no dependen entre sí. Cada `await` espera a la anterior, y el tiempo total es la suma:

```ts
const temperature = await fetchTemperature('Granada'); // 1 s
const alerts = await fetchAlerts('Andalucía'); // +1 s
```
:::

## Modelar el estado de una petición

::: esencial
Mientras una petición está en curso, la interfaz tiene que saber en qué punto está. Una **unión discriminada** describe solo los estados posibles:

```ts twoslash
interface Weather {
  city: string;
  temperature: number;
}
// ---cut---
type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Weather }
  | { status: 'error'; message: string };
```

Ver [Uniones discriminadas](./02-uniones-narrowing#uniones-discriminadas) y su uso en [React](./15-react).
:::

## Ampliación

### Cancelar con `AbortController`

::: ampliacion
Si el usuario cambia de ciudad antes de que llegue la respuesta anterior, conviene **cancelar** la petición vieja para que no sobrescriba a la nueva:

```ts twoslash
let controller: AbortController | undefined;

async function search(city: string): Promise<string | undefined> {
  controller?.abort(); // cancela la búsqueda anterior, si la hay
  controller = new AbortController();

  try {
    const response = await fetch(`https://api.example.com/weather?q=${city}`, {
      signal: controller.signal,
    });
    return await response.text();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return undefined; // cancelada a propósito: no es un error
    }
    throw error;
  }
}
```

En React se usa el mismo mecanismo dentro de `useEffect`, cancelando en la función de limpieza.
:::

### Tiempo límite

::: ampliacion
`AbortSignal.timeout(ms)` crea una señal que cancela sola pasado ese tiempo:

```ts twoslash
async function fetchWithTimeout(url: string): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(5000) });
}
```

Si la respuesta tarda más de 5 segundos, la promesa se rechaza con un error `TimeoutError`.
:::

### El bucle de eventos

::: ampliacion
JavaScript ejecuta el código en **un solo hilo**. Las operaciones lentas se delegan al navegador, y sus callbacks se encolan para cuando el hilo quede libre. Por eso este código escribe primero `A`, luego `C` y al final `B`:

```ts twoslash
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
```

Las promesas (microtareas) se atienden **antes** que los temporizadores (tareas), aunque el temporizador sea de 0 ms.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Recibir el JSON como `unknown`, validar y adaptar.

```ts
const data: unknown = await response.json();
if (!isWeatherDto(data)) throw new Error('Formato inesperado');
return toWeather(data);
```
:::

::: evita
Afirmar el tipo de una respuesta sin comprobarla.

```ts
const data = (await response.json()) as Weather;
```
:::

</div>

<div class="wk-pair">

::: haz
Comprobar `response.ok` y lanzar un error con contexto.

```ts
if (!response.ok) {
  throw new Error(`Error ${response.status} al cargar ${city}`);
}
```
:::

::: evita
Un `catch` vacío que se traga el error: la aplicación falla en silencio.

```ts
try { await save(); } catch {}
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Tipar una función asíncrona | `async function f(): Promise<T>` |
| Obtener el valor de una promesa | `const x = await promesa` |
| Capturar errores | `try { ... } catch (error) { if (error instanceof Error) ... }` |
| Comprobar la respuesta HTTP | `if (!response.ok) throw new Error(...)` |
| Leer JSON de forma segura | `const data: unknown = await response.json()` + validación |
| Varias peticiones en paralelo | `await Promise.all([a(), b()])` |
| Cancelar una petición | `AbortController` + `signal` |

## Ver también

- [null y undefined](./06-null-undefined#validar-datos-que-llegan-de-fuera): validar datos externos.
- [Genéricos](./08-genericos): cómo se lee `Promise<T>`.
- [Puente a React](./15-react): cargar datos en un componente.
