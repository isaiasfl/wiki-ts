<template>
  <figure class="wk-fig">
    <div class="wk-fig-scroll">
      <svg viewBox="0 0 720 300" role="img" aria-labelledby="dn-t">
        <title id="dn-t">Narrowing: el tipo se estrecha en cada rama del if</title>
        <defs>
          <marker id="dn-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" class="ah" />
          </marker>
        </defs>

        <rect x="220" y="8" width="280" height="62" rx="10" class="box" />
        <text x="360" y="32" text-anchor="middle" class="t2">antes del if: puede ser cualquiera de los dos</text>
        <text x="360" y="56" text-anchor="middle" class="mono b">id: string | number</text>

        <path d="M360 70 V98" class="line" marker-end="url(#dn-a)" />

        <rect x="200" y="102" width="320" height="46" rx="23" class="box-soft" />
        <text x="360" y="130" text-anchor="middle" class="mono">if (typeof id === 'string')</text>

        <path d="M290 148 L190 198" class="line" marker-end="url(#dn-a)" />
        <path d="M430 148 L530 198" class="line" marker-end="url(#dn-a)" />
        <text x="222" y="170" class="b ok">sí</text>
        <text x="486" y="170" class="b">no</text>

        <rect x="30" y="202" width="300" height="84" rx="10" class="box-ok" />
        <text x="180" y="226" text-anchor="middle" class="t2">dentro del if</text>
        <text x="180" y="250" text-anchor="middle" class="mono b">id: string</text>
        <text x="180" y="273" text-anchor="middle" class="t2">ya puedes usar id.toUpperCase()</text>

        <rect x="390" y="202" width="300" height="84" rx="10" class="box-blue" />
        <text x="540" y="226" text-anchor="middle" class="t2">después del if: solo queda la otra opción</text>
        <text x="540" y="250" text-anchor="middle" class="mono b">id: number</text>
        <text x="540" y="273" text-anchor="middle" class="t2">ya puedes usar id.toFixed(0)</text>
      </svg>
    </div>
    <figcaption>
      <strong>El narrowing en un dibujo.</strong> La pregunta del <code>if</code> parte la unión en dos caminos, y en cada
      camino TypeScript sabe exactamente qué tipo tienes.
    </figcaption>
  </figure>
</template>
