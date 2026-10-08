<template>
  <figure class="wk-fig">
    <div class="wk-fig-scroll">
      <svg viewBox="0 0 720 280" role="img" aria-labelledby="du-t">
        <title id="du-t">Ciclo de useEffect con limpieza</title>
        <defs>
          <marker id="du-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" class="ah" />
          </marker>
        </defs>

        <!-- Fila superior -->
        <rect x="20" y="20" width="200" height="74" rx="10" class="box" />
        <text x="120" y="46" text-anchor="middle" class="b">1. Render</text>
        <text x="120" y="66" text-anchor="middle" class="t2">React ejecuta el componente</text>
        <text x="120" y="83" text-anchor="middle" class="t2">con el city actual</text>

        <rect x="260" y="20" width="200" height="74" rx="10" class="box" />
        <text x="360" y="46" text-anchor="middle" class="b">2. Pantalla</text>
        <text x="360" y="66" text-anchor="middle" class="t2">se pinta el resultado</text>
        <text x="360" y="83" text-anchor="middle" class="t2">(primero, «Cargando...»)</text>

        <rect x="500" y="20" width="200" height="74" rx="10" class="box-soft" />
        <text x="600" y="46" text-anchor="middle" class="b">3. Efecto</text>
        <text x="600" y="66" text-anchor="middle" class="t2">se ejecuta useEffect:</text>
        <text x="600" y="83" text-anchor="middle" class="mono">fetchWeather(city)</text>

        <path d="M220 57 H256" class="line" marker-end="url(#du-a)" />
        <path d="M460 57 H496" class="line" marker-end="url(#du-a)" />

        <!-- Fila inferior -->
        <rect x="500" y="156" width="200" height="66" rx="10" class="box-dash" />
        <text x="600" y="184" text-anchor="middle" class="b">cambia city</text>
        <text x="600" y="204" text-anchor="middle" class="t2">está en [city]</text>

        <rect x="260" y="156" width="200" height="66" rx="10" class="box-ok" />
        <text x="360" y="184" text-anchor="middle" class="b ok">4. Limpieza</text>
        <text x="360" y="205" text-anchor="middle" class="mono">controller.abort()</text>

        <path d="M600 94 V152" class="line" marker-end="url(#du-a)" />
        <path d="M500 189 H464" class="line" marker-end="url(#du-a)" />
        <path d="M260 189 H120 V98" class="line" marker-end="url(#du-a)" />
        <text x="130" y="140" class="t2">vuelta a empezar</text>
        <text x="130" y="157" class="t2">con el city nuevo</text>

        <text x="20" y="262" class="t2">Si el componente desaparece de la pantalla, React ejecuta solo la limpieza (paso 4) y no vuelve a empezar.</text>
      </svg>
    </div>
    <figcaption>
      <strong>La limpieza evita respuestas viejas.</strong> Si el usuario cambia de ciudad antes de que llegue la
      respuesta, la petición anterior se cancela; así nunca se pinta el tiempo de una ciudad que ya no está elegida.
    </figcaption>
  </figure>
</template>
