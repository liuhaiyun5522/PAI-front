<template>
  <el-aside class="aside" id="aside">
    <div class="main">
      <div class="logo">
        <LogoWhite />
      </div>

      <div>
        <div class="nav-item-dialog" @click="goPage('dialog')">
          <Icondialog />
          <span class="nav-item-text">{{ t('dialog') }}</span>
        </div>


        <div class="nav-item-history" @click="toggleHistory">
          <Iconhistory />
          <span class="nav-item-text">{{ t('history') }}</span>
          <span class="nav-history-icon" @click.stop="toggleHistory">
            <el-icon size="14px" v-show="!historyFlag">
              <CaretRight />
            </el-icon>
            <el-icon size="14px" v-show="historyFlag">
              <CaretBottom />
            </el-icon>
          </span>
        </div>
      </div>

      <div :class="['history-tree', { 'no-bottom-func': !showBottomFunc }]" v-if="historyFlag">
        <Menuu />
      </div>
      <div class="bottom">
        <div class="buttom-func" v-if="useMenu.userInfo.userPermissionLevel === 1">
          <div class="nav-button" @click="goPage('userManagement')">
            <Usermng></Usermng>
            <span>
              {{ t('userManagement') }}
            </span>
          </div>
          <div class="nav-button" @click="goPage('knowledgebaseManagement')">
            <Knowledgemng></Knowledgemng>
            <span>
              {{ t('knowledgebaseManagement') }}
            </span>
          </div>
        </div>


        <div class="version-text">
          <span>version 1.0.0</span>
        </div>


        <!-- <div class="layout-user-info">
          <div class="user-info-button">
            <Iconuser />
            <span>{{ useMenu.userInfo.userName }}</span>
            <div class="user-tool" @click="goPage('setpage')">
              <Icontool />
            </div>
          </div>
        </div> -->
         <div class="layout-user-info">
          <div class="user-info-button">
            <Iconuser class="user-avatar-icon" />
            <span>{{ useMenu.userInfo.userName }}</span>
            <div class="upgrade-button">
              {{ t('aside.upgrade') }}
            </div>

            <div class="user-tool" @click="goPage('setpage')">
              <Icontool />
            </div>
          </div>
        </div>
      </div>

    </div>
  </el-aside>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { profile } from '@/api/index';
import LogoWhite from '@/assets/logo-white.svg';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import Icondialog from '@/assets/icon-chat-new.svg';
import Iconhistory from '@/assets/icon-history.svg';
import Iconuser from '@/assets/user.svg';
import Icontool from '@/assets/user-tool.svg';
import Usermng from '@/assets/usermng.svg';
import Knowledgemng from '@/assets/knowledgemng.svg';
import Menuu from '@/layout/components/menu/submenu.vue';
import { useMenuStore } from '@/store/modules/useMenu'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const menuStore = useMenuStore()
const { useMenu } = useStore();
const historyFlag = ref(false);
const $router = useRouter();

const toggleHistory = () => {
  historyFlag.value = !historyFlag.value;
}

const goPage = (pageName: string) => {
  $router.push({ name: pageName });
}

const init = async () => {
  const res = await profile();
  menuStore.userInfo = {
    userId: res.data.userId,
    userName: res.data.userName,
    userEmail: res.data.userName,
    userPermissionLevel: res.data.permissionLevel
  }
}

onMounted(() => {
  init()
})

</script>



<style lang="scss" scoped>
.aside {
  width: 250px;
  height: 100vh;
  border-radius: 20px;
  background-image: url('@/assets/left.png');
  background-size: cover;
  display: flex;
  flex-direction: column;

  .main {
    padding: 20px 10px 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;

    // position: relative;
    .logo {
      margin-top: 25px;
      margin-bottom: 30px;
    }

    .nav-item-dialog,
    .nav-item-history {
      font-size: 16px;
      width: 210px;
      height: 45px;
      padding: 5px 15px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.1s;
      color: #fff;
      margin-top: 5px;

      &.is-active,
      &:hover {
        background: #fff;
        color: #34A0E9;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
      }

      .nav-item-text {
        margin-left: 12px;
        flex: 1;
      }
    }


    .history-tree {
      // background-color: aqua;
      max-width: 100%;
      max-height: calc(100vh - 405px);
      overflow-y: auto;
      overflow-x: hidden;
      margin-top: 10px;
      padding: 0 15px;
      flex-shrink: 0;
      flex: 1;
      margin-bottom: 10px;

      &.no-bottom-func {
        max-height: calc(100vh - 310px);
      }
    }

    .bottom {
      margin-top: auto;

      .buttom-func {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // position: absolute;
        bottom: 85px;

        .nav-button {
          font-size: 16px;
          width: 210px;
          height: 45px;
          padding: 5px 15px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.1s;
          color: #1D5276;
          margin-top: 5px;

          span {
            margin-left: 12px;
            flex: 1;
          }

          &:hover,
          &.active {
            background: #fff;
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);
            color: #1D5276;
          }
        }


      }

      .version-text {
        // position: absolute;
        bottom: 65px;
        width: 210px;
        border-bottom: 1px solid #fff;
        margin-bottom: 10px;

        span {
          font-size: 10px;
          color: #1D5276;
          margin-left: 140px;
        }
      }

      .layout-user-info {
        // position: absolute;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .layout-user-info {
          display: flex;
          align-items: center;
          justify-content: center;
          bottom: 10px;
          /* 如果您不希望它绝对定位，可以移除此行 */
        }

        .user-info-button {
          background-color: #79BFEE;
          width: 210px;
          height: 45px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          /* 确保所有子元素垂直居中 */
          color: #fff;
          padding: 0 15px;
          box-sizing: border-box;
        }

        /* 用户头像图标 */
        .user-info-button> :deep(.user-avatar-icon) {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          transform: translateY(4.0px);
        }

        /* 用户名 */
        .user-info-button>span {
          min-width: 0;
          /* 允许被无限压缩以显示省略号 */
          font-size: 14px;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 24px;
          margin-right: 4px;
        }

        /* 升级按钮 */
        .upgrade-button {
          height: 24px;
          padding: 0 12px 0 24px;
          font-size: 10px;
          font-weight: bold;
          color: #008d64;
          border-radius: 20px;
          background-image: url('@/assets/icon-upgrade.svg');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          flex-shrink: 0;
          /* 防止被压缩 */
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .upgrade-button:hover {
          transform: scale(1.05);
        }

        /* 设置工具图标的样式 */
        .user-tool {
          flex-shrink: 0;
          /* 防止被压缩 */
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto; 
        }

        .user-tool:hover,
        .user-tool:active {
          background-color: #62A3CF;
        }
      }
    }



  }
}
</style>
