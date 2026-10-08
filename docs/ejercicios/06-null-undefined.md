# Ejercicios · null y undefined

Repasa antes: [null y undefined](/guia/06-null-undefined). Cómo se hacen y se comprueban: [Ejercicios](./).

## 1. Buscar un alumno <span class="wk-level l1">básico</span>

Escribe `studentName(students, id)`: devuelve el nombre del alumno con ese `id` o, si no existe, `'Alumno desconocido'`. No se permite usar `!` ni `as`.

```ts twoslash playground
interface Student {
  id: number;
  fullName: string;
  group: string;
}

const students: Student[] = [
  { id: 1, fullName: 'Lucía Moreno', group: '2DAW' },
  { id: 2, fullName: 'Pablo Ruiz', group: '2DAW' },
];

function studentName(list: Student[], id: number): string {
  // Tu código aquí
  return '';
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
check('el alumno 2 es Pablo Ruiz', studentName(students, 2) === 'Pablo Ruiz');
check('el 99 no existe', studentName(students, 99) === 'Alumno desconocido');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
`find` devuelve `Student | undefined`. En una línea: `?.` para leer el nombre si existe y `??` para el valor por defecto.
:::

::: details Solución
```ts twoslash run
interface Student {
  id: number;
  fullName: string;
  group: string;
}

const students: Student[] = [
  { id: 1, fullName: 'Lucía Moreno', group: '2DAW' },
  { id: 2, fullName: 'Pablo Ruiz', group: '2DAW' },
];

function studentName(list: Student[], id: number): string {
  return list.find((s) => s.id === id)?.fullName ?? 'Alumno desconocido';
}

check('el alumno 2 es Pablo Ruiz', studentName(students, 2) === 'Pablo Ruiz');
check('el 99 no existe', studentName(students, 99) === 'Alumno desconocido');

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```
:::

## 2. Ajustes con valores por defecto <span class="wk-level l2">medio</span>

Un reproductor guarda los ajustes del usuario, pero cualquiera puede faltar. Escribe `withDefaults(settings)`, que rellene lo que falte:

| Ajuste | Por defecto |
|---|---|
| `volume` | `50` |
| `nickname` | `'Invitado'` |
| `autoplay` | `true` |

**Cuidado:** un volumen `0`, un apodo vacío `''` o `autoplay: false` son elecciones válidas del usuario y **no** se deben sustituir.

```ts twoslash playground
interface Settings {
  volume?: number;
  nickname?: string;
  autoplay?: boolean;
}

function withDefaults(settings: Settings): Required<Settings> {
  // Tu código aquí
  return { volume: 0, nickname: '', autoplay: false };
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const empty = withDefaults({});
check('sin nada, volumen 50', empty.volume === 50);
check('sin nada, Invitado', empty.nickname === 'Invitado');
check('sin nada, autoplay activado', empty.autoplay === true);
const chosen = withDefaults({ volume: 0, nickname: '', autoplay: false });
check('respeta el volumen 0', chosen.volume === 0);
check('respeta el apodo vacío', chosen.nickname === '');
check('respeta autoplay desactivado', chosen.autoplay === false);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
La diferencia entre `||` y `??` es justo lo que se pregunta: ver [?? frente a ||](/guia/06-null-undefined#frente-a). `Required<Settings>` es el mismo tipo con todas las propiedades obligatorias.
:::

::: details Solución
```ts twoslash run
interface Settings {
  volume?: number;
  nickname?: string;
  autoplay?: boolean;
}

function withDefaults(settings: Settings): Required<Settings> {
  return {
    volume: settings.volume ?? 50,
    nickname: settings.nickname ?? 'Invitado',
    autoplay: settings.autoplay ?? true,
  };
}

const empty = withDefaults({});
check('sin nada, volumen 50', empty.volume === 50);
check('sin nada, Invitado', empty.nickname === 'Invitado');
check('sin nada, autoplay activado', empty.autoplay === true);
const chosen = withDefaults({ volume: 0, nickname: '', autoplay: false });
check('respeta el volumen 0', chosen.volume === 0);
check('respeta el apodo vacío', chosen.nickname === '');
check('respeta autoplay desactivado', chosen.autoplay === false);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Con `||`, las tres últimas comprobaciones fallarían: `0`, `''` y `false` son valores «falsos» y se sustituirían.
:::

## 3. Validar alumnos que llegan en JSON <span class="wk-level l3">reto</span>

Un fichero JSON trae una lista de alumnos, pero no todos están bien escritos. Hay que quedarse solo con los válidos.

1. Escribe el type guard `isStudent(value: unknown): value is Student`. Un alumno es válido si es un objeto con `id` numérico, `fullName` de texto y `group` de texto.
2. Escribe `parseStudents(json: string): Student[]`: lee el texto con `JSON.parse` y devuelve los alumnos válidos. Si el texto no es JSON o no es una lista, devuelve `[]`.

```ts twoslash playground
interface Student {
  id: number;
  fullName: string;
  group: string;
}

function isStudent(value: unknown): value is Student {
  // Tu código aquí
  return false;
}

function parseStudents(json: string): Student[] {
  // Tu código aquí
  return [];
}

// ── Comprobación: no hace falta tocar nada de aquí abajo ──
const data = '[{"id":1,"fullName":"Lucía","group":"2DAW"},{"id":"2","fullName":"Pablo","group":"2DAW"},{"fullName":"Sin id"},null]';
check('solo el primero es válido', parseStudents(data).length === 1);
check('el válido es Lucía', parseStudents(data)[0]?.fullName === 'Lucía');
check('un texto que no es JSON da []', parseStudents('no es json').length === 0);
check('un JSON que no es lista da []', parseStudents('{"id":1}').length === 0);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

::: details Pista
- El type guard es como `isPreferences` en [Validar datos que llegan de fuera](/guia/06-null-undefined#validar-datos-que-llegan-de-fuera): `typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'number' && ...`.
- `JSON.parse` lanza un error si el texto no es JSON: envuélvelo en `try`/`catch`. Guarda el resultado como `unknown` y comprueba `Array.isArray`.
- Después, `filter(isStudent)`: TypeScript entiende que el resultado es `Student[]`.
:::

::: details Solución
```ts twoslash run
interface Student {
  id: number;
  fullName: string;
  group: string;
}

function isStudent(value: unknown): value is Student {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'fullName' in value &&
    typeof value.fullName === 'string' &&
    'group' in value &&
    typeof value.group === 'string'
  );
}

function parseStudents(json: string): Student[] {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.filter(isStudent);
}

const data = '[{"id":1,"fullName":"Lucía","group":"2DAW"},{"id":"2","fullName":"Pablo","group":"2DAW"},{"fullName":"Sin id"},null]';
check('solo el primero es válido', parseStudents(data).length === 1);
check('el válido es Lucía', parseStudents(data)[0]?.fullName === 'Lucía');
check('un texto que no es JSON da []', parseStudents('no es json').length === 0);
check('un JSON que no es lista da []', parseStudents('{"id":1}').length === 0);

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK   ' : 'FALLA'} ${label}`);
}
```

Pablo se descarta porque su `id` es el texto `"2"`, no un número: justo el tipo de error que una anotación sin validar dejaría pasar.
:::
