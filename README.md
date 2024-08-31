# A password manager

· English · [中文](./README-zh_CN.md)

## **background**

In the Internet era, there are too many account passwords. The previous method was to save them in a notepad. But it lacks security and is inconvenient to search.

There are many password management tools on the market, but they all require servers. But I always feel uneasy if sensitive information like passwords is stored on someone else's server.

I thought that the basic function is just encrypted storage and search, which should not be difficult to implement, so I made one by referring to 1password.

At present, the function is not perfect, and I will continue to optimize it during use. You can also give it a try and give me any suggestions.

My goals are currently simple:

1. For personal use only, no sharing or collaboration is required.

2. No server is required, only network disk backup and recovery functions are provided. Control your own data

## **Principle Introduction**

1. A dual password mechanism similar to 1password: master password (remembered by the user) + key (the software generates a random password with a length of 25)

2. Confidential information uses the aes-256-cbc encryption algorithm. The key is sha256 (master password + key)

3. The data is stored locally and uses sqlite database.

## **Function introduction**

1. Confidential project support: account number, bank card, notes

2. Multiple confidential projects can be associated with one vault

3. Multiple account support

4. Random password generation tool

5. Automatically enter password function

6. Local backup and recovery function

7. Cloud disk backup and recovery function (currently only supports Alibaba cloud disk)

8. csv import (supports chrome and edge)

## **Demonstration effect**

### **Vault**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/J2JSbjsYpots6zxdObtcLQjNnvg.gif)

### **Add confidential information**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/WIpwbuzdpov0QBx3gfhcv5hmnJd.gif)

### **Confidential Information Preview**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/PaRDbyqASo5B6rx57X2cfdd0nTe.gif)

### **Confidential Information Edit**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/VZtRbLDijoYEqAx02CccGMeMnhd.gif)

### **User setting function**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/Ud6ibdHu7o4PCSxPeuicyVfXngd.gif)

### **Password generation**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/R0yGbj9laoiboRx2fZ8ce9Nmnld.gif)

### **tray tray**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/O9iNbgRj3ok9YbxggjdcwlZynDS.png)

### **Automatic input**

![image]![image](https://ftyszyx.github.io/feishu-vitepress/assets/ARvUbClubozD6txiiN9cneAJnRh.gif)

### **csv import**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/Z7RObWhM0ouHS3xy4vKcvdV1nbg.gif)

### **csv export**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/X170bJ7sAoigCQxBD5HcmunnnRg.gif)

### **Multiple accounts**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/PL7hbSig9oE2dyxlGXzc4Ep2neg.gif)

### **Network disk backup and restore**

![image](https://ftyszyx.github.io/feishu-vitepress/assets/EVN3bnF86oCDlExf0WNcnFTdnSg.gif)

## **Development Notes**

### **Download Code**

```text
git clone https://github.com/ftyszyx/lockpass.git
```

### **Install dependencies**

```text
npm install
```

### **Run**

```text
npm rundev
```

## **Library used**

### **Pack**

[electron-vite](https://github.com/alex8088/electron-vite)

<u>electron-builder packaging</u>

<u>electron-builder github</u>

In fact, the packaging process is that electron vite first packages the script under main render preload into the out directory using vite, and then electron-build types the resources into asar.

## **Summary of problems encountered**
