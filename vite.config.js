// import {fileURLToPath,URL} from 'node:url'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
//
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


import {resolve} from 'path'

import { viteMockServe } from 'vite-plugin-mock'  //引入 mock 插件提供的方法

// 引入等比适配插件
// const px2rem = require('postcss-px2rem')
import postcssPx2rem from 'postcss-px2rem'; // 使用静态 import 替代 require



// 配置基本大小
const postcss = postcssPx2rem({
  // 基准大小 baseSize，需要和rem.js中相同
  // remUnit: 14 代表 1rem = 14px; 所以当你一个14px值时，它会自动转成 (14px/14)rem
  remUnit: 14
})

import svgLoader from 'vite-svg-loader'
// https://vitejs.dev/config/
export default defineConfig(({command})=>{
  return{
    plugins: [
      vue(),
      // VueDevTools(),
      //mock配置
      viteMockServe({
        mockPath:'src/mock',//设置模拟数据的存储文件夹
        // supportTs:false,//是否读取ts文件模块
        // logger:false,//是否在控制台显示请求日志
        // localEnabled:true,//设置是否启用本地mock文件
        // prodEnabled:true//设置打包是否启用 mock 功能
        enabled:command === 'serve'//保证开始阶段可以使用mock接口
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      svgLoader()
    ],
    css:{
      loaderOptions:{
        less:{
          javascriptEnabled: true,
        },
        postcss: {
          plugins: [
            postcss,
          ],
        }
      },
      // preprocessorOptions: {
      //   scss: {
      //     additionalData: `@import "./src/style/mixin.scss";` // 此处全局的scss文件
      //   }
      // }
    },
    resolve: {
      alias: {  // 这里就是需要配置resolve里的别名
        // "@": path.join(__dirname, "./src"), // path记得引入
        // '@':resolve(__dirname,"./src")
        '@':fileURLToPath(new URL('./src',import.meta.url))
        // 'vue': 'vue/dist/vue.esm-bundler.js' // 定义vue的别名，如果使用其他的插件，可能会用到别名
      }
    },
    // server: {
    //   host: '0.0.0.0'
    // }
    // 跨域
    server: {
      port:8091,
      host: "0.0.0.0",
      open: true,
      cors:true,//允许跨域
      // allowedHosts:['askme2.cbredata.com'],
      proxy: {
        "/api": {
          target: "http://13.112.150.251:8009/api",//目标后端服务器地址
          // target: "http://13.112.150.251:11451/api",//目标后端服务器地址
          changeOrigin: true,
          bypass(req, res, options) {
            const proxyURL = options.target + options.rewrite(req.url);
            res.setHeader("x-req-proxyURL", proxyURL); // 将真实请求地址设置到响应头中
          },
          pathRewrite: {
            '^/api': '/' // 重写路径（表示请求的地址没api前缀的时候）
          }
    //       // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      ws: true, // 启用 WebSocket
      server: {
        hmr: false
      }
    },
  }
  

})
