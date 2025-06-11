import request8009 from '@/utils/request8009'
//获取知识库列表
export const getknowledgeList = ()=>request8009.post<any>('/knowledge/get_list')

//新建知识库
export const createknowledgeabse = (data:any)=>request8009.post<any>('/knowledge/create_database',data)

//删除知识库
export const dropknowledgebase = (data:any)=>request8009.post<any>('/knowledge/drop_database',data)

///////base
//获取知识库文件列表
export const getknowledgeFiles = (data:any)=>request8009.post<any>('/knowledge/get_files',data)

//上传知识库文件
export const uploadFiles = (data:any)=>request8009.post<any>('/knowledge/upload_file',data, {timeout: 999999999,})

//删除知识库文件
export const deleteFile = (data:any)=>request8009.post<any>('/knowledge/del_file',data)

//获取文件内容
export const listFile = (data:any)=>request8009.post<any>('/knowledge/file_list',data)

