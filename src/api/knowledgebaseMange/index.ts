import request8009 from '@/utils/request8009'
//获取知识库列表
export const getknowledgeList = (data:any)=>request8009.post<any>('/knowledge/get_list',data)

//新建知识库
export const createknowledgeabse = (data:any)=>request8009.post<any>('/knowledge/create_database',data)

//获取知识库文件列表
export const getknowledgeFiles = (data:any)=>request8009.post<any>('/knowledge/get_files',data)

//删除知识库
export const dropknowledgeabse = (data:any)=>request8009.post<any>('/knowledge/drop_database',data)

