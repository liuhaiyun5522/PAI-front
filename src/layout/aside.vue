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
        <div class="aside-icon mt-10" :class="{ active: historyFlag || historyHovering }" @click="toggleHistory"
          @mouseenter="historyHovering = true" @mouseleave="historyHovering = false">
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

      <div class="history-tree" v-if="historyFlag">
        <Menuu />
      </div>


      <div class="buttom-func">
        <div class="nav-button" @click="goPage('userManagement')" :class="{ active: aaaHovering }"
          @mouseenter="aaaHovering = true" @mouseleave="aaaHovering = false">
          {{ t('userManagement') }}
        </div>
        <div class="nav-button" @click="goPage('knowledgebaseManagement')" :class="{ active: bbbHovering }"
          @mouseenter="bbbHovering = true" @mouseleave="bbbHovering = false">
          {{ t('knowledgebaseManagement') }}
        </div>
        <!-- <span class="version-text">
          version 1.0.0
        </span> -->

      </div>

      <div class="user">
        <div class="userbutton">
          <div class="user-icon"></div>
          <span>
            admin
            {{ useMenu.userInfo.userName }}
          </span>
          <div class="user-tool"  @click="goPage('setpage')">
            <img :src="usertool" alt="">
          </div>

        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref ,onMounted} from 'vue';
import { useGoPageHandler } from '@/hooks/useMenuFun.js';
import LogoWhite from '@/assets/logo-white.svg';
import { useRouter, useRoute } from 'vue-router';
import useStore from '@/store';
import Menuu from '@/layout/components/menu/submenu.vue'
import usertool from '@/assets/user-tool.jpg'
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

onMounted(()=>{
 console.log(useMenu.userInfo.userName)
})

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
  display: flex;
  flex-direction: column;

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
    flex-grow: 1; // 关键：使内容区域撑满
    overflow: hidden; // 防止外溢
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
    flex-shrink: 0;
    width: 100%;
    max-height: 46vh; // 控制最大高度
    overflow-y: auto;
    margin-top: 10px;
    padding: 0px 15px;
  }

  .buttom-func {
    width: 100%;
    height: 17vh;
    border-bottom: 1px solid #ffffff;
    // padding-top: 10px;
    margin-top: auto; // 固定到底部关键
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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
      position: relative;
      // justify-content: center;
      color: #fff;

      .user-icon {
        width: 17px;
        height: 17px;
        margin-left: 20px;
        mask-repeat: no-repeat;
        mask-size: contain;
        background-color: #fff;
        mask-image: url('@/assets/user.svg');
      }

      span {
        margin-left: 10px;
      }

      .user-tool {
  position: absolute; // ✅ 关键
  right: 10px;         // ✅ 距右边10px
  top: 50%;
  transform: translateY(-50%); // ✅ 垂直居中
  width: 40px;
  height: 40px;
  background-color: transparent;
  border-radius: 50%;
  cursor: pointer;

  img {
    width: 18px;
    height: 18px;
    margin: 11px; // ✅ 居中图标
  }

  &:hover,
  &:active {
    background-color: #62A3CF;
  }
}

    }
  }
}
</style>