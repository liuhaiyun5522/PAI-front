import request from '@/utils/request'
//获取缓存列表
export const getCacheList = (data:any)=>request.post<any>('/sys_admin/get_cache_list',data)
//删除缓存
export const deleteCache = (data:any)=>request.post<any>('/sys_admin/delete_cache_list',data)
//新增缓存
export const addCache = (data:any)=>request.post<any>('/sys_admin/add_cache_list',data)
//查看详情
export const getCacheDetail = (data:any)=>request.post<any>('/sys_admin/edit_cache_group',data)
//更新缓存
export const updateCache = (data:any)=>request.post<any>('/sys_admin/update_cache_list',data)
