<template>
  <div v-loading="loading">
    <div class="control-btns">
      <el-button type="primary" @click="openAddTaskWindow" icon="el-icon-plus">Add Task</el-button>
      <el-button
        style="margin-left:15px;"
        type="primary"
        @click="openAddStageWindow"
        icon="el-icon-plus"
      >Add stage</el-button>

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
            @click="openTask(task, stage)"
            :key="taskIndex"
            v-for="(task, taskIndex) in taskBoard[stageIndex].tasks"
          >
            <div class="task-title">{{ task.title }}</div>
            <pre>{{ task.desc }}</pre>

            <div class="task-rate-block">
              <el-rate
                v-model="task.priority"
                disabled
                :colors="['#ecf0f1', '#f1c40f', '#d35400', '#c0392b']"
              ></el-rate>
            </div>

            <div
              class="task-days-left"
            >Days left: {{ Math.ceil(Math.abs(task.taskDateRange[1] - new Date().getTime()) / (1000 * 3600 * 24)) }}</div>

            <div class="task-edit-btns-block">
              <el-tooltip class="item" effect="dark" content="Send this task back" placement="top">
                <el-button
                  size="mini"
                  v-if="!editMode"
                  @click.stop="openMoveTaskBackWindow(task, stage)"
                  type="info"
                  icon="el-icon-back"
                  circle
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Finish this task in current stage"
                placement="top"
              >
                <el-button
                  size="mini"
                  v-if="!editMode"
                  @click.stop="finishTask(task, stage)"
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
                  @click.stop="openEditTaskWindow(task, stage)"
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
                  @click.stop="deleteTask(task, stage.stageId)"
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
        <div class="task-form-label">Task title:</div>
        <el-input type="text" style="margin-bottom:20px;" v-model="task.title"></el-input>

        <div class="task-form-label">Task description:</div>
        <el-input type="textarea" style="margin-bottom: 15px;" :rows="4" v-model="task.desc"></el-input>

        <div style="display:inline-block; margin-right: 20px;">
          <div class="task-form-label">Pick start and finish date</div>
          <el-date-picker
            v-model="task.taskDateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="timestamp"
          ></el-date-picker>
        </div>

        <div style="display:inline-block;vertical-align:top;">
          <div class="task-form-label">Task priority:</div>
          <el-rate v-model="task.priority" :colors="['#ecf0f1', '#f1c40f', '#d35400', '#c0392b']"></el-rate>
        </div>
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

    <el-dialog title="Move task back" :visible.sync="moveTaskBackWindow" width="30%">
      <form @submit.prevent>
        <div class="task-form-label">Choose the stage to move</div>
        <el-select v-model="moveToStageId" placeholder="Select">
          <el-option
            v-for="stage in prevStages"
            :key="stage.stageId"
            :label="stage.title"
            :value="stage.stageId"
          ></el-option>
        </el-select>

        <div class="task-form-label">Reason</div>
        <el-input type="textarea" :rows="2" v-model="moveBackReason"></el-input>
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveTaskBackWindow = false">Cancel</el-button>
        <el-button type="primary" @click="sendTaskBack(task, stage)">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as fb from "firebase";
import { stat } from "fs";

export default {
  data() {
    return {
      editMode: false,
      loading: false,
      taskBoard: [],
      task: {
        title: "",
        desc: "",
        priority: 0,
        taskDateRange: ""
      },
      stage: {
        title: ""
      },
      taskAdding: false,
      stageAdding: false,

      addEditTaskDialogVisible: false,
      editTask: false,

      addEditStageDialogVisible: false,
      editStage: false,
      prevState: null,

      moveTaskBackWindow: false,
      moveToStageId: null,
      moveBackReason: "",
      prevStages: [],
    };
  },
  mounted() {
    this.loading = true;
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.loadBoard();
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
      this.task = { title: "", desc: "", taskDateRange: "" };
    },

    openEditTaskWindow(task, stage) {
      this.addEditTaskDialogVisible = true;
      this.editTask = true;
      this.task = task;
      this.stage = stage;

      this.prevState = {title: this.task.title, desc: this.task.desc, priority: this.task.priority, taskDateRange: this.task.taskDateRange};
    },

    async addEditTask() {
      if (this.editTask) {

          const newState = {title: this.task.title, desc: this.task.desc, priority: this.task.priority, taskDateRange: this.task.taskDateRange};

        this.task.lifecycle.push({
          type: "edited",
          date: new Date().getTime(),
          newState: newState,
          prevState: this.prevState
        });

        console.log(this.task)

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
        this.task.lifecycle = [];

        let created = {
          type: "created",
          toStage: this.taskBoard[0].title,
          date: new Date().getTime()
        };

        this.task.lifecycle.push(created);

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

    openTask(task, stage) {
      this.$router.push(
        `/taskBoard/stages/${stage.stageId}/tasks/${task.taskId}`
      );
    },

    async finishTask(task, stage) {
      const stageIndex = this.taskBoard.findIndex(
        value => value.stageId === stage.stageId
      );

      if (this.taskBoard[stageIndex + 1] !== undefined) {
        task.lifecycle.push({
          type: "finished",
          fromStage: stage.title,
          toStage: this.taskBoard[stageIndex + 1].title,
          date: new Date().getTime()
        });

        this.moveTask(
          task,
          stage.stageId,
          this.taskBoard[stageIndex + 1].stageId
        );
      } else {
        task.lifecycle.push({
          type: `finished`,
          fromStage: stage.title,
          date: new Date().getTime()
        });

        this.$message({ message: "Moved to finished tasks", type: "success" });

        let taskData = task;

        this.deleteTask(task, stage.stageId);

        await fb
          .database()
          .ref(`taskBoard/user-${this.currentUser.uid}/finishedTasks`)
          .push(taskData);
      }
    },

    openMoveTaskBackWindow(task, stage) {
      this.task = task;
      this.stage = stage;
      this.moveTaskBackWindow = true;

      this.prevStages = [];
      for (let i = 0; i < this.taskBoard.length; i++) {
        if (stage.stageId == this.taskBoard[i].stageId) {
          break;
        }
        this.prevStages.push(this.taskBoard[i]);
      }
    },

    async sendTaskBack(task, stage) {
      const stageIndex = this.taskBoard.findIndex(
        value => value.stageId === stage.stageId
      );
      if (stageIndex === 0) {
        return;
      }

      task.lifecycle.push({
        type: `movedBack`,
        fromStage: stage.title,
        toStage: this.taskBoard[stageIndex - 1].title,
        date: new Date().getTime(),
        desc: this.moveBackReason
      });

      this.moveTask(task, stage.stageId, this.moveToStageId).then(() => {
        this.moveTaskBackWindow = false;
      });
    },

    async moveTask(task, fromStageId, toStageId) {
      this.deleteTask(task, fromStageId);
      this.addTask(task, toStageId);
    },

    async addTask(task, stageId) {
      await fb
        .database()
        .ref(`/taskBoard/user-${this.currentUser.uid}/stages/${stageId}/tasks`)
        .push(task);
    },

    async deleteTask(task, stageId) {
      await fb
        .database()
        .ref(
          `taskBoard/user-${this.currentUser.uid}/stages/${stageId}/tasks/${
            task.taskId
          }`
        )
        .remove();
    },

    async loadBoard() {
      this.loading = true;
      const taskBoard = await fb
        .database()
        .ref(`taskBoard/user-${this.currentUser.uid}`);

      taskBoard.on("value", snapshot => {
        this.taskBoard = [];
        Object.keys(snapshot.val()).forEach(key => {
          if (key === "stages") {
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
          }
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
        this.updateDb(update);
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
    }
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
  margin-bottom: 30px;
  padding-bottom: 0px;
  white-space: pre;
  cursor: pointer;
}

.task:hover {
  background: rgba(236, 240, 241, 0.1);
}

.task-title {
  font-size: 17px;
  margin-bottom: 7px;
  text-align: center;
  font-weight: bold;
}

.task-rate-block {
  position: absolute;
  margin-top: 5px;
  margin-left: 46px;
}

.task-days-left {
  position: absolute;
  font-size: 11px;
  color: grey;
  margin-top: 23px;
  margin-left: 160px;
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
  margin-top: 15px;
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
  white-space: pre-wrap;
}

.left-text {
  text-align: left;
}

.task-form-label {
  font-size: 15px;
  font-weight: bold;
  margin: 10px 0px;
}
</style>

