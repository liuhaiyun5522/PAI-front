<template>
  <div class="user-list">
    <!-- 添加按钮 -->
    <el-button class="add-button" @click="dialogVisible = true">
      <el-icon>
        <Plus />
      </el-icon>
      {{ t('add') }}
    </el-button>
    <el-button class="export-button">
      <el-icon>
        <Plus />
      </el-icon>
      {{ t('export') }}
    </el-button>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="t('usermng.adduser')" width="900px" :show-close="true" class="custom-dialog">
      <div class="dialog-body">
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
          <el-button class="confirm-button" @click="handleConfirm">{{ t('confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--顶部 筛选栏 -->
    <div class="top-section">
      <el-form label-position="left" label-width="auto" :inline="true" size="large">
        <el-form-item>
          <el-input v-model="selectedStatus" style="width: 330px;height: 40px; " :placeholder="t('inputTip')">
            <template #suffix>
              <el-icon color="#000000" size="15" class="cursor-pointer">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item :label="t('usermng.addtime')">
          <el-date-picker v-model="value2" style="width: 300px;height: 40px;" type="datetimerange"
            :start-placeholder="t('usermng.starttime')" :end-placeholder="t('usermng.endtime')"
            format="YYYY-MM-DD HH:mm:ss" class="date-picker" />
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" class="table-section" style="width: 100%;">
      <el-table-column prop="userId" label="ID" min-width="8" align="center" />
      <el-table-column prop="username" :label="t('usermng.name')" min-width="10" align="center" />
      <el-table-column prop="email" :label="t('usermng.email')" min-width="20" align="center" />
      <el-table-column prop="createdAt" :label="t('usermng.addtime')" min-width="20" align="center">
        <template #default="scope">
          {{ formatDateTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLogin" :label="t('usermng.lastlogintime')" min-width="20" align="center">
        <template #default="scope">
          {{ formatDateTime(scope.row.lastLogin) }}
        </template>
      </el-table-column>
      <el-table-column prop="permissionLevel" :label="t('usermng.permission')" min-width="10" align="center">
        <template #default="scope">
          <span> {{ t('usermng.mng') }}</span>
          <el-switch v-model="scope.row.permissionLevel" size="small" :active-value="1" :inactive-value="0" active-color="#13ce66"
            inactive-color="#ff4949" @change="handlePermissionChange(scope.row)" />
        </template>
      </el-table-column>/>
      <el-table-column :label="t('usermng.tool')" min-width="12" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <div class="icon-wrapper" @click="handleEdit(scope.$index)">
              <tableedit></tableedit>
            </div>
            <div class="icon-wrapper" @click="handleDelete(scope.$index)">
              <tabledelete></tabledelete>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" :total="fullData.length" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { getuserList } from '@/api/userManage';
import tableedit from '@/assets/usermng/edit.svg';
import tabledelete from '@/assets/usermng/delete.svg';
const { t } = useI18n();
const { useMenu } = useStore();
const $router = useRouter();

const dialogVisible = ref(false);
const createName = ref('');
const createIntro = ref('');
const searchText = ref('');
const value2 = ref('');
const selectedStatus = ref('');



const currentPage = ref(1); // 当前页码
const pageSize = 10;        // 每页条数
const total = ref(0);       // 总条数

const fullData = ref([]);   // 所有数据
const tableData = ref([]);  // 当前页显示的数据

// 时间格式转换函数
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    // 处理 ISO 8601 格式: 2025-06-05T15:31:42 或 2025-06-05T15:31:42.123Z
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString; // 如果转换失败，返回原字符串
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('日期格式转换错误:', error);
    return dateString; // 出错时返回原字符串
  }
};

const init = async () => {
  try {
    const res = await getuserList({
      page: currentPage.value,
      pageSize: pageSize,
      // permissionLevel: None
    })
    if (res) {
      console.log(res.data.data.users)
      fullData.value = res.data.data.users;
      updateTableData();
    } else {
      // ElMessage.error(t('login.loginFailed'))
    }

  } catch (error) {
    const msg = error.response?.status === 500
    console.log(error)
  }
};

const allData = ref([
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  },
  {
    userId: '100008',
    username: '张三',
    email: 'zhangsan@example.com',
    createdAt: '2024-05-01 10:00:00',
    lastLogin: '2024-05-01 10:00:00',
    permissionLevel: "1"
  }
]);

const updateTableData = () => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  tableData.value = fullData.value.slice(start, end);
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  updateTableData();
};

const handlePermissionChange = (row) => {
  console.log(`用户 ${row.name} 权限变为：${row.permissionLevel}`);
}

onMounted(() => {
  init();
  // fullData.value = allData.value;
  updateTableData();
});

</script>

<style scoped lang="scss">
.user-list {
  padding: 15px 20px;
  position: relative;
  height: 90vh; // 固定高度
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  .add-button {
    color: #FFFFFF;
    position: absolute;
    right: 150px;
    top: -55px;
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

  .export-button {
    color: #FFFFFF;
    position: absolute;
    right: 15px;
    top: -55px;
    background-color: #FF9D2D;
    border-radius: 10px;
    width: 111px;
    height: 40px;
    border-color: #FF9D2D;
    z-index: 11;

    &:hover,
    &:active {
      background-color: #FFCB8F !important;
      color: #693F0E !important;
    }
  }

  .custom-dialog {
  border-radius: 20px !important;

//   .el-dialog__header {
//   border-bottom: 1px solid #dcdfe6; /* Element Plus 默认分割线色 */
// }
//   .el-dialog__body {
//     padding: 30px 0;
//     height: 300px;
//     box-sizing: border-box;
//   }

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
  ::v-deep(.el-form-item__label) {
    font-size: 16px;
    color: #012A2D;
  }

  .top-section{
    height: 40px;
  }
  
  .table-section {
    flex: 1; // 让表格区域自适应剩余空间
    overflow: auto;
    // max-height: 80vh;
    background-color: white;
    border-radius: 10px;
    font-size: 14px;
    margin-top: 10px; 
    margin-bottom: 10px; 
    
    :deep(.el-table__body),
    :deep(.el-table__header),
    :deep(.el-table__cell) {
      background-color: white !important;
    }
    
    // 设置表格行高为50px
    :deep(.el-table__row) {
      height: 50px !important;
    }
    
    // 设置表格单元格高度和垂直居中
    :deep(.el-table__cell) {
      height: 59px !important;
      padding: 0 !important;
      
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        line-height: 50px;
      }
    }
    
    // 设置表头行高
    :deep(.el-table__header-wrapper .el-table__row) {
      height: 50px !important;
    }
    
    // 设置表头单元格
    :deep(.el-table__header .el-table__cell) {
      height: 50px !important;
      padding: 0 !important;
      
      .cell {
        height: 50px;
        line-height: 50px;
      }
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
      width: 40px;
      height: 30px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #F1F4F7;
      }
      
      &:active {
        background-color: #F1F4F7;
      }
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
    
  }

  .pagination {
    margin-top: auto; // 自动推到底部
    display: flex;
    justify-content: center;
    height: 25px;
  }
}
</style>