<template>
  <div class="sign-out">
<!--    user_type  （00:正式员工/01:非正式/10:部门管理/90:系统管理） -->
    <el-popover v-if="useMenu.userInfo.user_type == '90'" placement="right" effect="dark" :width="55" trigger="hover" popper-class="sign-out-popover"
                  popper-style="background:#012A2D;border-radius: 15px;padding:2px 5px;" :show-arrow="false"
                  :offset="24">
        <template #reference>
<!--          <span class="aside-icon click-icon" @click="clickIcon($event)">-->
<!--            <img class="sign-img" :src="iconManage" alt="">-->
<!--          </span>-->
          <div class="aside-icon click-icon" @click="clickIcon($event)">
            <img :src="iconManage" alt=""> <span class="aside-text">{{ t ('grandManagement') }}</span>
          </div>
        </template>
        <template #default>
          <div class="sign-out-pop">
            <div class="sign-out-pop-item click-icon" @click="goComment(),clickIcon($event)">
              <img :src="iconComment" alt="">{{ t ('comment') }}
            </div>
            <div class="sign-out-pop-item click-icon" @click="goDatabase(),clickIcon($event)">
              <img :src="iconDatabase" alt="">{{ t ('databaseTitle') }}
            </div>
          </div>
        </template>
      </el-popover>
    <el-tooltip
         popper-class="aside-tooltip"
         :effect="isCollapse?'dark':'light'"
         :content="t('personalCenter')"
         placement="right"
     >
      <div class="aside-icon click-icon" @click="clickIcon($event)">
       <img :src="iconUser" alt=""> <span class="aside-text">{{ t ('personalCenter') }}</span>
      </div>
    </el-tooltip>

  </div>
</template>

<script setup lang="ts">
import {ref,defineProps} from 'vue'
import iconUser from '@/assets/icon-user.png'
import {useRouter} from 'vue-router';
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})
let $router = useRouter ()
import iconManage from '@/assets/icon-manage.png'
import iconDatabase from '@/assets/icon-database.png'
import iconComment from '@/assets/icon-comment.png'

import {useGoPageHandler} from '@/hooks/useMenuFun.js'

const { clickIcon } = useGoPageHandler ()

function goDatabase () {
  $router.push ('/cache')
}

function goComment () {
  $router.push ('/knowledgebaseManagement')
}

import {useI18n} from "vue-i18n";
const { t } = useI18n ()

import useStore  from "@/store";
const {useMenu} = useStore()
</script>

<style lang="scss" scoped>
@import url('@/style/components/aside.scss');

.sign-out {
  padding: 0 0 15px;
  border-top: 1px solid #fff;
  b {
    font-size: 14px;
    margin-left: 8px;
    vertical-align: 3px;
  }

  &-box {
    position: relative;
  }

  &-pop {
    //display: flex;
    //flex-direction: column;
    //align-items: center;
    &-item {
      padding: 9px 10px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      margin: 4px 0;

      &:hover, &.active {
        background: #80BBAD;
      }

      img {
        width: 12px;
        margin-right: 6px;
        vertical-align: -1px;
      }
    }
  }

  //:deep(.el-popper.is-light){
  //  background: #163C32;
  //}
}


.sign-img {
  width: 20px;
  cursor: pointer;
}

.coll {
  &:not(.sm-show) {
    .sign-out {
      padding: 0 0 20px;
      flex-direction: column-reverse;
      align-items: flex-start;

      b {
        display: none;
      }
    }

    .sign-img {
      //margin-bottom: 10px;
    }
  }

}
</style>
