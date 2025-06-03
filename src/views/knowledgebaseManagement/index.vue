<template>
  <div class="knowledge-list">
    <el-button class="primary-button"  type="primary" @click="dialogVisible = true">
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
      <div class="card-inner" @click="goToCardDetail(item)">
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
                <el-dropdown-item @click="rename(item)">
                  <el-icon>
                    <RenameIcon />
                  </el-icon>
                  <span style="margin-left: 5px;"> {{ t('rename') }}</span>
                </el-dropdown-item>

                <el-dropdown-item @click="confirmDelete(item)" divided>
                  <el-icon>
                    <DeleteIcon />
                  </el-icon>
                  <span style="margin-left: 5px;"> {{ t('delete') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getknowledgeList, createknowledgeabse, dropknowledgeabse } from '@/api/knowledgebaseMange';
import RenameIcon from '@/assets/icon-rename.svg?component';
import DeleteIcon from '@/assets/icon-delete2.svg?component';
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


// 确认删除函数
const confirmDelete = (item) => {
    // 弹出确认框
    ElMessageBox.confirm(
        `确定要删除知识库 "${name}" 吗？`,
        // $languageStore.getMessage('knowledge_del_notice'),
        // '警告',
        {
            confirmButtonText: `ok`,
            cancelButtonText: `no`,
            type: 'warning',
        }
    ).then(async () => {
        // 用户确认删除
        await deleteItem(item);
    }).catch(() => {
        // 用户取消删除
        console.log('取消删除');
    });
};


const deleteItem = async (item) => {
  console.log(item)
  try {
    const payload = {
      name:item.name,
      userid: "1"
    };
    const response = await dropknowledgeabse(payload);
    console.log('删除知识库成功:', response.data);
    await init(); // 重新获取知识库列表
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
  }
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
  border-radius: 10px;
  width: 111px;
  height: 40px;
  z-index: 11;

  &:hover,
  &:active {
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
    position: relative; // 确保内容层建立新的层叠上下文 
    z-index: 2; // 确保内容层在背景层之上 
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
    padding: 8px;

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
      // transition: background-color 0.3s ease;

      &:hover,
      &:active {
        background-color: #F1F4F7; // 或者 #e0e0e0 也不错
      }
    }

  }

  .card-time {
    font-size: 12px;
    color: #AFBCCD;
  }


  .el-popover {
    padding: 10px;
  }
}
</style>
