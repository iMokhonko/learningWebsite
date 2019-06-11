<template>
  <div>
    <router-link to="/users/add">add user</router-link>
    <hr>
    <div :key="index" v-for="(user, index) in users">
      <li>Email: {{ user.email }} | Pass: {{ user.password }}</li>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.$http
      .get("http://localhost:3000/users")
      .then(response => response.json())
      .then(dbUsers => {
        console.log(dbUsers);
        this.users = dbUsers;
      });
  }
};
</script>

<style>
</style>

