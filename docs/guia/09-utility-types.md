# Utility types

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U3 · U4</span>
  <span><strong>En React</strong> props derivadas, formularios de edición, actualizaciones parciales</span>
</div>

Los **utility types** son genéricos que vienen con TypeScript y **crean tipos nuevos a partir de otros**. Permiten tener una sola definición de cada dato y derivar de ella las variantes: la versión para crear, la versión para editar, la versión pública. Si el tipo original cambia, todas las variantes se actualizan solas.

Los ejemplos parten de este tipo:

```ts twoslash
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
```

## `Partial`: todo opcional

::: esencial
`Partial<T>` hace **opcionales** todas las propiedades: es como poner un `?` a cada una. Es el tipo natural de una actualización, en la que solo se envían los campos que cambian:

```ts twoslash
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
// ---cut---
function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}

declare const ana: User;
const renamed = updateUser(ana, { name: 'Ana María' });
```

`{ ...user, ...changes }` copia primero todo el usuario y después encima los cambios: las propiedades que vengan en `changes` sustituyen a las originales y el resto se queda igual.
:::

## `Required`: todo obligatorio

::: esencial
Lo contrario: quita los `?`. Útil para una configuración con valores por defecto ya aplicados:

```ts twoslash
interface Options {
  pageSize?: number;
  sortBy?: 'title' | 'date';
}

const defaults: Required<Options> = { pageSize: 20, sortBy: 'title' };

function withDefaults(options: Options): Required<Options> {
  return { ...defaults, ...options };
}
```
:::

## `Pick` y `Omit`: elegir o quitar propiedades

::: esencial
- `Pick<T, 'a' | 'b'>` → solo las propiedades indicadas.
- `Omit<T, 'a' | 'b'>` → todas **menos** las indicadas.

```ts twoslash
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
// ---cut---
type PublicUser = Omit<User, 'password'>;
// → PublicUser = { id: number; name: string; email: string; createdAt: Date; }
type NewUser = Omit<User, 'id' | 'createdAt'>;
type UserPreview = Pick<User, 'id' | 'name'>;
// → UserPreview = { id: number; name: string; }
```

`NewUser` es lo que envía un formulario de registro: el `id` y la fecha los pone el servidor. `PublicUser` es lo que se puede mostrar o devolver sin exponer la contraseña.
:::

::: tip ¿`Pick` u `Omit`?
Usa el que obligue a escribir **menos** nombres. Si quitas una o dos propiedades, `Omit`; si te quedas con una o dos, `Pick`.
:::

## `Readonly`: todo de solo lectura

::: esencial
Marca todas las propiedades como `readonly`. Documenta que una función **no debe modificar** lo que recibe:

```ts twoslash
// @errors: 2540
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
// ---cut---
function greeting(user: Readonly<User>): string {
  user.name = user.name.trim();
  return `Hola, ${user.name}`;
}
```
:::

::: info Nota
`Readonly` es **superficial**: protege las propiedades del primer nivel, no los objetos o arrays que contengan.
:::

## `Record`: un valor por cada clave

::: esencial
`Record<Claves, Valor>` crea un objeto con esas claves y ese tipo de valor. Se trata a fondo en [Objetos](./03-objetos#record-objetos-que-funcionan-como-diccionario).

```ts twoslash
type Role = 'admin' | 'editor' | 'reader';

const permissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  reader: ['read'],
};
```
:::

## `Exclude` y `Extract`: filtrar uniones

::: esencial
Trabajan sobre **uniones**, no sobre objetos:

```ts twoslash
type Role = 'admin' | 'editor' | 'reader';

type Staff = Exclude<Role, 'reader'>;
// → Staff = "admin" | "editor"
type CanEdit = Extract<Role, 'admin' | 'editor' | 'guest'>;
// → CanEdit = "admin" | "editor"
```

- `Exclude<U, X>` → la unión `U` **sin** lo que encaja con `X`.
- `Extract<U, X>` → solo lo de `U` que **encaja** con `X`.
:::

## Derivar tipos con `keyof` y el acceso indexado

::: esencial
Dos herramientas que se combinan con todo lo anterior:

```ts twoslash
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
// ---cut---
type UserField = keyof User; // 'id' | 'name' | 'email' | 'password' | 'createdAt'
type UserId = User['id'];
// → UserId = number
```

- `keyof T` → la unión de las claves de `T`.
- `T['prop']` → el tipo de una propiedad concreta.

Así, si el `id` pasa de `number` a `string`, todo lo que use `User['id']` cambia con él.
:::

## Ampliación

### Tipos a partir de funciones: `ReturnType`, `Parameters` y `Awaited`

::: ampliacion
Permiten obtener tipos de funciones que ya existen, por ejemplo de una librería que no exporta sus tipos. Se les pasa `typeof nombreDeLaFunción`, que es el tipo de la función ([ver Fundamentos](./01-fundamentos#el-operador-typeof-en-los-tipos)). La función del ejemplo es `async`, así que devuelve una promesa ([ver Asincronía](./11-asincronia)):

```ts twoslash
async function fetchUser(id: number, withPosts: boolean) {
  return { id, name: 'Ana', posts: withPosts ? ['Hola'] : [] };
}

type Args = Parameters<typeof fetchUser>;
// → Args = [id: number, withPosts: boolean]
type Returned = ReturnType<typeof fetchUser>;
// → Returned = Promise<{ id: number; name: string; posts: string[]; }>
type UserData = Awaited<ReturnType<typeof fetchUser>>;
// → UserData = { id: number; name: string; posts: string[]; }
```

`Awaited` «desenvuelve» una promesa: obtiene el tipo de lo que dará al resolverse.
:::

### Combinar utilidades

::: ampliacion
Se pueden encadenar. El signo `&` (*intersección*) une dos tipos: el resultado tiene las propiedades de los dos. Un formulario de edición en el que el `id` es obligatorio y el resto opcional:

```ts twoslash
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
// ---cut---
type UserPatch = Pick<User, 'id'> & Partial<Omit<User, 'id' | 'createdAt'>>;

const patch: UserPatch = { id: 7, email: 'nuevo@example.com' };
```

Se lee de dentro afuera: *quita `id` y `createdAt`, hazlo todo opcional, y añade el `id` obligatorio*.
:::

### Tipos mapeados

::: ampliacion
Los utility types están escritos con **tipos mapeados**, que recorren las claves de un tipo como un bucle. `[K in keyof T]` se lee «para cada propiedad `K` de `T`», y `T[K]` es el tipo que tenía. Así se define `Partial`: cada propiedad, con su mismo tipo, pero con `?`:

```ts twoslash
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type Flags = { darkMode: boolean; beta: boolean };
type FlagLabels = { [K in keyof Flags]: string };
// → FlagLabels = { darkMode: string; beta: string; }
```

No hace falta escribirlos en el día a día, pero ayudan a entender los mensajes de error que muestran estos tipos.
:::

## Haz y evita

<div class="wk-pair">

::: haz
Una definición principal y variantes derivadas.

```ts
interface User { /* ... */ }
type NewUser = Omit<User, 'id'>;
type UserPatch = Partial<NewUser>;
```
:::

::: evita
Copiar la interfaz a mano para cada variante. Cuando cambie `User`, las copias se desincronizan.

```ts
interface NewUser {
  name: string;
  email: string;
  // ¿y el campo que añadimos ayer a User?
}
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Todo opcional (actualizaciones) | `Partial<T>` |
| Todo obligatorio | `Required<T>` |
| Solo algunas propiedades | `Pick<T, 'a' \| 'b'>` |
| Todas menos algunas | `Omit<T, 'a' \| 'b'>` |
| Nada modificable | `Readonly<T>` |
| Un valor por cada clave | `Record<K, V>` |
| Quitar opciones de una unión | `Exclude<U, X>` |
| Las claves de un tipo | `keyof T` |
| El tipo de una propiedad | `T['prop']` |
| Lo que da una promesa | `Awaited<T>` |

<PracticeLink topic="09-utility-types" />

## Ver también

- [Objetos](./03-objetos): `interface`, `type` y `Record`.
- [Genéricos](./08-genericos): cómo funcionan los parámetros de tipo.
- [Puente a React](./15-react): props derivadas con `Omit` y `Pick`.
