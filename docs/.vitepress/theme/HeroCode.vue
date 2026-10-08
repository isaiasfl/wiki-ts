<script setup lang="ts">
// Ventana de editor decorativa para la portada: un fragmento de TypeScript con el
// recuadro de tipo que muestra el editor al pasar el ratón.
</script>

<template>
  <div class="hc" aria-hidden="true">
    <div class="hc-bar">
      <span class="hc-dot" /><span class="hc-dot" /><span class="hc-dot" />
      <span class="hc-file">products.ts</span>
    </div>
    <pre class="hc-code"><code><span class="k">interface</span> <span class="t">Product</span> {
  <span class="p">id</span>: <span class="t">number</span>;
  <span class="p">name</span>: <span class="t">string</span>;
  <span class="p">price</span>: <span class="t">number</span>;
}

<span class="k">const</span> <span class="v hc-hover">found</span> = products.<span class="f">find</span>((p) <span class="o">=></span> p.<span class="p">id</span> <span class="o">===</span> <span class="n">3</span>);
<span class="hc-tip"><span class="k">const</span> found: <span class="t">Product</span> | <span class="t">undefined</span></span>
<span class="k">const</span> <span class="v">name</span> = found?.<span class="p">name</span> <span class="o">??</span> <span class="s">'No existe'</span>;</code></pre>
  </div>
</template>

<style scoped>
.hc {
  width: 100%;
  max-width: 470px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 12px 40px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  text-align: left;
}
.hc-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.hc-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--vp-c-divider); }
.hc-file {
  margin-left: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.hc-code {
  margin: 0;
  padding: 18px 20px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--vp-c-text-1);
  white-space: pre;
  overflow-x: auto;
  font-variant-ligatures: none;
}
.k { color: #ab5959; }
.t { color: #2e8f82; }
.p { color: #b07d48; }
.v { color: #b07d48; }
.f { color: #59873a; }
.o { color: #999999; }
.s { color: #b56959; }
.n { color: #2f798a; }
.dark .k { color: #cb7676; }
.dark .t { color: #5da994; }
.dark .p, .dark .v { color: #bd976a; }
.dark .f { color: #80a665; }
.dark .s { color: #c98a7d; }
.hc-hover {
  border-bottom: 1px dotted var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}
.hc-tip {
  display: inline-block;
  margin: 2px 0 6px 6ch;
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
  font-size: 12.5px;
}
</style>
