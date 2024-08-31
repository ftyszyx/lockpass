import { resolve } from 'path'
import { defineConfig, bytecodePlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { builtinModules } from 'node:module'
// import pkg from './package.json'
export const builtins = ['electron', ...builtinModules.map((m) => [m, `node:${m}`]).flat()]
export const external = [
  ...builtins,
  'sqlite3',
  'robotjs_addon'
  // ...Object.keys('dependencies' in pkg ? (pkg.dependencies as Record<string, unknown>) : {})
]

const isdev = process.env.NODE_ENV === 'development'
console.log('isdev', isdev)
const plugins = []
if (isdev === false) {
  plugins.push(bytecodePlugin())
}

export default defineConfig({
  main: {
    plugins,
    build: {
      sourcemap: isdev,
      minify: isdev === false,
      rollupOptions: {
        external
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@common': resolve('src/common')
      }
    }
  },
  preload: {
    plugins,
    build: {
      sourcemap: isdev,
      minify: isdev === false,
      rollupOptions: {
        external
      }
    }
  },
  renderer: {
    build: {
      sourcemap: isdev,
      rollupOptions: {
        input: ['src/renderer/index.html', 'src/renderer/quick.html']
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve('src/common')
      }
    },
    plugins: [react()]
  }
})
