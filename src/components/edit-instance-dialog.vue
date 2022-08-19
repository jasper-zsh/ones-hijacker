<template>
  <el-dialog v-model="visible">
    <el-form label-width="80px">
      <el-form-item label="模式">
        <el-select v-model="instance.mode">
          <el-option value="DEV">Dev</el-option>
          <el-option value="URL">指定URL</el-option>
          <el-option value="STANDALONE">私有部署</el-option>
        </el-select>
      </el-form-item>
      <div v-if="instance.mode === 'URL'">
        <url-generator label="Project地址" service="project" v-model="instance.project" />
        <url-generator label="Wiki地址" service="wiki" v-model="instance.wiki" />
      </div>
      <div v-if="instance.mode === 'DEV'">
        <el-form-item label="分支名">
          <el-input v-model="instance.project" />
        </el-form-item>
      </div>
      <div v-if="instance.mode === 'STANDALONE'">
        <el-form-item label="私有部署地址">
          <el-input v-model="instance.project" />
        </el-form-item>
      </div>
      <el-form-item label="备注">
        <el-input v-model="instance.note" />
      </el-form-item>
    </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineExpose, ref, defineEmits } from 'vue'
import UrlGenerator from './url-generator.vue'

const visible = ref(false)
const instance = ref()

const emit = defineEmits(['submit'])

const open = (instanceObj: any) => {
  instance.value = instanceObj
  visible.value = true
}

const submit = () => {
  if (instance.value.ID) {
    chrome.runtime.sendMessage({
      command: 'updateInstance',
      args: [instance.value.ID, instance.value]
    }, res => {
      visible.value = false
      emit('submit', res)
    })
  } else {
    chrome.runtime.sendMessage({
      command: 'createInstance',
      args: [instance.value]
    }, res => {
      visible.value = false
      emit('submit', res)
    })
  }
}

defineExpose({
  open
})

</script>
