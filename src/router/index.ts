
// 通过vue-router插件实现路由配置
import { createRouter,createWebHistory } from 'vue-router';
// 引入routes配置项

import { constantRoute as routes } from './routes';

import 'nprogress/nprogress.css'

// 创建路由  import.meta.env.BASE_URL
let router = createRouter({
    // 路由模式hash
    history: createWebHistory(),//import.meta.env.BASE_URL
    // routes: constantRoute,
    routes,
    //使用浏览器的回退或者前进时，重新返回时保留页面滚动位置，跳转页面的话，不触发。
    // 滚动行为
    scrollBehavior:()=>({left:0,top:0})
})

// // 路由守卫
// router.beforeEach((to, from, next) => {
//     let isUserLoggedIn = false;
//     let userId = localStorage.getItem("userId");
//     if (userId) {
//         isUserLoggedIn = true;
//     }
//     if (to.path !== '/login') {
//         next('/login');
//     } else {
//         // 否则，继续导航
//         next();
//     }

//     let token = localStorage.getItem("TOKEN")
//     if (to.path === '/login' && token) {
//         next('/dialog');
//     }else{
//         next();
//     }
// })


export default router;
