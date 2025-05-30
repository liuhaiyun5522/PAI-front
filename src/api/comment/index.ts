import request from '@/utils/request'
//获取评论列表
export const getCommentList = (data:any)=>request.post<any>('/sys_admin/get_thumbs_up_list',data)
//导出
export const exportComment = (data:any)=>request.post<any>('/sys_admin/download_thumbs_up_list',data,{ responseType: 'blob'})
//删除
export const deleteComment = (data:any)=>request.post<any>('/sys_admin/delete_thumbs_up_list',data)
//更新评论优化状态
export const updateCommentStatus = (data:any)=>request.post<any>('/sys_admin/update_thumbs_up_status',data)
//单个导出
export const exportCommentOne = (data:any)=>request.post<any>('/sys_admin/download_one_thumbs_up',data,{ responseType: 'blob'})
