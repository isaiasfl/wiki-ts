# Ejercicios · Arrays

Repasa antes: [Arrays](/guia/04-arrays). Cómo se hacen y se comprueban: [Ejercicios](./).

Los tres ejercicios usan la cartelera de un cine:

```ts
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number; // de 0 a 10
}
```

## 1. Películas largas <span class="wk-level l1">básico</span>

Escribe `longTitles(movies, minMinutes)`: devuelve **solo los títulos** de las películas que duran **al menos** `minMinutes`, en el mismo orden.

```ts twoslash playground
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number;
}

const movies: Movie[] = [
  { id: 1, title: 'Origen', genre: 'ciencia ficción', minutes: 148, rating: 8.8 },
  { id: 2, title: 'Up', genre: 'animación', minutes: 96, rating: 8.3 },
  { id: 3, title: 'El laberinto del fauno', genre: 'fantasía', minutes: 118, rating: 8.2 },
  { id: 4, title: 'Coco', genre: 'animación', minutes: 105, rating: 8.4 },
];

function longTitles(list: Movie[], minMinutes: number): string[] {
  // Tu código aquí
  return [];
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('de 110 minutos o más', longTitles(movies, 110).join('|') === 'Origen|El laberinto del fauno');
check('de 100 o más', longTitles(movies, 100).length === 3);
check('si ninguna llega, lista vacía', longTitles(movies, 300).length === 0);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Primero `filter` para quedarte con las largas, después `map` para quedarte con el título.
:::

::: details Solución
```ts twoslash run
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number;
}

const movies: Movie[] = [
  { id: 1, title: 'Origen', genre: 'ciencia ficción', minutes: 148, rating: 8.8 },
  { id: 2, title: 'Up', genre: 'animación', minutes: 96, rating: 8.3 },
  { id: 3, title: 'El laberinto del fauno', genre: 'fantasía', minutes: 118, rating: 8.2 },
  { id: 4, title: 'Coco', genre: 'animación', minutes: 105, rating: 8.4 },
];

function longTitles(list: Movie[], minMinutes: number): string[] {
  return list
    .filter((movie) => movie.minutes >= minMinutes)
    .map((movie) => movie.title);
}

check('de 110 minutos o más', longTitles(movies, 110).join('|') === 'Origen|El laberinto del fauno');
check('de 100 o más', longTitles(movies, 100).length === 3);
check('si ninguna llega, lista vacía', longTitles(movies, 300).length === 0);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

El orden importa: si haces el `map` primero, ya no te quedan los minutos para filtrar.
:::

## 2. Minutos por género <span class="wk-level l2">medio</span>

Escribe `minutesByGenre(movies)`: devuelve un objeto con el **total de minutos de cada género**. Para la cartelera de ejemplo: `{ 'ciencia ficción': 148, animación: 201, fantasía: 118 }`.

```ts twoslash playground
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number;
}

const movies: Movie[] = [
  { id: 1, title: 'Origen', genre: 'ciencia ficción', minutes: 148, rating: 8.8 },
  { id: 2, title: 'Up', genre: 'animación', minutes: 96, rating: 8.3 },
  { id: 3, title: 'El laberinto del fauno', genre: 'fantasía', minutes: 118, rating: 8.2 },
  { id: 4, title: 'Coco', genre: 'animación', minutes: 105, rating: 8.4 },
];

function minutesByGenre(list: Movie[]): Record<string, number> {
  // Tu código aquí
  return {};
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const totals = minutesByGenre(movies);
check('animación suma 201', totals['animación'] === 201);
check('fantasía suma 118', totals['fantasía'] === 118);
check('hay 3 géneros', Object.keys(totals).length === 3);
check('una lista vacía da un objeto vacío', Object.keys(minutesByGenre([])).length === 0);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
Es como el ejemplo de canciones por artista en [Resumir: reduce](/guia/04-arrays#resumir-reduce): valor inicial `{}`, el tipo entre `< >`, y para cada película `acc[genre] = (acc[genre] ?? 0) + minutos`.
:::

::: details Solución
```ts twoslash run
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number;
}

const movies: Movie[] = [
  { id: 1, title: 'Origen', genre: 'ciencia ficción', minutes: 148, rating: 8.8 },
  { id: 2, title: 'Up', genre: 'animación', minutes: 96, rating: 8.3 },
  { id: 3, title: 'El laberinto del fauno', genre: 'fantasía', minutes: 118, rating: 8.2 },
  { id: 4, title: 'Coco', genre: 'animación', minutes: 105, rating: 8.4 },
];

function minutesByGenre(list: Movie[]): Record<string, number> {
  return list.reduce<Record<string, number>>((acc, movie) => {
    acc[movie.genre] = (acc[movie.genre] ?? 0) + movie.minutes;
    return acc;
  }, {});
}

const totals = minutesByGenre(movies);
check('animación suma 201', totals['animación'] === 201);
check('fantasía suma 118', totals['fantasía'] === 118);
check('hay 3 géneros', Object.keys(totals).length === 3);
check('una lista vacía da un objeto vacío', Object.keys(minutesByGenre([])).length === 0);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Otra solución igual de válida: un `for...of` que vaya rellenando un objeto local.
:::

## 3. Puntuar sin mutar <span class="wk-level l3">reto</span>

Dos funciones que **no deben modificar** el array original (la comprobación lo vigila):

- `rateMovie(movies, id, rating)`: devuelve una lista nueva en la que la película con ese `id` tiene la nueva puntuación. Las demás quedan igual.
- `topRated(movies, n)`: devuelve las `n` películas mejor puntuadas, de mayor a menor.

```ts twoslash playground
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number;
}

const movies: Movie[] = [
  { id: 1, title: 'Origen', genre: 'ciencia ficción', minutes: 148, rating: 8.8 },
  { id: 2, title: 'Up', genre: 'animación', minutes: 96, rating: 8.3 },
  { id: 3, title: 'El laberinto del fauno', genre: 'fantasía', minutes: 118, rating: 8.2 },
  { id: 4, title: 'Coco', genre: 'animación', minutes: 105, rating: 8.4 },
];

function rateMovie(list: Movie[], id: number, rating: number): Movie[] {
  // Tu código aquí
  return list;
}

function topRated(list: Movie[], n: number): Movie[] {
  // Tu código aquí
  return list;
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const before = JSON.stringify(movies);
const rated = rateMovie(movies, 2, 9.5);
check('Up pasa a tener un 9.5', rated.find((m) => m.id === 2)?.rating === 9.5);
check('las demás no cambian', rated.find((m) => m.id === 1)?.rating === 8.8);
check('devuelve un array nuevo', rated !== movies);
const top = topRated(movies, 2);
check('las dos mejores son Origen y Coco', top.map((m) => m.title).join('|') === 'Origen|Coco');
check('el array original no ha cambiado', JSON.stringify(movies) === before);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
- Para cambiar uno: `map` y, en el que coincide, una copia con spread: `{ ...movie, rating }`.
- Para el ranking: `toSorted` de mayor a menor (`b.rating - a.rating`) y después `slice(0, n)`. No uses `sort`: modifica el original.
:::

::: details Solución
```ts twoslash run
interface Movie {
  id: number;
  title: string;
  genre: string;
  minutes: number;
  rating: number;
}

const movies: Movie[] = [
  { id: 1, title: 'Origen', genre: 'ciencia ficción', minutes: 148, rating: 8.8 },
  { id: 2, title: 'Up', genre: 'animación', minutes: 96, rating: 8.3 },
  { id: 3, title: 'El laberinto del fauno', genre: 'fantasía', minutes: 118, rating: 8.2 },
  { id: 4, title: 'Coco', genre: 'animación', minutes: 105, rating: 8.4 },
];

function rateMovie(list: Movie[], id: number, rating: number): Movie[] {
  return list.map((movie) => (movie.id === id ? { ...movie, rating } : movie));
}

function topRated(list: Movie[], n: number): Movie[] {
  return list.toSorted((a, b) => b.rating - a.rating).slice(0, n);
}

const before = JSON.stringify(movies);
const rated = rateMovie(movies, 2, 9.5);
check('Up pasa a tener un 9.5', rated.find((m) => m.id === 2)?.rating === 9.5);
check('las demás no cambian', rated.find((m) => m.id === 1)?.rating === 8.8);
check('devuelve un array nuevo', rated !== movies);
const top = topRated(movies, 2);
check('las dos mejores son Origen y Coco', top.map((m) => m.title).join('|') === 'Origen|Coco');
check('el array original no ha cambiado', JSON.stringify(movies) === before);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

`{ ...movie, rating }` es una abreviatura de `{ ...movie, rating: rating }`. Son exactamente los patrones que usarás para actualizar el estado en React.
:::
