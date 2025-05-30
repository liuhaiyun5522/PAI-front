<template>
  <template v-for="(item,index) in useMenu.menuList" :key="index">
    <template v-if="item.children&&item.children.length>0">
      <div class="aside-date">{{ item.date }}</div>
      <div>
        <div v-for="(sItem,sIndex) in item.children" @click="useGoDialog(sItem.id)"
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
import {ref, onMounted, watch} from 'vue'
import {useRoute, useRouter} from "vue-router";
const $router = useRouter()
const $route = useRoute ()
const activeId = ref('')
watch(()=>$route.query,(newVal,oldVal)=>{
  activeId.value = newVal?.id
})
import {deleteHistory, updateTitle} from "@/api/chat";
import {useMenuStore} from "@/store/modules/useMenu";
const useMenu = useMenuStore ();

onMounted(()=>{
  useMenu.getMenuList()
  if($route.query.id){
    activeId.value = $route.query.id
  }
})

const dropdownClick = (event: { stopPropagation: () => void; })=>{
  event.stopPropagation(); // 阻止事件冒泡
}
import {useI18n} from "vue-i18n";
const { t } = useI18n ();
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
    margin: 10px 0;
    font-size: 14px;
    color: #80BBAD;
  }

  &-title {
    padding: 10px 40px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    padding-right: 70px;
    margin-bottom: 5px;
    font-size: 12px;
    color: #DADFE0;
    &-text{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.active, &:hover {
      background: #2A5658;
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
      color: #fff;
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
  color: #012A2D;
}
</style>

