<template>
  <div class="overflow-auto">
    <div class="container history-container">
<!--      <el-input :placeholder="t('searchPlaceholder2')">-->
<!--        <template #suffix>-->
<!--          <el-icon color="#000000" size="20" @click.stop="getTableList">-->
<!--            <Search/>-->
<!--          </el-icon>-->
<!--        </template>-->
<!--      </el-input>-->
      <div class="history-content">
<!--        <div class="history-delete">-->
<!--          <el-button type="danger" v-if="checkList.length>0">{{ t('delete') }}</el-button>-->
<!--        </div>-->
        <template v-for="(item,index) in useMenu.menuList" :key="index">
          <template v-if="item.children&&item.children.length>0">
            <div class="history-date"><IconCircle></IconCircle>{{ item.date }}</div>
            <div class="history-box">
              <div v-for="(sItem,sIndex) in item.children" @click="useGoDialog(sItem.id)"
                   class="history-item" >
                <div class="history-text">
                  {{ sItem.title }}
                </div>
<!--                <el-checkbox :value="sItem.id" @change="checkChange(sItem.id)"-->
<!--                             size="large" true-value="1" false-value="0" @click.stop />-->
              </div>
            </div>
          </template>

        </template>

      </div>
    </div>
  </div>

</template>

<script setup>
import {onMounted,ref} from 'vue'
import {useI18n} from "vue-i18n";
const {t} = useI18n ();
import {Search} from '@element-plus/icons-vue'
import {useMenuStore} from "@/store/modules/useMenu";
const useMenu = useMenuStore ();
import {useGoPageHandler} from "../../hooks/useMenuFun.js";
function getTableList(){

}
onMounted(()=>{
  useMenu.getMenuList()

})
const {useGoDialog} = useGoPageHandler()
import IconCircle from '@/assets/icon-circle.svg'

//选中列表
const checkList = ref([])
function checkChange(val){
  console.log(val)
  if(checkList.value.indexOf(val)<0){
    checkList.value.push(val)
  }else{
    checkList.value.splice(checkList.value.indexOf(val),1)
  }
  console.log(checkList.value)
}
</script>

<style scoped>
@import "@/style/components/history.scss";
</style>
