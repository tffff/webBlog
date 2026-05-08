---
title: Node初探
date: 2022-01-11 20:20:31
---

## Linux 下安装 node

可以参考[菜鸟教程](https://www.runoob.com/nodejs/nodejs-install-setup.html)

```bash
# 首先下载node 使用wget命令
[root@localhost]# wget https://nodejs.org/dist/v12.18.1/node-v12.18.1-linux-x64.tar.xz

# 解压 进入node目录
[root@localhost]# tar xf node-v12.18.1-linux-x64.tar.xz
[root@localhost]# mv node-v12.18.1-linux-x64 /usr/local/

[root@localhost]# vi .bash_profile
#添加一行
export PATH=$PATH:/usr/local/node-v12.18.2/bin

[root@localhost]# source .bash_profile

#查看版本
[root@localhost]# node -v 或者 npm -v
```
