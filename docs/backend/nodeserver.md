## Node.js 服务端

### 1、nestjs 是什么
NestJS 是一个基于 Node.js 的后端框架，专门用来写 HTTP 接口服务。

### 2、环境准备
#### 2.1 检查 Node.js 版本
```bash
node -v
# 需要 >= 20.x，推荐 v22.21.1

npm -v
# 需要 >= 9.x
```
#### 2.2 安装 NestJS
```bash
# 安装 NestJS CLI 工具
npm install -g @nestjs/cli

nest --version
# 输出版本号说明安装成功，例如：10.x.x
```
#### 2.3 创建项目
```bash
# 创建项目
nest new my-project

# 进入项目目录
cd my-project

# 启动项目
npm run start
```
输出类似以下内容：
```bash
NestJS is running on: http://localhost:3000
```
说明项目创建成功，项目启动成功。