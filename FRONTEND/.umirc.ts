import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  antd: {
    dark: false, // 开启暗色主题
    compact: true, // 开启紧凑主题
  },
  title:'site.title',
  routes: [
    { path: '/', component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/index' },
        { path: '/forum/:name', component: '@/components/Forum'},
        { path: '/thread/:id', component: '@/components/Thread'}
      ]},
  ],
});
