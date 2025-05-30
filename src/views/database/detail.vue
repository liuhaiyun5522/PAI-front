<template>
  <div class="database">
    <div class="database-container">
      <div class="database-title">
        <span>/{{ t ('databaseTitle') }}/{{ detailForm.name }}/{{detailForm.fileName}}</span>
      </div>
      <el-tabs
          v-model="activeName"
          type="card"
          class="database-tabs"
      >
        <!--  内容片段      -->
        <el-tab-pane label="チャンキング" name="0">
          <Information :id="id"></Information>
        </el-tab-pane>
        <!--  拓扑图      -->
        <el-tab-pane label="ナレッジグラフ" name="1">
          <Chart :id="id"></Chart>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import Information from './components/information.vue'
import Chart from './components/chart.vue'
//获取知识库详情
import {ref} from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n ()
import {useRoute} from "vue-router";
const $route = useRoute ()
const id = ref('')
id.value = $route.query.id
const detailForm = ref ({})
function getDatabaseDetail () {
  detailForm.value = {
    name: 'People',
    desc: '人事行政に関する資料です',
    fileName:'02_契約社員就業規則_20241001.xls'
  }
}
getDatabaseDetail()
//tabs
const activeName = ref('0')
</script>

<style scoped lang="scss">
@import "@/style/components/database.scss";
</style>
