# lockpass

密码管理器

## Recommended IDE Setup

## 使用electron vite来

https://github.com/alex8088/electron-vite
demo
https://github.com/caoxiemeihao/electron-vite-samples.git

## electron 的打包

electron-builder
https://www.electron.build/index.html
github地址
https://github.com/electron-userland/electron-builder

electron-builder.yml就是打包的配置

directotries是要打包的目录
icon need to be placed in the buildResources directory (defaults to build).

files The files configuration.

asar = true AsarOptions | Boolean | “undefined” - Whether to package the application’s source code into an archive, using Electron’s archive format.

Node modules, that must be unpacked, will be detected automatically, you don’t need to explicitly set asarUnpack - please file an issue if this doesn’t work.

其实打包流程就是
electron vite先把main render preload下的脚本用vite打包到out目录下
然后electron-build把资源打成asar

现在有个问题：
为什么node_modules会被整个的打包进去？
这很占空间

先看下rollup文档
https://cn.rollupjs.org/introduction/

rollup是干啥的？相当于就是合并代码
1、它将小的代码片段编译成更大、更复杂的代码
因为正常代码都是分模块的,只有发布时才会整合到一起。
2、删除不使用的模块

```
import { ajax } from './utils';
```

类似于上面代码，只会导入utils模块的ajax函数
