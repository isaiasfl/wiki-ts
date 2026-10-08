# Ejercicios · DOM tipado

Repasa antes: [DOM tipado](/guia/12-dom). Cómo se hacen y se comprueban: [Ejercicios](./).

Estos ejercicios necesitan una página HTML real. En el Playground se comprueba que **compilen sin errores**; para verlos funcionar, crea un proyecto de Vite (`npm create vite@latest`, plantilla *Vanilla* + *TypeScript*), pon el HTML de cada ejercicio en `index.html` y el código en `src/main.ts`.

## 1. Contador de caracteres <span class="wk-level l1">básico</span>

Un comentario admite como mucho 280 caracteres, y debajo se muestra cuántos llevas: `12/280`.

```html
<textarea id="comment"></textarea>
<p id="counter">0/280</p>
```

El código de partida «funciona», pero silencia a TypeScript con `as` y `!`. Si un día cambia el HTML, fallará sin explicar por qué. Reescríbelo **sin `as` ni `!`**: comprueba que cada elemento existe y es del tipo correcto, y si no, lanza un error que diga cuál falta.

```ts twoslash playground
const comment = document.querySelector('#comment') as HTMLTextAreaElement;
const counter = document.querySelector('#counter')!;

comment.addEventListener('input', () => {
  counter.textContent = `${comment.value.length}/280`;
});
```

::: details Pista
`document.querySelector('#comment')` devuelve `Element | null`. Con `if (!(comment instanceof HTMLTextAreaElement)) throw new Error(...)` se descartan a la vez el `null` y un elemento de otro tipo.
:::

::: details Solución
```ts twoslash
const MAX_LENGTH = 280;

const comment = document.querySelector('#comment');
if (!(comment instanceof HTMLTextAreaElement)) {
  throw new Error('Falta el <textarea id="comment">');
}

const counter = document.querySelector('#counter');
if (counter === null) {
  throw new Error('Falta el elemento #counter');
}

comment.addEventListener('input', () => {
  counter.textContent = `${comment.value.length}/${MAX_LENGTH}`;
});
```

Para `#counter` basta con descartar el `null`: `textContent` existe en cualquier elemento. Para `#comment` hace falta saber que es un `textarea`, porque se lee su `value`. El 280 pasa a ser una constante con nombre.
:::

## 2. Leer un formulario de contacto <span class="wk-level l2">medio</span>

```html
<form id="contact">
  <input name="fullName" />
  <input name="email" />
  <input name="age" type="number" />
  <button>Enviar</button>
</form>
<p id="result"></p>
```

Escribe `readContact(form)`: lee los tres campos con `FormData` y devuelve un objeto `Contact` si todo es correcto, o un **texto con el primer error** si no:

- `fullName` no puede estar vacío (sin contar espacios).
- `email` debe contener `@`.
- `age` debe ser un número entero de 16 o más.

Después, al enviar el formulario (sin recargar la página), muestra en `#result` el error o `Gracias, NOMBRE`.

```ts twoslash playground
interface Contact {
  fullName: string;
  email: string;
  age: number;
}

function readContact(form: HTMLFormElement): Contact | string {
  // Tu código aquí
  return 'Sin hacer';
}

// Tu código aquí: busca el formulario y #result y escucha el envío
```

::: details Pista
- `data.get('fullName')` es `FormDataEntryValue | null`: compruébalo con `typeof name !== 'string'`.
- `Number(data.get('age'))` y `Number.isInteger(age)`.
- Al escuchar `submit`, lo primero es `event.preventDefault()`. Para saber si `readContact` devolvió un error: `typeof result === 'string'`.
:::

::: details Solución
```ts twoslash
interface Contact {
  fullName: string;
  email: string;
  age: number;
}

function readContact(form: HTMLFormElement): Contact | string {
  const data = new FormData(form);
  const fullName = data.get('fullName');
  const email = data.get('email');
  const age = Number(data.get('age'));

  if (typeof fullName !== 'string' || fullName.trim() === '') {
    return 'El nombre es obligatorio';
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return 'El correo no es válido';
  }
  if (!Number.isInteger(age) || age < 16) {
    return 'Hay que tener 16 años o más';
  }
  return { fullName: fullName.trim(), email: email.trim(), age };
}

const form = document.querySelector('#contact');
const result = document.querySelector('#result');
if (!(form instanceof HTMLFormElement) || result === null) {
  throw new Error('Faltan #contact o #result en el HTML');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const contact = readContact(form);
  result.textContent = typeof contact === 'string' ? contact : `Gracias, ${contact.fullName}`;
});
```

`Contact | string` es una unión, y `typeof contact === 'string'` la estrecha: en la otra rama, TypeScript sabe que es un `Contact` y deja leer `fullName`.
:::

## 3. Lista de tareas con delegación <span class="wk-level l3">reto</span>

```html
<ul id="todo">
  <li data-id="1">Repasar el DOM <button data-action="remove">Quitar</button></li>
  <li data-id="2">Hacer la práctica <button data-action="remove">Quitar</button></li>
</ul>
<p id="pending">2 pendientes</p>
```

Con **un solo listener** en la `<ul>`, haz que al pulsar cualquier botón «Quitar» se elimine su `<li>` y se actualice el texto de `#pending`. Debe funcionar también para tareas que se añadan más tarde a la lista.

```ts twoslash playground
// Tu código aquí
```

::: details Pista
Es el patrón de [Delegación de eventos](/guia/12-dom#delegacion-de-eventos): comprueba que `event.target` es un `Element`, busca con `closest('button[data-action="remove"]')` y, desde el botón, sube otra vez con `closest('li')`. Para contar las que quedan: `list.querySelectorAll('li').length`.
:::

::: details Solución
```ts twoslash
const list = document.querySelector('#todo');
const pending = document.querySelector('#pending');
if (!(list instanceof HTMLUListElement) || pending === null) {
  throw new Error('Faltan #todo o #pending en el HTML');
}

const updatePending = (): void => {
  const count = list.querySelectorAll('li').length;
  pending.textContent = `${count} pendientes`;
};

list.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest('button[data-action="remove"]');
  if (button === null) return;

  const item = button.closest('li');
  if (item === null) return;

  item.remove();
  updatePending();
});
```

Como el listener está en la `<ul>` y se mira el `target` en cada clic, sirve para cualquier `<li>` presente o futuro, sin añadir un listener por botón.
:::
