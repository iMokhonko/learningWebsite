<template>
  <div>
    <div v-if="!isUserLoggedIn">
      <router-link to="/user/register">
        <el-button icon="el-icon-user" type="primary">Register user</el-button>
      </router-link>
      <router-link to="/user/login">
        <el-button style="margin-left: 20px;" icon="el-icon-user" type="primary">Login</el-button>
      </router-link>
    </div>
    <div v-if="isUserLoggedIn">
      <el-button style="float:right;" icon="el-icon-user" @click="logoutUser" type="primary">logout</el-button>
      <el-image style="width: 40px; height: 40px; float:left;margin-right: 20px;" :src="currentUser.photoURL" fit="fill"></el-image><h1>{{ currentUser.displayName }} </h1>

      <posts></posts>
    </div>
  </div>
</template>

<script>

import posts from '../../components/posts'

export default {
  data() {
    return {};
  },
  components: {
    posts
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
</style>

