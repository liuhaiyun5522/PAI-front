<template>
  <el-header class="header">
    <div class="title">
      <img class="back" :src="backIcon" @mouseover="backIcon = backIconHover" @mouseleave="backIcon = backIconDefault"
        @click="goBack" />
      <span>{{ t('knowledgebaseManagement') }}--{{ route.query.base }}--{{ route.query.header }}</span>
    </div>
  </el-header>

  <div class="main">
    <div class="left">
      <div class="left-content">
        <div class="input-section">
          <label class="input-label">分割结果</label>
          <el-input v-model="searchText" placeholder="请输入搜索内容" style="width: 30%;" />
        </div>

        <div class="cards-container">
          <div v-for="(card, index) in cardList" :key="index" class="card-item">
            {{ card.content }}
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="right-content">
        <div class="tab-container">
          <button v-for="(tab, index) in tabs" :key="index" :class="['tab-button', { active: activeTab === index }]"
            @click="activeTab = index">
            {{ tab }}
          </button>
        </div>

        <div class="content-area">
          <!-- 这里可以根据activeTab显示不同的内容 -->
          <div v-if="activeTab === 0">思维导图内容</div>
          <div v-else-if="activeTab === 1">文章大纲内容</div>
          <div v-else-if="activeTab === 2">知识图谱内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import backIcon1 from '@/assets/knowledgebase/back-icon1.jpg';
import backIcon2 from '@/assets/knowledgebase/back-icon2.jpg';
import { listFile } from '@/api/knowledgebaseMange';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const backIconDefault = backIcon1;
const backIconHover = backIcon2;
const backIcon = ref(backIconDefault);

// 搜索文本
const searchText = ref('');

// Tab相关
const tabs = ['思维导图', '文章大纲', '知识图谱'];
const activeTab = ref(0);

// 卡片数据
const cardList = ref([
  { content: '这是第一个分割结果的内容，用于展示卡片的样式和布局效果。' },
  { content: '第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。第二个分割结果，包含更多的文本内容来测试高度为20ch的效果。' },
  { content: '第三个分割结果' },
  { content: '第四个分割结果，这里有更长的文本内容用于测试换行和高度限制的效果。' },
  { content: '第五个分割结果' },
  { content: '第六个分割结果，继续添加内容来测试滚动效果。' },
  { content: '第七个分割结果' },
  { content: '第八个分割结果，用于测试更多内容时的滚动条显示。' }
]);

// 返回上一页
const goBack = () => {
  router.back();
};

const init = async () => {
  const data = {
    knowledge_name: route.query.base,
    file_name: route.query.header
  }
  console.log(data)
  const response = await listFile(data);
  console.log(response)
};

// 生命周期挂载时调用接口
onMounted(() => {
  init()
});
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  height: 10vh;
  width: 100%;
  top: 0;
  display: flex;

  .back {
    width: 28px;
    height: 28px;
    margin-right: 10px;
    cursor: pointer;
  }

  .title {
    height: 10vh;
    width: 100%;
    border-bottom: 1px solid #AFBCCD;
    display: flex;
    align-items: center;
    color: #1D5276;
    font-size: 18px;
    font-weight: bold;
    position: relative;
  }

  .primary-button {
    color: #FFFFFF;
    position: absolute;
    right: 15px;
    background-color: #34A0E9;
    border-radius: 10px;
    width: 111px;
    height: 40px;
    border-color: #34A0E9;
  }
}

.main {
  display: flex;
  width: 100%;
  height: 90vh;
  margin-top: 10px;
  gap: 10px;
  padding: 0px 10px 10px 10px;

  .left {
    display: flex;
    width: 75%;
    height: calc(90vh - 20px);
    background-color: #FFFFFF;
    border-radius: 10px;

    .left-content {
      padding: 10px 10px 20px 10px;
      height: 90vh;
      display: flex;
      flex-direction: column;

      .input-section {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;

        .input-label {
          color: #1D5276;
          // font-weight: 500;
        }
      }

      .cards-container {
        flex: 1;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        align-content: start;
        // background-color: #1D5276;
        height: 10px;

        .card-item {
          background-color: #F1F4F7;
          padding: 15px;
          border-radius: 8px;
          height: 25vh;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }
      }
    }
  }

  .right {
    width: 25%;
    height: calc(90vh - 20px);
    background-color: #FFFFFF;
    border-radius: 10px;

    .right-content {
      height: 100%;
      display: flex;
      flex-direction: column;

      .tab-container {
        display: flex;
        padding: 10px 10px 0px 10px;
        gap: 5px;

        .tab-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          background-color: rgba(97, 176, 229, 0.5);
          color: #FFFFFF;

          &.active {
            background-color: #61B0E5;
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }

      .content-area {
        flex: 1;
        margin: 10px;
        background-color: #F1F4F7;
        border-radius: 8px;
        padding: 20px;
        color: #333;
      }
    }
  }
}
</style>