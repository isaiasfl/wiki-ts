# Puente a React

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U8</span>
  <span><strong>Requisitos</strong> objetos, arrays, uniones, genéricos</span>
</div>

React no necesita un TypeScript distinto: usa **todo lo de los temas anteriores**. Un componente es una función; sus props son un objeto descrito con una `interface`; el estado se tipa con un genérico; las listas se pintan con `map`; los estados de una petición son una unión discriminada. Este tema muestra dónde encaja cada pieza.

::: info Nota
Los ejemplos son ficheros `.tsx`: TypeScript con JSX. Se comprueban con los tipos oficiales de React 19.
:::

## Componentes y props

::: esencial
Un componente es una **función que devuelve lo que se ve en pantalla**, escrito en **JSX**: una sintaxis parecida a HTML que se escribe dentro del código. Los datos que recibe el componente se llaman **props** (de *properties*) y llegan todos juntos en un objeto, igual que los atributos de una etiqueta HTML.

Las props se describen con una `interface` y se [desestructuran](./05-funciones#desestructurar-parametros-objeto) en la firma, para usar `title` en lugar de `props.title`:

```tsx twoslash
interface BookCardProps {
  title: string;
  author: string;
  pages: number;
}

export function BookCard({ title, author, pages }: BookCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        {author} · {pages} págs.
      </p>
    </article>
  );
}
```

Al usar el componente, `<BookCard title="Dune" ... />` equivale a llamar a la función con `{ title: 'Dune', ... }`. Por eso TypeScript comprueba las props igual que cualquier objeto: en `a` falta `pages`, y en `b` se pasa como texto en lugar de número:

```tsx twoslash
// @errors: 2741 2322
interface BookCardProps {
  title: string;
  author: string;
  pages: number;
}
declare function BookCard(props: BookCardProps): React.JSX.Element;
// ---cut---
const a = <BookCard title="Dune" author="Frank Herbert" />;
const b = <BookCard title="Dune" author="Frank Herbert" pages="412" />;
```
:::

::: tip No hace falta `React.FC`
Basta con tipar el parámetro de props. `React.FC` era habitual en tutoriales antiguos y hoy no se recomienda.
:::

## Props opcionales y valores por defecto

::: esencial
Igual que en cualquier función: `?` en la interfaz y valor por defecto al desestructurar.

```tsx twoslash
interface BadgeProps {
  label: string;
  tone?: 'neutral' | 'success' | 'danger';
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{label}</span>;
}

const ok = <Badge label="Disponible" tone="success" />;
const plain = <Badge label="Sin stock" />;
```

Una unión de literales en `tone` hace que el editor autocomplete las variantes y rechace cualquier otra.
:::

## `children`

::: esencial
El contenido que va **entre las etiquetas** de un componente llega en la prop `children`. Su tipo es `ReactNode`: cualquier cosa que React sabe pintar (texto, números, elementos, listas, `null`).

```tsx twoslash
import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  children: ReactNode;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

const view = (
  <Panel title="Préstamos">
    <p>No tienes préstamos activos.</p>
  </Panel>
);
```
:::

## Eventos

::: esencial
Los eventos de React tienen sus propios tipos, con el **elemento** como parámetro genérico. Si el manejador se escribe **en línea**, no hace falta anotar nada:

```tsx twoslash
export function SearchBox() {
  return (
    <input
      onChange={(event) => console.log(event.target.value)}
      // → event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>
    />
  );
}
```

Si el manejador es una función aparte, se anota su parámetro:

```tsx twoslash
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';

function handleChange(event: ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function handleClick(event: MouseEvent<HTMLButtonElement>) {
  console.log(event.currentTarget.name);
}

export function Signup() {
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} />
      <button name="send" onClick={handleClick}>
        Enviar
      </button>
    </form>
  );
}
```
:::

| Prop | Tipo del evento |
|---|---|
| `onClick` | `MouseEvent<HTMLButtonElement>` |
| `onChange` en `<input>` | `ChangeEvent<HTMLInputElement>` |
| `onChange` en `<select>` | `ChangeEvent<HTMLSelectElement>` |
| `onSubmit` | `FormEvent<HTMLFormElement>` |
| `onKeyDown` | `KeyboardEvent<HTMLInputElement>` |

::: tip Truco
¿No sabes el tipo de un evento? Escribe el manejador en línea, pasa el ratón por `event` y copia el tipo que muestra el editor.
:::

## Pasar funciones como props

::: esencial
Un componente hijo avisa al padre llamando a una función que recibe por props. Su tipo es una **firma de función**:

```tsx twoslash
interface TaskItemProps {
  id: number;
  title: string;
  onRemove: (id: number) => void;
}

export function TaskItem({ id, title, onRemove }: TaskItemProps) {
  return (
    <li>
      {title}
      <button onClick={() => onRemove(id)}>Quitar</button>
    </li>
  );
}
```

Por convención, las props de este tipo empiezan por `on`.
:::

## Estado con `useState`

::: esencial
El **estado** son los datos de un componente que cambian con el tiempo (un contador, la lista de tareas). `useState` recibe el valor inicial y devuelve una [tupla](./04-arrays#tuplas) de dos elementos: el valor actual y la función para cambiarlo. Se desestructura con `[count, setCount]`. Al llamar a `setCount`, React vuelve a ejecutar el componente y la pantalla se actualiza.

`useState` deduce el tipo del valor inicial:

```tsx twoslash
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  // → count: number
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Cuando el valor inicial **no representa todos los valores posibles**, se indica el tipo entre `< >`:

```tsx twoslash
import { useState } from 'react';

interface Book {
  id: number;
  title: string;
}

export function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Book | null>(null);
  // → selected: Book | null
  return null;
}
```

Sin `<Book[]>`, un array vacío se deduciría como `never[]` y no se podría añadir ningún libro.
:::

## Actualizar el estado sin mutar

::: esencial
React solo vuelve a pintar si el estado es un **valor nuevo**. Se usan los patrones de copia de [Arrays](./04-arrays#copiar-y-modificar-sin-mutar):

```tsx twoslash
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const add = (title: string) =>
    setTasks((prev) => [...prev, { id: Date.now(), title, done: false }]);

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return { tasks, add, toggle, remove };
}
```

`useTasks` es un **hook propio**: una función que empieza por `use` y agrupa estado y operaciones para reutilizarlos en varios componentes.

En lugar de pasar a `setTasks` el array nuevo, se le pasa una **función** `(prev) => ...`. React la llama con el estado más reciente (`prev`) y guarda lo que devuelva. Así no hay problemas si se hacen varios cambios seguidos antes de que React vuelva a pintar.
:::

::: error
Mutar el estado y volver a guardarlo. React recibe **el mismo array** y no detecta el cambio:

```ts
tasks.push(newTask);
setTasks(tasks); // no se vuelve a pintar
```
:::

## Pintar listas

::: esencial
Una lista se pinta con `map`, y cada elemento necesita una `key` **estable y única**, normalmente su `id`:

```tsx twoslash
interface Task {
  id: number;
  title: string;
  done: boolean;
}
// ---cut---
export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p>No hay tareas.</p>;
  }
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

No uses la posición del array como `key` si la lista se puede reordenar o filtrar: React confundiría unos elementos con otros.
:::

## Datos derivados: no los guardes en el estado

::: esencial
Lo que se puede **calcular** a partir del estado no se guarda en otro estado: se calcula cada vez que se ejecuta el componente (cada *render*).

<div class="wk-pair">

::: haz
```tsx
const [tasks, setTasks] = useState<Task[]>([]);
const pending = tasks.filter((t) => !t.done).length;
```
:::

::: evita
```tsx
const [tasks, setTasks] = useState<Task[]>([]);
const [pending, setPending] = useState(0);
// hay que acordarse de actualizar los dos
```
:::

</div>

**Por qué:** dos estados que dependen uno del otro acaban desincronizándose.
:::

## Cargar datos

::: esencial
El estado de una petición es una **unión discriminada**. La petición se hace dentro de `useEffect`, el hook para código que debe ejecutarse **después** de pintar y cada vez que cambie un dato concreto (aquí, `city`).

Qué hace el ejemplo:

1. Al aparecer el componente, o al cambiar `city`, se ejecuta el efecto: pone el estado en `'loading'` y lanza la petición.
2. Cuando llega la respuesta, guarda los datos (`'success'`) o el mensaje (`'error'`).
3. La función que devuelve el efecto se ejecuta si `city` cambia antes de que llegue la respuesta, o si el componente desaparece de la pantalla: cancela la petición vieja con el [`AbortController`](./11-asincronia#cancelar-con-abortcontroller).
4. Según `status`, el `switch` pinta una cosa u otra.

```tsx twoslash
import { useEffect, useState } from 'react';

interface Weather {
  city: string;
  temperature: number;
}

type WeatherState =
  | { status: 'loading' }
  | { status: 'success'; data: Weather }
  | { status: 'error'; message: string };

declare function fetchWeather(city: string, signal: AbortSignal): Promise<Weather>;

export function WeatherWidget({ city }: { city: string }) {
  const [state, setState] = useState<WeatherState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchWeather(city, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'Error desconocido';
        setState({ status: 'error', message });
      });

    return () => controller.abort();
  }, [city]);

  switch (state.status) {
    case 'loading':
      return <p>Cargando el tiempo de {city}...</p>;
    case 'error':
      return <p role="alert">{state.message}</p>;
    case 'success':
      return (
        <p>
          {state.data.city}: {state.data.temperature} °C
        </p>
      );
  }
}
```

- `[city]` al final es la lista de dependencias: el efecto se repite cuando cambia alguno de esos valores.
- La función que devuelve `useEffect` es la **limpieza**: cancela la petición si `city` cambia antes de que llegue la respuesta.
- En cada `case`, TypeScript sabe qué datos hay: `state.data` solo existe en `'success'`.
:::

## Ampliación

### `useReducer` con acciones tipadas

::: ampliacion
Cuando el estado tiene varias operaciones, un **reductor** las centraliza. Es una función que recibe el estado actual y una **acción** (un objeto que describe qué ha pasado: «se ha añadido una tarea con este título») y devuelve el estado nuevo. Los componentes no cambian el estado directamente: envían acciones con `dispatch`. Las acciones se describen con una unión discriminada, y TypeScript comprueba cada `case`:

```tsx twoslash
import { useReducer } from 'react';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

type Action =
  | { type: 'added'; title: string }
  | { type: 'toggled'; id: number }
  | { type: 'removed'; id: number };

function tasksReducer(tasks: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'added':
      return [...tasks, { id: Date.now(), title: action.title, done: false }];
    case 'toggled':
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'removed':
      return tasks.filter((t) => t.id !== action.id);
  }
}

export function TaskBoard() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  return (
    <button onClick={() => dispatch({ type: 'added', title: 'Nueva' })}>
      Añadir ({tasks.length})
    </button>
  );
}
```

El reductor es una **función pura**: se puede probar sin React, con datos de entrada y salida.
:::

### Props a partir de otros tipos

::: ampliacion
Los [utility types](./09-utility-types) evitan repetir definiciones. Por ejemplo, un formulario de alta que recibe todo menos el `id`:

```tsx twoslash
interface Book {
  id: number;
  title: string;
  author: string;
}

interface BookFormProps {
  initial: Omit<Book, 'id'>;
  onSave: (book: Omit<Book, 'id'>) => void;
}
```

Y para un componente que envuelve un elemento nativo y acepta todas sus props. `ComponentProps<'button'>` son todas las props que admite un `<button>` normal (`type`, `disabled`, `onClick`...). `...rest` recoge las que no se han nombrado y `{...rest}` se las pasa tal cual al botón:

```tsx twoslash
import type { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={`btn btn-${variant}`} {...rest} />;
}

const save = <Button type="submit" disabled>Guardar</Button>;
```
:::

### Componentes genéricos

::: ampliacion
Un componente también puede ser genérico. Una lista que sirve para cualquier tipo de elemento:

```tsx twoslash
import type { ReactNode } from 'react';

interface ListProps<T> {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
}

export function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

const songs = [{ id: 1, title: 'Mediterráneo' }];
const view = <List items={songs} getKey={(s) => s.id} renderItem={(s) => s.title} />;
// → s: { id: number; title: string; }
```

TypeScript deduce `T` a partir de `items`, y el parámetro de `renderItem` ya sabe que es una canción.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Un tipo para cada estado posible y un `switch` para pintarlo.

```tsx
const [state, setState] = useState<State>({ status: 'loading' });
```
:::

::: evita
Varios estados booleanos sueltos para una misma petición.

```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [data, setData] = useState(null);
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Tipar las props | `function C({ a, b }: CProps)` con `interface CProps` |
| Una prop opcional | `tone?: 'a' \| 'b'` y valor por defecto al desestructurar |
| Contenido entre etiquetas | `children: ReactNode` |
| Un manejador aparte | `(event: ChangeEvent<HTMLInputElement>) => ...` |
| Avisar al padre | Prop `onAlgo: (dato: T) => void` |
| Estado vacío al principio | `useState<Book[]>([])` · `useState<Book \| null>(null)` |
| Estado de una petición | Unión discriminada + `switch` |
| Varias operaciones sobre el estado | `useReducer` con acciones en una unión |

## Ver también

- [Uniones y narrowing](./02-uniones-narrowing#uniones-discriminadas): modelar estados.
- [Arrays](./04-arrays#copiar-y-modificar-sin-mutar): actualizar listas sin mutar.
- [Genéricos](./08-genericos): leer `useState<T>`.
- [Asincronía](./11-asincronia): `fetch` tipado y cancelación.
