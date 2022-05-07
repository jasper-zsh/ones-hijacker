<template>
    <div class="instances-tab">
        <el-table :data="instances">
            <el-table-column prop="ID" label="ID" />
            <el-table-column prop="base_url" label="地址" />
            <el-table-column prop="note" label="备注" />
            <el-table-column>
                <template #header>
                    <el-button size="small" type="success" @click="createInstance">新建</el-button>
                </template>
                <template #default="scope">
                    <el-button size="small" @click="editInstance(scope.row)">编辑</el-button>
                    <el-popconfirm
                        title="确认要删除吗？"
                        confirm-button-type="danger"
                        @confirm="deleteInstance(scope.row.ID)"
                    >
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <EditInstanceDialog ref="editDialog" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import EditInstanceDialog from '../components/edit-instance-dialog.vue'

const instances = ref()
const editDialog = ref()

const loadInstances = () => {
  chrome.runtime.sendMessage({
    command: 'loadInstances'
  }, res => {
    instances.value = res
  })
}

onMounted(loadInstances)

const deleteInstance = (id: any) => {
  chrome.runtime.sendMessage({
    command: 'deleteInstance',
    args: [id]
  }, res => {
    loadInstances()
  })
}

const createInstance = () => {
  editDialog.value.open({})
}

const editInstance = (instance: any) => {
  editDialog.value.open(instance)
}

</script>

<style lang="scss" scoped>
.instances-tab {}
</style>
