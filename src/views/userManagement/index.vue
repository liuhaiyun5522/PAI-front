<template>
  <div class="user-list">
    <!-- 添加按钮 -->
    <el-button class="add-button" @click="addDialogVisible = true">
      <el-icon>
        <Plus />
      </el-icon>
      {{ t('add') }}
    </el-button>
    <el-button class="export-button" @click="exportToExcel()">
      <el-icon>
        <Plus />
      </el-icon>
      {{ t('export') }}
    </el-button>

    <!-- 删除确认组件 -->
    <Delete :dialogVisible="deleteDialogVisible" :deleteId="currentDeleteUser?.userId || ''"
      @updateVisible="deleteDialogVisible = $event" @deleteConfirm="confirmDelete" />

    <!-- 弹窗 -->
    <el-dialog v-model="addDialogVisible" :title="t('usermng.adduser')" width="650px" :show-close="true"
      class="custom-dialog">
      <div class="dialog-body">
        <div class="form-section">
          <label class="form-label">{{ t('usermng.name') }}</label>
          <el-input v-model="addName" :placeholder="t('usermng.namePlaceHolder')" class="custom-input long" />
        </div>
        <div class="form-section">
          <label class="form-label">{{ t('usermng.email') }}<span style="color: red">*</span></label>
          <el-input v-model="addEmail" :placeholder="t('usermng.emailPlaceHolder')" class="custom-input long" />
        </div>

        <div class="form-section">
          <label class="form-label">{{ t('usermng.password') }}<span style="color: red">*</span></label>
          <el-input v-model="addPassword" :placeholder="t('usermng.passwordPlaceHolder')" class="custom-input long" />
        </div>
        <div class="form-section">
          <label class="form-label">{{ t('usermng.permission') }}<span style="color: red">*</span></label>
          <el-select class="chat-select" v-model="llm_name" style="width: 190px;">
            <el-option v-for="item in permission" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-container">
          <el-button class="confirm-button" @click="handleConfirm()">{{ t('confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 顶部 筛选栏 -->
    <div class="top-section">
      <el-form label-position="left" label-width="auto" :inline="true" size="large">
        <el-form-item>
          <el-input v-model="usernameFilter" style="width: 330px;height: 40px;" :placeholder="t('usermng.name')"
            @input="filterTable">
            <template #suffix>
              <el-icon color="#000000" size="15" class="cursor-pointer">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item :label="t('usermng.addtime')">
          <el-date-picker v-model="dateRange" style="width: 370px;height: 40px;" type="datetimerange"
            :start-placeholder="t('usermng.starttime')" :end-placeholder="t('usermng.endtime')"
            format="YYYY-MM-DD HH:mm:ss" class="date-picker" @change="filterTable" />
        </el-form-item>
      </el-form>
    </div>


    <!-- 表格区域 -->
    <el-table :data="tableData" v-loading="loading" class="table-section" style="width: 100%;">
      <el-table-column prop="userId" label="ID" min-width="10" align="center" />
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
          <el-switch v-model="scope.row.permissionLevel" size="small" :active-value="0" :inactive-value="1"
            active-color="#13ce66" inactive-color="#ff4949" @change="handlePermissionChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column :label="t('usermng.tool')" min-width="10" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <!-- 修改删除按钮点击事件 -->
            <div class="icon-wrapper" @click="showDeleteDialog(scope.row)">
              <tabledelete></tabledelete>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" :total="filteredData.length" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { getuserList, createuser, deleteuser, editeuserpermission } from '@/api/userManage';
import tableedit from '@/assets/usermng/edit.svg';
import tabledelete from '@/assets/usermng/delete.svg';
import Delete from '@/components/Delete.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { t } = useI18n();
const { useMenu } = useStore();
const $router = useRouter();

const addEmail = ref('');
const addName = ref('');
const addPassword = ref('');
const llm_name = ref("0")
const addDialogVisible = ref(false);
const loading = ref(false)
const deleteDialogVisible = ref(false)
const currentPage = ref(1); // 当前页码
const pageSize = 10;        // 每页条数

// 筛选相关
const usernameFilter = ref(''); // 用户名筛选
const dateRange = ref('');      // 时间范围筛选

const fullData = ref([]);       // 所有数据
const tableData = ref([]);      // 当前页显示的数据

// 新增：保存当前要删除的用户信息
const currentDeleteUser = ref(null);

const permission = [
  {
    label: t('usermng.mng'), // 管理员
    value: '1'
  },
  {
    label: t('usermng.commonuser'), // 普通用户
    value: '0'
  }
]

// 计算过滤后的数据
const filteredData = computed(() => {
  let filtered = fullData.value;

  // 按用户名筛选
  if (usernameFilter.value) {
    filtered = filtered.filter(user => 
      user.username && user.username.toLowerCase().includes(usernameFilter.value.toLowerCase())
    );
  }

  // 按时间范围筛选
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value;
    filtered = filtered.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate >= startDate && userDate <= endDate;
    });
  }

  return filtered;
});

// 时间格式转换函数
const formatDateTime = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
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
    return dateString;
  }
};

const init = async () => {
  try {
    loading.value = true
    const res = await getuserList({
      page: currentPage.value,
      pageSize: pageSize,
    })
    if (res.data.data) {
      console.log(res.data.data.users)
      fullData.value = res.data.data.users;
      updateTableData();
      loading.value = false
    } else {
      // ElMessage.error(t('login.loginFailed'))
    }
  } catch (error) {
    const msg = error.response?.status === 500
    console.log(error)
  }
};

// 更新表格数据
const updateTableData = () => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  tableData.value = filteredData.value.slice(start, end);
};

// 筛选表格数据
const filterTable = () => {
  currentPage.value = 1; // 重置到第一页
  updateTableData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  updateTableData();
};

// 修改权限变更处理函数
const handlePermissionChange = async (row) => {
  try {
    const res = await editeuserpermission(row.userId, {
      permissionLevel: row.permissionLevel,
      reason: ""
    });

    if (res) {
      console.log('权限修改成功:', res);
    } else {
      row.permissionLevel = row.permissionLevel === 1 ? 0 : 1;
      ElMessage.error("修改失败");
    }
  } catch (error) {
    row.permissionLevel = row.permissionLevel === 1 ? 0 : 1;
    console.error('权限修改出错:', error);
  }
};

// 创建用户确认按钮
const handleConfirm = async () => {
  try {
    const res = await createuser({
      email: addEmail.value,
      username: addName.value,
      password: addPassword.value,
      permissionLevel: llm_name.value,
    })
    if (res) {
      console.log(res)
      addDialogVisible.value = false
      // 清空表单
      addEmail.value = '';
      addName.value = '';
      addPassword.value = '';
      llm_name.value = "0";
      init()
    } else {
      // 处理错误
    }
  } catch (error) {
    const msg = error.response?.status === 500
    console.log(error)
  }
}

// 新增：显示删除确认对话框
const showDeleteDialog = (user) => {
  currentDeleteUser.value = user;
  deleteDialogVisible.value = true;
};

// 新增：确认删除用户
const confirmDelete = async () => {
  if (!currentDeleteUser.value) return;

  try {
    console.log('删除用户ID:', currentDeleteUser.value.userId);
    const res = await deleteuser(currentDeleteUser.value.userId);

    if (res) {
      console.log('删除成功:', res);
      deleteDialogVisible.value = false;
      currentDeleteUser.value = null;
      init(); // 重新加载数据
    } else {
      // ElMessage.error('删除失败')
    }
  } catch (error) {
    console.error('删除用户出错:', error);
    // ElMessage.error('删除失败')
  }
};

onMounted(() => {
  init();
});

// 监听 filteredData 变化，自动更新表格数据
import { watch } from 'vue';
watch(filteredData, () => {
  updateTableData();
}, { deep: true });

// 导出表格数据为 Excel
const exportToExcel = () => {
  // 使用过滤后的数据导出
  const data = filteredData.value.map(item => ({
    ID: item.userId,
    [t('usermng.name')]: item.username,
    [t('usermng.email')]: item.email,
    [t('usermng.addtime')]: formatDateTime(item.createdAt),
    [t('usermng.lastlogintime')]: formatDateTime(item.lastLogin),
    [t('usermng.permission')]: item.permissionLevel === 1 ? t('usermng.mng') : t('usermng.commonuser'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, t('usermng.userlist'));

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${t('usermng.userlist')}.xlsx`);
};

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
      width: 400px;
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
      margin-top: -20px;
    }

    .dialog-footer-container {
      width: 550px;
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

  .top-section {
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
      color: #000000 !important;
      ;
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
      width: 45px;
      height: 35px;
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
        width: 17px;
        height: 17px;
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