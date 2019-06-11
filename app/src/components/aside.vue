<template>
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
</template>

<script>
export default {
  name: "aside-menu",
  components: {}
};
</script>

<style>
.aside-menu {
  position: absolute;
  width:300px;
  height:100vh;
  background: #545c64;
}
</style>
