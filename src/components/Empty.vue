<template>
  <el-empty :image="emptyImg">
    <template #description>
      <div class="empty-text" v-html="t('empty')"></div>
    </template>
  </el-empty>
</template>

<script setup>
import emptyImg from '@/assets/empty.png'
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
</script>

<style scoped>
.empty-text{
  color: #778E9C;
}
:deep(.empty-add){
  color: #80BBAD;
}
</style>
