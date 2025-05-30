<template>
  <div class="database">
    <div class="database-container">
      <div class="database-title">
        <span>/{{ t ('databaseTitle') }}/{{ detailForm.name }}</span>
      </div>
      <div class="database-setting-top">
        <div>
          <div class="database-box-top">
            <span class="database-box-icon"><IconFolderClose></IconFolderClose></span>
            <div class="database-box-right">
              <div class="database-box-title">{{ detailForm.name }}</div>
              <div class="database-box-desc">{{ detailForm.desc }}</div>
            </div>
          </div>
          <div class="database-setting-search database-form">
            <el-input v-model="searchName" style="width: 290px;" @keydown.enter="search"
                      :placeholder="t('searchPlaceholder')" clearable @clear="search">
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Search/>
                </el-icon>
              </template>
            </el-input>
            <!--            <el-button @click="search" type="primary" size="large">{{ t ('upload') }}</el-button>-->
          </div>
        </div>
        <div class="database-url">
          <el-form label-position="left" label-width="95px">
            <el-form-item label="URL：">
              <el-input v-for="(item,index) in urlList" v-model="item.url" :placeholder="t('updateUrl')">
                <template #suffix>
                  <el-icon v-if="index == 0" @click.stop="addUrl"
                  size="24px" color="#31705E" style="cursor: pointer;"><CirclePlusFilled /></el-icon>
                  <el-icon v-else @click.stop="removeUrl(index)"
                           size="24px" color="#31705E" style="cursor: pointer;"><RemoveFilled /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('existingUrl')">
              <el-input :disabled="true" v-model="detailForm.url"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">{{t('databaseUpdate')}}</el-button>
              <span class="database-url-warn">{{t('databaseWarn')}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <el-table
          ref="multipleTableRef"
          :data="detailList"
          row-key="id"
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"/>
        <el-table-column type="index" label="#" width="45"/>
        <el-table-column :label="t('formName')" min-width="320">
          <template #default="scope">
            <div @click="goDetail(scope.row.id)" style="cursor: pointer;">
              <img class="database-setting-icon" :src="fileIcons[getFileType(scope.row.name)]" alt="">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" :label="t('uploadTime')" min-width="140" />
        <el-table-column :label="t('operate')">
          <template #default="scope"><el-button size="small" type="danger" plain>{{ t('delete') }}</el-button></template>
        </el-table-column>
      </el-table>
      <div class="database-setting-bottom">
        <div>
          <div class="database-setting-check" v-if="multipleSelection.length>0">
            <el-button-group size="large" class="database-setting-button">
              <el-button type="primary" plain text>
                <span class="database-setting-span">{{multipleSelection.length}}</span>選択しました
              </el-button>
              <el-button type="danger" plain text >
                <el-icon :size="16"><Delete /></el-icon>
                {{t('delete')}}
              </el-button>
              <el-button text @click="clickCancel">
                {{ t('cancel') }}
              </el-button>
            </el-button-group>
          </div>
        </div>
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="total"
            :prev-text="'< '+t('prevPage')"
            :next-text="t('nextPage')+' >'"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import {Delete,Search,CirclePlusFilled,RemoveFilled} from "@element-plus/icons-vue"
import {useRoute,useRouter} from "vue-router";
const $route = useRoute ()
const $router = useRouter ()
const id = $route.query.id
//获取知识库详情
const detailForm = ref ({})
function getDatabaseDetail () {
  detailForm.value = {
    name: 'People',
    desc: '人事行政に関する資料です',
    url:'https://cbre.sharepoint.com/sites/intra-OperationsJP/SitePages/ja/Marunouchi-Office.aspx#%E4%BC%9A%E8%AD%B0%E5%AE%A4'
  }
}
const total = ref(0)
const detailList = ref([])
const currentPage = ref(1)
//获取知识库列表
function getTableList(){
  total.value = 15
  currentPage.value = 1
  detailList.value = [
    {
      name:'01_Work Regulations Full-Time Employee_20241001.pdf',
      time:'2025-02-05 10:22:25',
      id:'1'
    },
    {
      name:'01_正社員就業規則_20241001.docx',
      time:'2025-02-05 10:22:25',
      id:'2'
    },
    {
      name:'02_Work Regulations Contract Employee_20241001.txt',
      time:'2025-02-05 10:22:25',
      id:'3'
    },
    {
      name:'02_契約社員就業規則_20241001.xlsx',
      time:'2025-02-05 10:22:25',
      id:'4'
    },
    {
      name:'03_嘱託就業規則_20200401.ppt',
      time:'2025-02-05 10:22:25',
      id:'5'
    },
    {
      name:'01_Work Regulations Full-Time Employee_20241001.pdf',
      time:'2025-02-05 10:22:25',
      id:'11'
    },
    {
      name:'01_正社員就業規則_20241001.doc',
      time:'2025-02-05 10:22:25',
      id:'22'
    },
    {
      name:'02_Work Regulations Contract Employee_20241001.txt',
      time:'2025-02-05 10:22:25',
      id:'33'
    },
    {
      name:'02_契約社員就業規則_20241001.XLS',
      time:'2025-02-05 10:22:25',
      id:'44'
    },
    {
      name:'03_嘱託就業規則_20200401.ppt',
      time:'2025-02-05 10:22:25',
      id:'55'
    }
  ]
}
//获取知识库基本信息
getDatabaseDetail ()
//获取知识库文件列表
getTableList()

import IconFolderClose from "@/assets/icon-folder-close.svg"
//搜索资料
const searchName = ref ('')
//点击搜索
function search(){
  currentPage.value = 1
  const params = {
    fileName:searchName.value,
    page:currentPage.value
  }
  console.log(params)
  getTableList()
}
//点击页面跳转
function handleCurrentChange(val){
  currentPage.value = val
  getTableList()
}
const multipleSelection = ref([])
const multipleTableRef = ref()
//多选方法
function handleSelectionChange(val){
  multipleSelection.value = val
}
//取消多选
function clickCancel(){
  multipleTableRef.value.clearSelection()
}
//文件类型
import pdf from '@/assets/pdf.png'
import msg from '@/assets/msg.png'

import xls from '@/assets/xls.png'
import mp4 from '@/assets/mp4.png'
const fileIcons = {// 可以同时映射多个后缀
  pdf: pdf,
  msg:msg,
  xls:xls,
  xlsx:xls,
  mp4:mp4
};
//获取文件类型
function getFileType(fileName){
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return fileExtension
}
//前往知识库详情
function goDetail(id){
  $router.push({
    name:'databaseDetail',
    query:{
      id:id
    }
  })
}
const createUrlItem = () => ({ url: '' }); // 工厂函数
const urlList = ref([createUrlItem()]); // 初始化
//新增url
function addUrl() {
  urlList.value.unshift(createUrlItem()); // 每次调用生成新对象，防止数据粘连
}
//移除url
function removeUrl(index){
  urlList.value.splice(index,1)
}
</script>

<style scoped lang="scss">
@import "@/style/components/database.scss";
</style>
