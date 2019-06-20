<template>
  <div id="app" class="container">
    <div class="header">
      <div class="header-breadcrumbs">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(breadcrumb, index) in breadCrumbsPath"
            v-bind:key="index"
            :to="{ path: breadcrumb.url }"
          >{{ breadcrumb.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="header-user-info">
        <div v-if="!isUserLoggedIn">
          <router-link to="/register">
            <el-button icon="el-icon-user" size="mini" type="primary">Register user</el-button>
          </router-link>
          <router-link to="/login">
            <el-button
              style="margin-left: 20px;"
              size="mini"
              icon="el-icon-user"
              type="primary"
            >Login</el-button>
          </router-link>
        </div>
        <div v-if="isUserLoggedIn">
          <el-button
            style="float:right;"
            size="mini"
            icon="el-icon-user"
            @click="logoutUser"
            type="primary"
          >logout</el-button>
          <el-image
            style="width: 30px; height: 30px; float:left;margin-right: 10px;border-radius:50%;"
            :src="currentUser.photoURL"
            fit="fill"
          ></el-image>
          <h2>{{ currentUser.displayName }}</h2>
        </div>
      </div>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: "Application",
  components: {
  },
  watch: {
    $route(to, from) {
      this.breadCrumbsPath = this.$route.meta.bread;
    }
  },
  data() {
    return {
      breadCrumbsPath: []
    };
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters["userState/isLoggedIn"];
    },
    currentUser() {
      return this.$store.getters["userState/user"];
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch("userState/logoutUser");
    }
  }
};
</script>

<style>
html,
body {
  overflow: auto;
  margin: 0;
  padding: 0;
}

.header {
  border-bottom: 1px solid #f2f2f2;
  width: 100%;
  height: 70px;
  margin-bottom: 50px;
}

.header-breadcrumbs {
  display: inline-block;
  width: 500px;
  margin-left: 25px;
  margin-top: 28px;
}

.header-user-info {
  width: 350px;
  float: right;
  margin-right: 25px;
}

</style>
