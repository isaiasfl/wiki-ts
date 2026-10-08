<template>
  <figure class="wk-fig">
    <div class="wk-fig-scroll">
      <svg viewBox="0 0 720 240" role="img" aria-labelledby="dp-t">
        <title id="dp-t">Los tres estados de una promesa</title>
        <defs>
          <marker id="dp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" class="ah" />
          </marker>
        </defs>

        <rect x="20" y="82" width="210" height="76" rx="10" class="box-soft" />
        <text x="125" y="108" text-anchor="middle" class="mono b">Promise&lt;Weather&gt;</text>
        <text x="125" y="130" text-anchor="middle" class="b">pendiente</text>
        <text x="125" y="148" text-anchor="middle" class="t2">el ticket: aún no hay dato</text>

        <path d="M230 106 C 290 106, 300 54, 380 54" class="line" marker-end="url(#dp-a)" />
        <path d="M230 134 C 290 134, 300 186, 380 186" class="line" marker-end="url(#dp-a)" />
        <text x="250" y="44" class="t2">llega la respuesta</text>
        <text x="250" y="214" class="t2">falla la petición</text>

        <rect x="384" y="16" width="316" height="76" rx="10" class="box-ok" />
        <text x="404" y="42" class="b ok">resuelta (fulfilled)</text>
        <text x="404" y="62" class="t2">la promesa entrega el dato:</text>
        <text x="404" y="81" class="mono">const w = await fetchWeather()</text>

        <rect x="384" y="148" width="316" height="76" rx="10" class="box-bad" />
        <text x="404" y="174" class="b bad">rechazada (rejected)</text>
        <text x="404" y="194" class="t2">await lanza el error, que se recoge en</text>
        <text x="404" y="213" class="mono">catch (error) { ... }</text>
      </svg>
    </div>
    <figcaption>
      <strong>Una promesa siempre acaba de una de dos formas.</strong> Mientras está pendiente, el programa sigue con otras
      cosas. <code>await</code> espera al final: si se resuelve, da el dato; si se rechaza, lanza el error.
    </figcaption>
  </figure>
</template>
