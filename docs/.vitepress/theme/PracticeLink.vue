<script setup lang="ts">
// Enlace a los ejercicios de un tema. En la versión de examen no se muestra.
import { withBase } from 'vitepress';

const props = defineProps<{ topic: string }>();
const exam = __WIKI_EXAM__;
</script>

<template>
  <div v-if="!exam" class="wk-practice">
    <span class="wk-practice-icon" aria-hidden="true" />
    <div>
      <p class="wk-practice-title">Practica este tema</p>
      <p class="wk-practice-text">
        Ejercicios de menos a más, con pista, solución y comprobación automática en el Playground.
        <a :href="withBase(`/ejercicios/${props.topic}`)">Ir a los ejercicios</a>
      </p>
    </div>
  </div>
</template>
