<template>
  <div v-loading="loading">
    <div class="task-info-container">
      <h3>{{ task.title }}</h3>
      {{ task.desc }}
      <br>
      <br>
      <br>

      <el-timeline>
        <el-timeline-item
          :icon="period.type == 'created' ? 'el-icon-plus' : period.type == 'finished' ? 'el-icon-check ' : period.type == 'edited' ? 'el-icon-edit' : period.type == 'movedBack' ? 'el-icon-back' : ''"
          v-for="(period, index) in task.lifecycle"
          :key="index"
          size="large"
          :type="period.type == 'created' ? 'info' : period.type == 'finished' ? 'success ' : period.type == 'edited' ? 'warning' : period.type == 'movedBack' ? 'warning' : ''"
          :timestamp="new Date(period.date).toLocaleString('ru-RU')"
        >
          <div v-show="period.type == 'created'">Created in {{ period.toStage }}</div>

          <div
            v-show="period.type == 'finished'"
          >Finished stage '{{ period.fromStage }}' (moved to stage '{{ period.toStage }}')</div>

          <div v-show="period.type == 'movedBack'">
            Moved back ({{ period.fromStage }}
            <i style="font-size: 11px;" class="el-icon-right"></i>
            {{ period.toStage }})
            <br>
            <b>Reason:</b>
            {{period.desc ? period.desc : '-'}}
          </div>

          <div v-show="period.type == 'edited'">
            Edited
            <el-button
              size="mini"
              @click="openEditDetailsWindow(period)"
              type="text"
              round
            >(see changes)</el-button>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog title="Edit changes" :visible.sync="editDetailsWindow" width="30%">
      <div v-if="taskPrevState.title != taskNewState.title">
        <div class="task-state-change-label">Title</div>
        <div class="task-state">
          <pre>{{taskPrevState.title}}</pre>
        </div>
        <div class="task-state-divide-arrow">
          <i class="el-icon-right"></i>
        </div>
        <div class="task-state">
          <pre>{{taskNewState.title}}</pre>
        </div>
      </div>

      <div v-if="taskPrevState.desc != taskNewState.desc">
        <div class="task-state-change-label">Desc</div>
        <div class="task-state">
          <pre>{{taskPrevState.desc}}</pre>
        </div>
        <div class="task-state-divide-arrow">
          <i class="el-icon-right"></i>
        </div>
        <div class="task-state">
          <pre>{{taskNewState.desc}}</pre>
        </div>
      </div>

      <div v-if="taskPrevState.priority != taskNewState.priority">
        <div class="task-state-change-label">Priority</div>
        <div class="task-state">
          <el-rate
            v-model="taskPrevState.priority"
            disabled
            :colors="['#ecf0f1', '#f1c40f', '#d35400', '#c0392b']"
          ></el-rate>
        </div>
        <div class="task-state-divide-arrow">
          <i class="el-icon-right"></i>
        </div>
        <div class="task-state">
          <el-rate
            v-model="taskNewState.priority"
            disabled
            :colors="['#ecf0f1', '#f1c40f', '#d35400', '#c0392b']"
          ></el-rate>
        </div>
      </div>

        <div v-if="(taskPrevState.taskDateRange[0] != taskNewState.taskDateRange[0]) || (taskPrevState.taskDateRange[1] != taskNewState.taskDateRange[1])">
        <div class="task-state-change-label">Date range</div>
        <div class="task-state">
          {{ new Date(taskPrevState.taskDateRange[0]).toLocaleString('ru-RU').substring(0, 10) }} - {{ new Date(taskPrevState.taskDateRange[1]).toLocaleString('ru-RU').substring(0, 10) }}
        </div>
        <div class="task-state-divide-arrow">
          <i class="el-icon-right"></i>
        </div>
        <div class="task-state">
          {{ new Date(taskNewState.taskDateRange[0]).toLocaleString('ru-RU').substring(0, 10) }} - {{ new Date(taskNewState.taskDateRange[1]).toLocaleString('ru-RU').substring(0, 10) }}
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import * as fb from "firebase";

export default {
  data() {
    return {
      stageId: this.$route.params.stageId,
      taskId: this.$route.params.taskId,

      task: {},
      loading: false,

      editDetailsWindow: false,
      taskPrevState: {taskDateRange: []},
      taskNewState: { taskDateRange: []}
    };
  },
  mounted() {
    this.loading = true;
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.fetchTaskInfo();
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
    async fetchTaskInfo() {
      const taskInfo = fb
        .database()
        .ref(
          `taskBoard/user-${this.currentUser.uid}/stages/${
            this.stageId
          }/tasks/${this.taskId}`
        );

      taskInfo.on("value", snapshot => {
        this.task = snapshot.val();
      });
    },

    openEditDetailsWindow(period) {
      this.editDetailsWindow = true;
      this.taskPrevState = period.prevState;
      this.taskNewState = period.newState;
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

.task-state-change-label {
  text-align: center;
  margin: 20px 0px;
  font-weight: bold;
  font-size: 15px;
}

.task-state {
  display: inline-block;
  width: 45%;
  text-align: center;
}

.task-state-divide-arrow {
  display: inline-block;
  width: 10%;
  text-align: center;
}
</style>
