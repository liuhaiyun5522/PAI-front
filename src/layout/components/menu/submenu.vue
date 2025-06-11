<template>
  <template v-for="(item,index) in useMenu.menuList" :key="index">
    <template v-if="item.talk&&item.talk.length>0">
      <div class="aside-date">{{ getDateText(item.date) }}</div>
      <div>
        <div v-for="(sItem,sIndex) in item.talk" @click="useGoDialog(sItem.id)"
             :class="['aside-title',{'active':activeId==sItem.id}]" >
          <div class="aside-title-text">
            {{ sItem.title }}
          </div>

          <div @click="dropdownClick" class="aside-dropdown">
            <el-dropdown trigger="click" @command="handleCommand($event,sItem.id)">
              <span class="aside-dropdown-icon"><el-icon><MoreFilled /></el-icon></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item class="aside-dropdown-item" command="0"><IconRename style="margin-right: 5px"></IconRename>{{ t("rename") }}</el-dropdown-item>
                  <el-dropdown-item class="aside-dropdown-item" command="1"><IconDelete style="margin-right: 5px"></IconDelete>{{ t("delete") }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        </div>
      </div>
    </template>


  </template>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue'
import {useRoute, useRouter} from "vue-router";
const $router = useRouter()
const $route = useRoute ()
const activeId = ref('')
watch(()=>$route.query,(newVal,oldVal)=>{
  activeId.value = newVal?.id
})
// import {deleteHistory, updateTitle} from "@/api/chat";
import {useMenuStore} from "@/store/modules/useMenu";
const useMenu = useMenuStore ();

onMounted(()=>{
  useMenu.getMenuList()
  console.log(useMenu.menuList)
  if($route.query.id){
    activeId.value = $route.query.id
  }
})

const dropdownClick = (event: { stopPropagation: () => void; })=>{
  event.stopPropagation(); // 阻止事件冒泡
}
import {useI18n} from "vue-i18n";
const { t } = useI18n ();

// 方法1：使用方法
const getDateText = (date: string) => {
  const dateMap: { [key: string]: string } = {
    'today': t('aside.today'),
    'yesterday': t('aside.yesterday'),
    'week': t('aside.week'),
    'month': t('aside.month')
  }
  return dateMap[date] || date
}

// 方法2：使用计算属性（如果你想要响应式的多语言切换）
const dateTextMap = computed(() => ({
  'today': t('aside.today'),
  'yesterday': t('aside.yesterday'),
  'week': t('aside.week'),
  'month': t('aside.month')
}))

// 如果使用计算属性，则用这个方法
// const getDateText = (date: string) => {
//   return dateTextMap.value[date] || date
// }

import { ElMessage, ElMessageBox } from 'element-plus'
const handleCommand =  (command: string | number | object,id:string) => {
  console.log(command)
  if(command == '0'){ //重命名
    ElMessageBox.prompt(t('updateTitle'), t('tip'))
    .then(async ({ value }) => {
      const params={
        id:id,
        title:value
      }
      const res = await updateTitle(params)
      if(res.data.status_code =='200'){
        //删除后，调用获取历史列表
        useMenu.getMenuList()
      }
    })
    .catch(() => {})
  }else if(command == '1'){ //删除
    ElMessageBox.confirm(
        t('deleteTip'),
        t('deleteTipTitle'),
        {
          type: 'warning',
        }
    )
    .then(async () => {
      const res = await deleteHistory({id:id})
      if(res.data.status_code =='200'){
        //删除后，调用获取历史列表
        useMenu.getMenuList()
        ElMessage({
          type: 'success',
          message: t('deleteTip2'),
        })
      }
    })
    .catch(() => {})

  }
}
import {useGoPageHandler} from "@/hooks/useMenuFun";
const {useGoDialog} = useGoPageHandler()

import IconRename from "@/assets/icon-rename.svg"
import IconDelete from "@/assets/icon-delete2.svg"
</script>

<style lang="scss" scoped>
.aside {
  &-date {
    margin: 5px 5px;
    font-size: 14px;
    color: #1D5276;
  }

  &-title {
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    padding-right: 40px;
    font-size: 13px;
    width: 210px;
    color: rgba(29, 82, 118, 0.5);

    &-text{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.active, &:hover {
      background: rgba(255, 255, 255, 0.2); /* 0.2 表示 20% 透明度 */
      .aside-dropdown{
        visibility: visible;
        //display: block;
      }
    }
  }
  &-dropdown{
    position: absolute;
    right: 8px;
    top: 5px;
    //display: none;
    visibility: hidden;
    .el-dropdown{
      color: rgba(234, 27, 27, 0.2); /* 0.2 表示 20% 透明度 */

      outline-style: none;
    }
    &-icon{
      padding: 7px 5px;
      display: inline-block;
      outline-style:none;
    }

  }
  @media (max-width: 990px) {
    &-title{
      padding: 10px 40px 10px 25px;
    }
  }
}
:deep(.aside-dropdown-item){
  font-size: 10px;
  color: rgba(255, 255, 255, 0.2); /* 0.2 表示 20% 透明度 */
}
</style>

