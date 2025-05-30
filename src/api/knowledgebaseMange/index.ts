import request from '@/utils/request'
//获取知识库列表
export const getknowledgeList = (data:any)=>request.post<any>('/knowledge/get_list',data)

//新建知识库
export const createknowledgeabse = (data:any)=>request.post<any>('/knowledge/create_database',data)

//获取知识库文件列表
export const getknowledgeFiles = (data:any)=>request.post<any>('/knowledge/get_files',data)

//导出
export const exportComment = (data:any)=>request.post<any>('/sys_admin/download_thumbs_up_list',data,{ responseType: 'blob'})
//删除
export const deleteComment = (data:any)=>request.post<any>('/sys_admin/delete_thumbs_up_list',data)
//更新评论优化状态
export const updateCommentStatus = (data:any)=>request.post<any>('/sys_admin/update_thumbs_up_status',data)
//单个导出
export const exportCommentOne = (data:any)=>request.post<any>('/sys_admin/download_one_thumbs_up',data,{ responseType: 'blob'})
