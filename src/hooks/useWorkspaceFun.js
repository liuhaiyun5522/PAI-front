import { ElMessage, ElMessageBox,ElNotification ,ElProgress,ElLoading  } from 'element-plus'
import {useI18n} from "vue-i18n";
import {useRouter, useRoute} from 'vue-router';
import {reactive, ref, h} from 'vue'
import useStore from "@/store";
import {getCompanyOrg} from '@/api'

//工作库公共方法
export function useWorkspaceFun () {

  const $router = useRouter ()
  //跳转到工作库详情页
  function useGoWorkspaceDetail (id,type) {
    $router.push ({
      path: '/workspaceDetail',
      query:{
        id:id, //工作库id
        type:type //工作库类型
      }
    })
  }
  const { useWorkspace } = useStore()
  //获取组织架构
  const treeProps = {
    label: 'name',
    // children: 'zones',
    // isLeaf: 'leaf',
  }
//获取组织架构
  function getOrganization () {
    return new Promise(async (resolve, reject) => {
      if(useWorkspace.deptData.length==0){
        //调用接口
        const res = await getCompanyOrg()
        if(res.data.success == '200'){
          useWorkspace.deptData = res.data.message
        }
      }
      resolve(useWorkspace.deptData)
    });

  }
  
  return { useGoWorkspaceDetail,treeProps,getOrganization}
}
