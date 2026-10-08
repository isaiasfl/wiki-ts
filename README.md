# Wiki TS

Referencia de TypeScript del módulo **Desarrollo Web en Entorno Cliente** (2.º DAW): de los fundamentos del lenguaje a una aplicación React. Es material de **consulta**, pensado también para usarse durante las pruebas.

- 15 temas, glosario y traductor de errores del compilador.
- Cada tema con nivel **esencial** (lo del curso) y **ampliación**.
- Todos los ejemplos se **compilan al generar la web** con Twoslash: si un ejemplo tuviera un error de tipos no anunciado, la web no se generaría. Al pasar el ratón por el código se ve el tipo que deduce TypeScript.
- Buscador local que funciona sin conexión.

Hecha con [VitePress](https://vitepress.dev). Autor: Isaías Fernández Lozano.

## Uso en local

```sh
npm install
npm run dev       # http://localhost:5173, se recarga al guardar
npm run build     # genera docs/.vitepress/dist
npm run preview   # sirve la versión generada
```

## Escribir o modificar un tema

Los temas están en `docs/guia/`, un fichero Markdown por tema. Bloques disponibles:

```md
::: esencial
::: ampliacion
::: haz
::: evita
::: error
::: info Nota · ::: tip Consejo · ::: warning Atención
```

Para poner **Haz** y **Evita** lado a lado, envuélvelos en `<div class="wk-pair">`. Dentro de otro bloque, el bloque exterior se abre con cuatro puntos (`:::: esencial`).

Los ejemplos que se comprueban llevan `twoslash`:

````md
```ts twoslash
// @errors: 2322
const pages: number = '412';
const title = 'Dune';
//    ^?
```
````

- `// @errors: 2322` anuncia un error esperado: se muestra con el mensaje real.
- `//    ^?` debajo de un nombre pide su tipo. Para no tapar el código, conviértelo después en un comentario fijo con `node scripts/quitar-consultas.mjs docs/guia/tema.md`.
- `// ---cut---` oculta lo que hay por encima (declaraciones auxiliares).

### Ejercicios

Están en `docs/ejercicios/`, una página por tema. Cada ejercicio tiene:

- Un bloque de partida ```` ```ts twoslash playground ````: se compila al generar la web y lleva un enlace que lo abre en el TypeScript Playground. Las líneas `// @...` no se copian al Playground.
- Una pista y una solución en `::: details`. La solución es un bloque ```` ```ts twoslash run ```` con el programa completo y sus comprobaciones (`check(...)`).

`node scripts/soluciones.mjs` ejecuta todas las soluciones con Node y falla si alguna comprobación no dice OK.

### Versión de examen

`WIKI_EXAM=1 npm run build` (o `WIKI_EXAM=1 docker compose up -d --build`) genera la wiki sin ejercicios, sin soluciones y sin enlaces al Playground.

Herramientas de revisión:

```sh
node scripts/consultas.mjs docs/guia/04-arrays.md   # tipos y errores de cada ejemplo
npm run build && node scripts/enlaces.mjs           # enlaces y anclas internas
```

## Publicación

### GitHub Pages

El flujo `.github/workflows/deploy.yml` publica la web en cada `push` a `main`. En el repositorio: *Settings → Pages → Source: GitHub Actions*. La dirección será `https://<usuario>.github.io/wiki-ts/`.

### Contenedor para el aula

```sh
docker build -t wiki-ts .
docker run -d --name wiki-ts -p 8080:80 --restart unless-stopped wiki-ts
```

La web queda en `http://<ip-del-servidor>:8080`. Para un examen, basta con permitir el acceso a esa dirección y bloquear el resto.
