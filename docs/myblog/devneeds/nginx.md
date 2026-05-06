# nginx 命令

- 启动 `systemctl start nginx`
- 关闭 `systemctl stop nginx`
- 重启 `systemctl restart nginx`

- `man` 软件名 可以查看其有的各种参数 有空或者用时再查看其具体含义

- `nginx -t`检查配置文件格式是否正确
- `-c` : 指定配置文件的新路径(软件默认有一个路径)
- `-c filename` : `set configuration file (default: /etc/nginx/nginx.conf)`
- `-v` : 打印版本号
- `-g` : 设置一个全局的 `Nginx` 配置项
  - `[root@web01 ~]# nginx -g 'daemon off;'`
- `-p` ： 指定 `nginx` 的工作目录(后边有一个默认的工作目录)
- `-e`: 指定错误日志路径
- `-V` ： 打印版本号和配置项 及安装的所有模块
- `-T` ： 测试配置文件并启动
- `-q` ：打印错误日志
- `-s` : 操作进程
  - `stop` ：停止(慢慢停掉)
  - `quit` ： 退出
  - `reopen` ：重启---关机后启动
  - `reload` ：在不重启 `nginx` 情况下,重新加载配置文件
