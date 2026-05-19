const sidebar = {
  '/myblog': [
    {
      title: '关于博客',
      children: [
        { title: '博客简介', link: '/myblog' },
      ],
    },
    {
      title: '开发工具',
      children: [
        {title:'命令行操作合集',link:'/myblog/commandline'},
        {title:'前端插件',link:'/myblog/plugins'},
        {title:'ios安装',link:'/myblog/devneeds/iosinstall'},
        {title:'animate',link:'/myblog/devneeds/animate'},
        {title:'jsutils',link:'/myblog/devneeds/jsutils'},
        {title:'vscode',link:'/myblog/vscode'},
        {title:'gitlab',link:'/myblog/gitlab'},
        {title:'docker',link:'/myblog/docker'},
        {title:'reactnative坑',link:'/myblog/reactnative'},
      ],
    },
    {
      title: 'CSS',
      children: [
        {title:'CSS OO 的概念',link:'/myblog/css'},
        {title:'PC端布局',link:'/myblog/css_layout'},
        {title:'CSS绘制不规则图形',link:'/myblog/css_graph'},
        {title:'CSS分层',link:'/myblog/css_layered'},
        {title:'CSS工作流优化',link:'/myblog/css_workflow'},
        {title:'CSS魔术师Houdini',link:'/myblog/css_houdini'},
        {title:'CSS矩阵变换',link:'/myblog/css_matrix'},
        {title:'CSS裁剪路径',link:'/myblog/css_clippath'},
      ],
    },
    {
      title: 'JS',
      children: [
        {title:'JS基础',link:'/myblog/00_js'},
        {title:'JS装箱和拆箱',link:'/myblog/01_js'},
        {title:'JS闭包',link:'/myblog/02_js'},
        {title:'JS原型、原型链与继承',link:'/myblog/03_js'},
        {title:'JS EventLoop事件机制',link:'/myblog/04_js'},
        {title:'JS类型比较',link:'/myblog/05_js'},
        {title:'JS关于this',link:'/myblog/06_js'},
        {title:'JS函数柯里化',link:'/myblog/07_js'},
        // {title:'08',link:'/myblog/08_js'},
        // {title:'09',link:'/myblog/09_js'},
      ],
    },
    {
      title: '前端框架类',
      children: [
        {title:'React 探索',link:'/myblog/react'},
        {title:'Redux 初探',link:'/myblog/react_redux'},
        {title:'React 源码解析',link:'/myblog/react1'},
        {title:'React Hooks 探索',link:'/myblog/reacthook'},
        {title:'React Hooks源码解析',link:'/myblog/reacthook_ym'},
        {title:'从0到1使用react构建SSR',link:'/myblog/react_ssr'},
        {title:'vue2 知识点',link:'/myblog/vue_00'},
        {title:'vue2源码解析',link:'/myblog/vue_01'},
        {title:'vue3+ts+vite 组合式 api 知识点',link:'/myblog/vue_02'},
        {title:'vue nuxt使用',link:'/myblog/vue_nuxt'},
        {title:'小程序源码解析',link:'/myblog/applet_01'},
        {title:'TS初探',link:'/myblog/ts_00'},
      ],
    },
    {
      title: '前端工程化',
      children: [
        {title:'webpack 基本使用',link:'/myblog/01_webpack'},
        {title:'webpack 性能优化与与原理分析',link:'/myblog/02_webpack'},
        {title:'parcel 基本使用',link:'/myblog/parcel'},
        {title:'rollup 基本使用',link:'/myblog/rollup'},
        {title:'项目持续集成',link:'/myblog/03_continuous'},
        {title:'jenkins 配置',link:'/myblog/04_jenkins'},
        {title:'sonar 配置',link:'/myblog/05_sonar'},
        {title:'手写CLI',link:'/myblog/06_writecli'},
      ],
    },
    {
      title: '性能优化',
      children: [
        {title:'网页性能优化相关',link:'/myblog/performance'},
        {title:'首屏性能相关名词',link:'/myblog/fp'},
        {title:'现代浏览器渲染',link:'/myblog/chromebrower'},
        {title:'NodeJS性能优化',link:'/myblog/nodeperformance'},
      ],
    },
    {
      title: '服务器知识',
      children: [
        {title:'linux',link:'/myblog/linux'},
        {title:'http',link:'/myblog/http'},
        {title:'node',link:'/myblog/node'},
      ],
    },
    {
      title: '其他',
      children: [
        {title:'测试相关',link:'/myblog/test'},
        {title:'WebGL',link:'/myblog/webgl'},
        {title:'Threejs',link:'/myblog/threejs'},
      ],
    },
  ],
  '/algorithm': [
    {
      title: '关于算法',
      children: [
        { title: '数据结构与算法', link: '/algorithm' },
      ],
    },
    {
      title: '算法',
      children: [
        {title:'数据结构',link:'/algorithm/datasources'},
        {title:'排序算法',link:'/algorithm/sort'},
        {title:'算法题',link:'/algorithm/sft'},
      ],
    },
  ],
  '/interview': [
    {
      title: '关于面试',
      children: [
        { title: '面试题汇总', link: '/interview' },
      ],
    },
    {
      title: '基础',
      children: [
        {title:'html',link:'/interview/html'},
        {title:'css',link:'/interview/css'},
        {title:'javascript',link:'/interview/jsbasics'},
      ],
    },
    {
      title: '框架',
      children: [
        {title:'vue',link:'/interview/vue'},
        {title:'react',link:'/interview/react'},
      ],
    },
    {
      title: '其他',
      children: [
        {title:'安全',link:'/interview/safe'},
        {title:'http',link:'/interview/http'},
        {title:'性能',link:'/interview/performance'},
      ],
    },
  ],
};

export default sidebar;
