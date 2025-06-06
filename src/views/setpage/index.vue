<template>
  <div class="main">
    <el-button class="logout-button" @click="handleLogout" @mouseenter="isHovering = true"
      @mouseleave="isHovering = false" @mousedown="isClicking = true" @mouseup="isClicking = false">
      <img :src="iconSrc" class="logout-icon" />
      {{ t('settings.logout') }}
    </el-button>

    <div class="settings-section userform">
      <span class="section-title">
        {{ t('settings.account') }}
      </span>

      <div class="fields-container">
        <div class="input-row">
          <div class="input-group">
            <label>{{ t('usermng.name') }}</label>
            <el-input v-model="userInfo.username" :placeholder="t('settings.enterUsernamePlaceholder')">
              <template #suffix>
                <Edit2Icon class="custom-suffix-icon" />
              </template>
            </el-input>
          </div>
          <div class="input-group">
            <label>{{ t('usermng.password') }}<span class="required-star">*</span></label>
            <el-input v-model="userInfo.password" :placeholder="t('settings.enterPasswordPlaceholder')" :type="password"
              show-password>
              <template #suffix>
                <Edit2Icon class="custom-suffix-icon" />
              </template>
            </el-input>
          </div>
          <div class="input-group input-group--borderless">
            <label>{{ t('usermng.email') }}<span class="required-star">*</span></label>
            <el-input v-model="userInfo.email" :placeholder="t('settings.enterEmailPlaceholder')" />
          </div>
        </div>

        <div class="input-row">
          <div class="input-group input-group--borderless">
            <label>{{ t('settings.idLabel') }}<span class="required-star">*</span></label>
            <el-input v-model="userInfo.id" placeholder="ID" />
          </div>
        </div>

        <div class="button-row">
          <el-button class="save-button"> {{ t('settings.save') }}</el-button>
        </div>
      </div>
    </div>
    <div class="settings-section language">
      <span class="section-title">
        {{ t('settings.language') }}
      </span>
      <div class="whiteback language-box">
        <span class="language-label">{{ t('settings.userlang') }}</span>
        <el-select v-model="selectedLang" :placeholder="t('settings.selectLanguagePlaceholder')" class="lang-select">
          <el-option :label="t('settings.langChineseSimplified')" value="zh-CN" />
          <el-option :label="t('settings.langJapanese')" value="ja" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import Edit2Icon from '@/assets/icon-edit2.svg'
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { logout } from '@/api/index';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const $router = useRouter();

const userInfo = ref({
  id: '',
  username: '',
  password: '',
  email: '',
  position: '',
  department: ''
});

const selectedLang = ref('zh-CN');

const isHovering = ref(false);
const isClicking = ref(false);

const iconSrc = computed(() =>
  isClicking.value || isHovering.value
    ? new URL('@/assets/logout2.svg', import.meta.url).href
    : new URL('@/assets/logout1.svg', import.meta.url).href
);

const handleLogout = async () => {
  try {
    const res = await logout();
    if (res?.message === 'Logout successful') {
      localStorage.removeItem('token');
      ElMessage.success(t('settings.logoutSuccess'));
      $router.push({ name: 'login' });
    } else {
      ElMessage.error(t('settings.logoutFailed'));
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(t('settings.logoutError'));
  }
};
</script>

<style scoped>
.main {
  padding: 20px 16px;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section {
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 400;
  font-family: 'Microsoft YaHei';
  color: #1D5276;
  margin-top: 20px;
  margin-bottom: 17px;
  height: 26px;
  display: block;
  padding-left: 15px;
}

.whiteback {
  background-color: #FFF;
  border-radius: 10px;
  /* padding: 20px; */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.userform .form-box {
  /* background-color: #FFFFFF !important; */
  display: flex;
  gap: 30px;
  align-items: flex-start;
  font-family: 'Microsoft YaHei';
  font-size: 20px;
}

/*
.avatar-container {
  padding-top: 10px;
  width: 100px;
  height: 100px;
  background: #FFFFFF;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-background {
  width: 70px;
  height: 70px;
  background-color: #AFBCCD;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.avatar-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #AFBCCD;
}
*/

.fields-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 46px;
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 34px;
}

.input-row {
  display: flex;
  gap: 80px;
  /* 注意：宽度计算将基于此处的 80px */
}

.input-group {
  /* 内部布局：标签和输入框在同一行 */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0px;

  /* 统一宽度计算：此规则将作用于所有行的所有输入框组 */
  flex-basis: calc((100% - 2 * 80px) / 3);
  /* 使用 80px 的间距进行计算 */
  flex-grow: 0;
  /* 禁止拉伸 */
  flex-shrink: 0;
  /* 禁止收缩 */
}


.input-group label {
  font-size: 16px;
  color: #000000;
  display: flex;
  align-items: center;
  width: 60px;
  flex-shrink: 0;
}

.required-star {
  color: #F56C6C;
  margin-left: 4px;
}

.input-group .el-input {
  height: 36px;
  flex-grow: 1;
  /* 让输入框填满 .input-group 内部的剩余空间 */
}

/* 这是所有输入框的默认样式 */
.input-group :deep(.el-input__wrapper) {
  border: 1px solid #1D5276;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
  background-color: #F1F4F7;
  height: 100% !important;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* (***这里是唯一的修改***) 这是无边框样式的最终修复版，它会覆盖上面的默认样式 */
.input-group.input-group--borderless :deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
  background-color: #f1f4f7;
}

.input-group .el-input .el-input__inner {
  height: 100%;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button {
  background-color: #E8AF5F;
  border-color: #E8AF5F;
  color: #FFFFFF;
  padding: 9px 34px;
  font-size: 14px;
  border-radius: 4px;
}

.save-button:hover,
.save-button:active,
.save-button:focus {
  background-color: #fcae58 !important;
  border-color: #fcae58 !important;
  color: #FFFFFF !important;
}

.language .language-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  height: auto;
}

.language-label {
  font-size: 16px;
  color: #000000;
}

.lang-select {
  width: 200px;
}

.lang-select .el-input__wrapper {
  height: 36px !important;
  border-radius: 4px;
}

.logout-button {
  color: #FFFFFF;
  position: absolute;
  right: 30px;
  top: 25px;
  border-radius: 6px;
  width: auto;
  padding: 8px 15px;
  height: auto;
  z-index: 11;
  background-color: #34A0E9;
  border: none;
  font-size: 14px;
}

.logout-button:hover,
.logout-button:active,
.logout-button:focus {
  color: #FFFFFF !important;
  background-color: #58b4f0 !important;
}

.logout-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  vertical-align: middle;
}

:deep(.el-input__inner::placeholder) {
  color: #1D5276;
  font-size: 10px;
  font-family: "思源黑体";
}

:deep(.el-select .el-input__inner::placeholder) {
  color: #A8ABB2;
  font-size: 14px;
}
</style>