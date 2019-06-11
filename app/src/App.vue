<template>
  <div id="app">
    <el-container>
      <el-aside>
        <asideMenu></asideMenu>
      </el-aside>

      <el-container style="padding: 25px;">
          <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import asideMenu from "./components/aside.vue";

export default {
  name: "Application",
  components: {
    asideMenu
  }
};
</script>

<style>
html,
body {
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
}

.page-header {
  display: block;
  background: #f2f2f2;
  width: 100%;
}
</style>
