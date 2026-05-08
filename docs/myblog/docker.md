# docker 的命令使用

```bash
# 查看docker容器镜像
[root@localhost] docker images

# 查看所以服务启动状态
[root@localhost] docker ps

# 导入镜像
[root@localhost] docker load -i [镜像名]

# 启动 停止 重启某个服务
[root@localhost] docker start/stop/restart  [容器id]

# docker-compose up 命令来启动并运行整个应用程序,必须有docker-compose.yml文件
# -d是后台运行
[root@localhost] docker-compose up -d

# 停止所有容器
[root@localhost] docker stop $(docker ps -a -q)

# 删除某个容器服务
[root@localhost] docker rm  1e560fca3906

# 删除所有容器服务
[root@localhost] docker rm $(docker ps -a -q)

# 删除所有容器镜像
[root@localhost] docker rmi $(docker images -q)

# 查看某个服务日志
# --tail :仅列出最新N条容器日志
# -f : 跟踪日志输出
[root@localhost] docker logs -f --tail=100 [容器id]

# 修改docker镜像的默认存储位置
# 1.先安装 vim /etc/docker/daemon.json,添加下面的代码
{
 "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "registry-mirrors": [
    "https://ot2k4d59.mirror.aliyuncs.com/"
  ],
  "data-root": "/workspace/docker", //添加这一行
  "insecure-registries": ["10.10.102.75"]
}
# 2.然后重启docker，就可以看到docker挂载的路径变了

```
