<template>
  <div v-loading="loading">
    <form @submit.prevent>
      <el-input v-model="post.text" placeholder="WASSAP?"></el-input>
      <br>
      <br>

      <el-button type="primary" :loading="loading" @click="addPost">post</el-button>
    </form>

    <div class="task" style="margin-top: 25px;" :key="index" v-for="(post, index) in posts">
      {{ post.text }}
    </div>
  </div>
</template>

<script>
import * as fb from "firebase";

export default {
  data() {
    return {
      loading: false,
      posts: [],
      post: {
        text: ""
      }
    };
  },
  mounted() {
    this.loadPosts();
  },
  computed: {
    currentUser() {
      return this.$store.getters["userState/user"];
    }
  },
  methods: {
    async addPost() {
      this.posts = [];

      this.loading = true;

      await fb
        .database()
        .ref(`posts/${this.currentUser.uid}`)
        .push(this.post);

this.loading = false;
    },
    async loadPosts() {
      const postsRef = await fb.database().ref(`posts/${this.currentUser.uid}`);

      postsRef.on("value", snapshot => {
        Object.keys(snapshot.val()).forEach(key => {
          this.posts.unshift(snapshot.val()[key]);
        });
      });
    }
  }
};
</script>

<style>

.task {
    display: inline-block;
    margin-right: 20px;
    box-sizing: border-box;
    padding: 25px;
    border: 1px solid #f2f2f2;
    border-radius: 3px;
}

</style>

