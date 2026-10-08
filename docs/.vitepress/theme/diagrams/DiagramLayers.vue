<template>
  <figure class="wk-fig">
    <div class="wk-fig-scroll">
      <svg viewBox="0 0 720 360" role="img" aria-labelledby="dl-t">
        <title id="dl-t">Capas de un proyecto y sentido de las importaciones</title>
        <defs>
          <marker id="dl-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" class="ah" />
          </marker>
        </defs>

        <rect x="260" y="10" width="200" height="50" rx="10" class="box" />
        <text x="360" y="32" text-anchor="middle" class="mono b">main.ts</text>
        <text x="360" y="50" text-anchor="middle" class="t2">conecta las piezas</text>

        <rect x="30" y="104" width="250" height="60" rx="10" class="box" />
        <text x="155" y="129" text-anchor="middle" class="mono b">ui/</text>
        <text x="155" y="150" text-anchor="middle" class="t2">pinta y escucha eventos (DOM)</text>

        <rect x="440" y="104" width="250" height="60" rx="10" class="box" />
        <text x="565" y="129" text-anchor="middle" class="mono b">services/</text>
        <text x="565" y="150" text-anchor="middle" class="t2">habla con fuera: API, localStorage</text>

        <rect x="235" y="204" width="250" height="64" rx="10" class="box-soft" />
        <text x="360" y="229" text-anchor="middle" class="mono b">domain/</text>
        <text x="360" y="250" text-anchor="middle" class="t2">reglas y cálculos puros</text>

        <rect x="30" y="300" width="660" height="44" rx="10" class="box-dash" />
        <text x="360" y="327" text-anchor="middle"><tspan class="mono b">types/</tspan><tspan class="t2" dx="10">interfaces compartidas: cualquier capa puede importarlas</tspan></text>

        <path d="M320 60 L190 102" class="line" marker-end="url(#dl-a)" />
        <path d="M400 60 L530 102" class="line" marker-end="url(#dl-a)" />
        <path d="M175 164 L285 202" class="line" marker-end="url(#dl-a)" />
        <path d="M545 164 L435 202" class="line" marker-end="url(#dl-a)" />
        <path d="M360 268 V296" class="line" marker-end="url(#dl-a)" />
      </svg>
    </div>
    <figcaption>
      <strong>Cada flecha significa «importa de».</strong> Todas apuntan hacia abajo, hacia <code>domain/</code>: la
      lógica del programa no importa nada de la interfaz ni de los servicios, así que se puede probar sin navegador y sin
      red.
    </figcaption>
  </figure>
</template>
