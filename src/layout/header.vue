<template>
  <el-header class="header">
    <div class="title">  
      <img
        class="back"
        :src="backIcon"
         v-if="route.name === 'BasefileManagement'"
        @mouseover="backIcon = backIconHover"
        @mouseleave="backIcon = backIconDefault"
        @click="goBack"
      />
      <span>{{ t( route.name ) }}</span>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useStore from '@/store';
import { useRouter  ,useRoute} from 'vue-router';
import backIcon1 from '@/assets/knowledgebase/back-icon1.jpg';
import backIcon2 from '@/assets/knowledgebase/back-icon2.jpg';

const { useMenu } = useStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const backIconDefault = backIcon1;
const backIconHover = backIcon2;
const backIcon = ref(backIconDefault);

// 返回上一页
const goBack = () => {
  router.back();
  
};
</script>


<style lang="scss" scoped>
.header {
  position: relative;
  height: 10vh;
  display: flex;
  position: absolute;
  height: 10vh;
  width: 100% ;
  .back {
    width: 28px;
    height: 28px;
    // background-color: #34A0E9;
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
</style>
