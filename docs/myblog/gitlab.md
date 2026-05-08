---
title: gitlab CI/CD
date: 2021-06-18 10:30:10
---

# gitlab CI/CD

gitlab 网站里面我们看到有 CI/CD 的打包流程，但是我们都不知道到底是怎么配置的，下面我们就来看一下`.gitlab-ci.yml`文件是怎么编写的。

## .gitlab-ci.yml 放在哪里？

`.gitlab-ci.yml`主要是放在项目的根目录下面

## .gitlab-ci.yml 常用的步骤

下面是一个项目里面`.gitlab-ci.yml`的步骤，我们来看一下都是什么意思？

```js
variables:  //定义构建变量
  TARGET_REPO: ""

before_script: //这个是执行每个job之前需要执行的脚本，
  - chcp 65001  //设置cmd格式，数字65001代表的是cmd窗口中utf-8格式的编码
  - 'git config core.autocrlf false'

stages:  //定义脚本有多少阶段(专业点叫job)，这里有三个job,每个job都要用-开头换行
  - install
  - package
  - push

install: //这里就开始工作了
  stage: install  //这里对应的是上面的stagets的install，一定要一致
  script:    //执行命令，这些命令都是同步的
  - npm run init
  cache: //重复运行的时候不要重复安装全部node_modules的包，1、在不同pipeline之间重用资源，2、在同一pipeline的不同Job之间重用资源
    key: ${CI_COMMIT_REF_SLUG}
    paths:
    - node_modules/
  only:  //表示仅在dev/master分支上执行
    refs:
      - dev
      - master
    variables:
        - $NPM_INSTALL == "true"
  when: manual   //定义job什么时候能被执行,on_success,on_failure,always或者manual

package:
  stage: package
  script:
  - echo "${CI_PROJECT_DIR}"
  - npm run build:micro --releasepath=../CivWebPublish2021
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
    - node_modules/
  only:
    refs:
      - dev
      - master
  when: manual


push:
  variables:
    GIT_STRATEGY: none
  stage: push
  script:
  - 'cd "${TARGET_REPO}"'
  - 'git reset --hard head'
  - 'git clean -fd'
  - 'git remote set-url origin "https://${ACCESS_USER}:${ACCESS_PASSWORD}@g.civnet.cn:8443/CivPublish/CivWebPublish2021.git"'
  - 'git pull origin map'
  - 'git rm -rf "${TARGET_REPO}/civ_water"'
  - 'git commit -m "chore: clear folder"'
  - 'git push origin map'
  - 'robocopy "${CI_PROJECT_DIR}/../CivWebPublish2021/civ_water" "${TARGET_REPO}/civ_water" /S ;
        IF ((${LASTEXITCODE} -le 8)) {cmd /c "exit /b 0"}'
  - 'git add . ; git reset HEAD Web.config CityInterface/Web.config CityWebFW/Web.config ; git commit -m "auto package civ_water."'
  - 'git push origin map'
  only:
    refs:
      - dev
      - master
  when: manual
```

when 的几个值：

- `on_success` 只有在之前场景执行的所有作业成功的时候才执行当前 job，这个就是默认值，我们用最小配置的时候他默认就是这个值，所以失败的时候 pipeline 会停止执行后续任务
- `on_failure` 只有在之前场景执行的任务中至少有一个失败的时候才执行
- `always` 不管之前场景阶段的状态，总是执行
- `manual` ~手动执行 job 的时候触发
