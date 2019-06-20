<template>
  <div v-loading="loading">
    <div class="task-info-container">
      <h3>{{ task.title }}</h3>
      {{ task.desc }}
      
      </div>  
    </div>
</template>

<script>
import * as fb from "firebase";

export default {
  data() {
    return {
      stageId: this.$route.params.stageId,
      taskId: this.$route.params.taskId,

      task: null,
      loading: false
    };
  },
  mounted() {
    this.loading = true;
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.fetctTaskInfo();
        this.loading = false;
      } else {
        this.$router.push("/login");
      }
    });
  },
  computed: {
    currentUser() {
      return this.$store.getters["userState/user"];
    }
  },
  methods: {
    async fetctTaskInfo() {
        const taskInfo =  fb.database()
        .ref(`taskBoard/user-${this.currentUser.uid}/stages/${this.stageId}/tasks/${this.taskId}`);

        taskInfo.on('value', (snapshot) => {
          this.task = snapshot.val();
        });
    }
  }
};
</script>

<style>

.task-info-container {
  width: 600px;
  left: 50%;
  margin-left: -300px;
  position: absolute;
}


</style>
