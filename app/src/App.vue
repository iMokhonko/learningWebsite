<template>
  <div id="app">
    <el-container>
      <el-aside width="250px">
        <div class="aside-menu">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="height:100%;"
          >
            <el-menu-item index="1">
              <span>Tasks</span>
            </el-menu-item>

            <el-menu-item index="2">
              <span>Settings</span>
            </el-menu-item>
          
          </el-menu>
        </div>
      </el-aside>

      <el-container style="padding: 25px;">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Application",
  components: {}
};
</script>

<style>
html, body {
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.aside-menu {
  position: relative;
  height:100vh;
  background: #545c64;
}

.page-header {
  display: block;
  background: #f2f2f2;
  width: 100%;
}
</style>
