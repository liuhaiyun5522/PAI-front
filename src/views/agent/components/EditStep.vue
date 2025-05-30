<template>
  <el-dialog
      v-model="visible"
      width="60%"
      class="dialog-style dialog-agent "
      :close-on-click-modal="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="el-dialog__title">
        <template v-if="!agentId">
          {{ t('agentObj.create')}}
        </template>
        <template v-else>
          {{ agentName }}
        </template>
      </div>
    </template>
    <div class="dialog-agent-container" v-loading="loading">
      <el-row :gutter="20" type="flex" style="width: 100%;">
        <el-col :span="24" >
          <div class="dialog-agent-box" style="display: flex;flex-direction: column;">
            <div class="dialog-agent-bg agent-step edit" style="flex: 1;overflow-y: auto;">
              <div class="edit-item-tip" style="margin-bottom: 8px;">{{ t('agentObj.stepTip') }}</div>
              <div class="agent-step-box" v-for="(item,index) in stepList">
                <span class="agent-step-title">{{index+1}}</span>
                <el-input class="agent-step-input" v-model="stepList[index]"></el-input>
                <div>
                  <el-button @click="addStep(index)">
                    <IconAdd #icon color="#80BBAD"  style="width: 13px;height: 13px;"></IconAdd>
                  </el-button>
                  <el-button @click="removeStep(index)" v-if="stepList.length>1">
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
          {{ t ('confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, defineExpose, defineProps, defineEmits, computed, reactive,nextTick} from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import IconRun from '@/assets/agent/icon-run.svg'
import IconAdd from '@/assets/icon-add.svg'
import IconMinus from '@/assets/icon-minus.svg'
import {getAgentStepApi} from "../../../api/agent/index.ts";
import {ElLoading} from "element-plus";
const visible = ref (false)
const agentId = ref ()
const agentName = ref ()
const type = ref()
const loading = ref(false)
function init (id,agent_type,name) {
  //打开弹窗
  visible.value = true
  type.value = agent_type
  agentId.value = id
  agentName.value = name
  getAgentStep(id)
}
const stepList = ref([])

async function getAgentStep(id){
  loading.value = true
  const res = await getAgentStepApi({agent_id:id})
  stepList.value = res.data.message
  loading.value = false
}

//step 新增
function addStep(index){
  stepList.value.splice(index+1,0,'')
  nextTick(()=>{
    document.querySelectorAll(".agent-step-input .el-input__inner")[index+1].focus()
  })

}
//step 删除
function removeStep(index){
  stepList.value.splice(index,1)
}
const emit = defineEmits(['confirm'])
function handleConfirm(){
  visible.value = false
  emit('confirm',stepList.value)
}

defineExpose ({init})
</script>

<style lang="scss" scoped>
@import './../../../style/components/agent.scss';
</style>
