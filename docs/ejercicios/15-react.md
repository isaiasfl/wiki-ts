# Ejercicios · Puente a React

Repasa antes: [Puente a React](/guia/15-react). Cómo se hacen y se comprueban: [Ejercicios](./).

En el Playground se comprueba que el código **compile**: el propio Playground descarga los tipos de React al ver el `import`, lo que tarda unos segundos la primera vez. Para verlos funcionar, cópialos a un proyecto de Vite con la plantilla *React* + *TypeScript*.

## 1. Tipar las props de una tarjeta <span class="wk-level l1">básico</span>

El componente `CourseCard` muestra un curso. Escribe su interfaz de props:

- `title` y `teacher`: textos, obligatorios.
- `hours`: número, obligatorio.
- `level`: solo `'básico'`, `'medio'` o `'avanzado'`; opcional, y si no se indica, `'básico'`.
- `onEnrol`: función que recibe el título del curso y no devuelve nada.

Las dos líneas de uso del final deben compilar, y la comentada debe dar error si le quitas las `//`.

```tsx twoslash playground
// @errors: 7031 2741 7006
export function CourseCard({ title, teacher, hours, level, onEnrol }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        {teacher} · {hours} h · {level}
      </p>
      <button onClick={() => onEnrol(title)}>Inscribirme</button>
    </article>
  );
}

const a = <CourseCard title="TypeScript" teacher="Isaías" hours={20} onEnrol={(t) => console.log(t)} />;
const b = <CourseCard title="React" teacher="Isaías" hours={30} level="medio" onEnrol={() => {}} />;
// const c = <CourseCard title="CSS" teacher="Ana" hours="10" level="experto" onEnrol={() => {}} />;
```

::: details Pista
`interface CourseCardProps { ... }`, con `level?: 'básico' | 'medio' | 'avanzado'` y `onEnrol: (title: string) => void`. El valor por defecto se pone al desestructurar: `level = 'básico'`.
:::

::: details Solución
```tsx twoslash
interface CourseCardProps {
  title: string;
  teacher: string;
  hours: number;
  level?: 'básico' | 'medio' | 'avanzado';
  onEnrol: (title: string) => void;
}

export function CourseCard({ title, teacher, hours, level = 'básico', onEnrol }: CourseCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        {teacher} · {hours} h · {level}
      </p>
      <button onClick={() => onEnrol(title)}>Inscribirme</button>
    </article>
  );
}

const a = <CourseCard title="TypeScript" teacher="Isaías" hours={20} onEnrol={(t) => console.log(t)} />;
const b = <CourseCard title="React" teacher="Isaías" hours={30} level="medio" onEnrol={() => {}} />;
```

La línea `c` tiene dos errores: `hours` como texto y un nivel que no existe. En `onEnrol={(t) => ...}`, `t` ya es `string` sin anotarlo.
:::

## 2. Una lista con estado <span class="wk-level l2">medio</span>

Completa el componente `ShoppingList`:

- El estado `items` empieza **vacío** y guarda objetos `Item`. Anota su tipo.
- `add` añade un producto nuevo con `id: Date.now()` y `bought: false`.
- `toggle` cambia `bought` del producto con ese `id`.
- Ninguna de las dos debe mutar el estado: usa los patrones de copia.
- Muestra `N pendientes` calculándolo a partir de `items` (sin otro estado).

```tsx twoslash playground
// @errors: 2339
import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  bought: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState([]);

  const add = (name: string) => {
    // Tu código aquí
  };

  const toggle = (id: number) => {
    // Tu código aquí
  };

  return (
    <section>
      <button onClick={() => add('Pan')}>Añadir pan</button>
      <ul>
        {items.map((item) => (
          <li key={item.id} onClick={() => toggle(item.id)}>
            {item.name}
          </li>
        ))}
      </ul>
      <p>{/* N pendientes */}</p>
    </section>
  );
}
```

::: details Pista
`useState<Item[]>([])`: sin el tipo, un array vacío se deduce como `never[]`. Para añadir: `setItems((prev) => [...prev, nuevo])`; para cambiar uno: `map` con `{ ...item, bought: !item.bought }`.
:::

::: details Solución
```tsx twoslash
import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  bought: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState<Item[]>([]);

  const add = (name: string) => {
    setItems((prev) => [...prev, { id: Date.now(), name, bought: false }]);
  };

  const toggle = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item)));
  };

  const pending = items.filter((item) => !item.bought).length;

  return (
    <section>
      <button onClick={() => add('Pan')}>Añadir pan</button>
      <ul>
        {items.map((item) => (
          <li key={item.id} onClick={() => toggle(item.id)}>
            {item.name}
          </li>
        ))}
      </ul>
      <p>{pending} pendientes</p>
    </section>
  );
}
```

`pending` no es estado: se recalcula en cada render a partir de `items`, así que nunca se desincroniza.
:::

## 3. Cargar datos con estados <span class="wk-level l3">reto</span>

El componente `UserProfile` carga un usuario con `fetchUser(id)`. Ahora usa tres estados sueltos (`loading`, `error`, `user`) que pueden contradecirse.

1. Sustitúyelos por **un solo estado** con una unión discriminada: cargando, correcto (con el usuario) y error (con el mensaje).
2. Pinta cada caso con un `switch`.
3. Cancela la petición si el `id` cambia antes de que llegue la respuesta (`fetchUser` acepta un `AbortSignal`).

```tsx twoslash playground
import { useEffect, useState } from 'react';

interface User {
  id: number;
  fullName: string;
  email: string;
}

declare function fetchUser(id: number, signal: AbortSignal): Promise<User>;

export function UserProfile({ id }: { id: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(id, new AbortController().signal)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setError('No se pudo cargar'));
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p role="alert">{error}</p>;
  return <h2>{user?.fullName}</h2>;
}
```

::: details Pista
Mira [Cargar datos](/guia/15-react#cargar-datos): `type State = { status: 'loading' } | { status: 'success'; user: User } | { status: 'error'; message: string }`, el `AbortController` creado dentro del efecto y `return () => controller.abort();`.
:::

::: details Solución
```tsx twoslash
import { useEffect, useState } from 'react';

interface User {
  id: number;
  fullName: string;
  email: string;
}

declare function fetchUser(id: number, signal: AbortSignal): Promise<User>;

type ProfileState =
  | { status: 'loading' }
  | { status: 'success'; user: User }
  | { status: 'error'; message: string };

export function UserProfile({ id }: { id: number }) {
  const [state, setState] = useState<ProfileState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchUser(id, controller.signal)
      .then((user) => setState({ status: 'success', user }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'No se pudo cargar';
        setState({ status: 'error', message });
      });

    return () => controller.abort();
  }, [id]);

  switch (state.status) {
    case 'loading':
      return <p>Cargando...</p>;
    case 'error':
      return <p role="alert">{state.message}</p>;
    case 'success':
      return <h2>{state.user.fullName}</h2>;
  }
}
```

Fallos del código original que desaparecen:

- Si fallaba, `loading` seguía en `true` y nunca se mostraba el error.
- Al cambiar de `id` tras un error, el mensaje viejo se quedaba.
- `user?.fullName` necesitaba `?.` porque `user` podía ser `null` incluso tras cargar; ahora, en `'success'`, el usuario existe siempre.
:::
