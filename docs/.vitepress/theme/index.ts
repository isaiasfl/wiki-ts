import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import TopicGrid from './TopicGrid.vue';
import HeroCode from './HeroCode.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'home-hero-image': () => h(HeroCode) }),
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue);
    app.component('TopicGrid', TopicGrid);
  },
} satisfies Theme;
