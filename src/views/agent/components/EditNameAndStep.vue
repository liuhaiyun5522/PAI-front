<template>
  <el-dialog
      v-if="agentInfo"
      v-model="visible"
      width="80%"
      class="dialog-style dialog-agent "
      :close-on-click-modal="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="el-dialog__title">
        <template v-if="type=='0'">
          {{ t('agentObj.create')}}
        </template>
        <template v-else>
          {{ agentName }}
          <span class="dialog-agent-type">
            {{ t ('agentObj.userCreate', {user: agentInfo.agent_type == 'work' ? 'CBRE.ai' : agentInfo.owner_user}) }}
          </span>
        </template>

      </div>
    </template>
    <div class="dialog-agent-container" v-loading="loading">
      <el-row :gutter="20" type="flex" style="width: 100%;">
        <el-col :span="11" style="display:flex;flex-direction: column;">
          <el-form :rules="rules" ref="formEl" label-position="right" :model="agentInfo" label-width="140" size="large">
            <el-form-item  prop="agent_name">
              <template #label>
                <div class="dialog-agent-title">{{ t('agentObj.agentName') }}</div>
              </template>
              <el-input type="textarea" v-model="agentInfo.agent_name" :autosize="{ minRows: 2 }">
              </el-input>
            </el-form-item>
            <el-form-item prop="agent_memo" >
              <template #label>
                <div class="dialog-agent-title">{{ t('agentObj.agentDesc') }}</div>
              </template>
              <el-input type="textarea" v-model="agentInfo.agent_memo" :autosize="{ minRows: 10 }"></el-input>
            </el-form-item>

          </el-form>

        </el-col>
        <el-col :span="13" >
          <div class="dialog-agent-box" style="display: flex;flex-direction: column;height:calc(100% - 22px)">
            <div class="dialog-agent-title">{{ t('agentObj.agentStep') }}</div>
            <div class="dialog-agent-bg agent-step edit" style="flex: 1;overflow-y: auto;">
              <div class="agent-step-box" v-for="(item,index) in agentInfo.agent_step_list">
                <span class="agent-step-title">{{index+1}}</span>
                <el-input class="agent-step-input" v-model="agentInfo.agent_step_list[index]"></el-input>
                <div>
                  <el-button @click="addStep(index)">
                    <IconAdd #icon color="#80BBAD"  style="width: 13px;height: 13px;"></IconAdd>
                  </el-button>
                  <el-button @click="removeStep(index)" v-if="agentInfo.agent_step_list.length>1">
                    <IconMinus #icon color="#80BBAD"  style="width: 13px;height: 13px"></IconMinus>
                  </el-button>
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
        <el-button type="primary" @click="handleConfirm" >
          {{ t ('confirm2') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, defineExpose, defineProps, defineEmits, computed, reactive, nextTick} from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import IconRun from '@/assets/agent/icon-run.svg'
import IconAdd from '@/assets/icon-add.svg'
import IconMinus from '@/assets/icon-minus.svg'
import {getAgentDetailApi, getAgentStepApi} from "@/api/agent/index.ts";
const visible = ref (false)
const agentId = ref ()
const agentInfo = ref ({})
const rules = reactive ({

  agent_name: [
    {
      required: true,
      message: t ('required'),
      trigger: ['blur','target']
    }
  ],
})
const type = ref()
const loading = ref (false)
//flag 0 新建 / 1 编辑
function init (id,flag) {
  console.log(id);
  //打开弹窗
  visible.value = true
  type.value = flag
  if(id){
    agentId.value = id
    nextTick(async ()=>{
      loading.value = true
      await getAgentInfo ()
      await getAgentStep()
      loading.value = false
    })

  }else {
    agentInfo.value.agent_name=''
    agentInfo.value.agent_memo=''
    agentInfo.value.agent_step_list=['']
  }
}
const agentName = ref('')
//获取agent基本信息
async function getAgentInfo () {
  const res =await getAgentDetailApi({agent_id:agentId.value})
  agentName.value = res.data.message.agent_name
  agentInfo.value = {
    ...agentInfo.value,
    ...res.data.message
  }
}
//获取agent步骤
async function getAgentStep(){
  const res = await getAgentStepApi({agent_id:agentId.value})
  agentInfo.value = {
    ...agentInfo.value,
    ...{
      agent_step_list:res.data.message
    }
  }
}
//step 新增
function addStep(index){
  agentInfo.value.agent_step_list.splice(index+1,0,'')
  nextTick(()=>{
    document.querySelectorAll(".agent-step-input .el-input__inner")[index+1].focus()
  })
}
//step 删除
function removeStep(index){
  agentInfo.value.agent_step_list.splice(index,1)
}
const emit = defineEmits(['confirm'])
function handleConfirm(){
  visible.value = false
  emit ('confirm',agentInfo.value)
}

defineExpose ({init})
</script>

<style lang="scss" scoped>
@import './../../../style/components/agent.scss';
</style>
