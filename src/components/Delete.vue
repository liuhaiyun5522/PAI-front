<template>
  <el-dialog
      v-model="visible"
      :title="t('delete')"
      width="580"
      :show-close="false"
      class="dialog-style"
  >
    <div class="delete-content">
      <img :src="Imgdelete" alt="">
      <div v-html="newline(t('deleteTip3'))"></div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="$emit('updateVisible', false)">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="$emit('deleteConfirm')">
          確  認
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {useI18n} from "vue-i18n";
const { t } = useI18n ()
import {defineProps,computed,ref,defineEmits} from "vue";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  deleteId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['updateVisible','deleteConfirm'])
const visible = computed({
  get: () => props.dialogVisible,
  set: (value) => emit('updateVisible', value)
})
import Imgdelete from '@/assets/delete.png'
//删除弹出框
const deleteId = ref('')
import {newline} from '@/utils'


</script>

<style scoped>

</style>
