<template>
  <div class="knowledge-list">
    <el-button class="primary-button" type="primary" @click="openDialog(false, null)">
      <el-icon>
        <Plus />
      </el-icon>
      {{ t('add') }}
    </el-button>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isRename ? t('knowledgemng.renameDatabase') : t('knowledgemng.addDatabase')" width="800px" :show-close="true" class="custom-dialog">
      <div class="dialog-body">
        <div class="line"></div>
        <div class="form-section">
          <label class="form-label">{{ t('formName') }}<span style="color: red">*</span></label>
          <el-input v-model="createName" :placeholder="t('namePlaceholder')" class="custom-input short" />
        </div>
        <div class="form-section">
          <label class="form-label">{{ t('formDesc') }}</label>
          <el-input v-model="createIntro" type="textarea" :rows="4" :placeholder="t('descPlaceholder')" class="custom-input long" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-container">
          <el-button class="confirm-button" @click="handleConfirm">
            {{ t('confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 删除确认组件 -->
    <Delete :dialogVisible="deleteDialogVisible" :deleteId="currentDeleteItem?.id || ''" @updateVisible="deleteDialogVisible = $event" @deleteConfirm="confirmDelete" />
    <!-- 卡片容器 -->
    <div class="cards-container" v-loading="loading">
      <div class="card" v-for="item in knowledgeList" :key="item.id" @click="goToCardDetail(item)" @mouseover="hovered = true" @mouseleave="hovered = false">
        <div class="card-inner">
          <div class="card-top">
            <img class="card-img" src="@/assets/knowledgebase/card-img.jpg" alt="card image" />
            <div class="card-text">
              <p class="card-title">{{ item.name }}</p>
              <p class="card-description">{{ item.description }}</p>
            </div>
          </div>
          <div class="card-bottom">
            <p class="card-time">{{ formatDate(item.create_time) }}</p>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" @click.stop>
                <el-icon class="more-icon">
                  <MoreFilled />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openDialog(true, item)">
                 
                      <RenameIcon  />
                   
                    <span style="margin-left: 5px;"> {{ t('rename') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="showDeleteDialog(item)" divided>
                  
                      <DeleteIcon />
                   
                    <span style="margin-left: 5px;"> {{ t('delete') }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getknowledgeList, createknowledgeabse, dropknowledgebase  } from '@/api/knowledgebaseMange';
import Delete from '@/components/Delete.vue';
import RenameIcon from '@/assets/icon-rename.svg?component';
import DeleteIcon from '@/assets/icon-delete2.svg?component';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const { useMenu } = useStore();
const loading = ref(false);
const knowledgeList = ref([]);
const dialogVisible = ref(false);
const createName = ref('');
const createIntro = ref('');
const $router = useRouter();
const deleteDialogVisible = ref(false);
const currentDeleteItem = ref(null);
const isRename = ref(false); 
const renameItem = ref(null); 


const init = async () => {
  loading.value = true;
  const response = await getknowledgeList();
  knowledgeList.value = response.data.message;
  loading.value = false;
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString('zh-CN', options);
};

const openDialog = (isRenameFlag, item) => {
  isRename.value = isRenameFlag;
  if (isRenameFlag) {
    renameItem.value = item;
    createName.value = item.name;
    createIntro.value = item.description;
  } else {
    renameItem.value = null;
    createName.value = '';
    createIntro.value = '';
  }
  dialogVisible.value = true;
};

//对话框，确认键
const handleConfirm = async () => {
  if (!createName.value.trim()) {
    ElMessage.error(t('knowledgeNameRequired') || "知识库名称为必填项");
    return;
  }

  if (isRename.value) {
    // 调用重命名接口
    const payload = {
      id: renameItem.value.id,
      name: createName.value,
      description: createIntro.value,
    };
    // await updateknowledgeabse(payload);
    console.log(payload)
  } else {
    // 调用新建接口
    const payload = {
      name: createName.value,
      description: createIntro.value,
    };
    await createknowledgeabse(payload);
  }
  dialogVisible.value = false;
  init();
};

//跳转库内文件
const goToCardDetail = (item) => {
  $router.push({
    name: "BasefileManagement",
    query: {
      id: item.id,
      name: item.name,
      description: item.description,
      time: item.create_time
    }
  });
};

const showDeleteDialog = (item) => {
  currentDeleteItem.value = item;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  if (currentDeleteItem.value) {
    deleteDialogVisible.value = false;
    await deleteItem(currentDeleteItem.value);
    currentDeleteItem.value = null;
  }
};

const deleteItem = async (item) => {
  try {
    const payload = {
      name: item.name,
    };
    const response = await dropknowledgebase(payload);
    console.log('删除知识库成功:', response.data);
    await init();
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
  }
};

onMounted(() => {
  init();
});
</script>

<style scoped lang="scss">
.knowledge-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 30px 20px;
  position: relative;
}

.primary-button {
  color: #FFFFFF;
  position: absolute;
  right: 15px;
  top: -50px;
  border-radius: 10px;
  width: auto;
  height: 40px;
  z-index: 11;
}

.custom-dialog {
  border-radius: 20px !important;
  .line {
    width: 100%;
    border-bottom: 1px solid #AFBCCD;
    margin-bottom: 20px;
    margin-top: -5px;
  }
  :deep(.el-dialog__title) {
    color: #1D5276 !important;
    font-weight: 900 !important;
    font-family: inherit !important;
  }
  
  .el-dialog__body {
    padding: 30px 0;
    height: 400px;
    box-sizing: border-box;
  }
  
  .form-section {
    width: 700px;
    margin: 0 auto 30px auto;
    display: flex;
    flex-direction: column;
  }
  
  .form-label {
    font-size: 16px;
    margin-bottom: 5px;
    text-align: left;
    font-weight: bold;
    color: #000000;
  }
  
  .custom-input {
    &.short {
      :deep(.el-input__wrapper) {
        height: 60px !important;
        display: flex;
        align-items: center;
        background-color: #F1F4F7 !important;
        border: 1px solid rgba(1, 42, 45, 0.2) !important;
        border-radius: 8px !important;
        box-shadow: none !important;
      }
      
      :deep(.el-input__inner) {
        background-color: #F1F4F7 !important;
      }
    }
    
    &.long {
      :deep(.el-textarea__inner) {
        height: 200px !important;
        background-color: #F1F4F7 !important;
        border: 1px solid rgba(1, 42, 45, 0.2) !important;
        border-radius: 8px !important;
        box-shadow: none !important;
      }
    }
  }
  
  .dialog-footer {
    padding: 0px 30px;
    margin-top: -20px;
  }
  
  .dialog-footer-container {
    width: 700px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    margin-top: -10px;
    margin-bottom: 20px;
  }
  
  .confirm-button {
    background-color: #34A0E9;
    color: #FFFFFF;
    border-radius: 6px;
    width: 110px;
    height: 40px;
    border: none;
    transition: all 0.3s ease;
    &:hover,
    &:active {
      background-color: #ADDEFF !important;
      color: #1D5276 !important;
    }
  }
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.card {
  background-image: url('@/assets/knowledgebase/card-background.jpg');
  background-size: cover;
  width: calc(25% - 20px);
  height: 170px;
  margin: 0 10px 10px;
  border-radius: 20px;
  padding: 24px;
  position: relative;
  box-sizing: border-box;
  border: 2px solid #F1F4F7;
  &:hover {
    border: 2px solid #8cc7f0;
  }
  .card-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
  .card-top {
    display: flex;
    gap: 10px;
  }
  .card-img {
    width: 70px;
    height: 70px;
    object-fit: cover;
  }
  .card-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    overflow: hidden;
    color: #1D5276;
    padding: 5px;
    .card-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .card-description {
      font-size: 14px;
    }
  }
  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -5%;
    .more-icon {
      cursor: pointer;
      border-radius: 4px;
      padding: 5px;
      font-size: 30px;
      &:hover,
      &:active {
        background-color: #F1F4F7;
      }
    }
  }
  .card-time {
    font-size: 12px;
    color: #AFBCCD;
    svg{
width: 140px;
height: auto;
    }
  }
}
</style>