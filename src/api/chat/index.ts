import request from '@/utils/request'
import type {get_file} from './type'

//文件对话上传文件接口
export const fileUpload = (data:get_file)=>request.post<any>('/file_chat/upload',data, {timeout: 999999999,})

//历史记录
export const historyGetList = ()=>request.post<any>('/history/get_list')

//存储历史记录
export const historySaveList = (data:any)=>request.post<any>('/history/insert_qa',data)

//根据id获取历史记录
export const getHistoryMessage = (data:any)=>request.post<any>('/history/get_json',data)

//根据id删除历史记录
export const deleteHistory = (data:any)=>request.post<any>('/history/delete',data)

//根据对话重命名
export const updateTitle = (data:any)=>request.post<any>('/history/update_title',data)

//获取知识库列表
export const getKnowledgeList = ()=>request.post<any>('/knowledge/get_list')

//加载知识库内容
export const selectKnowledge = (data:any)=>request.post<any>('/knowledge/select_knowledge',data)

//点赞/点踩
export const handleThumbsUp = (data:any)=>request.post<any>('dialog/thumbs_up',data)


