import request from '@/utils/request'
// 新建workspace
export const addWorkspace = (data:any)=>request.post<any>('/my_space/add_work_space',data)
//上传workspace文件
export const uploadSpaceFiles = (data:any)=>request.post<any>('/my_space/upload_files',data)
//获取workspace列表
export const getWorkspaceList = (data:any)=>request.get<any>('/my_space/get_user_work_space_list',{params:data})
//workspace权限人员列表
export const getWorkspaceUserList = (data:any)=>request.get<any>('/my_space/get_user_permission_list',{params:data})
//workspace中文件列表
export const getWorkspaceDetail = (data:any)=>request.post<any>('/my_files/get_user_work_files_list',data)
//检查文件是否存在
export const checkFileExist = (data:any)=>request.post<any>('/my_files/check_exist_files',data)
//获取space详情信息
export const getSpaceDetail = (data:any)=>request.get<any>('/my_space/get_work_space_info',{params:data})
//获取workspace树形结构
export const getWorkspaceTree = ()=>request.get<any>('/my_space/get_work_space_tree')
//删除workspace
export const deleteWorkspace = (data:any)=>request.post<any>('/my_space/delete_work_space',data)
//workspace重命名
export const renameWorkspace = (data:any)=>request.post<any>('/my_space/rename_work_space',data)
