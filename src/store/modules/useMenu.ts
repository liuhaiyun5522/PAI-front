// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import {ref} from "vue";
import {historyGetList} from "@/api/chat";
import {getUserInfo} from '@/api'
export const useMenuStore = defineStore('useMenu', {
    state: () => ({
        menuList: ref ([] as Array<{ date: String, children: Array<{ id: String, title: String }> }>), // 存储动态路由配置
        pageKey:0,
        userInfo:{
            userId:'',
            userName:'',
            userEmail:'',
            userPermissionLevel:''
        },
    }),
    actions: {
        async getMenuList(){
           const res = await historyGetList()
            if(res.data.status_code == '200'){
                this.menuList = res.data.message
            }
        },
        async getUserInfo(){
            const res = await getUserInfo()
            if(res.data.status_code == '200'){
                this.userInfo = res.data.message[0]
            }
        }
    }
})

