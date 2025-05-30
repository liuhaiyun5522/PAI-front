<template>
  <div class="database">
    <div class="database-container">
      <div class="database-title">
        <span>/{{ t ('databaseTitle') }}</span>
        <el-button type="primary" size="large" @click="editDatabase(0)">
          <IconFolder style="width: 22px;margin-right: 7px;"></IconFolder>{{ t ('add') }}
        </el-button>
      </div>
      <el-row class="database-content" :gutter="gutter" type="flex">
        <el-col v-for="(item,index) in databaseList" :span="colSpan" :key="index" class="database-col">
          <div class="database-box" :collapse="collapseVal">
            <div class="database-box-top">
              <span class="database-box-icon"><IconFolderClose></IconFolderClose></span>
              <div class="database-box-right">
                <div class="database-box-title">{{ item.name }}</div>
                <div class="database-box-desc">{{ item.desc }}</div>
              </div>
            </div>
            <div class="database-box-bottom">
              <div class="database-box-time">{{ item.updateTime }}{{ t ("update") }}</div>
              <el-dropdown trigger="click" @command="clickDropdown($event,item.id)">
                <el-icon color="#163C32">
                  <MoreFilled/>
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="0" :icon="Delete">{{ t ('delete') }}</el-dropdown-item>
                    <el-dropdown-item command="1" :icon="EditPen">{{ t ('rename') }}</el-dropdown-item>
                    <el-dropdown-item command="2" :icon="Setting">{{ t ('setting') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500"
        class="database-dialog"
        header-class="database-dialog-header"
    >
      <el-form
          label-position="top"
          :model="formData"
          class="database-form"
          :rules="formRules"
          ref="formRef"
      >
        <el-form-item :label="t('formName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('namePlaceholder')"/>
        </el-form-item>
        <el-form-item :label="t('formDesc')" prop="desc">
          <el-input v-model="formData.desc" type="textarea" :rows="4" :placeholder="t('descPlaceholder')"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="clickConfirm(formRef)">
            {{ t ('confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import {FormInstance,FormRules} from 'element-plus'
import {useI18n} from "vue-i18n";

const { t } = useI18n ()
import IconFolder from "@/assets/icon-folder.svg"
import IconFolderClose from "@/assets/icon-folder-close.svg"
import {useRouter} from 'vue-router'

const $router = useRouter ()
//知识库列表
import {Delete, EditPen, Setting} from "@element-plus/icons-vue";

const databaseList = ref ([] as Array<{}>)
databaseList.value = [
  {
    name: 'People',
    id: '1',
    desc: '人事行政に関する資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '2',
    desc: 'プロジェクトに関する情報資料、写真、プロモーションビデオ、内部設計書、外部設計書、テスト仕様書などです',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '3',
    desc: '財政経済関連部門の資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'People',
    id: '1',
    desc: '人事行政に関する資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '2',
    desc: 'プロジェクトに関する情報資料、写真、プロモーションビデオ、内部設計書、外部設計書、テスト仕様書などです',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '3',
    desc: '財政経済関連部門の資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'People',
    id: '1',
    desc: '人事行政に関する資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '2',
    desc: 'プロジェクトに関する情報資料、写真、プロモーションビデオ、内部設計書、外部設計書、テスト仕様書などです',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '3',
    desc: '財政経済関連部門の資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'People',
    id: '1',
    desc: '人事行政に関する資料',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '2',
    desc: 'プロジェクトに関する情報資料、写真、プロモーションビデオ、内部設計書、外部設計書、テスト仕様書などです',
    updateTime: '2025年3月10日 11:00:00'
  },
  {
    name: 'Finance',
    id: '3',
    desc: '財政経済関連部門の資料',
    updateTime: '2025年3月10日 11:00:00'
  }
]

const formRef = ref<FormInstance>()
//知识库表单
interface FormType {
  name?:string,
  desc?:string
}
const formData = reactive<FormType>({
  name: '',
  desc: ''
})
const formRules = reactive<FormRules<FormType>>({
  name:[
    {required:true,trigger:['blur','change']}
  ],
  desc:[
    {required:true,trigger:['blur','change']}
  ]
})
import {filterObj} from '@/utils'

//点击下拉菜单
function clickDropdown (command: string, id: string) {
  if (command == '0') {//删除

  } else if (command == '1') {//重命名
    editDatabase (1, id)
    const obj:FormType = filterObj (databaseList.value, 'id', id)
    formData.name = obj.name;
    formData.desc = obj.desc
  } else if (command == '2') { //设定
    $router.push ({
      name: 'databaseSetting',
      query: {
        id: id
      }
    })
  }
}

//样式设置
const gutter = ref (50)
const colSpan = ref (8)
const collapseVal = ref (false)

function setGutter () {
  const windowWidth = window.innerWidth
  gutter.value = 50
  colSpan.value = 8
  console.log(windowWidth);
  if(windowWidth<768){
    colSpan.value = 24
    gutter.value = 0
  } else if (windowWidth < 1400) {
    gutter.value = 24
    if (!collapseVal.value) {
      colSpan.value = 12
    }
  } else if (windowWidth < 1680) {
    gutter.value = 36
  }
}

onMounted (() => {
  window.addEventListener ('collapseChange', e => {
    collapseVal.value = e.detail.value
    setGutter ()
  });
  window.addEventListener ('resize', setGutter); // 添加事件监听器
  setGutter ()
})
//监听离开页面
onUnmounted (() => {
  window.removeEventListener ('collapseChange', e => {})
  window.removeEventListener ('resize', setGutter); // 移除事件监听器
})

//新建知识库/修改知识库
const dialogVisible = ref (false)
const dialogTitle = ref ('')

function editDatabase (flag: number, id: any) {
  dialogVisible.value = true
  dialogTitle.value = flag == 0 ? t ('addDatabase') : t ('renameDatabase')
}

//弹窗点击确认
async function clickConfirm (formEl:any) {
  if (!formEl) return
  await formEl.validate((valid: boolean, fields: string) => {
    if (valid) {
      //接口调用
      //关闭弹窗
      dialogVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })

}


</script>

<style scoped lang="scss">
@import "@/style/components/database.scss";
</style>
