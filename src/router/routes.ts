import Layout from '@/layout/index.vue'

// 对外暴露配置路由（常量路由）
// @ts-ignore
export const constantRoute = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login'
},
  {
    path: "",
    component: Layout,
    name: 'Layout',
    children: [
      // {
      //   path: "", // 空路径
      //   name: "defaultPage",
      //   redirect: { name: 'dialog' } // 命名路由跳转（无URL变化）
      // },

      {
        path: "/dialog",
        name: "dialog",
        component: () => import('@/views/dialog/index.vue'),
      },
      //用户管理页面
      {
        path: "/userManagement",
        name: "userManagement",
        component: () => import('@/views/userManagement/index.vue'),
      },
      //知识库管理页面
      {
        path: "/knowledgebaseManagement",
        name: "knowledgebaseManagement",
        component: () => import('@/views/knowledgebaseManagement/index.vue'),
      },
      {
        path: "/knowledgebaseManagement/base",
        name: "BasefileManagement",
        component: () => import('@/views/knowledgebaseManagement/base.vue'),
      },
      
      //历史记录页面
      {
        path: "/history",
        name: "history",
        component: () => import('@/views/history/index.vue'),
      },
      //agent
      {
        path:"/agent",
        name:"agent",
        component:() => import('@/views/agent/index.vue')
      },//agent
      {
        path:"/agent/ask",
        name:"agentAsk",
        component:() => import('@/views/agent/ask.vue')
      },
      {
        path:"/agent/chat",
        name:"agentChat",
        component:() => import('@/views/agent/chat.vue')
      }
    ]
  },
  {
    // 任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any'
  }
]
