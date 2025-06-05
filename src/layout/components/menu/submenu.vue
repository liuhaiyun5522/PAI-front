<template>
  <template v-for="(item,index) in mockMenuData.message.list" :key="index">
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


const mockMenuData = {
  status_code: 200,
  message: {
    list: [
      {
        date: "今日",
        children: [
          {
            id: "bba13f04-4223-49cc-9153-c113b46c1bc5",
            question: "如何学习 Vue 3 Composition API？",
            title: "如何学习 Vue 3 Composition API？", // 添加 title 字段以匹配模板
            search_name: "ChatBot"
          },
          {
            id: "cca14f05-5334-50dd-a264-d224c57d2cd6",
            question: "JavaScript 异步编程最佳实践",
            title: "JavaScript 异步编程最佳实践",
            search_name: "ChatBot"
          },
          {
            id: "dda15f06-6445-61ee-b375-e335d68e3de7",
            question: "Element Plus 表单验证问题",
            title: "Element Plus 表单验证问题",
            search_name: "ChatBot"
          }
        ]
      },
      {
        date: "过去1週間",
        children: [
          {
            id: "34036799-1d5e-4388-bbd4-fb45f0d0dd5e",
            question: "React vs Vue 性能对比分析",
            title: "React vs Vue 性能对比分析",
            search_name: "ChatBot"
          },
          {
            id: "6cd3a5c6-401b-49ed-857b-62469b6f562a",
            question: "TypeScript 泛型详解",
            title: "TypeScript 泛型详解",
            search_name: "ChatBot"
          },
          {
            id: "7de4b6d7-512c-5aff-c968-73579f7f663b",
            question: "前端性能优化策略",
            title: "前端性能优化策略",
            search_name: "ChatBot"
          },
          {
            id: "8ef5c7e8-623d-6b00-da79-84680080774c",
            question: "CSS Grid 布局实战",
            title: "CSS Grid 布局实战",
            search_name: "ChatBot"
          }
        ]
      },
      {
        date: "过去1か月",
        children: [
          {
            id: "9f06d8f9-734e-7c11-eb8a-95791191885d",
            question: "微前端架构设计思路",
            title: "微前端架构设计思路",
            search_name: "ChatBot"
          },
          {
            id: "a017e90a-845f-8d22-fc9b-a68a22a2996e",
            question: "Node.js 服务端开发指南",
            title: "Node.js 服务端开发指南",
            search_name: "ChatBot"
          }
        ]
      }
    ],
    total_count: 8,
    page: 1,
    page_size: 20
  }
};


// onMounted(()=>{
//   useMenu.getMenuList()
//   if($route.query.id){
//     activeId.value = $route.query.id
//   }
// })

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

