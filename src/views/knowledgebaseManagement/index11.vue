<template>
  <div class="knowledge-list">
    <div class="card" v-for="item in knowledgeList" :key="item.id">
      <div class="card-inner" @click="goToCardDetail(item)">

        <div class="card-main-area">
          <img class="card-icon" src="@/assets/knowledgebase/card-img.jpg" alt="icon" />

          <div class="card-text">
            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-description">{{ item.description || '暂无描述' }}</p>
          </div>
        </div>

        <div class="card-bottom">
          <p class="card-time">{{ formatDate(item.create_time) }}</p>
          <el-dropdown trigger="click" @command="(command) => handleCommand(command, item)">
            <span class="el-dropdown-link" @click.stop> 
              <el-icon class="more-icon">
                <MoreFilled />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="rename">
                  <el-icon><RenameIcon /></el-icon> 
                  <span style="margin-left: 5px;">重命名</span>
                </el-dropdown-item>
                
                <el-dropdown-item command="delete" divided>
                  <el-icon><DeleteIcon /></el-icon> 
                  <span style="margin-left: 5px;">删除</span>
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
// 2. ElDropdown, ElDropdownMenu, ElDropdownItem 是新加的
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon } from 'element-plus';
import { MoreFilled, } from '@element-plus/icons-vue';
import RenameIcon from '@/assets/icon-rename.svg?component';
import DeleteIcon from '@/assets/icon-delete2.svg?component'; 
import { getknowledgeList } from '@/api/knowledgebaseMange'
import { useRouter, useRoute } from 'vue-router';
import useStore from '@/store';

const { useMenu } = useStore();
const knowledgeList = ref([]);
// const hovered = ref(false); // 移除，因为 ElDropdown 处理了交互
// const popoverItem = ref(null); // 移除，因为不再需要手动控制 Popover

const userid = ref("1")
const $router = useRouter();

// 模拟数据 (你的 fetchData)
const fetchData = () => {
  const data = {
    "status_code": 200, "message": [
      { "id": "7d2e8369-0b36-4a67-b968-be515c3ab6ad", "name": "TEST", "description": "测试用", "milvus_name": "TEST", "graph_name": "1", "user_id": 1, "create_time": "2025-04-29T10:18:21" },
      { "id": "81325626-e717-42a6-b795-84178985ed08", "name": "dlyh", "description": "", "milvus_name": "dlyh", "graph_name": "2", "user_id": 1, "create_time": "2025-04-29T15:29:54" },
      { "id": "6ac526f1-cbc4-4f8a-b6e3-e97138c0fdc9", "name": "Smarttransportation", "description": "智慧交通", "milvus_name": "Smarttransportation", "graph_name": "3", "user_id": 1, "create_time": "2025-04-29T16:06:43" },
      { "id": "ea918614-7373-4f6b-b9ed-81c7755a19de", "name": "Nanko", "description": "南光ナレッジベーステスト", "milvus_name": "Nanko", "graph_name": "5", "user_id": 1, "create_time": "2025-05-12T09:46:00" },
      { "id": "4445f4b3-3e98-4f66-8def-a99076309d01", "name": "hokenn", "description": "", "milvus_name": "hokenn", "graph_name": "0", "user_id": 1, "create_time": "2025-05-21T14:22:26" },
      { "id": "72286f0a-6724-4278-b999-7ab371ad8119", "name": "AAAA", "description": "", "milvus_name": "AAAA", "graph_name": "4", "user_id": 1, "create_time": "2025-05-21T14:28:27" }
    ]
  };
  knowledgeList.value = data.message;
};

// 格式化时间
const formatDate = (date) => {
  const d = new Date(date);
  // 使用 toLocaleString 并指定 'ja-JP' (日本) 或 'zh-CN' (中国) 来匹配你图片中的格式
  // year-month-day hour:minute 格式
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
};

// 文件管理页
const goToCardDetail = (item) => {
  useMenu.currentActivePage = "BasefileManagement";
  $router.push({
    name: "BasefileManagement", query: {
      id: item.id, name: item.name, description: item.description, time: item.create_time
    }
  });
};

// 2. 不再需要 openPopover
// const openPopover = (item) => { ... };

// 重命名和删除函数保持不变
const rename = (item) => {
  // 这里可以加入 Element Plus 的 ElMessageBox.prompt 来实现真正的重命名
  console.log(`重命名：${item.name}`);
  alert(`重命名：${item.name}`);
};

const deleteItem = (item) => {
  // 这里可以加入 Element Plus 的 ElMessageBox.confirm 来确认删除
  console.log(`删除：${item.name}`);
  alert(`删除：${item.name}`);
};

// 2. 新增 ElDropdown 的命令处理函数
const handleCommand = (command, item) => {
  // 阻止事件冒泡，防止触发 goToCardDetail
  // event.stopPropagation(); // ElDropdown 内部似乎处理了冒泡，如果还有问题再加

  if (command === 'rename') {
    rename(item);
  } else if (command === 'delete') {
    deleteItem(item);
  }
};


onMounted(() => {
  fetchData()
});
</script>

<style scoped lang="scss">
.knowledge-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 30px 20px;
}

.card {
//background-image: url('@/assets/knowledgebase/card-background.jpg');

//background-size: cover;

//background-position: center center; 

width: calc((100% - 3 * 20px) / 4);

height: 170px;

margin-bottom: 30px;

margin-right: 20px;

border-radius: 20px;

box-sizing: border-box;

border: 2px solid transparent;

transition: border 0.2s ease;

position: relative; // 伪元素定位需要
overflow: hidden;   // 圆角裁剪需要 

&::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('@/assets/knowledgebase/card-background.jpg'); // 背景图在这里设置
    background-size: cover;
    background-position: center;
    z-index: 1; // 把它放在内容层之下 (我们让内容层是 2) 
  }



  &:nth-child(4n) {
    margin-right: 0;
  }

  &:hover {
    border: 2px solid #8cc7f0;
  }

  .card-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 20px 20px 0px 20px; // 上20 右20 下0 左20 
    box-sizing: border-box;
    cursor: pointer;
    position: relative; // 确保内容层建立新的层叠上下文 
    z-index: 2;         // 确保内容层在背景层之上 
  }

  .card-main-area {
    display: flex;
    align-items: flex-start; // 核心: 垂直居中对齐 
    gap: 15px;
    // flex-grow: 1; 
    min-height: 60px; 
  }

  .card-icon {
    width: 60px;   // 使用确认的尺寸
    height: 60px;  // 使用确认的尺寸
    object-fit: contain;
    flex-shrink: 0;
  }

  .card-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start; // 文字内部也左对齐
    // justify-content: center; // 核心: 文字内部也居中
    flex-grow: 1;
    overflow: hidden;
  }

  .card-title {
    font-size: 20px;
    font-weight: 700;
    color: #1D5276;
    font-family: "Microsoft YaHei";
    margin: 0 0 4px 0; // 标题和描述之间留一点小间距
    padding: 0;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-description {
    font-size: 14px;
    font-weight: 400;
    color: #1D5276;
    font-family: "Microsoft YaHei";
    margin: 0; 
    padding: 0;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-top: 10px;
  }

  .card-time {
    font-size: 10px;
    font-weight: 400;
    color: #AFBCCD;
    font-family: "Microsoft YaHei";
  }

  .el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 50%;

    &:hover {
        background-color: #f0f0f0;
    }
  }

  .more-icon {
      font-size: 20px;
      color: #888;
  }
}
</style>