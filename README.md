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

### 2024/8月

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

### 2024/9/16

1. 新增的一个密码后，页面要能选中该密码(完成)
2. 选中密码项时，选中项要居中(完成)
3. vault_item增加一个字段表示创建时间,兼容老版(完成)
4. 新增密码的弹窗，在点Outsize区域不要关掉(完成)
5. 锁定页面打开时应该定位到密码输入框(完成)
6. 增加软件窗口隐藏的快捷键ctrl+shift+down(完成)
7. 备份到阿里云盘时可以自定义名字(完成)
8. 可以删除阿里云盘的备份(完成)
9. 有修改没有备份时在窗口下方加个日志，或者项目右上角加个红点，表示有修改(完成)

   ![image](https://github.com/user-attachments/assets/2c49ac5d-dbb3-4b31-82e6-011d8d6521bd)

10. 密码库页面增加方向键控制和选中效果(完成)
11. 增加本地快捷键的映射ctrl+f ctrl+j(完成)
12. 自动输入时需要将输入法切成英文(完成)
13. 可以修改密码所属的保险库(完成)

    ![image](https://github.com/user-attachments/assets/cdf0f10e-777d-49d1-b09d-20351c937b6f)

14. 修改密码信息后，快捷搜索页没有更新(完成)
15. 增加密码时，选择密码类型也增加键盘方向控制(完成)

    ![20240924211600_rec_](https://github.com/user-attachments/assets/d0e7a197-0ba8-4651-be1e-60d63d39a7e1)

16. 优化软件更新逻辑(完成)

### 2024/9/18

1. 解锁后软件的title不对(完成)
2. ctrl+f和ctrl+j优化（完成）

### 2024/9/19

1. 第一次打开软件时，本地快捷键没有生效（终于重现了，原来是快捷键读取时没有转小写，已处理）
   ![image](https://github.com/user-attachments/assets/6444c69d-6cb7-4b32-8936-50dd1bc86c01)

2. 第一次启动默认语言读取系统语言(完成)
   ![image](https://github.com/user-attachments/assets/9e4e62a2-b921-45c1-9a28-289dd1447a0a)

3. ctrl+f和ctrl+J这种快捷键在ui中显示出来

   ![image](https://github.com/user-attachments/assets/f3bfc21a-22b0-43a5-9c8e-91ee55d4e761)

### 2024/9/20

1. 更新软件的描述显示优化

   ![image](https://github.com/user-attachments/assets/87692f33-8e6a-4a88-b2bd-73d89099b69a)

2. 参考mousetrap快捷键排除input输入，避免错误的快捷键检测
   ![image](https://github.com/user-attachments/assets/dda7a7bd-39c0-4461-bde0-af33870432f6)

3. 新增一项后，显示的是空的(解决)

   ![img_v3_02et_fb2fdfe2-098e-4ca5-ab05-286b7355bb1g](https://github.com/user-attachments/assets/51383bdd-6e89-4648-9d89-2595d823469f)

4. 快捷查看页面的快捷键失灵了(解决)

   ![img_v3_02et_3bbc09f0-ac38-4447-9cc6-1de13497c04g](https://github.com/user-attachments/assets/513346ce-6ff3-4ff2-90af-78a7217838f1)

5. 密码项显示创建时间，并按照时间排序(解决)

   ![img_v3_02et_c913d49f-7e82-4de8-83cc-7845321440eg](https://github.com/user-attachments/assets/c62f2367-aa06-485d-b7d5-7803b8431a5a)

### 2024/9/24

1. 窗口的大小缩放后可以记住(已完成)

   ![20240924211923_rec_](https://github.com/user-attachments/assets/6eca1c22-9f06-4e96-a0ca-4c61a915acd7)

2. 快捷窗口每次打开要清除之前输入的内容(完成)
3. qq密码无法输入问题（完成）
   原因是: 之前输入密码是使用unicode的方式，qq密码框有限制。
   现在改成虚拟键盘的方式，改了一点robotjs的代码，只支持windows

   ![20240924215039_rec_](https://github.com/user-attachments/assets/1603bad4-3f62-49b2-ae39-a5cbebd0ea98)

# 需要修复的bug及功能优化

1. 通过ctrl+左和ctrl+右来控制子窗口间切换
2. 然后可以通过键盘的上下来控制菜单 的移动
3. 窗口显示当前拉取的备份信息
4. 软件内链接需要使用系统浏览器打开，现在是在软件内打开(完成)
5. 百度和goolge网盘备份功能

# 远期的优化

1. 自己上传图片更换
1. 增加一个常用密码列表的设置
1. 加密图片信息
