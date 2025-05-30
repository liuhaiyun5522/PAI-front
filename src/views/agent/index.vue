<template>
  <div class="chat-container">
    <div class="agent">
      <div class="agent-tab container">
      <span :class="['agent-tab-item',{'active':activePage == item.type}]" v-for="item in tabList"
            @click="goPageHandler(item.type)">{{ item.name }}</span>
        <el-button type="primary" style="float: right;" :icon="Plus" @click="handleAdd">作 成</el-button>
      </div>
      <div class="agent-content" >
        <div class="agent-row" v-if="agentList.length>0">
          <div v-for="(item,index) in agentList" class="agent-box" @click="goAgentPage(item.id,item.agent_type,item.agent_name)">
            <div>
              <div class="agent-top">
                <img class="agent-icon" :src="agentIcon" alt="">
                <span class="agent-title">{{ item.agent_name }}</span>
              </div>
              <div class="agent-desc">{{ item.agent_memo }}</div>
            </div>

            <div class="agent-bottom">
            <span class="agent-time">
              {{t('agentObj.userCreate',{user:item.agent_type == 'work'?'CBRE.ai':item.create})}}
            </span>
              <div class="agent-dropdown">
                <el-dropdown trigger="click" @command="handleOperateCommand($event,item)" popper-class="agent-popper"
                             placement="bottom-start">
                  <span class="agent-dropdown-icon" @click.stop><el-icon color="#778E9C"><MoreFilled/></el-icon></span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item class="agent-popper-item" command="view">
                        <el-icon style="margin-right: 5px"><View /></el-icon>
                        {{ t ("view") }}
                      </el-dropdown-item>
                      <el-dropdown-item class="agent-popper-item" command="edit">
                        <el-icon style="margin-right: 5px"><Edit /></el-icon>
                        {{ t ("edit") }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="item.agent_type=='my'" class="agent-popper-item" command="delete">
                        <IconDelete style="margin-right: 5px"></IconDelete>
                        {{ t ("delete") }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
        <Empty v-else></Empty>
      </div>
      <div class="chat-input" v-if="false">
        <el-input v-model="useAgent.inputMessage" :placeholder="t('agentObj.placeholder')"
                  type="textarea" class="autoresize-textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                  @keydown.ctrl.enter="handleKeydown" v-focus>
        </el-input>
        <div class="chat-input-bottom">
          <div class="chat-input-button">
            <el-tooltip class="item" effect="light" content="送信（Ctrl+Enter）" placement="top">
              <el-button :icon="IconSend" :disabled="!useAgent.isFinish" type="primary" @click="handleSend">
                {{ t ('send') }}
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <ViewAgent ref="viewAgentRef" @editFun="editNameStepRef.init($event,1)"></ViewAgent>
    <EditNameAndStep ref="editNameStepRef" @confirm="handleNameStepConfirm"></EditNameAndStep>
    <EditSource ref="editSourceRef" @confirm="handleSourceConfirm"></EditSource>
    <Delete :dialogVisible="dialogDeleteVisible" @updateVisible="dialogDeleteVisible = $event"
            @deleteConfirm="deleteConfirm"></Delete>
  </div>

</template>

<script setup>
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import { useRouter} from "vue-router";
const $router = useRouter ()
import {ref,onMounted} from 'vue'
import {Plus} from '@element-plus/icons-vue'
//图片引入
import agentIcon from '@/assets/agent/agent1.png'
import IconSend from '@/assets/icon-send.svg'
import IconDelete from '@/assets/icon-delete.svg'
//管理库引入
import useStore from '@/store'
const {useAgent} = useStore()
//组件引入
import ViewAgent from './components/ViewAgent.vue'
import EditNameAndStep from './components/EditNameAndStep.vue'
import EditSource from './components/EditSource.vue'
//api引入
import {getAgentListApi,deleteAgentApi,saveAgentApi} from "@/api/agent/index.ts";

import {ElLoading, ElMessage} from 'element-plus'
/*tab start*/
const tabList = [
  {
    name: 'CBRE Agent',
    type: 'work'
  },
  {
    name: 'My Agent',
    type: 'my'
  }
]
const activePage = ref ('work')
function goPageHandler (type) {
  activePage.value = type
  getAgentList()
}

/*tab end*/

/*获取agent列表 start*/
const agentList = ref ([])
async function getAgentList () {
  const loadingInstance = ElLoading.service ({
    target: document.querySelector ('.agent-content'),
    fullscreen: false
  })
  const res = await getAgentListApi({agent_type: activePage.value})
  if(res.data.status_code == '200'){
    agentList.value = res.data.message
  }
  loadingInstance.close()
}
onMounted(()=>{
  getAgentList ()
})
/*获取agent列表 end*/

/*操作按钮 start*/
const viewAgentRef = ref (null)
const editNameStepRef = ref (null)
const dialogDeleteVisible = ref (false)
const deleteId = ref ()
//点击操作按钮
function handleOperateCommand (command,item) {
  if(command == 'view'){ //查看
    viewAgentRef.value.init(item.id)
  }else if(command == 'edit'){ //编辑
    editNameStepRef.value.init(item.id,1)
  }else if(command=='delete'){ //删除
    dialogDeleteVisible.value = true
    deleteId.value = item.id
  }
}
//新建
function handleAdd(){
  editNameStepRef.value.init(null,0)
}
//删除确认
async function deleteConfirm () {
  const loadingInstance = ElLoading.service ({
    target: document.querySelector ('.agent-content'),
    fullscreen: false
  })
  const res = await deleteAgentApi ({agent_id: deleteId.value,agent_type:'my'})
  dialogDeleteVisible.value = false
  if (res.data.status_code == 200) {
    ElMessage ({
      message: t ('deleteTip2'),
      type: 'success',
    })
    getAgentList()
  }
  loadingInstance.close ()
}
/*操作按钮 end*/

//前往agent提问页
function goAgentPage (id,type,name) {
  $router.push({
    path:'/agent/ask',
    query:{
      id:id
    }
  })
}
//自定义指令，输入框自动获取焦点
const vFocus = {
  mounted: (el) => {
    el.querySelector (".el-textarea__inner").focus ()
  }
}
function handleKeydown(){

}
function handleSend(){

}
const agentInfo = ref (null)
const editSourceRef = ref()
//名称步骤编辑确定
function handleNameStepConfirm(agentNameStep){
  agentInfo.value = {
    ...agentInfo.value,
    ...agentNameStep
  }
  editSourceRef.value.init(agentInfo.value.agent_id,agentInfo.value.agent_type)
}
//检索源编辑确定
async function handleSourceConfirm(urlList,spaceList){
  agentInfo.value = {
    ...agentInfo.value,
    internet_source_list:urlList,
    space_source_list:spaceList
  }
  const res = await saveAgentApi(agentInfo.value)
  if(res.data.status_code == '200'){
    ElMessage ({
      message: t ('updateTip'),
      type: 'success',
    })
  }
  getAgentList()
}
</script>

<style lang="scss" scoped>
@import './../../style/components/agent.scss';
@import './../../style/components/chat.scss';
</style>
