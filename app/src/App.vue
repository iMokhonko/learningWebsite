<template>
  <div id="app" class="container">

        <el-breadcrumb style="margin-bottom: 50px;" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(breadcrumb, index) in breadCrumbsPath" v-bind:key="index" :to="{ path: breadcrumb.url }">{{ breadcrumb.name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div>
          <router-view></router-view>
        </div>
    
  </div>
</template>

<script>
import asideMenu from "./components/aside.vue";

export default {
  name: "Application",
  components: {
    asideMenu
  },
  watch: {
    $route(to, from) {
      this.breadCrumbsPath = this.$route.meta.bread
    }
  },
  data() {
    return {
      breadCrumbsPath: [] 
    }
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

.container {
  width: 800px;
  left:50%;
  margin-left:-400px;
  position: relative;
  margin-top: 50px;
}
</style>
