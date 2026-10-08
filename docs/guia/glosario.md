# Glosario

Términos que aparecen en la wiki y en los mensajes del compilador, ordenados alfabéticamente. Cada uno enlaza al tema donde se explica.

| Término | Significado | Tema |
|---|---|---|
| **Acceso indexado** | `T['prop']`: el tipo de una propiedad concreta de otro tipo | [Utility types](./09-utility-types#derivar-tipos-con-keyof-y-el-acceso-indexado) |
| **Adaptador** | Función que convierte los datos de una API (DTO) al formato de la aplicación | [Asincronía](./11-asincronia#fetch-tipado-de-unknown-a-datos-fiables) |
| **Alias de tipo** | Nombre dado a un tipo con `type`: `type Id = number` | [Objetos](./03-objetos#type-para-objetos) |
| **Anotación** | Tipo escrito de forma explícita: `const n: number = 1` | [Fundamentos](./01-fundamentos#inferencia-typescript-deduce-casi-todo) |
| **`any`** | Tipo que desactiva las comprobaciones. Prohibido en el curso | [Fundamentos](./01-fundamentos#any-frente-a-unknown) |
| **Aserción (`as`)** | Indicar al compilador un tipo sin comprobarlo. Se evita | [null y undefined](./06-null-undefined#lo-que-no-se-hace-y-as) |
| **Callback** | Función que se pasa como argumento a otra | [Funciones](./05-funciones#callbacks-funciones-como-argumento) |
| **Closure** | Función que recuerda las variables del lugar donde se creó | [Funciones](./05-funciones#funciones-que-devuelven-funciones) |
| **Comparador** | Función `(a, b) => número` que decide el orden en `toSorted` | [Arrays](./04-arrays#ordenar-sin-mutar-tosorted) |
| **Discriminante** | Propiedad con un valor literal distinto en cada miembro de una unión (`status`, `kind`, `type`) | [Uniones y narrowing](./02-uniones-narrowing#uniones-discriminadas) |
| **DTO** | *Data Transfer Object*: el tipo de los datos tal como llegan de fuera | [Asincronía](./11-asincronia#fetch-tipado-de-unknown-a-datos-fiables) |
| **Ensanchamiento** | Cuando TypeScript deduce `string` en lugar del literal `'dark'` | [Fundamentos](./01-fundamentos#ensanchamiento-de-tipos) |
| **Estado derivado** | Dato que se calcula a partir del estado en lugar de guardarse aparte | [Puente a React](./15-react#datos-derivados-no-los-guardes-en-el-estado) |
| **Exhaustividad** | Comprobar que un `switch` trata todos los casos de una unión, con `never` | [Uniones y narrowing](./02-uniones-narrowing#switch-exhaustivo-con-never) |
| **Firma** | Parámetros y tipo de retorno de una función | [Funciones](./05-funciones#la-firma) |
| **Frontera** | Punto donde entran datos de fuera del programa; ahí se anota y se valida | [Clean code](./13-clean-code#_9-valida-en-la-frontera-confia-dentro) |
| **Genérico** | Tipo con un hueco que se rellena al usarlo: `Array<T>` | [Genéricos](./08-genericos) |
| **Inferencia** | Deducción automática del tipo a partir del valor | [Fundamentos](./01-fundamentos#inferencia-typescript-deduce-casi-todo) |
| **Inmutabilidad** | Crear copias en lugar de modificar los datos existentes | [Arrays](./04-arrays#copiar-y-modificar-sin-mutar) |
| **`interface`** | Declaración de la forma de un objeto | [Objetos](./03-objetos#interface) |
| **`keyof`** | Unión de las claves de un tipo | [Utility types](./09-utility-types#derivar-tipos-con-keyof-y-el-acceso-indexado) |
| **Literal** | Un valor concreto usado como tipo: `'pending'`, `3`, `true` | [Uniones y narrowing](./02-uniones-narrowing#uniones-de-literales) |
| **Módulo** | Fichero con `import` o `export` | [Módulos](./07-modulos) |
| **Mutar** | Modificar un array u objeto existente (`push`, `sort`, asignar una propiedad) | [Arrays](./04-arrays#metodos-que-devuelven-y-si-modifican-el-original) |
| **Narrowing** | Estrechamiento: reducir un tipo tras una comprobación | [Uniones y narrowing](./02-uniones-narrowing#narrowing-comprobar-para-estrechar) |
| **`never`** | Tipo de lo que no puede ocurrir | [Fundamentos](./01-fundamentos#never) |
| **Non-null assertion (`!`)** | Afirmar que algo no es `null` ni `undefined` sin comprobarlo. Se evita | [null y undefined](./06-null-undefined#lo-que-no-se-hace-y-as) |
| **Parámetro de tipo** | El hueco de un genérico: la `T` de `function f<T>()` | [Genéricos](./08-genericos#funciones-genericas) |
| **Props** | Objeto con los datos que recibe un componente de React | [Puente a React](./15-react#componentes-y-props) |
| **`readonly`** | Propiedad que no se puede reasignar | [Objetos](./03-objetos#propiedades-de-solo-lectura) |
| **`Record`** | Objeto con un valor por cada clave: `Record<Clave, Valor>` | [Objetos](./03-objetos#record-objetos-que-funcionan-como-diccionario) |
| **Reductor** | Función pura `(estado, acción) => nuevoEstado` | [Puente a React](./15-react#usereducer-con-acciones-tipadas) |
| **`satisfies`** | Comprobar un valor contra un tipo sin perder su tipo exacto | [Objetos](./03-objetos#satisfies-comprobar-sin-perder-precision) |
| **Tipado estructural** | Dos tipos son compatibles si tienen la misma forma, aunque se llamen distinto | [Objetos](./03-objetos#tipado-estructural) |
| **Tupla** | Array de longitud fija con un tipo por posición: `[string, number]` | [Arrays](./04-arrays#tuplas) |
| **Type guard** | Función `(v: unknown): v is T` que comprueba y estrecha un tipo | [Uniones y narrowing](./02-uniones-narrowing#type-guards-propios) |
| **Unión** | Tipo que puede ser uno u otro: `A \| B` | [Uniones y narrowing](./02-uniones-narrowing#uniones) |
| **Unión discriminada** | Unión de objetos que se distinguen por una propiedad literal común | [Uniones y narrowing](./02-uniones-narrowing#uniones-discriminadas) |
| **`unknown`** | Tipo seguro para valores de origen desconocido: obliga a comprobar | [Fundamentos](./01-fundamentos#any-frente-a-unknown) |
| **Utility type** | Genérico incluido en TypeScript que transforma tipos: `Partial`, `Omit`... | [Utility types](./09-utility-types) |
| **`void`** | Tipo de retorno de una función que no devuelve nada útil | [Fundamentos](./01-fundamentos#void) |
| **XSS** | Ataque que inyecta código a través de HTML construido con datos externos | [DOM tipado](./12-dom#crear-contenido-de-forma-segura) |
