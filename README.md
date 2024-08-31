# lockpass

一个密码管理器

## 背景

互联网时代，账号密码太多，之前的方法是保存在一个记事本中。但缺乏安全性，搜索也不方便。

市面上有不少密码管理工具，但都需要服务器。但密码这种敏感信息，存在别人服务器上总感觉不放心。

心想基本功能只是一个加密存储和搜索，实现起来应该不难，于是自己参考1password做了一个。

目前功能尚不完善，我会在使用过程中不断优化。大家也可以试用一下，有什么建议可以提。

我的目标目前很简单：

1、只个人使用，不搞什么分享，协作这些复杂的完意

2、不要服务器，只提供网盘备份和恢复功能。自己的数据自己掌握

## 原理介绍

1、类似1password的双密码机制：主密码（用户自己记住）+key(软件生成长度为25的随机密码）

2、机密信息使用aes-256-cbc加密算法。密钥是 sha256(主密码+key)

3、数据存在本地，使用sqlite数据库

## 功能介绍
1、 保密项目支持：账号、银行卡、笔记 

2、多个保密项目可以关联到一个保险库中

3、多账号支持

4、随机密码生成工具

5、自动输入密码功能

6、本地备份和恢复功能

7、云盘备份和恢复功能（目前只支持阿里云盘）

8、csv导入（支持chrome和edge)

## 演示效果

### 保险库

![image](https://github.com/user-attachments/assets/5c38fbe4-a6b8-4155-9ace-5ee35f7321e3)

### 新增保密信息
![image](https://github.com/user-attachments/assets/b4bd1623-70f5-43b4-a67b-3ce64c1afa00)

### 保密信息预览
![image](https://github.com/user-attachments/assets/9436a368-2317-42a5-8f84-38bdfe8041b3)

### 保密信息编辑
![image](https://github.com/user-attachments/assets/96409b64-9eb1-46c3-8814-d745e53d919d)

### 用户设置功能

![image](https://github.com/user-attachments/assets/2bd1482e-3a24-438a-8f8d-d60ea5d990a3)

### 密码生成
![image](https://github.com/user-attachments/assets/1c25532d-60b6-4625-94fd-985b30317269)

### tray托盘
![image](https://github.com/user-attachments/assets/779a50da-1113-46f3-bf4f-545af8f332a9)

### 自动输入
![image](https://github.com/user-attachments/assets/638e0ec0-5e9d-4fd1-8d65-12142fe50642)

### 本地备份还原
 

### csv导入
![image](https://github.com/user-attachments/assets/26732d81-58b8-48c5-a0ed-b25e357137f8)
### csv导出
![image](https://github.com/user-attachments/assets/cf4899a8-7415-42da-82ea-cd25457c0d59)

### 多账号
![image](https://github.com/user-attachments/assets/f5cb3cce-0b58-4b36-bc39-1922359a507e)

### 网盘备份和还原
![image](https://github.com/user-attachments/assets/db42d5a7-cabc-4ec3-8be1-58072ad60462)


## 开发说明 

### 下载代码

```
git clone https://github.com/ftyszyx/lockpass.git
```

### 安装依赖

```
npm install
```

### 运行
```
npm run dev
```

## 使用的库


### 打包
![electron vite](https://github.com/alex8088/electron-vite)

 
[electron-builder 打包](https://www.electron.build/index.html)

[electron-builder github](https://github.com/electron-userland/electron-builder)

其实打包流程就是
electron vite先把main render preload下的脚本用vite打包到out目录下
然后electron-build把资源打成asar

## 遇到的问题汇总

