import request11451 from '@/utils/request11451'

export interface loginForm {
    userid:string
    password:string
  }
  export interface loginResultData{
    code:any,
    data:any
  }
  
//登录
export const login = (data:loginForm)=>request11451.post<any,loginForm>('/user/login',data)

//用户登出
export const logout = ()=>request11451.post<any,loginResultData>('/user/logout')

//获取用户信息，token验证
export const profile = ()=>request11451.get<any,loginResultData>('/user/profile')


