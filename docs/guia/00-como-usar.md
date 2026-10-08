# Cómo usar esta wiki

Esta wiki es una **referencia de consulta**, no un curso. Los apuntes de cada unidad se leen de principio a fin; aquí se viene a buscar algo concreto: *¿cómo se tipaba esto?*, *¿qué significa este error?*, *¿cuál es la forma correcta de hacerlo?*

## Cómo encontrar algo

- **Buscador**: pulsa <kbd>Ctrl</kbd> + <kbd>K</kbd> (o <kbd>/</kbd>) y escribe una palabra: `Record`, `narrowing`, `possibly undefined`. Funciona sin conexión.
- **Menú lateral**: los temas siguen el orden lógico del lenguaje, no el del calendario.
- **En esta página**: el índice de la derecha lleva a cada apartado del tema abierto.

## Cómo está organizado cada tema

Todos los temas siguen la misma estructura:

1. **Qué es**, en una o dos frases.
2. **Sintaxis** mínima.
3. **Ejemplos** con distintos dominios: una biblioteca, una lista de tareas, una tienda, una API del tiempo.
4. **Errores típicos**, con el mensaje real del compilador.
5. **Haz / Evita**: la forma recomendada frente a la que da problemas.
6. **Ver también**: temas relacionados.

Los contenidos se dividen en dos niveles:

::: esencial
Lo que se trabaja en el curso y se necesita para programar con soltura. Es la parte que entra en las pruebas.
:::

::: ampliacion
Un paso más allá: detalles del lenguaje que aparecen en proyectos reales y en código de librerías. Recomendable, pero no imprescindible.
:::

## Los ejemplos están comprobados

Cada fragmento de código se **compila al generar la wiki**. Si un ejemplo tuviera un error de tipos, la wiki no se podría publicar. Cuando un ejemplo muestra un error a propósito, el mensaje que aparece es **el real** del compilador.

Pasa el ratón (o toca, en el móvil) sobre cualquier variable de un ejemplo para ver **el tipo que deduce TypeScript**:

```ts twoslash
const title = 'El nombre del viento';
// → title: "El nombre del viento"
const pages = 662;
const available = pages > 0;
// → available: boolean
```

## Avisos que encontrarás

::: info Nota
Información complementaria o una aclaración.
:::

::: tip Consejo
Una forma más cómoda o más clara de hacer algo.
:::

::: warning Atención
Algo que funciona, pero tiene una trampa.
:::

::: error
Un error que comete casi todo el mundo la primera vez, con su explicación.
:::

<div class="wk-pair">

::: haz
La forma recomendada.
:::

::: evita
La forma que funciona mal o es difícil de mantener.
:::

</div>

## Configuración de referencia

Los ejemplos usan la configuración de un proyecto **Vite + TypeScript** actual: modo estricto, `verbatimModuleSyntax` y `erasableSyntaxOnly`. Es la misma con la que se trabaja en clase.
