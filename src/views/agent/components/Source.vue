<template>
  <div class="agent-chat-source-content" :type="type" v-if="sourceList&&sourceList.length>0">
    <div class="agent-chat-source-item" v-for="(item,index) in sourceList">
      <!--   图片展示   -->
      <template v-if="type=='4'">
<!--        <div class="agent-chat-source-img" >-->
          <el-image :src="item"
                    :preview-src-list="sourceList"
                    :initial-index="index" show-progress
                    fit="cover"
          />
<!--        </div>-->
      </template>
      <template v-else>
        <div class="agent-chat-source-link">
          <span class="agent-chat-source-index">{{ index + 1 }}</span>
          <a v-if="type == '1'" class="agent-chat-source-website" target="_blank"
             :href="item.file">{{ item.file }}</a>
          <span v-else-if="type== '3'" class="agent-chat-source-website">{{ item.file }}</span>
        </div>
        <div class="agent-chat-source-subtitle">{{ item.title }}</div>
        <div class="agent-chat-source-desc" v-html="newline(item.raw_content)"></div>
        <el-divider v-if="!showAllIcon"/>
      </template>
    </div>
    <div class="agent-chat-source-all" v-if="showAllIcon">
      <span class="cursor-pointer"
                      @click="showAll()">{{ t ('agentObj.showAll1', {number: allNumber}) }}<el-icon
                    style="margin-left: 5px;vertical-align: -2px;" size="13"><Expand/></el-icon></span>
    </div>
  </div>
  <div v-else class="agent-chat-source-desc">{{ t ('agentObj.noContent') }}</div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
const { t } = useI18n ()
import { defineProps,defineEmits } from 'vue'
import {newline} from '@/utils'
const props = defineProps({
  sourceList: {
    type: Array,
    required: true
  },
  type:{
    type: String,
  },
  allNumber:{
    type: Number
  },
  showAllIcon:{
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['showAll'])
const showAll = () => {
  emit('showAll',props.type)
}
</script>


<style lang="scss" scoped>
@import './../../../style/components/agent.scss';
</style>
