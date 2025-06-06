import request from '@/utils/request'
//获取用户列表
export const getuserList = (data:any)=>request.get<any>('/admin/users',{params:data})

//创建用户
export const createuser = (data:any)=>request.post<any>('/admin/users/create',data)

//删除用户
export const deleteuser = (userId: string | number) => 
    request.delete<any>(`/admin/users/${userId}`)

//修改用户权限
export const editeuserpermission = (userId: string | number,data:any) => 
    request.put<any>(`/admin/users/${userId}/permission`,data)


