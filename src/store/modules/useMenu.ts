// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { ref } from "vue";
import { historyGetList } from "@/api/chat";
export const useMenuStore = defineStore('useMenu', {
    state: () => ({
        menuList: ref([] as Array<{ date: String, talk: Array<{ id: String, title: String }> }>), // 存储动态路由配置
        pageKey: 0,
        userInfo: {
            userId: '',
            userName: '',
            userEmail: '',
            userPermissionLevel: ''
        },
    }),
    actions: {
        async getMenuList() {
            // const data = {
            //     page: 1,
            //     page_size: 100
            // }
            // const res = await historyGetList(data)
            // 模拟接口返回的假数据
            const mockResponse = {
                status_code: '200',
                message: {
                    list: [
                        {
                            date: 'today',
                            talk: [
                                {
                                    id: '123456',
                                    title: 'Today Talk 1',
                                    update_time: '2025-06-03 10:28:30'
                                },
                                {
                                    id: '654321',
                                    title: 'Today Talk 2',
                                    update_time: '2025-06-03 09:30:15'
                                }
                            ]
                        },
                        {
                            date: 'yesterday',
                            talk: [
                                {
                                    id: '789012',
                                    title: 'Yesterday Talk 1',
                                    update_time: '2025-06-02 10:28:30'
                                },
                                {
                                    id: '210987',
                                    title: 'Yesterday Talk 2',
                                    update_time: '2025-06-02 09:30:15'
                                }
                            ]
                        },
                        {
                            date: 'week',
                            talk: [
                                {
                                    id: '345678',
                                    title: 'Week Talk 1',
                                    update_time: '2025-06-01 10:28:30'
                                },
                                {
                                    id: '876543',
                                    title: 'Week Talk 2',
                                    update_time: '2025-06-01 09:30:15'
                                }
                            ]
                        },
                        {
                            date: 'month',
                            talk: [
                                {
                                    id: '901234',
                                    title: 'Month Talk 1',
                                    update_time: '2025-06-01 10:28:30'
                                },
                                {
                                    id: '432109',
                                    title: 'Month Talk 2',
                                    update_time: '2025-06-01 09:30:15'
                                }
                            ]
                        }
                    ],
                    total_count: 54,
                    page: 1,
                    page_size: 20
                }
            }
            this.menuList = mockResponse.message.list
            // if (res.data.status_code == '200') {
            //     this.menuList = res.data.message.list
            // }
        },

        // async getUserInfo(){
        //     const res = await getUserInfo()
        //     if(res.data.status_code == '200'){
        //         this.userInfo = res.data.message[0]
        //     }
        // }
    }
})

