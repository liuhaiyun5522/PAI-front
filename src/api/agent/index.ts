import request from '@/utils/request'
//获取agent列表
export const getAgentListApi = (data:any)=>request.get<any>('/agent/get_agent_list',{params:data})
//获取agent详情
export const getAgentDetailApi = (data:any)=>request.get<any>('/agent/get_agent_info',{params:data})
//获取agent的检索条件
export const getAgentStepApi = (data:any)=>request.get<any>('/agent/get_agent_step_list',{params:data})
//获取agent的检索源
export const getAgentSourceApi = (data:any)=>request.get<any>('/agent/get_agent_source_list',{params:data})
//储存agent 检索条件
export const saveAgentChatApi = (data:any)=>request.post<any>('/agent/save_agent_chat_info',data)
//获取agent检索条件
export const getAgentChatApi = (data:any)=>request.get<any>('/agent/get_agent_chat_info',{params:data})
//删除agent
export const deleteAgentApi = (data:any)=>request.post<any>('/agent/update_agent_to_delete',data)
//agent新建/更新
export const saveAgentApi = (data:any)=>request.post<any>('/agent/save_my_agent',data)
