<template>
  <figure class="wk-fig">
    <div class="wk-fig-scroll">
      <svg viewBox="0 0 720 300" role="img" aria-labelledby="de-t">
        <title id="de-t">El bucle de eventos: pila, navegador y colas</title>
        <defs>
          <marker id="de-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" class="ah" />
          </marker>
        </defs>

        <!-- Pila -->
        <rect x="16" y="20" width="210" height="244" rx="10" class="box-soft" />
        <text x="121" y="46" text-anchor="middle" class="b">Pila de ejecución</text>
        <text x="121" y="64" text-anchor="middle" class="t2">el código, línea a línea</text>
        <rect x="34" y="84" width="174" height="30" rx="6" class="box" />
        <text x="121" y="104" text-anchor="middle" class="mono">console.log('A')</text>
        <text x="121" y="142" text-anchor="middle" class="t2">un solo hilo:</text>
        <text x="121" y="160" text-anchor="middle" class="t2">hace una cosa cada vez</text>

        <!-- Navegador -->
        <rect x="300" y="12" width="360" height="72" rx="10" class="box" />
        <text x="320" y="38" class="b">Navegador</text>
        <text x="320" y="58" class="t2">espera por su cuenta lo que tarda:</text>
        <text x="320" y="75" class="mono">setTimeout · fetch · clics</text>

        <!-- Microtareas -->
        <rect x="300" y="112" width="360" height="66" rx="10" class="box-blue" />
        <text x="320" y="136" class="b">Cola de microtareas</text>
        <text x="320" y="154" class="t2">promesas: then, await</text>
        <rect x="520" y="132" width="124" height="28" rx="6" class="chip" />
        <text x="582" y="151" text-anchor="middle" class="mono">log('C')</text>

        <!-- Tareas -->
        <rect x="300" y="200" width="360" height="66" rx="10" class="box" />
        <text x="320" y="224" class="b">Cola de tareas</text>
        <text x="320" y="242" class="t2">temporizadores, eventos</text>
        <rect x="520" y="220" width="124" height="28" rx="6" class="chip" />
        <text x="582" y="239" text-anchor="middle" class="mono">log('B')</text>

        <!-- Flechas -->
        <path d="M226 48 H296" class="line" marker-end="url(#de-a)" />
        <text x="232" y="40" class="t2">delega</text>
        <path d="M660 48 H690 V233 H664" class="line" marker-end="url(#de-a)" />
        <text x="696" y="140" class="t2" transform="rotate(90 696 140)" text-anchor="middle">cuando termina</text>
        <path d="M300 145 H230" class="line" marker-end="url(#de-a)" />
        <text x="250" y="137" class="b blue">1.º</text>
        <path d="M300 233 H230" class="line" marker-end="url(#de-a)" />
        <text x="250" y="225" class="b">2.º</text>
      </svg>
    </div>
    <figcaption>
      <strong>Por qué sale A, C, B.</strong> Primero se ejecuta todo el código normal (A). Cuando la pila queda libre, se
      vacían <strong>las microtareas</strong> (las promesas, C) y solo después se atiende <strong>una tarea</strong> (el
      temporizador, B), aunque fuera de 0 ms.
    </figcaption>
  </figure>
</template>
