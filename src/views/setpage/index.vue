<template>
  <div class="main">
    <el-button class="logout-button" @click="handleLogout" @mouseenter="isHovering = true"
      @mouseleave="isHovering = false" @mousedown="isClicking = true" @mouseup="isClicking = false">
      <img :src="iconSrc" class="logout-icon" />
      {{ t('settings.logout') }}
    </el-button>

    <div class="userform">
      <span>
        {{ t('settings.account') }}
      </span>
      <div class="whiteback form-box">
        <div class="input-row">
          <div class="input-group">
            <label>ID</label>
            <el-input placeholder="请输入ID" required />
          </div>
          <div class="input-group">
            <label> {{ t('usermng.name') }}</label>
            <el-input placeholder="请输入用户名" />
          </div>
          <div class="input-group">
            <label>{{ t('usermng.password') }}</label>
            <el-input placeholder="请输入密码" type="password" required />
          </div>
        </div>
        <div class="input-row">
          <div class="input-group">
            <label>{{ t('usermng.email') }}</label>
            <el-input placeholder="请输入邮箱" required />
          </div>
          <div class="input-group">
            <label>{{ t('usermng.position') }}</label>
            <el-input placeholder="请输入职位" required />
          </div>
          <div class="input-group">
            <label>{{ t('usermng.department') }}</label>
            <el-input placeholder="请输入部门" required />
          </div>
        </div>
        <div class="button-row">
          <el-button class="save"> {{ t('settings.save') }}</el-button>
        </div>
      </div>
    </div>

    <div class="language">
      <span>
        {{ t('settings.language') }}
      </span>
      <div class="whiteback language-box">
        <span>{{ t('settings.userlang') }}</span>
        <el-select v-model="selectedLang"  class="lang-select">
          <el-option label="中文" value="zh" />
          <el-option label="日本語" value="ja" />
          <el-option label="English" value="en" />
        </el-select>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { logout } from '@/api/index';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const $router = useRouter();
const dialogVisible = ref(false);
const selectedLang = ref('');
const isHovering = ref(false);
const isClicking = ref(false);

const iconSrc = computed(() =>
  isClicking.value || isHovering.value
    ? new URL('@/assets/logout2.svg', import.meta.url).href
    : new URL('@/assets/logout1.svg', import.meta.url).href
);

// 点击 logout 按钮的处理逻辑
const handleLogout = async () => {
  try {
    const res = await logout();
    if (res) {
      localStorage.removeItem('token');
      console.log('token after removal:', localStorage.getItem('token')); // 打印确认是否删除
      ElMessage.success('退出登录成功');
      $router.push({ name: 'login' });
    } else {
      ElMessage.error('退出失败，请重试');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('退出异常，请检查网络');
  }
};


onMounted(() => {
  console.log('111:', localStorage.getItem('token')); // 打印确认是否删除
})

</script>


<style scoped>
.main {
  height: 90vh;
  padding: 30px 20px;

  .userform {
    font-size: 18px;
    color: #1D5276;

    .whiteback.form-box {
      margin-top: 2vh;
      background-color: #FFF;
      width: 100%;
      border-radius: 10px;
      margin-bottom: 2vh;
      padding: 20px;

      .input-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .input-group {
        display: flex;
        align-items: center;
        margin-right: 20px;
        height: 70px;
        flex: 1;
      }

      .input-group label {
        min-width: 60px;
        margin-right: 10px;
        color: #333;
        font-weight: bold;
        font-size: 14px;
      }

      .input-group {
        display: flex;
        align-items: center;
        margin-right: 20px;
        height: 70px;
        width: 100%;
      }

      .input-group .el-input {
        flex: 1;
        height: 70px;
      }

      .el-input__wrapper {
        height: 70px !important;
        align-items: center;
      }


      .button-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
        margin-right: 20px;

        .save {
          background-color: #FF9D2D;
          border-color: #FF9D2D;
          color: #FFFFFF;

          &:hover,
          &:active {
            background-color: #FFCB8F !important;
            color: #693F0E !important;
          }
        }
      }
    }
  }

  .language {
    font-size: 18px;
    color: #1D5276;

    .whiteback.language-box {
      margin-top: 2vh;
      background-color: #FFF;
      width: 100%;
      height: 8vh;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;

      span {
        font-size: 14px;
      }
    }

    .lang-select {
      width: 200px;
    }
  }
}

.logout-button {
  color: #FFFFFF;
  position: absolute;
  right: 15px;
  top: 20px;
  border-radius: 10px;
  width: auto;
  height: 40px;
  z-index: 11;
  background-color: #34A0E9;

  &:hover,
  &:active {
    color: #1D5276 !important;
    background-color: #ADDEFF;
  }

  .logout-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>
