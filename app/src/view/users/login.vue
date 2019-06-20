<template>
  <div>
    <form @submit.prevent>
      <h2>Email</h2>
      <el-input v-model="user.email" placeholder="email"></el-input>

      <h2>Password</h2>
      <el-input v-model="user.password" placeholder="passwrod"></el-input>
      <br>
      <br>

      <el-button type="primary" @click="login">Login</el-button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      this.$store.dispatch("userState/loginUser", this.user).then(user => {
        this.$router.push("/")
      });
    }
  }
};
</script>

<style>
</style>

