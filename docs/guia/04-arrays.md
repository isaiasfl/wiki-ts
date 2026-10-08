# Arrays

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U2</span>
  <span><strong>En React</strong> pintar listas, filtrar, ordenar, totales</span>
</div>

Un array es una **lista ordenada** de valores. En TypeScript, además, todos sus elementos tienen un tipo conocido, así que el editor sabe qué se puede hacer con cada uno. La mayor parte del trabajo con datos en una interfaz consiste en **transformar listas**: filtrarlas, ordenarlas, buscar en ellas y resumirlas.

Los ejemplos de este tema usan una lista de reproducción:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
```

## Tipar un array

::: esencial
Se añaden corchetes al tipo de los elementos. `Song[]` se lee «lista de `Song`»:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
// ---cut---
const playlist: Song[] = [
  { id: 1, title: 'Mediterráneo', artist: 'Serrat', seconds: 207, liked: true },
  { id: 2, title: 'Entre dos aguas', artist: 'Paco de Lucía', seconds: 356, liked: false },
  { id: 3, title: 'La flaca', artist: 'Jarabe de Palo', seconds: 263, liked: true },
];

const titles = ['Mediterráneo', 'La flaca'];
// → titles: string[]
```

Existe una segunda escritura equivalente, `Array<Song>`, que verás en código de librerías. En el curso usamos `Song[]`.
:::

::: warning Atención: arrays con varios tipos
Los paréntesis cambian el significado:

- `(string | number)[]` → una lista en la que **cada elemento** puede ser texto o número.
- `string | number[]` → **o** un texto, **o** una lista de números.
:::

## Tuplas

::: esencial
Una **tupla** es un array de **longitud fija** en el que cada posición tiene su propio tipo:

```ts twoslash
const point: [number, number] = [40.4168, -3.7038];
const entry: [string, number] = ['Mediterráneo', 207];

const [title, seconds] = entry;
// → seconds: number
```

`const [title, seconds] = entry` es **desestructuración**: guarda la posición 0 en `title` y la 1 en `seconds`. Las tuplas las verás sobre todo al desestructurar el resultado de una función que devuelve dos cosas, como `useState` en React: `const [count, setCount] = useState(0)`.
:::

## Métodos: qué devuelven y si modifican el original

::: esencial
La pregunta clave de cada método: **¿modifica el array original?** En el código moderno, y en React en particular, se prefieren los que **devuelven uno nuevo**.

| Método | Pregunta que responde | Devuelve | ¿Muta? |
|---|---|---|---|
| `map(fn)` | ¿En qué convierto cada elemento? | array del **mismo tamaño** | No |
| `filter(fn)` | ¿Cuáles cumplen? | array **igual o menor** | No |
| `find(fn)` | ¿Cuál es el primero que cumple? | **un elemento** o `undefined` | No |
| `findIndex(fn)` | ¿En qué posición está? | número o `-1` | No |
| `some(fn)` / `every(fn)` | ¿Alguno cumple? / ¿Todos cumplen? | `boolean` | No |
| `includes(valor)` | ¿Está este valor? | `boolean` | No |
| `reduce(fn, inicial)` | ¿Qué resumen saco? | **un valor** del tipo del inicial | No |
| `toSorted(fn)` | ¿Cómo quedan ordenados? | array **nuevo** ordenado | No |
| `sort(fn)` | Ordena | **el mismo** array | **Sí** |
| `slice(i, f)` | ¿Qué hay en este tramo? | array **nuevo** | No |
| `splice(i, n)` | Quita o inserta | los elementos quitados | **Sí** |
| `with(i, valor)` | ¿Y si cambio esta posición? | array **nuevo** | No |
| `push(x)` / `pop()` | Añade al final / quita del final | longitud / elemento | **Sí** |
:::

## Transformar: `map`

::: esencial
Convierte **cada** elemento en otra cosa. El resultado tiene la misma longitud:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const labels = playlist.map((song) => `${song.title} · ${song.artist}`);
// → labels: string[]
```

La función que se pasa a `map`, `(song) => ...`, se llama **callback**: `map` la ejecuta una vez por cada elemento, pasándole ese elemento en `song`. Todos los métodos de este tema funcionan así (más en [Funciones](./05-funciones#callbacks-funciones-como-argumento)).

El tipo del parámetro `song` **no se anota**: TypeScript lo deduce del array.
:::

## Seleccionar: `filter`

::: esencial
Devuelve los elementos para los que el callback devuelve `true`:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const favourites = playlist.filter((song) => song.liked);
// → favourites: Song[]
const longOnes = playlist.filter((song) => song.seconds > 300);
```

`filter` **no cambia** los elementos: devuelve los mismos objetos completos. Si quieres solo los títulos, encadena un `map`.
:::

## Buscar y comprobar

::: esencial
```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const song = playlist.find((s) => s.id === 2);
// → song: Song | undefined
const position = playlist.findIndex((s) => s.id === 2);
const hasFavourites = playlist.some((s) => s.liked);
const allShort = playlist.every((s) => s.seconds < 600);
```

`find` puede no encontrar nada, por eso su tipo incluye `undefined`. Hay que tratarlo antes de usar el resultado: ver [null y undefined](./06-null-undefined).
:::

| Si buscas... | Usa | Si no hay ninguno |
|---|---|---|
| Varios elementos | `filter` | `[]` (comprueba `.length`) |
| Uno, por ejemplo por `id` | `find` | `undefined` (compruébalo) |
| Saber si existe | `some` o `includes` | `false` |

::: error
Leer una propiedad del resultado de `filter` como si fuera un solo elemento: `playlist.filter((s) => s.id === 2).title`. `filter` devuelve una **lista**. Para un elemento, `find`.
:::

## Resumir: `reduce`

::: esencial
Recorre la lista acumulando un resultado. Recibe un callback `(acumulado, actual) => nuevoAcumulado` y un **valor inicial**:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const totalSeconds = playlist.reduce((total, song) => total + song.seconds, 0);
// → totalSeconds: number
```

El **valor inicial decide el tipo** del resultado: con `0` es `number`.
:::

::: warning Atención: siempre con valor inicial
Sin valor inicial, `reduce` usa el primer elemento como punto de partida y, con un array vacío, **lanza un error al ejecutar** que TypeScript no detecta. Escribe siempre el valor inicial.
:::

Cuando el resultado es un objeto, hay que decirle a TypeScript qué forma tendrá, porque un `{}` vacío como valor inicial no le da pistas. Se indica entre `< >` justo después de `reduce`. En este caso, «un objeto con un número por cada artista»:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const songsByArtist = playlist.reduce<Record<string, number>>((acc, song) => {
  acc[song.artist] = (acc[song.artist] ?? 0) + 1;
  return acc;
}, {});
// → { Serrat: 1, 'Paco de Lucía': 1, 'Jarabe de Palo': 1 }
```

`acc[song.artist] ?? 0` significa «lo que lleve contado ese artista, o `0` si aún no tiene nada»: el operador `??` da un valor por defecto cuando lo de la izquierda es `undefined` ([explicado aquí](./06-null-undefined)).

::: tip ¿Siempre `reduce`?
No. Para sumar o contar es ideal. Si el callback crece y cuesta leerlo, un bucle `for...of` sobre una variable local hace lo mismo y es igual de correcto.
:::

## Ordenar sin mutar: `toSorted`

::: esencial
`toSorted` devuelve una **copia** ordenada. Recibe un comparador `(a, b) => número`:

| El comparador devuelve | Significa |
|---|---|
| negativo | `a` va antes que `b` |
| positivo | `a` va después |
| `0` | se mantiene el orden |

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const shortestFirst = playlist.toSorted((a, b) => a.seconds - b.seconds);
const longestFirst = playlist.toSorted((a, b) => b.seconds - a.seconds);
const byTitle = playlist.toSorted((a, b) => a.title.localeCompare(b.title, 'es'));
```

- `a - b` ordena de menor a mayor; `b - a`, de mayor a menor.
- Para textos, `localeCompare` con `'es'` ordena bien tildes y eñes.
:::

::: error
Ordenar números sin comparador: `[10, 9, 1].toSorted()` da `[1, 10, 9]`, porque sin comparador se ordena **como texto**.
:::

::: warning Atención: `sort` muta
`sort` ordena **el propio array** y lo devuelve. `const sorted = list.sort(...)` engaña: `sorted` y `list` son el mismo array, y el original ha cambiado. Usa `toSorted`.
:::

## Copiar y modificar sin mutar

::: esencial
Para añadir, quitar o cambiar elementos sin tocar el original:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
declare const newSong: Song;
// ---cut---
const added = [...playlist, newSong]; // añadir al final
const removed = playlist.filter((s) => s.id !== 2); // quitar por id
const updated = playlist.map((s) => (s.id === 2 ? { ...s, liked: true } : s)); // cambiar uno
const firstThree = playlist.slice(0, 3); // un tramo
```

Los tres puntos `...` (*spread*) **copian** el contenido:

- `[...playlist, newSong]`: un array nuevo con todos los elementos de `playlist` y, al final, `newSong`.
- `{ ...s, liked: true }`: un objeto nuevo con todas las propiedades de `s`, pero con `liked` cambiado a `true`. Lo que se escribe después del spread sobrescribe lo copiado.

En `updated`, el `map` recorre la lista: si la canción es la de `id` 2 devuelve una copia modificada, y si no, la deja igual.

Estos cuatro patrones son exactamente los que se usan para actualizar listas en el estado de React.
:::

## Encadenar

::: esencial
Como cada método devuelve un array nuevo, se pueden encadenar. Se escribe **un método por línea**:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const topFavourites = playlist
  .filter((s) => s.liked) // 1. solo favoritas
  .toSorted((a, b) => b.seconds - a.seconds) // 2. de más larga a más corta
  .slice(0, 3) // 3. las tres primeras
  .map((s) => s.title); // 4. solo el título
```

El orden importa: `map` va al final, porque después ya no quedan `liked` ni `seconds` para filtrar u ordenar. Filtrar antes de ordenar, además, hace que se ordenen menos elementos.
:::

## Ampliación

### Acceso por posición y `at`

::: ampliacion
Por defecto, TypeScript asume que `list[0]` **existe**, aunque el array esté vacío:

```ts twoslash
const empty: string[] = [];
const first = empty[0];
// → first: string
const last = empty.at(-1);
// → last: string | undefined
```

`first` aparece como `string`, pero vale `undefined`. `at` sí incluye `undefined` en su tipo, y además admite índices negativos (`-1` es el último). La opción `noUncheckedIndexedAccess` del `tsconfig` hace que el acceso con corchetes también incluya `| undefined`.
:::

### Arrays de solo lectura

::: ampliacion
`readonly Song[]` (o `ReadonlyArray<Song>`) prohíbe los métodos que mutan. Es una buena forma de documentar que una función no debe modificar lo que recibe:

```ts twoslash
// @errors: 2339
function totalDuration(durations: readonly number[]): number {
  durations.push(0);
  return durations.reduce((acc, d) => acc + d, 0);
}
```
:::

### Agrupar: `Object.groupBy`

::: ampliacion
Disponible desde ES2024, agrupa los elementos según la clave que devuelve el callback:

```ts twoslash
interface Song {
  id: number;
  title: string;
  artist: string;
  seconds: number;
  liked: boolean;
}
declare const playlist: Song[];
// ---cut---
const byLength = Object.groupBy(playlist, (s) => (s.seconds > 300 ? 'long' : 'short'));
// → byLength: Partial<Record<"long" | "short", Song[]>>
```

`Partial` significa que todas las claves son opcionales ([ver Utility types](./09-utility-types)): TypeScript no puede saber si habrá canciones de cada grupo, así que cada clave puede faltar.
:::

### `flatMap`

::: ampliacion
Transforma cada elemento en una **lista** y aplana el resultado en un solo nivel:

```ts twoslash
const albums = [
  { name: 'Mediterráneo', tracks: ['Mediterráneo', 'Lucía'] },
  { name: 'Almendra', tracks: ['Muerte en la playa'] },
];

const allTracks = albums.flatMap((album) => album.tracks);
// → allTracks: string[]
```
:::

## Haz y evita

<div class="wk-pair">

::: haz
Métodos que devuelven un array nuevo.

```ts
const sorted = songs.toSorted((a, b) => a.seconds - b.seconds);
const next = [...songs, newSong];
```
:::

::: evita
Mutar el array original, sobre todo si es estado compartido.

```ts
songs.sort((a, b) => a.seconds - b.seconds);
songs.push(newSong);
```
:::

</div>

<div class="wk-pair">

::: haz
Un método por línea al encadenar, con nombres que expliquen el resultado.

```ts
const likedTitles = songs
  .filter((s) => s.liked)
  .map((s) => s.title);
```
:::

::: evita
Anotar el tipo de los parámetros de los callbacks: TypeScript ya lo sabe.

```ts
songs.filter((s: Song): boolean => s.liked);
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Transformar cada elemento | `list.map((x) => ...)` |
| Quedarme con algunos | `list.filter((x) => condición)` |
| Uno concreto | `list.find((x) => x.id === id)` y tratar el `undefined` |
| Un total | `list.reduce((acc, x) => acc + x.n, 0)` |
| Ordenar sin mutar | `list.toSorted((a, b) => a.n - b.n)` |
| Añadir / quitar / cambiar sin mutar | `[...list, x]` · `filter` · `map` con spread |

<PracticeLink topic="04-arrays" />

## Ver también

- [null y undefined](./06-null-undefined): tratar el resultado de `find`.
- [Funciones](./05-funciones): callbacks y funciones de orden superior.
- [Genéricos](./08-genericos): cómo se tipa `Array<T>` por dentro.
