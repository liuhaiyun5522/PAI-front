<template>
  <div class="knowledge-list">
    <el-button class="primary-button" @click="dialogVisible = true">
      <el-icon>
        <Plus />
      </el-icon>
      {{ t('add') }}
    </el-button>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="t('addDatabase')" width="900px" :show-close="true" class="custom-dialog">

      <div class="dialog-body">
        <div class="line">

        </div>
        <div class="form-section">
          <label class="form-label">{{ t('formName') }}<span style="color: red">*</span></label>
          <el-input v-model="createName" :placeholder="t('namePlaceholder')" class="custom-input short" />
        </div>

        <div class="form-section">
          <label class="form-label">{{ t('formDesc') }}</label>
          <el-input v-model="createIntro" type="textarea" :rows="4" :placeholder="t('descPlaceholder')"
            class="custom-input long" />
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


    <div class="card" v-for="item in knowledgeList" :key="item.id" @click="goToCardDetail(item)"
      @mouseover="hovered = true" @mouseleave="hovered = false">
      <div class="card-content">
        <div class="card-top">
          <img class="card-img" src="@/assets/knowledgebase/card-img.jpg" alt="card image" />
          <div class="card-text">
            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-description">{{ item.description }}</p>
          </div>
        </div>
        <div class="card-bottom">
        <p class="card-time">{{ formatDate(item.create_time) }}</p>
        <el-icon @click.stop="openPopover(item)">
          <MoreFilled />
        </el-icon>
        <el-popover trigger="click" v-if="popoverItemId === item.id" placement="bottom">
          <el-button @click="rename(item)">{{ t('rename') }}</el-button>
          <el-button @click="deleteItem(item)">{{ t('delete') }}</el-button>
        </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getknowledgeList, createknowledgeabse } from '@/api/knowledgebaseMange';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { useMenu } = useStore();

const knowledgeList = ref([]);
const popoverItemId = ref(null); // 用id做标识
const dialogVisible = ref(false);
const createName = ref('');
const createIntro = ref('');
const $router = useRouter();

const init = async () => {
  const response = await getknowledgeList({ userid: "1" });
  knowledgeList.value = response.data.message;
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString('zh-CN', options);
};

const handleConfirm = async () => {
  if (!createName.value.trim()) {
    ElMessage.error(t('knowledgeNameRequired') || "知识库名称为必填项");
    return;
  }
  const payload = {
    name: createName.value,
    description: createIntro.value,
    userid: "1"
  };
  await createknowledgeabse(payload);
  dialogVisible.value = false;
  createName.value = '';
  createIntro.value = '';
  init();
};

const goToCardDetail = (item) => {
  useMenu.currentActivePage = "BasefileManagement";
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

const openPopover = (item) => {
  if (popoverItemId.value === item.id) {
    popoverItemId.value = null;
  } else {
    popoverItemId.value = item.id;
  }
};

const rename = (item) => {
  alert(`重命名：${item.name}`);
  popoverItemId.value = null; // 关闭弹窗
};

const deleteItem = (item) => {
  alert(`删除：${item.name}`);
  popoverItemId.value = null; // 关闭弹窗
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
}

.primary-button {
  color: #FFFFFF;
  position: absolute;
  right: 15px;
  top: 20px;
  background-color: #34A0E9;
  border-radius: 10px;
  width: 111px;
  height: 40px;
  border-color: #34A0E9;
  z-index: 11;

  &:hover,
  &:active {
    background-color: #ADDEFF !important;
    color: #1D5276 !important;
  }
}

.custom-dialog {
  border-radius: 20px !important;

  .line {
    width: 100%;
    border-bottom: 1px solid #AFBCCD;
    margin-bottom: 20px;
  }

  .el-dialog__body {
    padding: 30px 0;
    height: 300px;
    box-sizing: border-box;
  }

  .form-section {
    width: 800px;
    margin: 0 auto 30px auto;
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 16px;
    margin-bottom: 10px;
    text-align: left;
    font-weight: bold;
    color: #000000;
  }

  .custom-input {
    background-color: #f1f4f7;
    border-radius: 8px;

    &.short .el-input__wrapper {
      height: 150px; // 原来是100px + 50px
      display: flex;
      align-items: center;
      background-color: #f1f4f7;
      border-radius: 8px;
    }

    &.long .el-textarea__inner {
      height: 200px !important; // 原来是150px + 50px
      background-color: #f1f4f7;
      border-radius: 8px;
    }
  }

  .dialog-footer {
    padding: 0px 30px;
    margin-top: -20px; // 往上挪一点
  }

  .dialog-footer-container {
    width: 800px;
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

  &:hover {
    border: 2px solid #8cc7f0;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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
    justify-content: space-between;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .card-description {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-time {
    font-size: 12px;
    color: #888;
  }

  .el-icon {
    cursor: pointer;
  }

  .el-popover {
    padding: 10px;
  }
}
</style>
