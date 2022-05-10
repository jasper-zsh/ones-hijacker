<template>
    <el-dialog v-model="visible">
        <el-form label-width="80px">
            <el-form-item label="邮箱">
                <el-input v-model="account.email" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="account.password" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="account.note" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineExpose } from 'vue'

const visible = ref(false)
const account = ref()
const emit = defineEmits(['submit'])

const open = (accountObj: any) => {
  account.value = accountObj
  visible.value = true
}

const submit = () => {
  if (account.value.ID) {
    chrome.runtime.sendMessage({
      command: 'updateAccount',
      args: [account.value.ID, account.value]
    }, res => {
      visible.value = false
      emit('submit', res)
    })
  } else {
    chrome.runtime.sendMessage({
      command: 'createAccount',
      args: [account.value]
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
