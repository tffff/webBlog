const sidebar = {
  // '/myblog':[{
  //   title:'开发基础',
  //   children:[
  //     {title:'插件',link:'/myblog/devneeds/plugins'},
  //   ]
  // }]
  '/myblog': [
    {
      title: '开发基础',
      children: [
        {title:'插件',link:'/myblog/devneeds/plugins'},
        {title:'nginx',link:'/myblog/devneeds/nginx'},
        {title:'svn',link:'/myblog/devneeds/svn'},
        {title:'mac安装',link:'/myblog/devneeds/macinstall'},
        {title:'ios',link:'/myblog/devneeds/ios'},
        {title:'ios安装',link:'/myblog/devneeds/iosinstall'},
        {title:'jsutils',link:'/myblog/devneeds/jsutils'},
        {title:'vscode',link:'/myblog/devneeds/vscode'},
        {title:'gitlab',link:'/myblog/devneeds/gitlab'},
        {title:'docker',link:'/myblog/devneeds/docker'},
        {title:'reactnative',link:'/myblog/devneeds/reactnative'},
      ],
    },
    {
      title: 'CSS',
      children: [
        {title:'css',link:'/myblog/css/css'},
        {title:'csslayout',link:'/myblog/css/csslayout'},
        {title:'cssgraph',link:'/myblog/css/cssgraph'},
        {title:'csslayered',link:'/myblog/css/csslayered'},
        {title:'cssworkflow',link:'/myblog/css/cssworkflow'},
        {title:'csshoudini',link:'/myblog/css/csshoudini'},
        {title:'cssmatrix',link:'/myblog/css/cssmatrix'},
        {title:'clippath',link:'/myblog/css/clippath'},
      ],
    },
    {
      title: 'JS',
      children: [
        {title:'00',link:'/myblog/js/00'},
        {title:'01',link:'/myblog/js/01'},
        {title:'02',link:'/myblog/js/02'},
        {title:'03',link:'/myblog/js/03'},
        {title:'04',link:'/myblog/js/04'},
        {title:'05',link:'/myblog/js/05'},
        {title:'06',link:'/myblog/js/06'},
        {title:'07',link:'/myblog/js/07'},
      ],
    },
    {
      title: '前端框架类',
      children: [
        {title:'react',link:'/myblog/frame/react'},
        {title:'react_redux',link:'/myblog/frame/react_redux'},
        {title:'react1',link:'/myblog/frame/react1'},
        {title:'reacthook',link:'/myblog/frame/reacthook'},
        {title:'reacthook_ym',link:'/myblog/frame/reacthook_ym'},
        {title:'react_ssr',link:'/myblog/frame/react_ssr'},
        {title:'vue_00',link:'/myblog/frame/vue_00'},
        {title:'vue_01',link:'/myblog/frame/vue_01'},
        {title:'vue_02',link:'/myblog/frame/vue_02'},
        {title:'applet_01',link:'/myblog/frame/applet_01'},
        {title:'ts_00',link:'/myblog/frame/ts_00'},
      ],
    },
    {
      title: '前端工程化',
      children: [
        {title:'01_webpack',link:'/myblog/engineering/01_webpack'},
        {title:'02_webpack',link:'/myblog/engineering/02_webpack'},
        {title:'parcel',link:'/myblog/engineering/parcel'},
        {title:'rollup',link:'/myblog/engineering/rollup'},
        {title:'03_continuous',link:'/myblog/engineering/03_continuous'},
        {title:'04_jenkins',link:'/myblog/engineering/04_jenkins'},
        {title:'05_sonar',link:'/myblog/engineering/05_sonar'},
        {title:'06_writecli',link:'/myblog/engineering/06_writecli'},
      ],
    },
    {
      title: '性能优化',
      children: [
        {title:'performance',link:'/myblog/performance/performance'},
        {title:'fp',link:'/myblog/performance/fp'},
        {title:'chromebrower',link:'/myblog/performance/chromebrower'},
        {title:'nodeperformance',link:'/myblog/performance/nodeperformance'},
      ],
    },
    {
      title: '服务器知识',
      children: [
        {title:'linux',link:'/myblog/server/linux'},
        {title:'http',link:'/myblog/server/http'},
        {title:'node',link:'/myblog/server/node'},
      ],
    },
    {
      title: '其他',
      children: [
        {title:'test',link:'/myblog/other/test'},
        {title:'webgl',link:'/myblog/other/webgl'},
        {title:'threejs',link:'/myblog/other/threejs'},
      ],
    },
  ],
  '/algorithm': [
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
