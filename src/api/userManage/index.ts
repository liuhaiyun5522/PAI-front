import request from '@/utils/request'
//获取用户列表
export const getuserList = (data:any)=>request.get<any>('/admin/users',{params:data})


