<template>
  <el-dialog
      v-model="visible"
      width="500px"
      class="custom-delete-dialog"
      :append-to-body="true"
      :show-close="true" 
  >
    <template #header="{ titleId, titleClass }">
      <div class="my-header-container">
        <h4 :id="titleId" :class="titleClass">{{ t('delete') }}</h4>
      </div>
      <div class="header-divider"></div>
    </template>

    <div class="delete-content">
      <img :src="Imgdelete" alt="Delete Icon">
      <div class="message-title">{{ t('usermng.deleteConfirmTitle') }}</div>
      <div class="message-subtitle">{{ t('usermng.deleteConfirmSubtitle') }}</div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel-btn" @click="$emit('updateVisible', false)">{{ $t('cancel') }}</el-button>
        <el-button class="confirm-btn" @click="$emit('deleteConfirm')">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { defineProps, computed, defineEmits } from "vue";
import Imgdelete from '@/assets/dialog-delete.svg?url'; 

const { t } = useI18n();

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  deleteId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['updateVisible', 'deleteConfirm']);

const visible = computed({
  get: () => props.dialogVisible,
  set: (value) => emit('updateVisible', value)
});
</script>

<style scoped lang="scss">
.custom-delete-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
  }
  
  .my-header-container {

    padding-left: 25px;

    h4 {
      margin: 0; 
    }
  }

  // 分割线的样式
  .header-divider {
    height: 1px;
    background-color: #E5E7EB;
    margin-top: 16px; // 控制与标题的间距
  }
  
  :deep(.el-dialog__body) {
    padding-top: 24px;
  }
}

// 删除内容的容器样式
.delete-content {
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding: 10px 0; 

  img {
    width: 56px;
    height: 56px;
    margin-bottom: 20px;
  }
  .message-title {
    font-size: 20px;
    color: #AFBCCD; 
    font-family: "微软雅黑";
  }
  .message-subtitle {
    font-size: 20px;
    color: #AFBCCD; 
    font-family: "微软雅黑";
  }
}

// 底部容器样式
.dialog-footer {
  display: flex;
  justify-content: flex-end; 
  
  .el-button {
    width: 80px;
    border-radius: 4px;
  }
  .cancel-btn {
    background-color: #AFBCCD;
    border: 1px solid #DCDFE6; 
    color: #606266;
    font-size: 14px;
    font-family: "微软雅黑";           

    &:hover {
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
  .confirm-btn {
    background-color: #34A0E9; 
    border-color: #409EFF;
    color: #FFFFFF;
    font-size: 14px;
    font-family: "微软雅黑";  

    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
    }
  }
}
</style>