<template>
  <div class="container">
    <!-- 顶部区域 -->
    <div class="top-section">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <div class="field-group">
            <el-input v-model="searchText" placeholder="请输入搜索内容" class="search-input">
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
            <label class="field-label"> {{ t('Basetable.filestatus') }}</label>
            <el-select v-model="selectedStatus" placeholder="请选择状态" class="status-select">
              <el-option label="全部" value="全部" />
              <el-option label="已上传" value="已上传" />
              <el-option label="上传中" value="上传中" />
              <el-option label="正在排队" value="正在排队" />
              <el-option label="上传失败" value="上传失败" />
            </el-select>
            <el-button type="primary" class="upload-btn"> <el-icon>
                <Plus />
              </el-icon> {{ t('Basetable.upload') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" class="table-section">
      <el-table-column prop="name" :label="tableLabels.name" min-width="40%" />
      <el-table-column prop="size" :label="tableLabels.size" min-width="15%" align="center" />
      <el-table-column prop="updateTime" :label="tableLabels.updateTime" min-width="15%" align="center" />
      <el-table-column prop="status" :label="tableLabels.status" min-width="25%" align="center" />
      <el-table-column :label="tableLabels.action" min-width="10%" align="center">
        <template #default="scope">
          <el-icon @click="handleDelete(scope.$index)" size="18px">
            <Delete />
          </el-icon>
          <el-icon @click="handleDownload(scope.row)" size="18px">
            <Download />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'; // 添加 onMounted
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search, Delete, Download, Plus } from '@element-plus/icons-vue';
import { getknowledgeFiles } from '@/api/knowledgebaseMange';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

// 卡片信息
const cardInfo = {
  id: route.query.id,
  name: route.query.name,
  description: route.query.description,
  time: route.query.time,
};

console.log('接收到卡片信息：', cardInfo);

// UI数据绑定
const searchText = ref('');
const selectedStatus = ref('全部');
const value2 = ref([]);

// 表头翻译
const tableLabels = {
  name: t('Basetable.filename'),
  size: t('Basetable.filesize'),
  updateTime: t('Basetable.updatetime'),
  status: t('Basetable.filestatus'),
  action: t('Basetable.tool')
};

// 表格数据
const tableData = ref([]);

// 获取文件数据
const fetchTableData = async () => {
  try {
    const response = await getknowledgeFiles({ knowledge_name: cardInfo.name, user_id: "1" }); // 传递name作为参数
    console.log('接口返回数据：', response);
    
    if (Array.isArray(response.data.message)) {
      tableData.value = response.data.message.map((filename, index) => ({
        name: filename,
        size: '--', // 你可以替换为实际的 size
        updateTime: '--', // 同上
        status: '已上传', // 或根据接口数据设置
      }));
    } else {
      ElMessage.warning('返回数据格式不正确');
    }
  } catch (error) {
    console.error('获取文件数据失败', error);
    ElMessage.error('获取文件数据失败');
  }
};

// 生命周期挂载时调用接口
onMounted(() => {
  fetchTableData();
});

// 删除 & 下载操作
const handleDelete = (index) => {
  tableData.value.splice(index, 1);
  ElMessage.success('文件已删除');
};

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
    background-color: #34A0E9;
    border-color: #34A0E9;
    border-radius: 6px;
  }
}

.search-input {
  width: 100%;
  // height: 50px;
  background-color: white;
  border-radius: 6px;
}

.table-section {
  margin-top: 10px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;

  :deep(.el-table__body),
  :deep(.el-table__header),
  :deep(.el-table__cell) {
    background-color: white !important;
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
