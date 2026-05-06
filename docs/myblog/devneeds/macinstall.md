---
title: MAC 安装命令行汇总
date: 2022-01-17 15:36:10
---

## 安装 rar 解压命令

### 安装 unrar

```bash
[root@localhost] # brew install unrar
```

### cd 到对应要解压的目录下面，执行下列命令

```bash
[root@localhost] # unrar x 需解压的文件目录
```

## 安装 svn 命令行

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

## mac 显示/隐藏文件

```bash
# 在终端中输代码即可显示隐藏文件
[localhost]# defaults write com.apple.finder AppleShowAllFiles -boolean true;killall Finder

# 在终端中输代码即可隐藏隐藏文件
[localhost]# defaults write com.apple.finder AppleShowAllFiles -boolean false;killall Finder
```
