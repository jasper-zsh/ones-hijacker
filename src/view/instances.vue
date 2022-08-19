<template>
    <div class="instances-tab">
      <el-button type="success" @click="createInstance">新建</el-button>
      <el-row :gutter="12">
        <el-col :span="6" v-for="instance in instances" :key="instance.ID">
          <el-card>
            <el-descriptions :column="2">
              <el-descriptions-item label="ID">{{instance.ID}}</el-descriptions-item>
              <el-descriptions-item label="模式">{{instance.mode}}</el-descriptions-item>
              <el-descriptions-item v-if="instance.mode === 'URL'" label="Project" :span="2">{{instance.project}}</el-descriptions-item>
              <el-descriptions-item v-if="instance.mode === 'URL'" label="Wiki" :span="2">{{instance.wiki}}</el-descriptions-item>
              <el-descriptions-item v-if="instance.mode === 'DEV'" label="分支名" :span="2">{{instance.project}}</el-descriptions-item>
              <el-descriptions-item v-if="instance.mode === 'STANDALONE'" label="地址" :span="2">{{instance.project}}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{instance.note}}</el-descriptions-item>
            </el-descriptions>
            <el-button type="danger" @click="deleteInstance(instance.ID)">删除</el-button>
          </el-card>
        </el-col>
      </el-row>
      <EditInstanceDialog ref="editDialog" @submit="loadInstances" />
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
