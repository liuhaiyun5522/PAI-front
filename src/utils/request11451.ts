
// 引入axios封装
import axios from 'axios'
import router from '@/router' // 引入router实例
import {ElMessage} from "element-plus";
// 创建axios实例
const request11451 = axios.create({
    baseURL: import.meta.env.VITE_NODE_ENV11451, // url = base url + request url
    timeout: 50000,// 5s超时,
})

// 请求拦截器 一般写法模式
request11451.interceptors.request.use(
    (response) => {
        // @ts-ignore
      response.headers = {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization':'Bearer '+localStorage.getItem('token')
        }
        return response // 请求成功则返回response
    },
    (error) => { // 请求失败则显示错误状态
      
        return Promise.reject(error)
    }
)

// 响应拦截器
request11451.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if(error.status == 401){
            ElMessage.error('认证过期请重新登录');
            localStorage.removeItem("token")
            router.push({ name: 'login' });
        }
        return Promise.reject(error)
    }
)

// 导出request
export default request11451
