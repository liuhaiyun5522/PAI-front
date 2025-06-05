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
    <el-dialog v-model="dialogVisible" :title="t('addDatabase')" width="900px" :show-close="true" class="custom-dialog">
      <div class="dialog-body">
        <div class="line"></div>
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

    <!-- 顶部区域 -->
    <div class="top-section">
      <el-row :gutter="10">
        <!-- 搜索框 -->
        <el-col :span="5">
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
        <el-col :span="5">
          <div class="field-group status-upload">
            <label class="field-label">{{ t('usermng.department') }}</label>
            <el-select v-model="selectedStatus" placeholder="请选择状态" class="status-select">
              <el-option label="全部" value="全部" />
              <el-option label="开发部" value="开发部" />
              <el-option label="设计部" value="设计部" />
              <el-option label="测试部" value="测试部" />
              <el-option label="管理部" value="管理部" />
            </el-select>
          </div>
        </el-col>
        <!-- 状态选择 -->
        <el-col :span="6">
          <div class="field-group status-upload">
            <label class="field-label">{{ t('usermng.status') }}</label>
            <el-select v-model="selectedStatus" placeholder="请选择状态" class="status-select">
              <el-option label="全部" value="全部" />
              <el-option label="已上传" value="已上传" />
              <el-option label="上传中" value="上传中" />
              <el-option label="正在排队" value="正在排队" />
              <el-option label="上传失败" value="上传失败" />
            </el-select>
          </div>
        </el-col>
        <!-- 时间选择器 -->
        <el-col :span="8">
          <div class="field-group">
            <label class="field-label">{{ t('usermng.addtime') }}</label>
            <el-date-picker v-model="value2" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss" class="date-picker" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" class="table-section">
      <el-table-column prop="id" label="ID" min-width="5%" />
      <el-table-column prop="username" :label="usermng.name" min-width="10%" />
      <el-table-column prop="pic" :label="tableLabels.pic" min-width="10%" align="center" />
      <el-table-column prop="userid" :label="tableLabels.email" min-width="25%" align="center" />
      <el-table-column prop="password" :label="tableLabels.password" min-width="10%" align="center" />
      <el-table-column prop="position" :label="tableLabels.position" min-width="10%" />
      <el-table-column prop="department" :label="tableLabels.department" min-width="10%" align="center" />
      <el-table-column prop="status" :label="tableLabels.status" min-width="10%" align="center" />
      <el-table-column prop="permissionLevel" :label="tableLabels.permission" min-width="10%" align="center" >
        <template #default="scope">
      <span>管理员</span>
      <el-switch
        v-model="scope.row.permissionLevel"
        :active-value="1"
        :inactive-value="0"
        @change="handlePermissionChange(scope.row)"
      />
    </template>
      </el-table-column>
      <el-table-column prop="addtime" :label="tableLabels.addtime" min-width="15%" align="center" />
      <el-table-column :label="tableLabels.tool" min-width="10%" align="center">
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

const allData = ref([
  {
    id: '1',
    username: '张三',
    pic: 'avatar1.png',
    status: '已上传',
    userid: 'zhangsan@example.com',
    permissionLevel: 1,
    password: '123456',
    position: '开发',
    department: '开发部',
    addtime: '2024-05-01 10:00:00'
  },
  {
    id: '2',
    username: '李四',
    pic: 'avatar2.png',
    status: '上传中',
    userid: 'lisi@example.com',
    permissionLevel: 0,
    password: 'abcdef',
    position: '设计',
    department: '设计部',
    addtime: '2024-05-02 10:00:00'
  },
  {
    id: '3',
    username: '王五',
    pic: 'avatar3.png',
    status: '正在排队',
    userid: 'wangwu@example.com',
    permissionLevel: 1,
    password: '654321',
    position: '测试',
    department: '测试部',
    addtime: '2024-05-03 10:00:00'
  },
  {
    id: '4',
    username: '赵六',
    pic: 'avatar4.png',
    status: '上传失败',
    userid: 'zhaoliu@example.com',
    permissionLevel: 0,
    password: 'pass123',
    position: '管理',
    department: '管理部',
    addtime: '2024-05-04 10:00:00'
  },
  {
    id: '5',
    username: '孙七',
    pic: 'avatar5.png',
    status: '已上传',
    userid: 'sunqi@example.com',
    permissionLevel: 1,
    password: 'sunqi2024',
    position: '开发',
    department: '开发部',
    addtime: '2024-05-05 10:00:00'
  },
  {
    id: '1',
    username: '张三',
    pic: 'avatar1.png',
    status: '已上传',
    userid: 'zhangsan@example.com',
    permissionLevel: 1,
    password: '123456',
    position: '开发',
    department: '开发部',
    addtime: '2024-05-01 10:00:00'
  },
  {
    id: '2',
    username: '李四',
    pic: 'avatar2.png',
    status: '上传中',
    userid: 'lisi@example.com',
    permissionLevel: 0,
    password: 'abcdef',
    position: '设计',
    department: '设计部',
    addtime: '2024-05-02 10:00:00'
  },
  {
    id: '3',
    username: '王五',
    pic: 'avatar3.png',
    status: '正在排队',
    userid: 'wangwu@example.com',
    permissionLevel: 1,
    password: '654321',
    position: '测试',
    department: '测试部',
    addtime: '2024-05-03 10:00:00'
  },
  {
    id: '4',
    username: '赵六',
    pic: 'avatar4.png',
    status: '上传失败',
    userid: 'zhaoliu@example.com',
    permissionLevel: 0,
    password: 'pass123',
    position: '管理',
    department: '管理部',
    addtime: '2024-05-04 10:00:00'
  },
  {
    id: '5',
    username: '孙七',
    pic: 'avatar5.png',
    status: '已上传',
    userid: 'sunqi@example.com',
    permissionLevel: 1,
    password: 'sunqi2024',
    position: '开发',
    department: '开发部',
    addtime: '2024-05-05 10:00:00'
  },
  {
    id: '1',
    username: '张三',
    pic: 'avatar1.png',
    status: '已上传',
    userid: 'zhangsan@example.com',
    permissionLevel: 1,
    password: '123456',
    position: '开发',
    department: '开发部',
    addtime: '2024-05-01 10:00:00'
  },
  {
    id: '2',
    username: '李四',
    pic: 'avatar2.png',
    status: '上传中',
    userid: 'lisi@example.com',
    permissionLevel: 0,
    password: 'abcdef',
    position: '设计',
    department: '设计部',
    addtime: '2024-05-02 10:00:00'
  },
  {
    id: '3',
    username: '王五',
    pic: 'avatar3.png',
    status: '正在排队',
    userid: 'wangwu@example.com',
    permissionLevel: 1,
    password: '654321',
    position: '测试',
    department: '测试部',
    addtime: '2024-05-03 10:00:00'
  },
  {
    id: '4',
    username: '赵六',
    pic: 'avatar4.png',
    status: '上传失败',
    userid: 'zhaoliu@example.com',
    permissionLevel: 0,
    password: 'pass123',
    position: '管理',
    department: '管理部',
    addtime: '2024-05-04 10:00:00'
  },
  {
    id: '5',
    username: '孙七',
    pic: 'avatar5.png',
    status: '已上传',
    userid: 'sunqi@example.com',
    permissionLevel: 1,
    password: 'sunqi2024',
    position: '开发',
    department: '开发部',
    addtime: '2024-05-05 10:00:00'
  }
]);


// 表头翻译
const tableLabels = {
  name: t('usermng.name'),
  pic: t('usermng.pic'),
  email: t('usermng.email'),
  password: t('usermng.password'),
  position: t('usermng.position'),
  department: t('usermng.department'),
  status: t('usermng.status'),
  permission: t('usermng.permission'),
  addtime: t('usermng.addtime'),
  tool: t('usermng.tool')

};
// // 模拟获取数据（你可以换成真实的 getknowledgeList 请求）
// const fetchTableData = async () => {
//   // 这里用模拟数据替代
//   const res = await getuserList({ page: currentPage.value, pageSize: pageSize,permissionLevel:0 }); // 替换为真实请求
//   console.log(res)
// };

const updateTableData = () => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  tableData.value = fullData.value.slice(start, end);
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  updateTableData();
};


const  handlePermissionChange =(row) =>{
    console.log(`用户 ${row.name} 权限变为：${row.permissionLevel}`);
    // 可以在这里调用API更新数据库中的权限状态
  }

onMounted(() => {
  fullData.value = allData.value; // 如果你后续用 getuserList，这里可以替换掉
  updateTableData(); // 初始化分页显示
});


</script>

<style scoped lang="scss">
.user-list {
  padding: 15px 20px;
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

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

.top-section {
  width: 100%;
  box-sizing: border-box;
}

.field-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.field-label {
  width: 70px;
  text-align: right;
  margin-right: 10px;
  color: #333;
  flex-shrink: 0;
}

.status-upload {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-btn {
  margin-left: 10px;
}


.table-section {
  flex: 1; // 让表格区域自适应剩余空间
  overflow: auto;
  max-height: 80vh;
  margin-top: 10px;
  background-color: white;
  border-radius: 10px;

  :deep(.el-table__body),
  :deep(.el-table__header),
  :deep(.el-table__cell) {
    background-color: white !important;
  }
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
