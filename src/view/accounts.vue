<template>
    <div class="accounts-tab">
        <el-table :data="accounts">
            <el-table-column prop="ID" label="ID" />
            <el-table-column prop="instance.note" label="实例" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="note" label="备注" />
            <el-table-column>
                <template #header>
                    <el-button size="small" type="success" @click="createAccount">新建</el-button>
                </template>
                <template #default="scope">
                    <el-button size="small" @click="editAccount(scope.row)">编辑</el-button>
                    <el-popconfirm
                        title="确认要删除吗？"
                        confirm-button-type="danger"
                        @confirm="deleteAccount(scope.row.ID)"
                    >
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <edit-account-dialog ref="editDialog" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import EditAccountDialog from '../components/edit-account-dialog.vue'

const accounts = ref()
const editDialog = ref()

const loadAccounts = () => {
  chrome.runtime.sendMessage({
    command: 'loadAccounts'
  }, res => {
    accounts.value = res
  })
}
const deleteAccount = (id: any) => {
  chrome.runtime.sendMessage({
    command: 'deleteAccount',
    args: [id]
  }, res => {
    loadAccounts()
  })
}

onMounted(loadAccounts)

const createAccount = () => {
  editDialog.value.open({})
}

const editAccount = (account: any) => {
  console.log('edit', account)
  editDialog.value.open(account)
}
</script>

<style lang="scss" scoped>
.accounts-tab {}
</style>
