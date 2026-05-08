---
title: Three.js
date: 2022-01-23 15:32:20
---

## three.js 简介

webGL 是基于 OpenGL ES 2.0 的 web 标准，可以通过 html5 canvas 元素作为 DOM 接口访问

webGL 灵活且复杂

Three.js 是一个 3D JavaScript 库，Three.js 可以简化 webGL 开发

Three.js 封装了底层的图形接口，能够在无需掌握繁冗的图形学知识的情况下，也能用简单的代码实现三维场景的渲染

**用途**

- 创建三维图形
- 在三维场景中生成动画
- 在物体上应用纹理和材质
- 从三维建模软件中加载图形
- 创建基于样条曲线的二维图形

**插件**

- Flash 适合 pc 的 2D 动画，移动端兼容性不好

- O3D 浏览器兼容性高，不支持移动平台
- Unity3D(以上需要安装插件) 专业游戏引擎，支持 app
- GlGE(以下是原生 web 引擎) 扩展性不好，开发维护高
- X3DOM 比较容易上手，扩展性不好
- PhiloGL 数据可视化分析
- CopperLicht 完善的游戏引擎

**优点**

- 基于 webGL/OpenGL ES 2.0
- 使用熟悉的 html/javascript 代码
- 对底层 webGL 的高级封装
- 保留底层开发的特性
- 结构严谨而灵活，易于扩展

## 创建 Three.js 基础代码

- Three.min.js 版本通常在互联网上部署的时候使用
- Three.js 版本用于调试和远吗学习

## 绘制三维对象

- `Plane`（平面）二维矩形，渲染结果是在屏幕中央有一个灰色矩形
- `Cube`（方块）三维立方体
- `Sphere`（球体）三维球体
- `Camera`（相机）决定视点的位置，和最终的观察结果
- `Axes`（轴）辅助测试工具

## 添加材质和灯光、阴影

- 只有 `MeshLambertMaterial`和`MeshPhongMaterial`两张材质材质会光源产生反应

## 动画效果

- 引入`requestAnimationFrame`方法可以显示动画效果

demo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>threejs</title>
    <script src="./three.js"></script>
    <script src="./stats.min.js"></script>
  </head>
  <body>
    <div id="Stats-output"></div>
    <script>
      //增加统计功能
      var stats = initStats();
      //设一个场景
      var scene = new THREE.Scene();
      //设置透视相机
      var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);
      //设置绘制对象
      var renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(new THREE.Color(0xeeeeee));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;

      //设置辅助测试工具
      var axes = new THREE.AxesHelper(20);
      scene.add(axes);

      //设置平面
      var planeGeometry = new THREE.PlaneGeometry(70, 50, 1, 1);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 15;
      plane.position.y = 0;
      plane.position.z = 0;
      plane.receiveShadow = true; //打开阴影
      scene.add(plane);

      //设置立方体
      var cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff000 });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = -4;
      cube.position.y = 3;
      cube.position.z = 0;
      cube.castShadow = true; //打开阴影
      scene.add(cube);

      //设置球面体
      var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.x = 20;
      sphere.position.y = 3;
      sphere.position.z = -2;
      sphere.castShadow = true; //打开阴影
      scene.add(sphere);

      //设置光源
      var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      scene.add(spotLight);

      //实现动画
      var step = 0;
      function render() {
        stats.update();
        //转动方块
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;
        //球体跳跃
        step += 0.04;
        sphere.position.x = 20 + 10 * Math.cos(step);
        sphere.position.y = 20 + 10 * Math.abs(Math.sin(step));
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      //初始化统计对象
      function initStats() {
        var stats = new Stats();
        stats.setMode(0); //0 FPS 1 渲染时间
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById('Stats-output').appendChild(stats.domElement);
        return stats;
      }

      //将renderer的输出挂载到body
      document.body.appendChild(renderer.domElement);
      // renderer.render(scene,camera)
      render();
    </script>
  </body>
</html>
```

## Three.js 必备组件

- **相机**：决定哪些东西将被显示在屏幕上
- **光源**：生成阴影与改变物体表面显示效果
- **物体**：相机透视图里主要的渲染对象

### 属性

- `fog`通过该属性可以设置场景的**雾化**效果
- `overrideMaterial` 通过这个属性可以让场景中的所有物体都使用相同材质,看起来比较统一
- `scene.add()`在场景中添加物体
- `scene.remove()` 从场景中移除物体
- `scene.children()`获取场景中所有子对象的列表
- `scene.getChildByName()`获取场景中所有对象的列表

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>threejs基本组件</title>
    <style type="text/css">
      body {
        margin: 0;
        overflow: hidden;
      }
    </style>
    <script src="./three.js"></script>
  </head>
  <body>
    <script>
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.x = -50;
      camera.position.y = 60;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      //雾化效果
      scene.fog = new THREE.Fog(0xffffff, 0.005, 100);

      //使用材质覆盖属性
      scene.overrideMaterial = new THREE.MeshLambertMaterial({
        color: 0xff5500,
      });

      var renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(new THREE.Color(0xeeeeee, 1));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      //平面
      var planeGeometry = new THREE.PlaneGeometry(70, 50, 1, 1);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      scene.add(plane);
      //光源
      var ambientLight = new THREE.AmbientLight(0x0c0c0c);
      scene.add(ambientLight);

      var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.cashShadow = true;
      scene.add(spotLight);

      //添加方块
      function addCube() {
        var cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff000 });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x =
          -30 + Math.round(Math.random() * planeGeometry.parameters.width);
        cube.position.y = Math.round(Math.random() * 5);
        cube.position.z =
          -20 + Math.round(Math.random() * planeGeometry.parameters.height);
        cube.castShadow = true; //打开阴影
        scene.add(cube);
      }
      function render() {
        addCube();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
      document.body.appendChild(renderer.domElement);
    </script>
  </body>
</html>
```

## 几何和网格对象

### 几何对象的属性和函数

- `THREE.Geometry` 是所有几何对象的基类(简称 geom)
- `geom.vertices` 表示几何体的顶点，是一个数组
- `geom.faces` 表示几何体的侧面

### 网格对象的属性和函数

- `position` 决定该对象相对于父对象的位置
- `rotation` 设置对象绕任何一个轴的旋转弧度
- `scale` 沿 x,y,z 轴缩放对象
- `translateX` x 轴平移
- `translateY` y 轴平移
- `translateZ` z 轴平移

### 照相机

- `OrthographicCamera` - 正交投影照相机
  - `left` 左边界
  - `right` 右边界
  - `top` 上边界
  - `bottom` 下边界
  - `near` 近裁面
  - `far` 远裁面
  - `camera.lookAt` 设置目标点
- `PerspectiveCamera` - 透视投影照相机
  - `fov` 视野宽度
  - `apsect` 长宽比，推荐使用`window.innerWidth/window.innerHeight`
  - `near` 近裁面，推荐值`1000`，值太大会影响性能，值太小场景显示不全

### 光源

- `AmbientLight` 环境光
  基础光源，影响整个场景的光源，环境光没有明确的光源的位置，在各处形成的亮度也是一致的，不会有阴影的产生，不能将环境光作为场景中唯一的光源

  - THREE.AmbientLight(hex)
  - add(color) 添加到当前颜色上
  - clone() 复制当前颜色

- `PonitLight` 点光源
  空间的一个点，朝所有方向发射光源，点光源是单点发光方式，点光源不会产生阴影，减少 GPU 的负担

  - `THREE.PointLight(hex,intensity,distance)`
  - `clone()` 复制当前颜色，color 光源颜色
  - `intensity` 光照强度
  - `distance` 光源照射的距离
  - `position` 光源所在的位置

- `SpotLight` 聚光灯
  具有锥形效果的聚光光源，能够朝着一个方向投射光线，最常用到的光源，可以产生阴影，锥形效果，类似电筒光照效果

  - `THREE.SpotLight(hex,intensity,distance,angle,exponent)`
  - `castShadow` 如果设置为`true`，这个光源就会产生阴影
  - `target` 决定光照的方向
  - `angle` 光照的角度，默认值`Math.PI/3`

- `DirectionalLight` 平行光
  无线光，模拟远处太阳的光源

  - THREE.DirectionalLight(hex,intensity)，它和平行光源的属性一样，常用的属性 castShadow,target 和 angle
  - 不常用的属性有 `shadowCameraVisible`、`shadowDarkness`、`shadowMapWidth`和`shadowMapHeight`等，这些属性很少被用到

- 高级光照效果一般球光、平行光、镜头炫光
