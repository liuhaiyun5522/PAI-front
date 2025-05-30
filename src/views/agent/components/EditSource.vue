<template>
  <el-dialog
      v-model="visible"
      width="85%"
      class="dialog-style dialog-agent "
      :close-on-click-modal="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="el-dialog__title">
        <template v-if="!agentId">
          {{ t ('agentObj.create') }}
        </template>
        <template v-else>
          {{ agentName }}
        </template>
      </div>
    </template>
    <div v-loading="loading">
      <div class="dialog-agent-title">{{ t ('agentObj.searchSource') }}</div>
      <el-row :gutter="20" type="flex" style="width: 100%;">
        <!--   左侧展示      -->
        <el-col :span="12">
          <div class="dialog-agent-box" style="display: flex;flex-direction: column;height: 100%;">
            <div class="dialog-agent-bg agent-source" style="flex: 1;overflow-y: auto;">
              <div>{{ t ('agentObj.selectSource') }}</div>
              <!--     url 检索源         -->
              <div class="agent-source-bg urlSource" v-if="urlList.length>0" style="flex: 0.3">
                <img :src="close" @click="urlList=[]" class="agent-source-close" alt="">
                <div class="agent-source-container">
                  <div class="agent-source-title">{{ t ('agentObj.urlSearch') }}</div>
                  <div class="agent-source-box">
                    <div v-for="item in urlList" class="flex-align-center">
                      <div class="urlSource-item" style="flex: 1">
                        <span v-if="item=='all'">{{ t ('agentObj.allSearch') }}</span>
                        <span v-else>{{ item }}</span>
                      </div>
                      <el-icon v-if="item!='all'" class="dialog-agent-close" @click="handleRemoveUrl"
                               style="margin-bottom: 10px;">
                        <CircleClose/>
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
              <!--       workspace 检索源       -->
              <div class="agent-source-bg" v-if="spaceCheckedList.length>0" style="flex: 0.7">
                <img :src="close" @click="spaceList=[]" class="agent-source-close" alt="">
                <div class="agent-source-container">
                  <div class="agent-source-title">WorkSpace</div>
                  <div class="agent-source-box">
                    <template v-for="(item,index) in spaceList">
                      <div class="workspace-item" :type="item.id" v-if="item.children&&item.children.length>0">
                        <div>
                          <template v-if="item.id == '0'">{{ t ('workspace.mySpace') }}</template>
                          <template v-else-if="item.id == '1'">{{ t ('workspace.sharedSpace') }}</template>
                          <template v-else-if="item.id == '2'">{{ t ('workspace.divisionSpace') }}</template>
                        </div>
                        <span class="workspace-item-name " v-for="sItem in item.children">
                          {{ sItem.label }}
                          <el-icon class="dialog-agent-close" @click="handleRemoveSpace(index,sItem.id)"
                                   style="vertical-align: -3px;"><CircleClose/></el-icon></span>
                      </div>
                    </template>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!--    右侧操作    -->
        <el-col :span="12">
          <div class="dialog-agent-bg select">
            <div class="select-tag">
              <span v-for="(item,index) in tagList"
                    :class="['select-tag-item',{'active':activeTag==index,'select':item.select}]"
                    @click="handleTagClick(index)">
                <IconInternet v-if="item.type==1"></IconInternet>
                <IconFile v-else-if="item.type==3"></IconFile>
                {{ item.name }}
              </span>
            </div>
            <!--       Internet検索         -->
            <div v-if="activeTag == 0" class="select-content">
              <div class="agent-source-tip">{{ t ('agentObj.urlTip') }}</div>
              <div class="agent-source-container">
                <div class="agent-source-title">{{ t ('agentObj.urlSearch') }}</div>
                <div class="agent-source-box">
                  <el-input type="textarea" :rows="8" v-model="urlInput"></el-input>
                  <div style="text-align: right;margin-top: 10px;">
                    <el-button type="primary" @click="handleUrlConfirm">提 出</el-button>
                  </div>
                </div>
              </div>
            </div>
            <!--       workspace检索        -->
            <div v-if="activeTag == 1" class="select-content">
              <div class="permission-content">
                <el-tree
                    :data="spaceTree"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    @check-change="handleCheckChange"
                    ref="treeRef"
                >
                  <template #default="{ node, data }">

                    <div class="permission-item">
                      <span>{{ node.label }}</span>

                    </div>
                  </template>
                </el-tree>
                <div style="text-align: right;margin-top: 10px;">
                  <el-button type="primary" @click="handleSpaceConfirm">提 出</el-button>
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
        <el-button type="primary" @click="handleConfirm">
          {{ t ('confirm2') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, defineExpose, watch, defineEmits, computed, reactive, nextTick, onMounted} from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import IconInternet from '@/assets/agent/icon-internet.svg'
import IconFile from '@/assets/agent/icon-file.svg'
import close from '@/assets/agent/close.png'
import {getWorkspaceTree} from "@/api/workspace/index.ts";
import {getAgentSourceApi} from "@/api/agent/index.ts";
import {formatObj} from "@/utils/index.ts";
import {ElMessage} from "element-plus";
const emit = defineEmits (['confirm'])



/*弹窗初始化 start */
const type = ref ()
const urlList = ref ([])
const spaceList = ref ([])
const spaceCheckedList = ref ([])
const spaceSelectTree = ref ([])
const visible = ref (false)
const agentName = ref ('')
const agentId = ref ('')
const loading = ref(false)
function init (id, agent_type,name) {
  //打开弹窗
  visible.value = true
  type.value = agent_type
  agentId.value = id
  agentName.value = name
  if (id) {
    getAgentSource (id)
  } else {
    urlList.value = []
    spaceList.value = []
    spaceCheckedList.value = []
    spaceSelectTree.value = []
  }
}
//获取检索源
async function getAgentSource (id) {
  loading.value = true
  const res = await getAgentSourceApi ({agent_id: id})
  const data = res.data.message
  urlList.value = data.internet_source_list
  spaceList.value = data.space_source_list
  loading.value = false
}
/*弹窗初始化 end */

/*检索源 操作 start*/
//检索源类型
const tagList = ref ([
  {
    type: 1,
    name: t ('agentObj.urlSearch'),
    select: false,
  },
  {
    type: 3,
    name: 'WorkSpace',
    select: false,
  }
])
const activeTag = ref (0);
//切换检索源展示
function handleTagClick (index) {
  activeTag.value = index;
  if (index == 1) {
    getWorkspaceList ()
  }
}
//space列表
const spaceTree = ref ([])
async function getWorkspaceList () {
  const res = await getWorkspaceTree ()
  spaceTree.value = res.data.message
}

//监听网络检索url列表
watch (() => urlList, async (newVal) => {
  if (newVal.value.length > 0) {
    tagList.value[0].select = true
  } else {
    tagList.value[0].select = false
  }
}, {deep: true, immediate: true})
//监听space检索列表
watch (() => spaceList, async (newVal) => {
  spaceCheckedList.value = extractNestedIds (spaceList.value)
  if (spaceCheckedList.value.length > 0) {
    tagList.value[1].select = true
  } else {
    tagList.value[1].select = false
  }
}, {deep: true, immediate: true})

function extractNestedIds (data) {
  return data.reduce ((acc, curr) => {
    // 收集当前层级的ID
    if (curr.id && curr.space_type != '') acc.push (curr.id);
    // 递归处理子层级
    if (curr.children?.length) {
      acc.push (...extractNestedIds (curr.children));
    }
    return acc;
  }, []);
};

//组织树点击多选框
function handleCheckChange (node, checked, isLeaf) {
  if (node.space_type != '') {
    const index = spaceSelectTree.value.findIndex (item => item.id === node.id)
    if (checked) {
      spaceSelectTree.value.push (node)
    } else {
      spaceSelectTree.value.splice (index, 1)
    }
  }
}

//移除space
function handleRemoveSpace (sIndex, spaceId) {
  const index = spaceList.value[sIndex].children.findIndex (item => item.id === spaceId)
  if (index > -1) {
    spaceList.value[sIndex].children.splice (index, 1)
  }
}

//workspace 点击确认
const treeRef = ref ();
function handleSpaceConfirm () {
  //todo 暂时增加只能选一个space的设定
  if(spaceSelectTree.value.length>1){
    ElMessage ({
      message: 'workspaceは1つしか選択できません',
      type: 'warning',
    })
  }else {
    //循环选中列表，重构树形结构
    spaceSelectTree.value.forEach ((sItem) => {
      let tIndex = spaceList.value.findIndex (item => item.id === sItem.space_type)
      if (tIndex == -1) {
        spaceList.value.push ({
          id: sItem.space_type,
          space_type: '',
          children: []
        })
        tIndex = spaceList.value.length - 1
      }
      const index = spaceList.value[tIndex].children.findIndex (item => item.id === sItem.id)
      if (index == -1) {
        spaceList.value[tIndex].children.push (sItem)
      }
    })
    //  清空选中
    if (treeRef.value) {
      treeRef.value.setCheckedKeys ([]);
    }
  }

}

//url输入框
const urlInput = ref ('')
function handleUrlConfirm () {

  if (urlList.value.length > 0) {
    if (urlInput.value.trim () == '') {
      ElMessage ({
        message: t ("inputTip"),
        type: 'warning',
      })
      return false;
    }
    if (urlList.value[0] == 'all') {
      urlList.value.splice (0, 1)
    }
  } else {
    if (urlInput.value.trim () == '') {
      urlList.value.push ('all')
      return false;
    }
  }
  urlList.value.push (urlInput.value)
  urlInput.value = ''
}

//移除url
function handleRemoveUrl (index) {
  urlList.value.splice (index, 1)
}
//点击确定，必须选择一个检索源
function handleConfirm () {
  if (urlList.value.length == 0 && spaceList.value.length == 0) {
    ElMessage ({
      message: t ('agentObj.selectSourceTip'),
      type: 'warning',
    })
  } else {
    //todo 暂时增加只能选一个space的设定
    if(spaceCheckedList.value.length>1){
      ElMessage ({
        message: 'workspaceは1つしか選択できません',
        type: 'warning',
      })
    }else {
      visible.value = false
      emit ('confirm', urlList.value, spaceCheckedList.value)
    }
  }
}

defineExpose ({init})
</script>

<style lang="scss" scoped>
@import './../../../style/components/workspace.scss';
@import './../../../style/components/agent.scss';
</style>
