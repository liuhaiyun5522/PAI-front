import { createApp } from 'vue'
import router from './router'
const app = createApp(App)
import App from './App.vue'
// 引入大仓库
import pinia from '@/store/createPinia'
// element plus
import ElementPlus from 'element-plus'
import axios from 'axios'
import { createI18n } from 'vue-i18n'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './style/mixin.scss'

//自适应px换算rem
import './utils/rem'

app.config.globalProperties.$axios = axios

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import moment from 'moment';
app.config.globalProperties.$moment = moment;
import Delete from './components/Delete.vue'
import Empty from './components/Empty.vue'
app.component('Delete', Delete)
app.component('Empty', Empty)
const localeLang = localStorage.getItem('lang')||'ja'
// 引入语言资源文件
import jp from './lang/jp.json'
import zh from './lang/zh.json'
// 创建i18n实例并传入选项
const i18n = createI18n({
  locale:  localeLang, // 设置默认语言
  legacy: false,
  messages: {
    ja:jp,
    'zh-CN':zh
    // jp, // 日文资源
    // zh  // 中文资源
  }
})
import elementPlusJaLocale from 'element-plus/dist/locale/ja.mjs'
import elementPlusZhCnLocale from 'element-plus/dist/locale/zh-cn.mjs'

app.use(router).use(i18n).use(ElementPlus,{
  locale: localeLang === 'ja' ? elementPlusJaLocale : elementPlusZhCnLocale
}).use(pinia).mount('#app')

import './style.scss'
