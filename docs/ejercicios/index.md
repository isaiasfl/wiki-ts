# Ejercicios

Cada tema de la guía tiene su página de ejercicios, ordenados de menos a más:

<span class="wk-level l1">básico</span> aplica lo esencial del tema, casi directamente.
<span class="wk-level l2">medio</span> combina varias ideas o pide decidir qué herramienta usar.
<span class="wk-level l3">reto</span> va un paso más allá; puede necesitar algo de la ampliación.

## Cómo se hace un ejercicio

1. Lee el enunciado y pulsa **Abrir en el Playground**. Se abre el [TypeScript Playground](https://www.typescriptlang.org/play), el editor oficial en el navegador, con el código de partida ya cargado. No hay que instalar nada.
2. Escribe tu solución donde pone `// Tu código aquí`. Mientras haya algo **subrayado en rojo**, TypeScript te está avisando de un error: pasa el ratón por encima para leerlo (y si no lo entiendes, búscalo en el [traductor de errores](/guia/14-errores)).
3. Cuando no quede nada en rojo, pulsa **Run** (arriba a la izquierda) y mira la pestaña **Logs** de la derecha.

## La comprobación automática

Al final de cada código hay unas líneas que no hay que tocar. Comprueban tu solución y escriben el resultado:

```text
OK    la media de [5, 7, 9] es 7
FALLA la media de una lista vacía es 0
```

El ejercicio está resuelto cuando se cumplen **las dos condiciones**:

- No queda **ningún error de tipos** (nada en rojo).
- Todas las líneas dicen **OK**.

Si algo dice **FALLA**, el texto de la línea explica qué se esperaba. Corrige y vuelve a pulsar **Run**.

::: tip Antes de mirar la solución
Cada ejercicio tiene una **pista** y una **solución** desplegables. Intenta resolverlo primero solo; si te atascas, abre la pista. La solución, cuando ya lo tengas o cuando lleves un rato largo bloqueado: compararla con la tuya también enseña.
:::

::: info Ejercicios sin Playground
Los del DOM y React se comprueban en el Playground solo por tipos (que compilen), porque necesitan una página real para ejecutarse. Para verlos funcionar, cópialos a tu proyecto de Vite.
:::

## Por temas

| Tema | Ejercicios |
|---|---|
| 1. Fundamentos | [Anotar, unknown, never](./01-fundamentos) |
| 2. Uniones y narrowing | [Literales, typeof, uniones discriminadas](./02-uniones-narrowing) |
| 3. Objetos | [interface, Record, as const](./03-objetos) |
| 4. Arrays | [map, filter, reduce, sin mutar](./04-arrays) |
| 5. Funciones | [Parámetros, callbacks, closures](./05-funciones) |
| 6. null y undefined | [find, ??, validar unknown](./06-null-undefined) |
| 7. Módulos | [Capas e import type](./07-modulos) |
| 8. Genéricos | [Funciones genéricas, restricciones, Result](./08-genericos) |
| 9. Utility types | [Omit, Partial, keyof](./09-utility-types) |
| 10. Clases | [Campos privados, errores propios, implements](./10-clases) |
| 11. Asincronía | [async/await, errores, Promise.all](./11-asincronia) |
| 12. DOM tipado | [Elementos, eventos, formularios](./12-dom) |
| 13. Clean code | [Refactorizar código con malos hábitos](./13-clean-code) |
| 15. Puente a React | [Props y estado](./15-react) |
