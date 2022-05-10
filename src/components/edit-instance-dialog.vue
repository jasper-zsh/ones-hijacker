<template>
    <el-dialog v-model="visible">
        <el-form label-width="80px">
            <el-form-item label="地址">
                <el-input v-model="instance.base_url">
                  <template #prepend>
                    <el-dropdown split-button>
                      快速生成
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="urlByBranch">分支名</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-input>
            </el-form-item>
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
import { ElMessageBox } from 'element-plus'
import { defineExpose, ref, defineEmits } from 'vue'

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

const urlByBranch = () => {
  ElMessageBox.prompt('请输入分支名', '快速生成').then(({ value }) => {
    instance.value.base_url = `https://dev.myones.net/project/${value}/api/project`
    instance.value.note = `DEV Branch ${value}`
  })
}

defineExpose({
  open
})

</script>
