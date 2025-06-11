<template>
  <div class="container">
    <!-- 顶部操作区域 -->
    <div class="top-section">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <div class="field-group">
            <el-input v-model="searchText" :placeholder="t('Basetable.inputTip')" class="search-input">
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
        </el-col>

        <!-- 时间选择 -->
        <el-col :span="6">
          <div class="field-group">
            <label class="field-label">{{ t('Basetable.updatetime') }}</label>
            <el-date-picker v-model="value2" type="datetimerange" start-placeholder="Start date"
              end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss" class="date-picker" />
          </div>
        </el-col>

        <!-- 状态选择 + 上传按钮 -->
        <el-col :span="8">
          <div class="field-group status-upload">
            <label class="field-label">{{ t('Basetable.filestatus') }}</label>
            <el-select v-model="selectedStatus" :placeholder="t('Basetable.selectStatusPlaceholder')"
              class="status-select">
              <el-option :label="t('Basetable.all')" value="all" />
              <el-option :label="t('Basetable.already')" value="already" />
              <el-option :label="t('Basetable.uploading')" value="uploading" />
              <el-option :label="t('Basetable.queuing')" value="queuing" />
              <el-option :label="t('Basetable.failed')" value="failed" />
            </el-select>
            <el-button type="primary" class="upload-btn" @click="handleUploadeFile">
              <el-icon>
                <Plus />
              </el-icon>
              {{ t('Basetable.upload') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input ref="fileInput" type="file" accept=".pdf,.xls,.xlsx,.ppt,.pptx,.doc,.docx,.txt" multiple
      style="display: none" @change="handleFileSelect" />

    <!-- 删除确认组件 -->
    <Delete :dialogVisible="deleteDialogVisible" :deleteId="currentDeleteItem?.id || ''"
      @updateVisible="deleteDialogVisible = $event" @deleteConfirm="confirmDelete" />

    <!-- 表格区域 -->
    <el-table :data="filteredTableData" style="width: 100%" v-loading="loading" class="table-section">
      <el-table-column prop="name" :label="t('Basetable.filename')" min-width="40">
        <template #default="scope">
          <!-- 修复文件图标不显示的问题 -->
          <img class="spaceDetail-file-icon" :src="fileIcons[getFileType(scope.row.name[0])] || defaultIcon"
            alt="file-icon" />
          {{ scope.row.name[0] }}
        </template>
      </el-table-column>
      <el-table-column prop="size" :label="t('Basetable.filesize')" min-width="15" align="center" />
      <el-table-column prop="updateTime" :label="t('Basetable.updatetime')" min-width="15" align="center" />
      <el-table-column prop="status" :label="t('Basetable.filestatus')" min-width="25" align="center">
        <template #default="scope">
          <div class="status-tag" :class="getStatusClass(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('Basetable.tool')" min-width="10" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <!-- 删除按钮 -->
            <div class="icon-wrapper" @click="showDeleteDialog(scope.row)">
              <tabledelete></tabledelete>
            </div>
            <!-- 下载按钮 -->
            <div class="icon-wrapper" @click="handleDownload(scope.row)">
              <tabledownload></tabledownload>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import Delete from '@/components/Delete.vue';
import tabledelete from '@/assets/knowledgebase/delete.svg';
import tabledownload from '@/assets/knowledgebase/download.svg';
import { getknowledgeFiles, deleteFile, uploadFiles, } from '@/api/knowledgebaseMange';
import { useI18n } from 'vue-i18n';
import { KnowledgeUploadFile } from '@/utils/minio.js';
const { t } = useI18n();
const route = useRoute();
const loading = ref(false);
const fileInput = ref(null);
const searchText = ref('');
const selectedStatus = ref('all');
const value2 = ref([]);
const tableData = ref([]);// 表格数据
// 删除操作
const deleteDialogVisible = ref(false);
const currentDeleteItem = ref(null);

// 文件类型图标映射
import pdf from '@/assets/knowledgebase/pdf.png';
import doc from '@/assets/knowledgebase/doc.png';
import msg from '@/assets/knowledgebase/msg.png';
import xls from '@/assets/knowledgebase/xls.png';
import mp4 from '@/assets/knowledgebase/mp4.png';
import ppt from '@/assets/knowledgebase/ppt.png';
import txt from '@/assets/knowledgebase/txt.png';
const defaultIcon = '@/assets/knowledgebase/txt.png';//默认图标
const fileIcons = {
  pdf: pdf,
  msg: msg,
  xls: xls,
  xlsx: xls,
  mp4: mp4,
  doc: doc,
  docx: doc,
  ppt: ppt,
  pptx: ppt,
  txt: txt,
};

// 获取文件类型
const getFileType = (fileName) => {
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return fileExtension;
};

// 卡片信息
const cardInfo = {
  id: route.query.id,
  name: route.query.name,
  description: route.query.description,
  time: route.query.time,
};

// 获取文件数据
const fetchTableData = async () => {
  try {
    loading.value = true;
    const response = await getknowledgeFiles({ knowledge_name: cardInfo.name });
    console.log('接口返回数据：', response);

    if (Array.isArray(response.data.message)) {
      tableData.value = response.data.message.map((filename, index) => ({
        name: filename,
        size: '--',
        updateTime: '--', // 这里可以根据实际需要设置真实的更新时间
        status: 'already',
        id: `${index}_${filename}`, // 添加唯一ID用于删除操作
      }));
    } else {
      ElMessage.warning('返回数据格式不正确');
    }
  } catch (error) {
    console.error('获取文件数据失败', error);
    ElMessage.error('获取文件数据失败');
  } finally {
    loading.value = false;
  }
};

// 筛选后的表格数据 - 使用计算属性
const filteredTableData = computed(() => {
  let filtered = [...tableData.value];

  // 文件名搜索
  if (searchText.value.trim()) {
    const searchLower = searchText.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      // 确保 item.name 存在且为字符串
      const itemName = item.name ? String(item.name) : '';
      return itemName.toLowerCase().includes(searchLower);
    });
  }

  // 状态筛选
  if (selectedStatus.value && selectedStatus.value !== 'all') {
    filtered = filtered.filter((item) => {
      const itemStatus = item.status ? String(item.status) : '';
      return itemStatus === selectedStatus.value;
    });
  }

  // 时间范围筛选
  if (value2.value && value2.value.length === 2) {
    const [startDate, endDate] = value2.value;
    filtered = filtered.filter((item) => {
      if (!item.updateTime || item.updateTime === '--') return false;

      try {
        const itemDate = new Date(item.updateTime);
        // 检查日期是否有效
        if (isNaN(itemDate.getTime())) return false;
        return itemDate >= startDate && itemDate <= endDate;
      } catch (error) {
        console.warn('日期解析错误:', item.updateTime);
        return false;
      }
    });
  }

  return filtered;
});

// 状态样式映射
const getStatusClass = (status) => {
  const statusMap = {
    already: 'status-uploaded',
    failed: 'status-failed',
    uploading: 'status-uploading',
    queuing: 'status-queuing',
  };
  return statusMap[status] || '';
};

// 状态文本映射
const getStatusText = (status) => {
  const statusTextMap = {
    already: t('Basetable.already'),
    failed: t('Basetable.failed'),
    uploading: t('Basetable.uploading'),
    queuing: t('Basetable.queuing'),
  };
  return statusTextMap[status] || status;
};

// 生成uuid
const generateUniqueName = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}-${randomNum}`;
};

// 上传文件
const handleUploadeFile = async () => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.pdf,.md';
    input.onchange = async (event) => {
      const file = event.target.files?.[0];
      if (file.size > 104857600) {
        // 100MB in bytes
        alert($languageStore.getMessage('uploadfile_info'));
        return;
      }
      if (file) {
        loading.value = true;
        console.log('上传的文件名:', file.name);

        const uniqueName = generateUniqueName();
        const newFile = new File([file], uniqueName + file.name.slice(file.name.lastIndexOf('.')), {
          type: file.type,
        });
        console.log('newFile.name----', newFile.name);

        await KnowledgeUploadFile({ file: newFile }, null);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = {
          knowledge_name: cardInfo.name,
          file_name: file.name,
          minio_bucket_name: 'knowledge-file',
          minio_file_name: newFile.name,
        };

        const res2 = await uploadFiles(data);
        if (res2.data.status_code === '200') {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          fetchTableData();
        } else {
          console.log(res2);
        }
      }
    };
    input.click();
  } catch (error) {
    console.error('文件上传出错:', error);
  }
};

// 生命周期挂载时调用接口
onMounted(() => {
  console.log('接收到卡片信息：', cardInfo);
  fetchTableData();
});

//展示删除对话框
const showDeleteDialog = (row) => {
  currentDeleteItem.value = row;
  deleteDialogVisible.value = true;
};

//确认删除
const confirmDelete = async () => {
  if (!currentDeleteItem.value) return;
  try {
    loading.value = true;
    const data = {
      knowledge_name: cardInfo.name,
      file_name: currentDeleteItem.value.name[0]
    }
    const response = await deleteFile(data);
    console.log('删除文件响应：', response);

    if (response.data.success) {
      ElMessage.success('文件删除成功');
      fetchTableData();
    } else {
      ElMessage.error('文件删除失败');
    }
  } catch (error) {
    console.error('删除文件失败', error);
    ElMessage.error('删除文件失败');
  } finally {
    loading.value = false;
    deleteDialogVisible.value = false;
    currentDeleteItem.value = null;
  }
};

// 下载操作
const handleDownload = (row) => {
  ElMessage.info(`正在下载 ${row.name}`);
};

</script>

<style scoped lang="scss">
.container {
  padding: 4px 20px;
}

.top-section {
  margin: 20px 0;
}

.field-group {
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 6px;

  .field-label {
    margin-right: 20px;
    width: 40px;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
  }

  .search-input,
  .status-select {
    flex: 1;
    background-color: white;
    border-radius: 6px;
  }

  .date-picker {
    flex: 1;
    background-color: white;
    border-radius: 6px;
    width: 60%;
    margin-left: 10px;
  }
}

.status-upload {
  .upload-btn {
    margin-left: 12px;
    width: auto;
    height: 40px;
    background-color: #34a0e9;
    border-color: #34a0e9;
    border-radius: 6px;
  }
}

.search-input {
  width: 100%;
  background-color: white;
  border-radius: 6px;
}

.table-section {
  margin-top: 10px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;

  .spaceDetail-file-icon {
    width: 15px;
    height: 15px;
    // margin-right: 2px;
  }

  :deep(.el-table__body),
  :deep(.el-table__header),
  :deep(.el-table__cell) {
    background-color: white !important;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 35px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f1f4f7;
    }

    &:active {
      background-color: #f1f4f7;
    }

    svg {
      width: 17px;
      height: 17px;
    }
  }
}

// 状态标签样式
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  width: auto;

  &.status-uploaded {
    background-color: #4bd78d;
  }

  &.status-failed {
    background-color: #f64e4e;
  }

  &.status-uploading {
    background-color: #ff9d2d;
  }

  &.status-queuing {
    background-color: #34a0e9;
  }
}

// 强制背景色为白色
:deep(.el-input__inner),
:deep(.el-select .el-input__inner),
:deep(.el-date-editor),
:deep(.el-date-editor .el-input__inner) {
  background-color: white !important;
  border-radius: 6px !important;
}
</style>