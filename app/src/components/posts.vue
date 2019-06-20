<template>
  <div v-loading="loading">
    <div class="control-btns">
      <el-button type="primary" @click="openAddTaskWindow">Add Task</el-button>
      <el-button style="margin-left:15px;" type="primary" @click="openAddStageWindow">Add stage</el-button>

      <el-button
        style="float:right;"
        type="text"
        icon="el-icon-edit"
        @click="editMode = !editMode"
      >{{ editMode ? 'Stop editing' : 'Edit' }}</el-button>
    </div>

    <div class="tasks-container">
      <div class="task-stage" :key="stageIndex" v-for="(stage, stageIndex) in taskBoard">
        <div class="stage-btns-controls" v-if="editMode">
          <el-tooltip class="item" effect="dark" content="move this stage left" placement="top">
            <el-button
              size="mini"
              v-if="stageIndex != 0"
              @click="moveStageLeft(stage)"
              type="info"
              icon="el-icon-arrow-left"
              circle
            ></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="move this stage right" placement="top">
            <el-button
              size="mini"
              @click="moveStageRight(stage)"
              v-if="stageIndex != taskBoard.length - 1"
              type="info"
              icon="el-icon-arrow-right"
              circle
            ></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="edit this stage" placement="top">
            <el-button
              @click="openEditStageWindow(stage)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="delete this stage" placement="top">
            <el-button
              size="mini"
              @click="deleteStage(stage)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-tooltip>
        </div>

        <div class="task-stage-name" :class="{'left-text': editMode}">{{ stage.title }}</div>
        <div class="stage-tasks">
          <div
            class="task"
            :key="taskIndex"
            v-for="(task, taskIndex) in taskBoard[stageIndex].tasks"
          >
            <pre>{{ task.text }}</pre>
            <div class="task-edit-btns-block">
              <el-tooltip
                class="item"
                effect="dark"
                content="finish this task in current stage"
                placement="top"
              >
                <el-button
                  size="mini"
                  v-if="!editMode"
                  @click="finishTask(task, stage)"
                  type="success"
                  icon="el-icon-check"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                v-if="editMode"
                effect="dark"
                content="Edit this task"
                placement="top"
              >
                <el-button
                  size="mini"
                  @click="openEditTaskWindow(task, stage)"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                v-if="editMode"
                effect="dark"
                content="delete this task"
                placement="top"
              >
                <el-button
                  size="mini"
                  @click="deleteTask(task, stage)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="editTask ? 'Edit task' : 'Add task'"
      :visible.sync="addEditTaskDialogVisible"
      width="40%"
    >
      <form @submit.prevent>
        <el-input type="textarea" :rows="4" v-model="task.text" placeholder="explain your task"></el-input>
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditTaskDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading="taskAdding"
          @click="addEditTask"
        >{{ editTask ? 'Edit task' : 'Add task' }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="editStage ? 'Edit stage' : 'Add stage'"
      :visible.sync="addEditStageDialogVisible"
      width="40%"
    >
      <form @submit.prevent>
        <el-input type="text" v-model="stage.title" placeholder="stage title"></el-input>
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditStageDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading="stageAdding"
          @click="addEditStage"
        >{{ editStage ? 'Edit stage' : 'Add stage' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as fb from "firebase";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      editMode: false,
      loading: false,
      taskBoard: [],
      task: {
        text: ""
      },
      stage: {
        title: ""
      },
      taskAdding: false,
      stageAdding: false,

      addEditTaskDialogVisible: false,
      editTask: false,

      addEditStageDialogVisible: false,
      editStage: false
    };
  },
  mounted() {
    this.loadBoard();
  },
  computed: {
    currentUser() {
      return this.$store.getters["userState/user"];
    }
  },
  methods: {
    async getUserBoardeRefById(userId) {
      return await fb.database().ref(`taskBoard/user-${userId}`);
    },

    async getStageRefById(stageId) {
      return await fb
        .database()
        .ref(`taskBoard/user-${this.currentUser.uid}/stages/${stageId}`);
    },

    openAddTaskWindow() {
      this.addEditTaskDialogVisible = true;
      this.editTask = false;
      this.task = { text: "" };
    },

    openEditTaskWindow(task, stage) {
      this.addEditTaskDialogVisible = true;
      this.editTask = true;
      this.task = task;
      this.stage = stage;
      console.log(this.task);
    },

    async addEditTask() {
      if (this.editTask) {

        let update = {};
        update[
          "/taskBoard/user-" +
            this.currentUser.uid +
            "/stages/" +
            this.stage.stageId +
            "/tasks/" +
            this.task.taskId
        ] = this.task;
        this.updateDb(update);

      } else {
        await fb
          .database()
          .ref(
            `taskBoard/user-${this.currentUser.uid}/stages/${
              this.taskBoard[0].stageId
            }/tasks`
          )
          .push(this.task);
      }

      this.addEditTaskDialogVisible = false;
    },

    async finishTask(task, stage) {
      this.loading = true;

      const stageIndex = this.taskBoard.findIndex(
        value => value.stageId === stage.stageId
      );

      if (this.taskBoard[stageIndex + 1] !== undefined) {
        await fb
          .database()
          .ref(
            `taskBoard/user-${this.currentUser.uid}/stages/${
              stage.stageId
            }/tasks/${task.taskId}`
          )
          .remove();
        await fb
          .database()
          .ref(
            `/taskBoard/user-${this.currentUser.uid}/stages/${
              this.taskBoard[stageIndex + 1].stageId
            }/tasks`
          )
          .push(task);
      }

      this.loading = false;
    },

    async deleteTask(task, stage) {
      this.loading = true;

      await fb
        .database()
        .ref(
          `taskBoard/user-${this.currentUser.uid}/stages/${
            stage.stageId
          }/tasks/${task.taskId}`
        )
        .remove();

      this.loading = false;
    },

    async loadBoard() {
      this.loading = true;

      const taskBoard = await fb
        .database()
        .ref(`taskBoard/user-${this.currentUser.uid}`);

      taskBoard.on("value", snapshot => {
        this.taskBoard = [];
        Object.keys(snapshot.val()).forEach(key => {
          Object.keys(snapshot.val()[key]).forEach(stage => {
            const stageValue = snapshot.val()[key][stage];
            stageValue.stageId = stage;
            if (stageValue.tasks !== undefined) {
              Object.keys(stageValue.tasks).forEach(key => {
                stageValue.tasks[key].taskId = key;
              });
            }

            this.taskBoard.push(stageValue);
          });
        });

        this.sortStages(this.taskBoard);
      });
      this.loading = false;
    },

    sortStages(taskBoard) {
      taskBoard.sort((first, next) => {
        return first.order - next.order;
      });
    },

    openAddStageWindow() {
      this.addEditStageDialogVisible = true;
      this.editStage = false;
      this.stage = { title: "" };
    },

    openEditStageWindow(stage) {
      this.addEditStageDialogVisible = true;
      this.editStage = true;
      this.stage = stage;
    },

    async addEditStage() {
      this.stageAdding = true;

      if (this.editStage) {
        let update = {};
        update[
          "/taskBoard/user-" +
            this.currentUser.uid +
            "/stages/" +
            this.stage.stageId
        ] = this.stage;
        this.updateStage(update);
      } else {
        let nextOrder = this.getNextOrder(this.taskBoard);
        const newStage = { title: this.stage.title, order: nextOrder };

        this.addNewStage(newStage);
      }

      this.addEditStageDialogVisible = false;
      this.stageAdding = false;
    },

    async addNewStage(newStage) {
      await fb
        .database()
        .ref(`taskBoard/user-${this.currentUser.uid}/stages`)
        .push(newStage);
    },

    getNextOrder(taskBoard) {
      let maxOrder = 0;

      for (let i = 0; i < taskBoard.length; i++) {
        if (taskBoard[i].order > maxOrder) {
          maxOrder = taskBoard[i].order;
        }
      }
      return maxOrder + 1;
    },

    deleteStage(stage) {
      if (stage.tasks !== undefined && stage.tasks.length !== 0) {
        this.$confirm(
          "There are tasks under this stage, if you delete they will be deleted too.",
          "Warning",
          {
            confirmButtonText: "Delete anyway",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        )
          .then(() => {
            this.$message({
              type: "success",
              message: "Delete completed"
            });

            this.sendStageDeleteRequest(stage.stageId);
          })
          .catch(() => {});
      } else {
        this.sendStageDeleteRequest(stage.stageId);
      }
    },

    sendStageDeleteRequest(stageId) {
      this.loading = true;
      const stageRef = this.getStageRefById(stageId);

      stageRef
        .then(ref => {
          ref.remove();
          this.loading = false;
        })
        .catch(() => {
          console.log("error");
          this.loading = false;
        });
    },

    moveStageLeft(stage) {
      this.loading = true;

      const stageIndex = this.taskBoard.findIndex(
        value => value.stageId === stage.stageId
      );

      if (stageIndex - 1 < 0) {
        return;
      }

      let currentStage = this.taskBoard[stageIndex];
      let prevStage = this.taskBoard[stageIndex - 1];

      this.swapStageOrders(
        this.taskBoard[stageIndex],
        this.taskBoard[stageIndex - 1]
      );

      let updates = {};
      updates[
        "/taskBoard/user-" +
          this.currentUser.uid +
          "/stages/" +
          currentStage.stageId
      ] = this.taskBoard[stageIndex];
      updates[
        "/taskBoard/user-" +
          this.currentUser.uid +
          "/stages/" +
          prevStage.stageId
      ] = this.taskBoard[stageIndex - 1];

      this.updateDb(updates).then(() => {
        this.loading = false;
      });
    },

    moveStageRight(stage) {
      this.loading = true;

      const stageIndex = this.taskBoard.findIndex(
        value => value.stageId === stage.stageId
      );

      if (stageIndex >= this.taskBoard.length - 1) {
        return;
      }

      let currentStage = this.taskBoard[stageIndex];
      let nextStage = this.taskBoard[stageIndex + 1];

      this.swapStageOrders(
        this.taskBoard[stageIndex + 1],
        this.taskBoard[stageIndex]
      );

      let updates = {};
      updates[
        "/taskBoard/user-" +
          this.currentUser.uid +
          "/stages/" +
          currentStage.stageId
      ] = this.taskBoard[stageIndex];
      updates[
        "/taskBoard/user-" +
          this.currentUser.uid +
          "/stages/" +
          nextStage.stageId
      ] = this.taskBoard[stageIndex + 1];

      this.updateDb(updates).then(() => {
        this.loading = false;
      });
    },

    swapStageOrders(prevStage, currentStage) {
      let currentOrderTemp = currentStage.order;
      currentStage.order = prevStage.order;
      prevStage.order = currentOrderTemp;
    },

    async updateDb(updates) {
      return await fb
        .database()
        .ref()
        .update(updates);
    },
  }
};
</script>

<style>
.tasks-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: 50px;
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  white-space: nowrap;
}

.task {
  display: block;
  box-sizing: border-box;
  padding: 25px;
  border: 1px solid #f2f2f2;
  border-radius: 3px;
  word-break: break-all;
  margin-top: 30px;
  padding-bottom: 0px;
  white-space: pre;
}

.task-stage {
  display: inline-block;
  border-right: 1px solid #f2f2f2;
  box-sizing: border-box;
  width: 300px;
  vertical-align: top;
  min-height: 100vh;
}

.stage-tasks {
  overflow: auto;
  padding: 20px;
}

.task-stage-name {
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 10px;
  text-align: center;
  font-weight: bold;
  padding: 20px;
}

.task-edit-btns-block {
  border-top: 1px solid #f2f2f2;
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
  margin-bottom: -13px;
}

.header-container {
  width: 500px;
  left: 50%;
  margin-left: -250px;
  position: relative;
}

.control-btns {
  margin: 0px 25px;
}

.stage-btns-controls {
  position: absolute;
  margin-top: 17px;
  margin-left: 140px;
}

.task-label {
  font-size: 20px;
  margin-bottom: 10px;
}

pre {
  margin: 0;
}

.left-text {
  text-align: left;
}
</style>

