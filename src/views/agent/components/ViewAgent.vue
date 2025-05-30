<template>
  <el-dialog
      v-if="agentInfo"
      v-model="visible"
      width="85%"
      class="dialog-style dialog-agent"
      :close-on-click-modal="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="el-dialog__title">
        {{ agentInfo.agent_name }}
        <span class="dialog-agent-type">
          {{ t ('agentObj.userCreate', {user: agentInfo.agent_type == 'work' ? 'CBRE.ai' : agentInfo.owner_user}) }}
        </span>
      </div>
    </template>
    <div class="dialog-agent-container" v-loading="loading">
      <el-row :gutter="20" type="flex" style="width: 100%;">
        <el-col :span="12" style="display:flex;flex-direction: column;">
          <div class="dialog-agent-box">
            <div class="dialog-agent-title">説明</div>
            <div class="dialog-agent-bg agent-memo">
              {{ agentInfo.agent_memo }}
            </div>
          </div>
          <div class="dialog-agent-box" style="flex: 1;display: flex;flex-direction: column;margin-bottom: 0;">
            <div class="dialog-agent-title">{{ t('agentObj.step') }}</div>
            <div class="dialog-agent-bg agent-step">
              <div class="agent-step-box" v-for="(item,index) in agentInfo.agent_step_list">
                <span class="agent-step-title">{{index+1}}</span>
                <span class="agent-step-content">{{item}}</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="12" >
          <div class="dialog-agent-box" style="display: flex;flex-direction: column;height: 100%;">
            <div class="dialog-agent-title">{{ t('agentObj.searchSource') }}</div>
            <div class="dialog-agent-bg agent-source" style="flex: 1;overflow-y: auto;">
              <div>{{t('agentObj.selectSource')}}</div>
              <!--     url 检索源         -->
              <div class="agent-source-bg urlSource" v-if="agentInfo.internet_source_list&&agentInfo.internet_source_list.length>0" style="flex: 0.3">
                <div class="agent-source-tip">{{t('agentObj.noSpecifiedUrl')}}</div>
                <div class="agent-source-container" >
                  <div class="agent-source-title">{{t('agentObj.urlSearch')}}</div>
                  <div class="agent-source-box">
                    <div class="urlSource-item" v-for="item in agentInfo.internet_source_list">
                      <span v-if="item=='all'">{{ t ('agentObj.allSearch') }}</span>
                      <span v-else>{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!--       workspace 检索源       -->
              <div class="agent-source-bg" v-if="agentInfo.space_source_list&&agentInfo.space_source_list.length>0" style="flex: 0.7">
                <div class="agent-source-container" >
                  <div class="agent-source-title">WorkSpace</div>
                  <div class="agent-source-box">
                    <template v-for="item in agentInfo.space_source_list" >
                      <div class="workspace-item" :type="item.id" v-if="item.children&&item.children.length>0">
                        <div>
                          <template v-if="item.id == '0'">{{ t ('workspace.mySpace') }}</template>
                          <template v-else-if="item.id == '1'">{{ t ('workspace.sharedSpace') }}</template>
                          <template v-else-if="item.id == '2'">{{ t ('workspace.divisionSpace') }}</template>
                        </div>
                        <span class="workspace-item-name" v-for="sItem in item.children">{{ sItem.label }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="visible=false">{{ $t ('cancel') }}</el-button>
<!--        <el-button type="primary" @click="handleConfirm" >-->
<!--          {{ t ('agentObj.application') }}-->
<!--        </el-button>-->
        <el-button type="primary" @click="handleEdit">{{ $t ('edit') }}</el-button>
<!--        <el-button type="primary" @click="handleRun" :icon="IconRun">-->
<!--          {{ t ('agentObj.run') }}-->
<!--        </el-button>-->
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, defineExpose,defineEmits,nextTick} from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import IconRun from '@/assets/agent/icon-run.svg'
import {getAgentDetailApi, getAgentSourceApi, getAgentStepApi} from "../../../api/agent/index.ts";

const visible = ref (false)
const agentId = ref ()
const agentInfo = ref (null)
const loading = ref(false)
function init (id) {
  //打开弹窗
  visible.value = true
  agentId.value = id
  nextTick(async ()=>{
    loading.value = true
    await getAgentInfo ()
    await getAgentStep()
    await getAgentSource()
    loading.value = false
  })

}
async function getAgentInfo () {
  const res =await getAgentDetailApi({agent_id:agentId.value})
  agentInfo.value = {
    ...agentInfo.value,
    ...res.data.message
  }
}
async function getAgentStep(){
  const res = await getAgentStepApi({agent_id:agentId.value})
  agentInfo.value = {
    ...agentInfo.value,
    ...{
      agent_step_list:res.data.message
    }
  }
}
async function getAgentSource(){
  const res = await getAgentSourceApi({agent_id:agentId.value})
  agentInfo.value = {
    ...agentInfo.value,
    ...res.data.message
  }
}
const emit = defineEmits(['editFun'])
function handleRun(){

}
function handleEdit(){
  visible.value = false
  emit('editFun',agentId.value)
}

defineExpose ({init})
</script>

<style lang="scss" scoped>
@import './../../../style/components/agent.scss';
</style>
