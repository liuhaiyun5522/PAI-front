<template>
  <div class="database-tabs-content">
    <div class="database-form">
      <span class="database-tabs-total">合計 {{ infoList.length }} 段</span>
      <el-input v-model="searchName" style="width: 350px;" :placeholder="t('searchPlaceholder')">
        <template #prefix>
          <el-icon class="el-input__icon">
            <search/>
          </el-icon>
        </template>
      </el-input>
    </div>
    <div>
      <div v-for="(item,index) in infoList" class="database-tabs-box" @click="showDetail(index)">
        <span class="database-tabs-tag">##{{ index + 1 }}</span>
        <!--        <div>{{item.title}}</div>-->
        <div class="database-tabs-detail" v-html="newline(item.detail)"></div>
      </div>
    </div>
    <el-drawer v-model="visible" :modal="false" size="36%" class="database-drawer">
      <template #header="{ close, titleId, titleClass }">
        <div>
          <span class="database-drawer-title">チャンキング </span>
          <span class="database-tabs-tag">##{{ activeDetail.number }}</span>
        </div>
      </template>
      <div v-html="newline(activeDetail.detail)"></div>
    </el-drawer>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";

const {t} = useI18n ()
const props = defineProps ({
  id: String
})
import {newline} from '@/utils'

const searchName = ref ('')
const infoList = ref ([])

function getInfoList () {
  infoList.value = [
    {
      detail: '契約社員就業規則  シービーアールイー株式会社\n２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    },
    {
      detail: '２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    },
    {
      detail: '２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    },
    {
      detail: '２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    },
    {
      detail: '２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    },
    {
      detail: '２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    },
    {
      detail: '２ 前項の通算契約期間は、２０１３年４月１日以降に開始する有期雇用契約の契約期間を通算するものとし、現在締結している有期労働契約については、その末日までの期間とする。ただし、労働契約が締結されていない期間が連続して６箇月以上ある契約社員については、それ以前の契約期間は通算契約期間に含めない。３ この規則に定める契約社員に適用される労働条件は、第１項の規定による'
    }
  ]
}
getInfoList ()

const visible = ref(false)
const activeDetail = ref({})
function showDetail(index){
  activeDetail.value = {
    ...infoList.value[index],
    number:index+1
  }
  visible.value = true
}
</script>

<style scoped lang="scss">
@import "@/style/components/database.scss";
</style>

