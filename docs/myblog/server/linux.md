---
title: Linux知识点
date: 2022-01-13 20:20:31
---

## 1、linux 安装

1. windows 安装[Vmware pro](https://www.vmware.com/cn.html),登录之后才能看到下载页面,centos 系统选择国内镜像安装
2. 使用腾讯云服务器比较好
3. 服务器一般选择 `CentOs`（redhat 有商业用途）
4. 严格遵守大小写
5. 可以在 windows 上模拟 linux 命令的软件[cygwin](http://www.cygwin.com/)

   ### linux 系统目录功能概述

   <img src='../../assets/node/linux.png'>

   - `etc` 配置文件（系统和程序的配置文件）
   - `boot` 不同版本的内核文件
   - `sbin` 环境变量存的位置
   - `mnt` 接移动硬盘这类
   - `srv` 是服务程序
   - `usr` 是用户的命令
   - `boot`(不要操作，存放 `linux` 内核，启动的配置文件)
   - `opt` 自己装的软件
   - `var` 是经常要用的(logs,系统日志)
   - `dev` 设备文件
   - `sys` 系统文件
   - `sbin` 可执行文件
   - `tmp` 临时文件(关闭之后会清空)

   <img src='../../assets/node/linux-etc.png'>

   -r 可读 ，-w 可写，-x 可执行

## 2、创建普通用户

```bash
useradd [name]
passwd [name]
```

## 3、基础知识汇总

默认进服务器是 `root` 用户目录

```bash
# 主机名~ 当前⼯工作⽬目录,默认是当前⽤用户的家⽬目录，使用whoami可以查看当前是哪个用户目录
# 超级管理员 权限是最大的
[root@localhost ~]$ whoami

# 显示$是超级用户
[root@localhost ~]#

# 显示#是普通用户
[root@localhost ~]$

# pwd 查看当前在那个用户目录下
[user1@VM-16-14-centos ~]$ pwd
# 这样显示是普通用户
/home/user1
# 这样显示是超级用户
/home

# linux 不分磁盘分区

# linux网络的配置文件在/etc/sysconfig/network-scripts/[ifcfg-eht0],不一定是0可能是其他的数字
# 该文件内容如下：
# 默认是dhcp,表示动态获取地址 ,静态地址：none static
BOOTPROTO=dhcp
DEVICE=eth0
HWADDR=52:54:00:99:5b:3b
#  开机自动开启网卡，访问不到机器的时候 是因为网卡没有激活，所以必须是yes
ONBOOT=yes
PERSISTENT_DHCLIENT=yes
TYPE=Ethernet
USERCTL=no

# ifdown 关闭网卡 ifup 开启网卡，不要在远程连接上做这个操作

# ifcfg-lo 本地回环地址 一般不动

# netstat -an  查看哪些端口被打开 netstat -an -p 多了一行pid，可以判断是哪一个进程用了这个端口

# kill pid 杀掉进程
[root@localhost ~]$ kill [pid]

# 连接服务器 出现`[root@localhost]`就是登录成功
[root@localhost ~]$ ssh 用户名@IP(ip是服务器公网ip)
```

## 4、linux 常用命令

```bash
# 查看隐藏文件 文件名前面带.的是隐藏文件
[root@localhost]  ls -a

# 创建文件夹
[root@localhost]  mkdir  a

# 删除文件夹
[root@localhost]  rm -rf [文件夹命名]

# 创建文件
[root@localhost]  touch  a.txt

# 复制文件到指定目录(例如：复制a.txt文件到a目录下面)
[root@localhost]  cp  a.txt a
# 复制文件到指定目录并且重命名(例如：复制a.txt文件到a目录下面)
[root@localhost]  cp  a.txt a/b.txt
# 复制文件夹aaa并改名为ddd
[root@localhost]  cp -r aaa ddd

# 移动文件到指定目录(例如：复制a.txt文件到a目录下面),mv也有重命名的功能
[root@localhost]  mv  a.txt a

# 查看当前路径 /root/workspace/aaa
[root@localhost]  pwd

# 删除文件夹aaa   删除文件a.txt
[root@localhost]  rm -r aaa / rm -r a.txt

## 解压文件
[root@localhost]  tar -xf 文件名

# 查看磁盘空间
[root@localhost]  df -h

## 安装软件 rpm -ivh apache-1.3.6.i386.rpm
[root@localhost]  rpm -ivh
```

## 5、linux 下安装 nginx

[nginx 地址](http://nginx.org/en/download.html)

[菜鸟安装](https://www.runoob.com/linux/nginx-install-setup.html)

配置 nginx.conf，`/usr/local/webserver/nginx/conf/nginx.conf`

```bash
#user  nobody;
worker_processes  1; #工作进程：数目。根据硬件调整，通常等于cpu数量或者2倍cpu数量。

#错误日志存放路径
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid; # nginx进程pid存放路径


events {
    worker_connections  1024; # 工作进程的最大连接数量
}


http {
    include       mime.types; #指定mime类型，由mime.type来定义
    default_type  application/octet-stream;

    # 日志格式设置
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main; #用log_format指令设置日志格式后，需要用access_log来指定日志文件存放路径

    sendfile        on; #指定nginx是否调用sendfile函数来输出文件，对于普通应用，必须设置on。
      如果用来进行下载等应用磁盘io重负载应用，可设着off，以平衡磁盘与网络io处理速度，降低系统uptime。
    #tcp_nopush     on; #此选项允许或禁止使用socket的TCP_CORK的选项，此选项仅在sendfile的时候使用

    #keepalive_timeout  0;  #keepalive超时时间
    keepalive_timeout  65;

    #gzip  on; #开启gzip压缩服务

    #虚拟主机
    server {
        listen       80;  #配置监听端口号 ，改这个地方可以改端口
        server_name  localhost; #配置访问域名，域名可以有多个，用空格隔开

        #charset koi8-r; #字符集设置

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }
        #错误跳转页
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ { #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
        #    root           html; #根目录
        #    fastcgi_pass   127.0.0.1:9000; #请求转向定义的服务器列表
        #    fastcgi_index  index.php; # 如果请求的Fastcgi_index URI是以 / 结束的, 该指令设置的文件会被附加到URI的后面并保存在变量$fastcig_script_name中
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;  #监听端口
    #    server_name  localhost; #域名

    #    ssl_certificate      cert.pem; #证书位置
    #    ssl_certificate_key  cert.key; #私钥位置

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5; #密码加密方式
    #    ssl_prefer_server_ciphers  on; # ssl_prefer_server_ciphers  on; #


    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

简单的配置 只需要修改端口和内核位数就行，在浏览器里面运行服务器 IP:端口号，出现下面界面就是配置成功
:tada: :100:

<!-- ![nginx](/node/nginx.png) -->
<img src='../../assets/node/nginx.png'>

### nginx 启动停止命令

```bash
/usr/local/webserver/nginx/sbin/nginx                      # 启动
/usr/local/webserver/nginx/sbin/nginx -s reload            # 重新载入配置文件
/usr/local/webserver/nginx/sbin/nginx -s reopen            # 重启 Nginx
/usr/local/webserver/nginx/sbin/nginx -s stop              # 停止 Nginx
```

## 6、进程、线程、协程

- 进程的目的就是担当分配系统资源（cpu 时间，内存）的实体
- 线程是操作系统能够进行运算调度的最小单位
- 协程是一种用户态的轻量级线程，无法利用多核资源
- IO 密集型应用的发展：多进程->多线程->事件驱动->协程
- cpu 密集型应用的发展：多进程->多线程
- 调度和切换的时间：进程>线程>协程
- 内核是一个特殊的进程，是操作系统被启用的第一个程序

## 7、Liunx 免密登录

### 生成秘钥对

```bash
ssh-keygen -t rsa -C "你的名字" -f "你自己的名字_rsa”（不要输入密码）
```

### 上传配置公钥

上传公钥到服务器对应账号的 home 路径下的.ssh/中
`ssh-copy-id -i "公钥文件名" 用户名@服务器ip或域名 (-i指定秘钥文件，传公钥pub文件)`
上传到服务器的登录用户的 home 目录下面 ,在下面的 .ssh
指定私钥登录

```bash
ssh -i 私钥名称 用户名@Ip
```

### 配置本地秘钥

进入 mac 本地.ssh 文件夹 `cd .ssh`

免密登录模板

```bash
# 多主机配置
Host gateway-produce  //host是服务器别名
HostName IP或绑定的域名
Port 22
Host node-produce
HostName IP或绑定的域名
Port 22
Host java-produce
HostName IP或绑定的域名
Port 22

Host *-produce
User root
IdentityFile ~/.ssh/produce_key_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO

#单主机配置
Host evil-cloud
User root
HostName IP或绑定的域名
IdentityFile ~/.ssh/evilboy_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO

#单主机配置
Host git.yideng.site
User git
IdentityFile ~/.ssh/evilboy_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO
```

### 打开 nginx 具体安装目录 查看配置文件

`/usr/local/var/www` 静态资源文件

### 免密登录功能的本地配置文件

编辑自己 `home` 目录的`cd .ssh/` 路径下的 `config` 文件,没有就新建一个 `config`

## 8、本地传输文件到远程服务器

### scp 传输方式

```bash
#复制一个文件
scp 本地文件路径  root@IP:/路径

#复制多个文件
scp ./*.zip root@IP:/路径

#从服务器下载文件
scp root@IP:/路径  本地文件路径

#从一个服务器到另一个服务器
scp [[user@]host1:]file1  [[user@]host2:]file2

```

### ftp 传输方式

```bash
# 登录服务器
ftp user@xxx.com port
```

### sftp 传输方式

```bash
#sftp登录
[root@localhost]# sftp 用户名@IP

#将本地的文件上传到服务器
[root@localhost]# put [本地文件的地址] [服务器上文件存储的位置]
例如： [root@localhost]# put /root/java/sonarqube-8.4.0.35506.zip /opt

#将服务器的文件下载到本地
[root@localhost]# get [服务器上文件存储的位置] [本地要存储的位置]

#退出
[root@localhost]# exit或quit
```
