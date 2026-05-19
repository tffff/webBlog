import { defineConfig } from 'dumi';
import nav from './config/nav'
import sidebar from './config/sidebar'

export default defineConfig({
  themeConfig: {
    name: '个人博客',
    nav,
    sidebar,
  },
});
