<template>
  <el-form-item :label="label">
    <el-input v-model="value">
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
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{
  modelValue: string,
  label: string,
  service: string
}>()

const value = ref(props.modelValue)

const emit = defineEmits(['update:modelValue'])

watch(value, (val) => {
  emit('update:modelValue', val)
})

const urlByBranch = () => {
  ElMessageBox.prompt('请输入分支名', '快速生成').then((e) => {
    value.value = `https://devapi.myones.net/${props.service}/${e.value}`
  })
}

</script>
