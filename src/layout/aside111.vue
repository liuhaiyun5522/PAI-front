<template>
  <el-aside :class="['aside',{'coll':isCollapse},{'widthChange':isCollapse}]" id="aside">
    <div class="aside-left-nav">
      <div>
        <div class="sm-show" style="margin-bottom: 10px;">
          <el-icon size="22" @click="closeMenu">
            <Close/>
          </el-icon>
        </div>
        <div >
          <el-tooltip
              popper-class="aside-tooltip"
              :effect="isCollapse?'dark':'light'"
              :content="isCollapse?t('expand'):t('fold')"
              placement="right"
          >
            <span class="logo" @click="collapseClick();clickIcon($event)">
<!--             <img v-show="isCollapse" :src="iconExpand" alt="">-->
<!--             <img v-show="!isCollapse" :src="iconExpand2" alt="">-->
              <LogoWhite></LogoWhite>
            </span>
          </el-tooltip>

        </div>
        <div>
          <el-tooltip
              popper-class="aside-tooltip"
              :effect="isCollapse?'dark':'light'"
              :content="t('newDialog')"
              placement="right"
          >
           <div class="aside-icon click-icon" @click="useGoDialog();clickIcon($event)">
             <IconChatNew></IconChatNew> <span class="aside-text">{{t('newDialog')}}</span>
            </div>
          </el-tooltip>
<!--          todo agent workspace 暂时注释-->
          <el-tooltip
              popper-class="aside-tooltip"
              :effect="isCollapse?'dark':'light'"
              :content="t('agent')"
              placement="right"
          >
            <div class="aside-icon click-icon" @click="clickIcon($event),goPage('agent')">
              <IconAgent name="agent"></IconAgent> <span class="aside-text">{{t('agent')}}</span>
            </div>
          </el-tooltip>
          <el-tooltip
              popper-class="aside-tooltip"
              :effect="isCollapse?'dark':'light'"
              :content="t('workSpace')"
              placement="right"
          >
            <div class="aside-icon click-icon" @click="clickIcon($event),goPage('workspace')">
              <img :src="IconWorkspace" alt=""> <span class="aside-text">{{t('workSpace')}}</span>
            </div>
          </el-tooltip>
          <el-tooltip
              popper-class="aside-tooltip"
              :effect="isCollapse?'dark':'light'"
              :content="t('history')"
              placement="right"
          >
            <div class="aside-icon click-icon" @click="clickIcon($event),goPage('history')">
              <img :src="IconHistory" alt=""> <span class="aside-text">{{t('history')}}</span>
              <span class="aside-history-icon" @click.stop="showHistory">
                <el-icon size="14px" v-show="!historyFlag"><CaretRight /></el-icon>
                <el-icon size="14px" v-show="historyFlag"><CaretBottom /></el-icon>
              </span>

            </div>
          </el-tooltip>

        </div>

      </div>
      <div class="aside-history" v-if="historyFlag">
        <Menuu />
      </div>
      <SignOut :isCollapse="isCollapse"/>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import {ref, watch, nextTick, onMounted} from 'vue';
import {useI18n} from "vue-i18n";
const { t } = useI18n ()
import {useRouter, useRoute} from 'vue-router';
import LogoWhite from '@/assets/logo-white.svg'
import SignOut from '@/layout/components/signOut/index.vue'
import Menuu from '@/layout/components/menu/submenu.vue'
import {useGoPageHandler} from '@/hooks/useMenuFun.js'

const { useGoDialog, clickIcon } = useGoPageHandler ()

import IconChatNew from '@/assets/icon-chat-new.svg';
import IconWorkspace from '@/assets/icon-workspace.png';
import IconAgent from '@/assets/icon-agent.svg?component';
import IconHistory from '@/assets/icon-history.png';

//侧边栏展开false/收起true
const isCollapse = ref (true)
const collapseClick = () => {
  isCollapse.value = !isCollapse.value
  emitCollapse ()
}

const closeMenu = () => {
  document.getElementById ('aside')?.classList.remove ('sm-show')
}

function emitCollapse () {
  const event = new CustomEvent ('collapseChange', { detail: { value: isCollapse.value } });
  window.dispatchEvent (event);
}

const historyFlag = ref (false)
function showHistory(){
  historyFlag.value = !historyFlag.value
}
const $router = useRouter ()
function goPage(pageName: string){
  $router.push ({name: pageName})
}
</script>

<style lang="scss" scoped>
@import url('@/style/components/aside.scss');

.aside {
  background: #012A2D;
  width: 300px;
  height: 100vh;
  //transition: width 0.3s;
  .logo{
    width: 100%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    svg{
      width: 124px;
    }
  }
  &.widthChange{
    width: 70px;
  }
  &.coll{
    &:not(.sm-show) .aside-history {
      display: none;
    }
    .logo{
      svg{
        width: 100%;
      }
    }
    &.sm-show{
      .logo svg{
        width: 130px ;
      }
    }
  }


  &-left-nav {
    color: #fff;
    position: relative;
    padding: 20px 13px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .el-button {
      margin: 20px 0;
      padding: 20px 60px;
      // width: 100%;
      // padding: 20px;
    }


  }

  &-history {
    height: calc(100vh - 141px);
    overflow: auto;
    padding-right: 15px;
  }

  .sm-show {
    display: none;
  }

  &.sm-show {
    display: block;
    position: absolute;
    z-index: 100;
    width: 100%;
  }

  @media (max-width: 990px) {
    width: 250px;
  }
  @media (max-width: 768px) {
    display: none;
    .sm-hidden {
      display: none;
    }
    .sm-show {
      display: block;
    }
  }
}

</style>
