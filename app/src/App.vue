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
  mounted() {

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

.ps {
  overflow: hidden !important;
  overflow-anchor: none;
  -ms-overflow-style: none;
  touch-action: auto;
  -ms-touch-action: auto;
}

/*
 * Scrollbar rail styles
 */
.ps__rail-x {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear, opacity 0.2s linear;
  -webkit-transition: background-color 0.2s linear, opacity 0.2s linear;
  height: 15px;
  /* there must be 'bottom' or 'top' for ps__rail-x */
  bottom: 0px;
  /* please don't change 'position' */
  position: absolute;
}

.ps__rail-y {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear, opacity 0.2s linear;
  -webkit-transition: background-color 0.2s linear, opacity 0.2s linear;
  width: 15px;
  /* there must be 'right' or 'left' for ps__rail-y */
  right: 0;
  /* please don't change 'position' */
  position: absolute;
}

.ps--active-x > .ps__rail-x,
.ps--active-y > .ps__rail-y {
  display: block;
  background-color: transparent;
}

.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
  opacity: 0.6;
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
  background-color: #eee;
  opacity: 0.9;
}

/*
 * Scrollbar thumb styles
 */
.ps__thumb-x {
  background-color: #aaa;
  border-radius: 6px;
  transition: background-color 0.2s linear, height 0.2s ease-in-out;
  -webkit-transition: background-color 0.2s linear, height 0.2s ease-in-out;
  height: 6px;
  /* there must be 'bottom' for ps__thumb-x */
  bottom: 2px;
  /* please don't change 'position' */
  position: absolute;
}

.ps__thumb-y {
  background-color: #aaa;
  border-radius: 6px;
  transition: background-color 0.2s linear, width 0.2s ease-in-out;
  -webkit-transition: background-color 0.2s linear, width 0.2s ease-in-out;
  width: 6px;
  /* there must be 'right' for ps__thumb-y */
  right: 2px;
  /* please don't change 'position' */
  position: absolute;
}

.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
  background-color: #999;
  height: 11px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
  background-color: #999;
  width: 11px;
}

/* MS supports */
@supports (-ms-overflow-style: none) {
  .ps {
    overflow: auto !important;
  }
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .ps {
    overflow: auto !important;
  }
}

</style>
