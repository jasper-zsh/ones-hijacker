<template>
  <div class="main_app">
    <el-form label-width="80px" style="width: 100%">
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
    <el-button @click="openSettings">设置</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup () {
    const instances = ref()
    const status = ref()
    const accounts = ref()
    const currentInstance = ref()
    const currentAccount = ref()

    const loadInstances = function () {
      chrome.runtime.sendMessage({
        command: 'loadInstances'
      }, res => {
        instances.value = res
      })
    }
    const gotStatus = (status: any) => {
      currentInstance.value = status.instance.ID
      currentAccount.value = status.account.ID
    }
    const loadStatus = () => {
      chrome.runtime.sendMessage({
        command: 'loadStatus'
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
      chrome.runtime.sendMessage({
        command: 'selectAccount',
        args: [id]
      }, res => {
        gotStatus(res)
      })
    }
    const selectInstance = (id: any) => {
      chrome.runtime.sendMessage({
        command: 'selectInstance',
        args: [id]
      }, res => {
        gotStatus(res)
      })
    }

    return {
      instances,
      accounts,
      status,
      currentInstance,
      currentAccount,
      loadInstances,
      selectInstance,
      selectAccount
    }
  },
  methods: {
    accountName (account: any) {
      if (account.instance) {
        return `[${account.instance.note}] ${account.email}`
      } else if (account.note && account.note.length > 0) {
        return account.note
      } else {
        return account.email
      }
    },
    openSettings () {
      chrome.runtime.openOptionsPage()
    }
  }
})
</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 500px;
  height: 200px;
}
</style>
