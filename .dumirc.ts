import { defineConfig } from 'dumi';
import nav from './config/nav'
import sidebar from './config/sidebar'

export default defineConfig({
  themeConfig: {
    name: 'webBlog',
    nav,
    sidebar,
  },
});
