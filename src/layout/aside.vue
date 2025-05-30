<template>
  <el-aside class="aside" id="aside">
    <div class="aside-left-nav">
      <div class="logo-class">
        <LogoWhite />
      </div>

      <div class="top-func">
        <!-- New Dialog Button -->
        <div class="aside-icon mt-43" :class="{ active: isActive || hovering }" @click="handleClick, goPage('dialog')"
          @mouseenter="hovering = true" @mouseleave="hovering = false">
          <div class="chat-icon"></div>
          <span class="aside-text">{{ t('dialog') }}</span>
        </div>

        <!-- History Button -->
        <div class="aside-icon mt-10" :class="{ active: historyFlag || historyHovering }"
          @click="toggleHistory, goPage('history')" @mouseenter="historyHovering = true"
          @mouseleave="historyHovering = false">
          <div class="history-icon"></div>
          <span class="aside-text">{{ t('history') }}</span>
          <span class="aside-history-icon" @click.stop="toggleHistory">
            <el-icon size="14px" v-show="!historyFlag">
              <CaretRight />
            </el-icon>
            <el-icon size="14px" v-show="historyFlag">
              <CaretBottom />
            </el-icon>
          </span>
        </div>
      </div>

      <div class="history-tree">

      </div>

      <div class="buttom-func">
        <div class="nav-button"  @click="goPage('userManagement')"  :class="{ active: aaaHovering }" @mouseenter="aaaHovering = true"
          @mouseleave="aaaHovering = false">
          {{ t('userManagement') }}
        </div>
        <div class="nav-button" @click="goPage('knowledgebaseManagement')"  :class="{ active: bbbHovering }" @mouseenter="bbbHovering = true"
          @mouseleave="bbbHovering = false">
          {{ t('knowledgebaseManagement') }}
        </div>
        <!-- <span class="version-text">
          version 1.0.0
        </span> -->

      </div>

      <div class="user">
        <div class="userbutton">
          <span>
            {{ useMenu.userInfo.userName }}
          </span>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGoPageHandler } from '@/hooks/useMenuFun.js';
import LogoWhite from '@/assets/logo-white.svg';
import { useRouter, useRoute } from 'vue-router';
import useStore from '@/store';
import { changeGlobalNodesTarget } from 'element-plus/es/utils';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const { useMenu } = useStore();
const { useGoDialog, clickIcon } = useGoPageHandler();
const isActive = ref(false);
const hovering = ref(false);
const historyFlag = ref(false);
const historyHovering = ref(false);
const aaaHovering = ref(false);
const bbbHovering = ref(false);
const $router = useRouter();

function handleClick(event: Event) {
  useGoDialog();
  clickIcon(event);
  isActive.value = true;
}

function toggleHistory() {
  historyFlag.value = !historyFlag.value;
}

function goPage(pageName: string) {
  console.log("2222");
  // useMenu.currentActivePage = pageName; // 将当前激活的页面名称存储到全局状态中
  $router.push({ name: pageName });
}
</script>




<style lang="scss" scoped>
.aside {
  width: 260px;
  height: 100vh;
  border-radius: 20px;
  background-image: url('./../assets/left.png');
  background-size: cover;

  .logo-class {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    svg {
      width: 124px;
    }
  }

  &-left-nav {
    color: #fff;
    padding: 20px 13px 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .aside-icon {
    font-size: 18px;
    width: 228px;
    height: 50px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    color: #fff;

    &.mt-43 {
      margin-top: 43px;
    }

    &.mt-10 {
      margin-top: 10px;
    }

    .chat-icon,
    .history-icon {
      width: 17px;
      height: 17px;
      margin-left: 20px;
      mask-repeat: no-repeat;
      mask-size: contain;
      background-color: #fff;
    }

    .chat-icon {
      mask-image: url('@/assets/icon-chat-new2.svg');
    }

    .history-icon {
      mask-image: url('@/assets/icon-history2.svg');
    }

    &:hover,
    &.active {
      background: #fff;
      color: #34A0E9;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);

      .chat-icon {
        mask-image: url('@/assets/icon-chat-new1.svg');
        background-color: #34A0E9;
      }

      .history-icon {
        mask-image: url('@/assets/icon-history1.svg');
        background-color: #34A0E9;
      }
    }

    .aside-text {
      margin-left: 12px;
      flex: 1;
    }

    .aside-history-icon {
      margin-left: auto;
    }
  }

  .history-tree {
    // background-color: aqua;
    width: 100%;
    height: 55vh;
  }

  .buttom-func {
    // 保持原有样式
    width: 100%;
    height: 15vh;
    border-bottom: 1px solid #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .nav-button {
      font-size: 16px;
      color: #1D5276;
      cursor: pointer;
      margin: 10px 0;
      text-align: center;
      width: 228px;
      height: 50px;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      &:hover,
      &.active {
        background: #fff;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);
        color: #1D5276;
      }
    }

    /* 让 version 1.0.0 在右下角 */
    span.version-text {
      bottom: 5px;
      right: 10px;
      color: #1D5276;
      font-size: 12px;
      margin-left: 160px;
      margin-bottom: 5px;
    }
  }


  .user {
    // background-color: rgb(82, 93, 68);
    width: 100%;
    height: 8vh;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .userbutton {
      background-color: #79BFEE;
      width: 228px;
      height: 51px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}
</style>