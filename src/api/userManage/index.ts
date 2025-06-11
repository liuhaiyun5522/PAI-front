import request11451 from '@/utils/request11451'
//获取用户列表
export const getuserList = (data:any)=>request11451.get<any>('/admin/users',{params:data})

//创建用户
export const createuser = (data:any)=>request11451.post<any>('/admin/users/create',data)

//删除用户
export const deleteuser = (userId: string | number) => 
    request11451.delete<any>(`/admin/users/${userId}`)

//修改用户权限
export const editeuserpermission = (userId: string | number,data:any) => 
    request11451.put<any>(`/admin/users/${userId}/permission`,data)


