# DOM tipado

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial + ampliación</span>
  <span><strong>Apuntes</strong> U5 · U6</span>
  <span><strong>En React</strong> React gestiona el DOM, pero los tipos de eventos son los mismos</span>
</div>

El **DOM** es la representación del HTML como objetos que el programa puede leer y modificar. TypeScript conoce los tipos de todos sus elementos (`HTMLButtonElement`, `HTMLInputElement`...) y de todos sus eventos. Su gran aportación aquí es recordarte que **un elemento puede no existir** y que **lo que escribe el usuario siempre llega como texto**.

## Seleccionar elementos

::: esencial
Lo que devuelve `querySelector` depende de cómo se busque:

```ts twoslash
const button = document.querySelector('button');
// → button: HTMLButtonElement | null
const search = document.querySelector('#search');
// → search: Element | null
const list = document.getElementById('results');
// → list: HTMLElement | null
```

- Buscando por **etiqueta** (`'button'`), TypeScript sabe el tipo exacto.
- Buscando por **id o clase**, solo sabe que es un `Element` genérico: TypeScript no lee tu HTML, así que no puede saber si `#search` es un `input`, un `div` o un `p`.
- En todos los casos puede ser **`null`**: si el elemento no está en el HTML.
:::

### Indicar el tipo y comprobar que existe

::: esencial
Con un selector de id o clase, se puede indicar el tipo esperado entre `< >` justo después de `querySelector`: «busca `#search`, y es un `HTMLInputElement`». (Los `< >` sirven para pasar un tipo a una función; se explican en [Genéricos](./08-genericos).) Después **se comprueba** que el elemento existe:

```ts twoslash
const searchInput = document.querySelector<HTMLInputElement>('#search');
if (searchInput === null) {
  throw new Error('Falta el campo #search en el HTML');
}

searchInput.value = 'Granada';
// → value: string
```
:::

::: warning Atención
`querySelector<HTMLInputElement>` **no comprueba** que el elemento sea de verdad un `input`: es una indicación al compilador. Si el `#search` del HTML fuera un `div`, el código compilaría y fallaría al ejecutar. Cuando no tengas control del HTML, comprueba con `instanceof`:

```ts twoslash
const element = document.querySelector('#search');
if (!(element instanceof HTMLInputElement)) {
  throw new Error('#search debe ser un <input>');
}
element.value = 'Granada';
```
:::

Los tipos de elemento más habituales:

| Elemento | Tipo | Propiedades propias |
|---|---|---|
| `<input>` | `HTMLInputElement` | `value`, `checked`, `valueAsNumber` |
| `<button>` | `HTMLButtonElement` | `disabled`, `type` |
| `<form>` | `HTMLFormElement` | `elements`, `reset()`, `reportValidity()` |
| `<select>` | `HTMLSelectElement` | `value`, `selectedOptions` |
| `<textarea>` | `HTMLTextAreaElement` | `value` |
| `<a>` | `HTMLAnchorElement` | `href` |
| `<img>` | `HTMLImageElement` | `src`, `alt` |
| `<ul>`, `<li>` | `HTMLUListElement`, `HTMLLIElement` | — |

## Crear contenido de forma segura

::: esencial
`document.createElement` devuelve el tipo exacto de la etiqueta:

```ts twoslash
interface Task {
  id: number;
  title: string;
}
// ---cut---
function renderTask(task: Task): HTMLLIElement {
  const item = document.createElement('li');
  item.textContent = task.title;
  item.dataset.id = String(task.id);
  return item;
}
```

- `textContent` pone el texto del elemento. Trata el contenido como texto plano, no como HTML.
- `dataset.id` crea el atributo `data-id` en el HTML (`<li data-id="7">`). Sirve para guardar en el elemento el identificador de la tarea y recuperarlo después, por ejemplo al pulsarlo. Los atributos `data-*` siempre guardan texto, por eso se convierte con `String`.
:::

::: error
Construir HTML con `innerHTML` a partir de datos del usuario. Si un título contiene `<img src=x onerror="...">`, el navegador **ejecuta** ese código: es un ataque **XSS** (*cross-site scripting*).

```ts
item.innerHTML = `<strong>${task.title}</strong>`; // peligroso con datos externos
```

Crea los elementos con `createElement` y rellénalos con `textContent`. Reserva `innerHTML` para plantillas fijas que no contienen datos del usuario.
:::

## Eventos

::: esencial
`addEventListener` sabe qué tipo de evento llega según su nombre, así que **no hace falta anotar** el parámetro:

```ts twoslash
declare const button: HTMLButtonElement;
declare const input: HTMLInputElement;
declare const form: HTMLFormElement;
// ---cut---
button.addEventListener('click', (event) => {
  // → event: PointerEvent
  console.log(event.clientX, event.clientY);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') console.log('Buscar');
});

form.addEventListener('submit', (event) => {
  // → event: SubmitEvent
  event.preventDefault();
});
```
:::

| Evento | Tipo | Datos útiles |
|---|---|---|
| `click` | `PointerEvent` (hereda de `MouseEvent`) | `clientX`, `clientY`, `pointerType` |
| `dblclick`, `mousemove` | `MouseEvent` | `clientX`, `clientY`, `button` |
| `keydown`, `keyup` | `KeyboardEvent` | `key`, `ctrlKey`, `shiftKey` |
| `input`, `change` | `Event` | `target` (hay que estrecharlo) |
| `submit` | `SubmitEvent` | `submitter` |
| `focus`, `blur` | `FocusEvent` | `relatedTarget` |

### `target` frente a `currentTarget`

::: esencial
- `currentTarget` → el elemento **al que se añadió** el listener.
- `target` → el elemento **en el que ocurrió** el evento (puede ser un hijo).

TypeScript no puede saber qué hay en `target`, así que su tipo es `EventTarget | null`. Hay que estrecharlo:

```ts twoslash
// @errors: 18047 2339
declare const input: HTMLInputElement;
// ---cut---
input.addEventListener('input', (event) => {
  console.log(event.target.value);

  if (event.target instanceof HTMLInputElement) {
    console.log(event.target.value);
  }
});
```
:::

## Delegación de eventos

::: esencial
En lugar de un listener por cada elemento de una lista, se pone **uno en el contenedor** y se mira en qué elemento ocurrió. Funciona también con elementos que se añaden más tarde:

```ts twoslash
declare const list: HTMLUListElement;
declare function removeTask(id: number): void;
// ---cut---
list.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest('button[data-action="remove"]');
  if (!(button instanceof HTMLButtonElement)) return;

  const id = Number(button.dataset.id);
  removeTask(id);
});
```

Paso a paso, cuando se hace clic en cualquier sitio de la lista:

1. Se comprueba que `event.target` (donde se hizo clic) sea un elemento. Si no, se sale.
2. `closest(...)` busca, desde ese elemento hacia arriba por sus padres, el primer botón con `data-action="remove"`. Así funciona aunque el clic caiga en un icono **dentro** del botón.
3. Si no hay tal botón (se hizo clic en otra parte de la lista), se sale.
4. Se lee el `data-id` del botón, se convierte a número y se borra esa tarea.

Las líneas `if (!(...)) return;` son narrowing con salida temprana: después de cada una, TypeScript sabe que la comprobación se cumplió.
:::

## Formularios

::: esencial
`FormData` recoge todos los campos de un formulario por su atributo `name`. Lo que devuelve `get` es `FormDataEntryValue | null`: puede ser un texto, un fichero o no existir.

```ts twoslash
interface Registration {
  name: string;
  age: number;
}

function readRegistration(form: HTMLFormElement): Registration | string {
  const data = new FormData(form);
  const name = data.get('name');
  const age = Number(data.get('age'));

  if (typeof name !== 'string' || name.trim() === '') {
    return 'El nombre es obligatorio';
  }
  if (!Number.isInteger(age) || age < 0) {
    return 'La edad debe ser un número entero';
  }
  return { name: name.trim(), age };
}
```

La idea clave: **convertir no es validar**. `Number('abc')` da `NaN` sin avisar; después de convertir, hay que comprobar que el resultado tiene sentido.
:::

## `localStorage`

::: esencial
`localStorage` solo guarda **textos**. `getItem` devuelve `string | null` (`null` si nunca se guardó nada), y lo que se lee pudo haberlo modificado cualquiera desde las herramientas del navegador. Por eso `loadTheme` no se fía: solo acepta `'dark'` o `'light'` y, si hay otra cosa, usa `'light'`:

```ts twoslash
const THEME_KEY = 'theme';
type Theme = 'light' | 'dark';

function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
}

function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === 'dark' || saved === 'light' ? saved : 'light';
}
```

Para objetos se usa `JSON.stringify` al guardar y `JSON.parse` al leer, siempre validando el resultado: ver [Validar datos que llegan de fuera](./06-null-undefined#validar-datos-que-llegan-de-fuera).
:::

## Ampliación

### `valueAsNumber` y `valueAsDate`

::: ampliacion
Los `input` numéricos y de fecha ofrecen el valor ya convertido:

```ts twoslash
declare const ageInput: HTMLInputElement;
declare const dateInput: HTMLInputElement;
// ---cut---
const age = ageInput.valueAsNumber; // NaN si está vacío
const due = dateInput.valueAsDate;
// → due: Date | null
```
:::

### `elements` de un formulario

::: ampliacion
`form.elements` da acceso a los controles por su `name`, pero cada uno es un `Element | RadioNodeList | null` genérico. Para usarlo hay que estrecharlo, igual que `target`:

```ts twoslash
declare const form: HTMLFormElement;
// ---cut---
const field = form.elements.namedItem('email');
if (field instanceof HTMLInputElement) {
  console.log(field.value);
}
```
:::

### Eventos propios

::: ampliacion
`CustomEvent<T>` permite emitir eventos con datos propios. Útil para comunicar partes de una aplicación sin que se conozcan entre sí:

```ts twoslash
const event = new CustomEvent<{ taskId: number }>('task-done', { detail: { taskId: 7 } });
document.dispatchEvent(event);

document.addEventListener('task-done', (e) => {
  if (e instanceof CustomEvent) {
    console.log(e.detail);
  }
});
```
:::

## Haz y evita

<div class="wk-pair">

::: haz
Comprobar que el elemento existe y fallar con un mensaje claro.

```ts
const form = document.querySelector<HTMLFormElement>('#signup');
if (form === null) throw new Error('Falta #signup');
```
:::

::: evita
Silenciar el `null` con `!` o `as`.

```ts
const form = document.querySelector('#signup')! as HTMLFormElement;
```
:::

</div>

<div class="wk-pair">

::: haz
`textContent` para mostrar datos.

```ts
title.textContent = book.title;
```
:::

::: evita
`innerHTML` con datos externos.

```ts
title.innerHTML = book.title;
```
:::

</div>

## Resumen

| Necesito... | Escribo |
|---|---|
| Un elemento por id o clase | `document.querySelector<HTMLInputElement>('#id')` + comprobar `null` |
| Asegurar el tipo real | `if (el instanceof HTMLInputElement)` |
| Crear un elemento | `document.createElement('li')` |
| Poner texto | `el.textContent = ...` |
| Escuchar un evento | `el.addEventListener('click', (event) => ...)` |
| Usar `event.target` | Estrecharlo con `instanceof` |
| Leer un formulario | `new FormData(form)` + validar |
| Guardar en el navegador | `localStorage.setItem` · `getItem` + validar |

<PracticeLink topic="12-dom" />

## Ver también

- [null y undefined](./06-null-undefined): por qué `querySelector` puede devolver `null`.
- [Uniones y narrowing](./02-uniones-narrowing#instanceof-clases-y-errores): `instanceof`.
- [Puente a React](./15-react#eventos): los mismos eventos, en JSX.
