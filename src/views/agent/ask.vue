<template>
  <div class="ask chat-container" >
    <div class="ask-title">
      {{ agentInfo.agent_name }}
    </div>
    <div style="text-align: center;">
      <span class="ask-type">
          {{ t ('agentObj.userCreate', {user: agentInfo.agent_type == 'work' ? 'CBRE.ai' : agentInfo.owner_user}) }}
      </span>
    </div>
    <div>
      <div class="chat-input">
        <el-input v-model="useAgent.inputMessage" :placeholder="t('agentObj.placeholder')"
                  type="textarea" class="autoresize-textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                  @keydown.ctrl.enter="handleSend" v-focus>
        </el-input>
        <div class="chat-input-bottom">
            <el-tooltip class="item" effect="light" placement="top" popper-class="ask-tooltip">
              <template #content> <div v-html="t('agentObj.aiTip')"></div> </template>
              <div>
                <IconStar style="vertical-align: -6px;margin-right: 6px;"></IconStar>
                <el-select class="chat-select" v-model="llm_name" style="width: 190px;">
                  <el-option
                      v-for="item in aiVersion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </div>

            </el-tooltip>
          <div class="chat-input-button">
            <el-tooltip class="item" effect="light" content="送信（Ctrl+Enter）" placement="top">
              <el-button :icon="IconSend" type="primary" @click="handleSend">
                {{ t ('send') }}
              </el-button>
            </el-tooltip>
          </div>
        </div>

      </div>
      <div class="edit-item-tip" style="text-align: center;">
        次の検索手順を使用して企業の各次元情報を体系的に取得し、深度分析レポートの作成をサポートします。
      </div>
    </div>
    <EditStep ref="editStepRef" @confirm="editStepConfirm"></EditStep>
    <EditSource ref="editSourceRef" @confirm="editSourceConfirm"></EditSource>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";

const {t} = useI18n ()
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from "vue-router";
const $router = useRouter ()
const $route = useRoute ()
//导入组件
import EditStep from './components/EditStep.vue'
import EditSource from './components/EditSource.vue'
//导入图片
import IconSend from '@/assets/icon-send.svg'
import IconStar from '@/assets/agent/icon-star.svg'
import {ElLoading, ElMessage} from "element-plus";
//导入接口
import {getAgentDetailApi,saveAgentChatApi} from "../../api/agent/index.ts";
import useStore from '@/store'
const {useAgent} = useStore ()
/*获取agent信息 start*/
const id = $route.query.id
const agentInfo = ref({})
async function getAgentInfo () {
  const res =await getAgentDetailApi({agent_id:id})
  agentInfo.value = res.data.message
}
getAgentInfo()
/*获取agent信息 end*/
//自定义指令，输入框自动获取焦点
const vFocus = {
  mounted: (el) => {
    el.querySelector (".el-textarea__inner").focus ()
  }
}

/*发送输入框内容 start*/
const editStepRef = ref ()
function handleSend () {
  if (useAgent.inputMessage.trim () != '') {
    editStepRef.value.init (id,agentInfo.value.agent_type,agentInfo.value.agent_name)
  } else {
    ElMessage ({
      message: t ("inputTip"),
      type: 'warning',
    })
  }
}
/*发送输入框内容 start*/

/*调整步骤和检索源 start*/
const searchInfo = ref({})
const editSourceRef = ref ()
//调整步骤点击确定
function editStepConfirm (val) {
  searchInfo.value.agent_step_list = val
  editSourceRef.value.init(id,agentInfo.value.agent_type,agentInfo.value.agent_name)
}
//调整检索源点击确定
async function editSourceConfirm(urlList,spaceList){
  ElLoading.service ({
    target: document.querySelector ('.ask'),
    fullscreen: false
  })
  searchInfo.value.internet_source_list = urlList
  searchInfo.value.space_source_list = spaceList
  const res =await saveAgentChatApi({
    agent_id:id,
    agent_chat:useAgent.inputMessage,//输入框内容
    llm_name: llm_name.value,//AI版本
    ...searchInfo.value //检索源和检索步骤
  })
  if(res.data.status_code == '200'){
    //连接状态初始化
    useAgent.resetConnection ()
    // //调用保存接口
    $router.push ({
      path:'/agent/chat',
      query:{
        id:res.data.message
      }
    })
  }

}

onMounted (() => {
  useAgent.inputMessage = ""
  useAgent.answer = {
    content: "",
    logs: [],
    urlList: []
  }
})
const llm_name = ref('bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0')
import {aiVersion} from '@/utils/index.ts'

</script>

<style lang="scss" scoped>
@import './../../style/components/agent.scss';
@import './../../style/components/chat.scss';
</style>
