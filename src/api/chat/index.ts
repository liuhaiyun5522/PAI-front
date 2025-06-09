import request8009 from '@/utils/request8009'
import type {get_file} from './type'

//文件对话上传文件接口
export const fileUpload = (data:get_file)=>request8009.post<any>('/file_chat/upload',data, {timeout: 999999999,})

//历史记录
export const historyGetList = ()=>request8009.post<any>('/history/get_list')

//存储历史记录
export const historySaveList = (data:any)=>request8009.post<any>('/history/insert_qa',data)

//根据id获取历史记录
export const getHistoryMessage = (data:any)=>request8009.post<any>('/history/get_json',data)

//根据id删除历史记录
export const deleteHistory = (data:any)=>request8009.post<any>('/history/delete',data)

//根据对话重命名
export const updateTitle = (data:any)=>request8009.post<any>('/history/update_title',data)

//获取知识库列表
export const getKnowledgeList = ()=>request8009.post<any>('/knowledge/get_list')

//加载知识库内容
export const selectKnowledge = (data:any)=>request8009.post<any>('/knowledge/select_knowledge',data)

//点赞/点踩
export const handleThumbsUp = (data:any)=>request8009.post<any>('dialog/thumbs_up',data)


