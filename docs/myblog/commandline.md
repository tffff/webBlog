---
title: 命令行操作合集
---

## 1、svn 命令行

### 首先在 CentOS 或者 MacOs 上下载 svn

```bash
yum install svn
```

[mac 安装教程](/devneeds/macinstall.html#安装svn命令行)

创建版本库可以参考[菜鸟教程](https://www.runoob.com/svn/svn-create-repo.html)

### svn 命令汇总(如果有漏掉的，会不定期更新~~)

```bash
# 同时装了客户端和服务器端
# 创建版本库
svnadmin create /opt/svn/runoob

#新创建项目
svn mkdir 线上svn地址 -m “mkdir”
#或者本地操作
svn mkdir file:///data/repos/ -m “mkdir”


# 下载项目
svn checkout svn地址 --username=用户名 --password=密码

#查看文件或者目录状态
svn status

# 添加单个文件
# 例如 svn add /src/pages/Loading
svn add file

# 添加多个文件
svn add *

#删除文件
#例如 svn delete /src/pages/Loading
svn delete file

# 提交
svn commit -m '更新说明'

# 忽略文件不加入到版本控制
# 例如 svn propedit svn:ignore node_modules
svn propedit svn:ignore 目录名称

svn branch 分支名(add/commit)。
svn merge 主干svn地址 分支svn地址。
Beyond Compare -> svn resolved。
svn copy 主干SVN地址 /tags/2017
```

## 2、git 命令行

mac 电脑默认安装 git，windows 需要下载对应的插件安装

### 1、初始化本地 git 存储库

```bash
git init
```

### 2、创建远程存储库的本地副本

```bash
git clone [git服务地址]
```

### 3、检查状态

```bash
git status
```

### 4、将文件添加到暂存区

```bash
# 添加单个文件
git add [file-name.txt]
# 添加所有修改的文件
git add .
```

### 5、将所有新文件和更改过的文件添加到登台区域

```bash
git add -A
```

### 6、提交更改

```bash
git commit -m "[commit message]"
```

### 7、删除文件

```bash
git rm -r [file-name.txt]
```

### 8、列出分支

```bash
git branch
```

### 9、创建一个新分支

```bash
git branch [branch name]
```

### 10、删除分支

```bash
git branch -d [branch name]
```

### 11、创建一个新分支并切换到该分支

```bash
git checkout -b [branch name]
```

### 12、克隆一个远程分支并切换到该分支

```bash
git checkout -b [本地分支名] origin/[远程分支名]
```

### 13、重命名本地分支

```bash
git branch -m [old branch name] [new branch name]
```

### 14、切换到分支

```bash
git checkout [branch name]
```

### 15、将一个分支合并到活动分支中

```bash
git merge [branch name]
```

### 16、将一个分支合并到一个目标分支

```bash
git merge [source branch] [target branch]
```

### 17、将更改存储在隐藏的工作目录中

```bash
git stash
```

### 18、删除所有隐藏的条目

```bash
git stash clear
```

### 19、将分支推送到你的远程存储库

```bash
git push origin [branch name]
```

### 20、将更改推送到远程存储库

```bash
git push
```

### 21、将本地存储库更新为最新的提交

```bash
git pull
```

### 22、从远程存储库中提取更改

```bash
git pull origin [branch name]
```

### 23、添加一个远程存储库

```bash
git remote add origin ssh://git@github.com/[username]/[repository-name].git
```

### 24、查看更改

```bash
git log
```

### 24、合并前预览更改

```bash
git diff [source branch] [target branch]
```

### 25、git 多分支开发

```bash
# 创建自己的分子并把远程分支的代码拉到本地

# 创建本地分支 注意：该分支只在本地出现，还没有提交到远程服务上
# 例如 git checkout -b test
git checkout -b [本地分支]
# 拉取远程分支到本地分支
git pull origin [远程分支]
# 修改新创建的本地分支的代码，并提交到远程服务器，会创建一个
# 例如 git push origin test  远程分支就会有一个test分支（
# 注意：本地分支推送的时候不能改名，意思就是本地分支是什么名字线上就是什么名字
git push origin [需要推送代码的分支]

# 分支合并

# 第一步  在自己的开发分支
git add .
git commit -m '提交内容'
git push
# 第二步 主分支(需要合并的分支)
git checkout [目标分支]
#拉取最新的代码
git pull
# 把自己的开发分支合到活动分支
git merge [自己的开发分支]
```

### 26、git 撤销 pull 或者 commit 操作

```bash
# 可以显示当前分支所有提交过的版本信息，不包括已经被删除的 commit 记录和reset的操作
git log

# git reflog命令中保留了从clone仓库开始，用户所有在本地库中的操作，所有引起HEAD指针变动的操作，都会被记录在git reflog命令中
git reflog

# 一行显示 简介的看
git log --pretty=oneline
# 两者的区别就是：reflog可以买后悔药，log不能买后悔药

#撤销操作
git reset --hard 对应前面的数字


# push失败之后怎么把commit 更改弄回到本地目录，这个命令会将你的更改移回到暂存区（stage），但不会改变工作目录中的文件。这意味着你的更改仍然存在，但是它们不再被标记为已提交
git reset --soft HEAD~1

#这个命令会丢弃工作目录中的所有更改，并将HEAD指针移动到前一个提交。注意：这会丢失所有未提交的更改，所以请确保你真的想要这么做
git reset --hard HEAD~1

```

### 27、git 修改分支名称

```bash
# 1、本地分支重命名(还没有推送到远程)
git branch -m oldName newName
# 2、重命名远程分支对应的本地分支
git branch -m oldName newName
# 3、删除远程分支
git push --delete origin oldName
# 4、上传新命名的本地分支
git push origin newName
# 5、把修改后的本地分支与远程分支关联
git branch --set-upstream-to origin/newName

```

### 28、git 基于某个分支的 commit 拉分支

```bash
# 1、查看commitid
git log
# 2、从某一个commit 切出来一个新分支 test
git checkout <commitid> -b test
# 3、推送 test 分支到远程仓库
git push origin test
```

### 29、git设置中文名
```bash
git config --global user.name "xxx(新用户名)"
git config --global user.password "xxx(新密码)"
git config --global user.email "xxx@xx.com(新邮箱)"
#查看用户名
git config user.name
#查看邮箱
git config user.email
```

## 3、nrm 切换源

```bash
# 1. 下载 nrm
npm install -g nrm
# 2. 添加源
nrm add 名字 私有npm地址
# 3、使用某个源地址
nrm use 名字
# 4. 查看 nrm 地址列表
nrm ls
# 5. 删除源地址
nrm del 名字
```
## 4、nginx 命令
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


## 5、mac 执行命令
### 安装 rar 解压命令

#### 安装 unrar

```bash
[root@localhost] # brew install unrar
```

#### cd 到对应要解压的目录下面，执行下列命令

```bash
[root@localhost] # unrar x 需解压的文件目录
```

#### 安装 svn 命令行

由于现在 10.15 以上的版本没有自带 svn,所以需要自行下载

```bash
#安装brew,如果报错和xcode相关需要先安装xcode
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"

#brew -v 查看版本
brew -v

#如果没有安装brew,要先安装brew
brew install svn

#查看svn 是否安装成功
svn help

```

### mac 显示/隐藏文件

```bash
# 在终端中输代码即可显示隐藏文件
[localhost]# defaults write com.apple.finder AppleShowAllFiles -boolean true;killall Finder

# 在终端中输代码即可隐藏隐藏文件
[localhost]# defaults write com.apple.finder AppleShowAllFiles -boolean false;killall Finder
```
