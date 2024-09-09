# 一个密码管理器

· 中文· [English](./README-en.md)

# 详细文档

国内

https://blog.bytefuse.cn/feishu__2024_8_6_product_onepassword_3doc

国外

https://ftyszyx.github.io/feishu-vitepress/feishu__2024_8_7_product_onepassword_4doc

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

1. **双密码机制:** 主密码和25字符的key(软件生成）组合成超强密码1.**AES数据加密:** 本地存储的敏感信息通过aes-256-cbc进行加密存储
1. **多种密码信息支持:** 登陆信息、银行卡信息、笔记信息的保存
1. **保险库功能:** 将不同的密码信息分类保存
1. **多账号功能:** 软件可以切换不同的账号（这样你可以将你父母的你自己密码信息隔离保存，因为不同账号主密码可以不同）
1. **随机密码生成工具:** 再也不用担心密码不够安全，不符合网站的需求。工具帮你随机按需生成密码
1. **键盘自动输入:** 通过快捷键呼出密码快捷搜索窗口，选中后，自动输入账号密码
1. **多语言支持:** 支持中文和英文的快速切换
1. **本地备份文件的导出和导入:** 可以将个人信息保存成zip文件，同时也可以导入此备份信息。
1. **云盘备份和恢复:** 可以将软件数据保存到云盘，或者从云盘上恢复相应的备份。（目前只支持阿里云盘）
1. **csv导入和导出:** 可以导入chrome或者edge浏览器导出的csv密码文件到软件中，也可以导出软件的密码信息成csv
1. **修改主密码:** 可以方便的修改主密码（注意备份）
1. **程序自动更新:** 支持从github上更新最新版本1.**开机自启动**
1. **系统锁定，软件也锁定**

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

1. 程序更新机制(完成)
   https://www.electron.build/auto-update
   electron-builder的功能的确强大，做的很好，点赞

1. Linux 打包异常问题(完成)
   snap打包好像需要签名文件。
   目前先把snap去掉。

   ```
   snapcraft internal error: NoKeyringError('No keyring found to store or retrieve credentials from.')
   ```

1. 覆盖安装不要把配置文件删除(完成)
   之前为了开发方便，把程序生成的用户文件和配置放在应用程序当前目录。
   但目前主流的做法是把这些配置文件放在系统划分的用户目录
   windows下是%appdata%
   这样的话，就不会有上面的问题了，因为配置和程序存储的位置分开了。
   而且也不会有权限的问题。

1. 修改主密码(完成)
1. 切换语言(完成)
1. 跟随系统锁定(完成)
1. 开机自启动(完成)
1. 新加入的账号信息，快捷搜索不到
1. 快捷搜索的快捷键改成 ctrl+shift+q

# bug及优化记录

1. 新增的一个密码后，页面要能选中该密码
1. 新增密码的弹窗，在点Outsize区域不要关掉
1. 锁定页面打开时应该定位到密码输入框
1. 增加软件窗口隐藏的快捷键ctrl+shift+down
1. 备份到阿里云盘时可以自定义名字
1. 可以删除阿里云盘的备份
1. 有修改没有备份时在窗口下方加个日志，或者项目右上角加个红点，表示有修改

# 远期的优化

1. 自己上传图片更换
