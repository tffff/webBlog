# js 工具类 Utils

## jquery 模块化

不要像以前那样写好多的点击事件，而是用一个模块包裹起来

```js
//单例模式 代理模式
var message ={
  init:function(arguments){
    var me=this;
    console.log('message init');
    this.render();
    this.bind();
  }
  render:function(){
    var me=this;
    me.btn=$('#btn');
  }
  bind:function(){
    var me=this;
    me.btn.on('click',$.proxy(me._go,this));
  }
  _go:function(e){
    consle.log(e.tartget)
  }
}

module.exports=message;
```

## js 常用正则表达式汇总

```js
// 匹配 16 进制颜色
var reges = /#([0-9a-fA-f]{6}|[0-9a-fA-f]{3})/g;

//匹配 qq 号
var reges = /^[1-9][0-9]{4,10}$/g;

//手机号码
var reges = /^1[3-9]\d{9}/g;

//用户名
var reges = /^[a-zA-Z\$][a-zA-Z0-9_\$]{4,16}/g;

//获取 URL 中 ？后的携带参数
let params = {};
location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (params[k] = v));
console.log(params);
```

## 数字格式化成金额

```js
/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (Number(num) || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}
```

## 下载文件

```js
const downloadFile = (api, params, fileName, type = 'get') => {
  axios({
    method: type,
    url: api,
    responseType: 'blob',
    params: params,
  })
    .then(res => {
      let str = res.headers['content-disposition'];
      if (!res || !str) {
        return;
      }
      let suffix = '';
      // 截取文件名和文件类型
      if (str.lastIndexOf('.')) {
        fileName
          ? ''
          : (fileName = decodeURI(
              str.substring(str.indexOf('=') + 1, str.lastIndexOf('.')),
            ));
        suffix = str.substring(str.lastIndexOf('.'), str.length);
      }
      //  如果支持微软的文件下载方式(ie10+浏览器)
      if (window.navigator.msSaveBlob) {
        try {
          const blobObject = new Blob([res.data]);
          window.navigator.msSaveBlob(blobObject, fileName + suffix);
        } catch (e) {
          console.log(e);
        }
      } else {
        //  其他浏览器
        let url = window.URL.createObjectURL(res.data);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName + suffix);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

//使用
downloadFile('/api/download', { id }, '文件名');
```

## 开启全屏

```js
export const launchFullscreen = element => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
};
```

## 关闭全屏

```js
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
```

## 解析 url 参数

```js
export const getSearchParams = () => {
  const searchPar = new URLSearchParams(window.location.search);
  const paramsObj = {};
  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value;
  }
  return paramsObj;
};
// 假设目前位于 https://****com/index?id=154513&age=18;
getSearchParams(); // {id: "154513", age: "18"}
```

## 判断手机是 android 还是 ios

```js
/**
 * 1: ios
 * 2: android
 * 3: 其它
 */
export const getOSType = () => {
  let u = navigator.userAgent,
    app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isIOS) {
    return 1;
  }
  if (isAndroid) {
    return 2;
  }
  return 3;
};
```

## 滚动页面到顶部

```js
export const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop;
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, height - height / 8);
  }
};
```

## new Date()使用

```js
var date = new Date();
console.log('今天是 ', date.getMonth() + 1, date.getDate());
//0是不存在的一天，date.setDate(0)之后，这一天不存在，或者说设置的是1号的前一天。那么，1号的前一天，自然就是前一个月的最后一天
date.setDate(0);
console.log('上个月最后一天是 ', date.getMonth() + 1, date.getDate());
//我们要得到的是这个月最后一天
date.setMonth(date.getMonth() + 1);
date.setDate(0);
console.log('当前月份最后一天是 ', date.getMonth() + 1, date.getDate());
```
