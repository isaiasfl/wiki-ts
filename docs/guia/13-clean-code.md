# Clean code en TypeScript

<div class="wk-meta">
  <span><strong>Nivel</strong> esencial</span>
  <span><strong>Apuntes</strong> todo el curso</span>
  <span><strong>Uso</strong> lista de comprobación antes de entregar</span>
</div>

Código limpio es código que **otra persona entiende y puede cambiar sin miedo**. Esa otra persona suele ser uno mismo, tres semanas después. TypeScript ayuda mucho, pero solo si se usa bien: un proyecto lleno de `any` y `as` tiene la sintaxis de TypeScript y los errores de JavaScript.

Esta página reúne las reglas del curso, cada una con **su razón**. No son caprichos: cada regla evita un tipo concreto de error.

## 1. Anota en las fronteras, infiere dentro

:::: esencial
Los tipos se escriben donde el compilador **no puede deducirlos** o donde sirven de **contrato**: parámetros, retornos de funciones exportadas y datos que entran desde fuera. A esos puntos de entrada y salida se les llama **fronteras**: son los bordes de una función o del programa. El resto se deja inferir.

<div class="wk-pair">

::: haz
```ts
export function lateFee(days: number): number {
  const perDay = 0.5;
  return days * perDay;
}
```
:::

::: evita
```ts
export function lateFee(days: number): number {
  const perDay: number = 0.5;
  const total: number = days * perDay;
  return total;
}
```
:::

</div>

**Por qué:** las anotaciones redundantes no añaden seguridad y hay que mantenerlas. Las de las fronteras sí: detectan el error donde está.
::::

## 2. Nada de `any`

:::: esencial
`any` desactiva el compilador para ese valor y para **todo lo que se calcule a partir de él**. Si no sabes el tipo, usa `unknown` y compruébalo.

<div class="wk-pair">

::: haz
```ts
const data: unknown = JSON.parse(raw);
if (isSettings(data)) apply(data);
```
:::

::: evita
```ts
const data: any = JSON.parse(raw);
apply(data);
```
:::

</div>

**Por qué:** un solo `any` puede propagarse por medio proyecto sin que se note, y los errores vuelven a aparecer en ejecución.
::::

## 3. Nada de `as` ni `!` sin una razón escrita

:::: esencial
`as` y `!` le dicen al compilador *«confía en mí»*. No comprueban nada.

<div class="wk-pair">

::: haz
```ts
const input = document.querySelector('#email');
if (!(input instanceof HTMLInputElement)) {
  throw new Error('Falta el campo #email');
}
```
:::

::: evita
```ts
const input = document.querySelector('#email') as HTMLInputElement;
const value = input!.value;
```
:::

</div>

**Por qué:** si la suposición es falsa, el programa falla igualmente, y además el error aparece lejos de donde se cometió. Si en algún caso excepcional un `as` es inevitable, deja un comentario que explique por qué es seguro.
::::

## 4. Haz imposibles los estados imposibles

:::: esencial
Usa **uniones de literales** para opciones fijas y **uniones discriminadas** para estados, en lugar de `string` o de varios booleanos.

<div class="wk-pair">

::: haz
```ts
type Upload =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number }
  | { status: 'done'; url: string }
  | { status: 'failed'; reason: string };
```
:::

::: evita
```ts
interface Upload {
  isUploading: boolean;
  isDone: boolean;
  progress?: number;
  url?: string;
  error?: string;
}
```
:::

</div>

**Por qué:** con varios booleanos existen combinaciones sin sentido (`isUploading` y `isDone` a la vez) que el código tiene que vigilar. Con una unión, **no se pueden representar**.
::::

## 5. Inmutabilidad por defecto

:::: esencial
- `const` siempre; `let` solo si la variable **de verdad** cambia.
- Para modificar listas y objetos, crea **copias**: spread, `map`, `filter`, `toSorted`.
- No modifiques los parámetros que recibe una función.

<div class="wk-pair">

::: haz
```ts
function complete(tasks: Task[], id: number): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
}
```
:::

::: evita
```ts
function complete(tasks: Task[], id: number): void {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = true;
}
```
:::

</div>

**Por qué:** cuando nadie modifica los datos «por detrás», es fácil seguir qué valor tiene cada cosa. En React es imprescindible: la interfaz solo se actualiza si el estado es un objeto **nuevo**.
::::

## 6. Nombres que expliquen

:::: esencial
| Qué | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase`, en inglés | `overdueLoans`, `calculateFee` |
| Tipos, interfaces, clases | `PascalCase` | `Loan`, `WeatherState` |
| Constantes de configuración | `UPPER_SNAKE_CASE` | `MAX_LOANS`, `API_URL` |
| Booleanos | Pregunta de sí o no | `isOverdue`, `hasStock`, `canEdit` |
| Funciones | Un verbo | `fetchBooks`, `renderList`, `formatDate` |
| Ficheros | `kebab-case` | `render-books.ts`, `loan-service.ts` |

En el curso, **el código en inglés y las explicaciones en español**: es lo que encontrarás en cualquier equipo.
::::

<div class="wk-pair">

::: haz
```ts
const overdueLoans = loans.filter(isOverdue);
```
:::

::: evita
```ts
const arr2 = data.filter((x) => x.d < n && !x.r);
```
:::

</div>

## 7. Funciones pequeñas y con un solo propósito

:::: esencial
Si para describir lo que hace una función necesitas la palabra «y», probablemente son dos funciones. Usa la **salida temprana** para tratar primero los casos especiales y evitar anidar.

<div class="wk-pair">

::: haz
```ts
function fee(loan: Loan, today: Date): number {
  if (loan.returned) return 0;
  const days = daysLate(loan.dueDate, today);
  if (days <= 0) return 0;
  return days * FEE_PER_DAY;
}
```
:::

::: evita
```ts
function fee(loan: Loan, today: Date): number {
  if (!loan.returned) {
    const days = /* cálculo largo aquí */ 0;
    if (days > 0) {
      return days * 0.5;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}
```
:::

</div>
::::

## 8. Sin números mágicos

:::: esencial
Un número o texto suelto en el código no dice qué significa. Dale nombre:

<div class="wk-pair">

::: haz
```ts
const VAT_RATE = 0.21;
const MAX_LOANS = 5;

const total = net * (1 + VAT_RATE);
if (loans.length >= MAX_LOANS) { /* ... */ }
```
:::

::: evita
```ts
const total = net * 1.21;
if (loans.length >= 5) { /* ... */ }
```
:::

</div>

**Por qué:** si el IVA cambia, se cambia en un sitio. Y quien lee el código entiende la regla, no solo el cálculo.
::::

## 9. Valida en la frontera, confía dentro

::: esencial
Los datos que entran al programa (formularios, APIs, `localStorage`, la URL) pueden traer cualquier cosa, porque no los controlas tú. Se **comprueban una vez**, en el punto de entrada, y se convierten al tipo de la aplicación. A partir de ahí, el resto del código confía en los tipos sin volver a comprobar.

```text
 exterior  ──►  validar + adaptar  ──►  tipos de la aplicación  ──►  lógica e interfaz
 (unknown)       (una sola vez)          (Weather, Loan, ...)        (sin comprobaciones repetidas)
```

Ver [null y undefined](./06-null-undefined#validar-datos-que-llegan-de-fuera) y [Asincronía](./11-asincronia#fetch-tipado-de-unknown-a-datos-fiables).
:::

## 10. Errores con significado

:::: esencial
- Lanza **objetos `Error`** con un mensaje que diga qué ha pasado y con qué dato.
- Para errores que el programa debe distinguir, crea **clases propias** (`ValidationError`, `NotFoundError`).
- Nunca dejes un `catch` vacío.

<div class="wk-pair">

::: haz
```ts
throw new NotFoundError(`No existe el libro con id ${id}`);
```
:::

::: evita
```ts
throw 'error';
```
:::

</div>
::::

## 11. Separa responsabilidades

::: esencial
Cada fichero, una responsabilidad. Una organización habitual:

| Carpeta | Contiene | No contiene |
|---|---|---|
| `types/` | Interfaces y tipos | Código ejecutable |
| `domain/` | Reglas y cálculos puros | DOM, `fetch`, `localStorage` |
| `services/` | Acceso a API y almacenamiento | DOM |
| `ui/` | Pintar y escuchar eventos | Reglas de negocio |

Ver [Módulos](./07-modulos#organizar-un-proyecto-por-capas).
:::

## 12. Antes de entregar

::: esencial
Lista de comprobación:

1. `npx tsc --noEmit` **sin errores**.
2. Ningún `any`, `as` ni `!` sin justificar.
3. Ningún `console.log` de depuración olvidado.
4. Nombres en inglés, descriptivos; nada de `data2`, `aux` o `temp`.
5. Sin código comentado «por si acaso»: para eso está Git.
6. Cada función hace una cosa y su nombre lo dice.
7. Los datos externos se validan al entrar.
8. Commit con un mensaje que explique **qué** y **por qué**.
:::

## Ampliación

### Herramientas que aplican las reglas por ti

::: ampliacion
- **ESLint** con **typescript-eslint** detecta automáticamente muchas de estas reglas: `any` explícitos, promesas sin `await`, variables sin usar, comparaciones sospechosas. Sus reglas *strict-type-checked* son un buen punto de partida.
- **Prettier** formatea el código de forma uniforme, para que las revisiones hablen del contenido y no de espacios y comas.
- Ambas se pueden ejecutar al guardar en el editor y antes de cada commit.
:::

### SOLID en una frase cada uno

::: ampliacion
| Principio | En una frase |
|---|---|
| **S**ingle responsibility | Cada módulo o función tiene una sola razón para cambiar |
| **O**pen/closed | Se añade comportamiento nuevo sin modificar el que ya funciona |
| **L**iskov substitution | Una implementación se puede cambiar por otra que cumpla el mismo contrato |
| **I**nterface segregation | Interfaces pequeñas y concretas mejor que una enorme |
| **D**ependency inversion | Depende de contratos (`interface`), no de implementaciones concretas |

En TypeScript, las interfaces hacen que varios de estos principios sean naturales: ver [Clases · Herencia y composición](./10-clases#herencia-y-composicion).
:::

## Ver también

- [Traductor de errores](./14-errores): qué significa cada aviso del compilador.
- [Uniones y narrowing](./02-uniones-narrowing): modelar estados.
- [Módulos](./07-modulos): organizar el proyecto.
