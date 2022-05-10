<template>
  <div class="main_app" v-loading="loading">
    <el-image class="fun-img" :src="require('../assets/fun.png')" />
    <div class="body">
      <el-form class="select-form" label-width="80px">
        <el-form-item label="服务">
          <el-select v-model="currentInstance" @change="selectInstance">
            <el-option
              v-for="instance in instances"
              :key="instance.ID"
              :label="instance.note"
              :value="instance.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-select v-model="currentAccount" @change="selectAccount">
            <el-option
              v-for="account in accounts"
              :key="account.ID"
              :label="accountName(account)"
              :value="account.ID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="openSettings">管理</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const instances = ref()
const status = ref()
const accounts = ref()
const currentInstance = ref()
const currentAccount = ref()
const loading = ref(false)

const loadInstances = function () {
  chrome.runtime.sendMessage({
    command: 'loadInstances'
  }, res => {
    instances.value = res
  })
}
const gotStatus = (status: any) => {
  loading.value = false
  if (status.error_msg) {
    ElMessage.error({
      message: status.error_msg,
      showClose: true
    })
  }
  currentInstance.value = status.instance.ID
  currentAccount.value = status.account.ID
}
const loadStatus = () => {
  chrome.runtime.sendMessage({
    command: 'checkStatus'
  }, res => {
    status.value = res
    gotStatus(res)
  })
}
const loadAccounts = () => {
  chrome.runtime.sendMessage({
    command: 'loadAccounts'
  }, res => {
    accounts.value = res
  })
}
onMounted(loadInstances)
onMounted(loadStatus)
onMounted(loadAccounts)

const selectAccount = (id: any) => {
  loading.value = true
  chrome.runtime.sendMessage({
    command: 'selectAccount',
    args: [id]
  }, res => {
    gotStatus(res)
  })
}
const selectInstance = (id: any) => {
  loading.value = true
  chrome.runtime.sendMessage({
    command: 'selectInstance',
    args: [id]
  }, res => {
    gotStatus(res)
  })
}

const accountName = (account: any) => {
  if (account.instance) {
    return `[${account.instance.note}] ${account.email}`
  } else if (account.note && account.note.length > 0) {
    return account.note
  } else {
    return account.email
  }
}
const openSettings = () => {
  chrome.runtime.openOptionsPage()
}
</script>

<style lang="scss">
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  align-items: center;
  .fun-img {
    width: 200px;
    height: 200px;
  }
  .select-form {
    width: 400px;
    .el-select {
      width: 100%;
    }
  }
}

</style>
