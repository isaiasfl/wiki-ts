import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import TopicGrid from './TopicGrid.vue';
import HeroCode from './HeroCode.vue';
import DiagramNarrowing from './diagrams/DiagramNarrowing.vue';
import DiagramPromise from './diagrams/DiagramPromise.vue';
import DiagramEventLoop from './diagrams/DiagramEventLoop.vue';
import DiagramLayers from './diagrams/DiagramLayers.vue';
import DiagramUseEffect from './diagrams/DiagramUseEffect.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'home-hero-image': () => h(HeroCode) }),
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue);
    app.component('TopicGrid', TopicGrid);
    app.component('DiagramNarrowing', DiagramNarrowing);
    app.component('DiagramPromise', DiagramPromise);
    app.component('DiagramEventLoop', DiagramEventLoop);
    app.component('DiagramLayers', DiagramLayers);
    app.component('DiagramUseEffect', DiagramUseEffect);
  },
} satisfies Theme;
