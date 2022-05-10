<template>
  <div class="main_app">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="服务实例" name="instances">
        <instances />
      </el-tab-pane>
      <el-tab-pane label="账号" name="accounts">
        <accounts />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import accounts from './accounts.vue'
import Instances from './instances.vue'
export default defineComponent({
  components: { accounts, Instances },
  setup () {
    const activeTab = ref('instances')

    return {
      activeTab
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
}
</style>
