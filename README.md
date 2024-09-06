# 一个密码管理器

· 中文· [English](./README-en.md)

## **背景**

互联网时代，账号密码太多，之前的方法是保存在一个记事本中。但缺乏安全性，搜索也不方便。

市面上有不少密码管理工具，但都需要服务器。但密码这种敏感信息，存在别人服务器上总感觉不放心。

心想基本功能只是一个加密存储和搜索，实现起来应该不难，于是自己参考1password做了一个。

目前功能尚不完善，我会在使用过程中不断优化。大家也可以试用一下，有什么建议可以提。

我的目标目前很简单：

1、只个人使用，不搞什么分享，协作这些复杂的完意

2、不要服务器，只提供网盘备份和恢复功能。自己的数据自己掌握

## **原理介绍**

1、类似1password的双密码机制：主密码（用户自己记住）+key(软件生成长度为25的随机密码）

2、机密信息使用aes-256-cbc加密算法。密钥是 sha256(主密码+key)

3、数据存在本地，使用sqlite数据库

## **功能介绍**

1、 保密项目支持：账号、银行卡、笔记

2、多个保密项目可以关联到一个保险库中

3、多账号支持

4、随机密码生成工具

5、自动输入密码功能

6、本地备份和恢复功能

7、云盘备份和恢复功能（目前只支持阿里云盘）

8、csv导入（支持chrome和edge)

## **演示效果**

### **保险库**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/J2JSbjsYpots6zxdObtcLQjNnvg.gif)

### **增保密信息**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/WIpwbuzdpov0QBx3gfhcv5hmnJd.gif)

### **保密信息预览**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/PaRDbyqASo5B6rx57X2cfdd0nTe.gif)

### **保密信息编辑**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/VZtRbLDijoYEqAx02CccGMeMnhd.gif)

### **用户设置功能**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/Ud6ibdHu7o4PCSxPeuicyVfXngd.gif)

### **密码生成**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/R0yGbj9laoiboRx2fZ8ce9Nmnld.gif)

### **tray托盘**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/O9iNbgRj3ok9YbxggjdcwlZynDS.png)

### **自动输入**

![image]![image](https://ftyszyx.github.io/feishu-vitepress/assets/ARvUbClubozD6txiiN9cneAJnRh.gif)

### ** csv导入**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/Z7RObWhM0ouHS3xy4vKcvdV1nbg.gif)

### **csv导出**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/X170bJ7sAoigCQxBD5HcmunnnRg.gif)

### **多账号**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/PL7hbSig9oE2dyxlGXzc4Ep2neg.gif)

### **网盘备份和还原**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/EVN3bnF86oCDlExf0WNcnFTdnSg.gif)

## **开发说明**

### **下载代码**

```text
git clone https://github.com/ftyszyx/lockpass.git
```

### **安装依赖**

```text
npm install
```

### **运行**

```text
npm run dev
```

## **使用的库**

### **打包**

[electron-vite](https://github.com/alex8088/electron-vite)

[electron-builder打包](https://www.electron.build/index.html)

[electron-builder github](https://github.com/electron-userland/electron-builder)
其实打包流程就是 electron vite先把main render preload下的脚本用vite打包到out目录下 然后electron-build把资源打成asar

## **遇到的问题汇总**

## **todo**

1、程序更新机制(完成)
https://www.electron.build/auto-update
electron-builder的功能的确强大，做的很好，点赞

3、Linux 打包异常问题(完成)
snap打包好像需要签名文件。
目前先把snap去掉。

```
snapcraft internal error: NoKeyringError('No keyring found to store or retrieve credentials from.')
```

4、覆盖安装不要把配置文件删除(完成)
之前为了开发方便，把程序生成的用户文件和配置放在应用程序当前目录。
但目前主流的做法是把这些配置文件放在系统划分的用户目录
windows下是%appdata%
这样的话，就不会有上面的问题了，因为配置和程序存储的位置分开了。
而且也不会有权限的问题。

5、修改主密码(完成)

6、切换语言(完成)
支持英文和中文

7、跟随系统锁定(完成)

8、开机自启动(完成)
