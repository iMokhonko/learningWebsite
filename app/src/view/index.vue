<template>
  <div>
    <draggable
      @end="checkMove"
      v-bind="dragOptions"
      :list="items"
      ghost-class="ghost"
    >
      <transition-group type="transition">
        <div v-for="item in items" :key="item.order">{{ item.title }}</div>
      </transition-group>
    </draggable>

    <pre>
      {{ items }}
    </pre>

    <center>
      <router-link to="/taskBoard">
        <el-button icon="el-icon-user" size="mini" type="primary">TaskBoard</el-button>
      </router-link>
    </center>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

export default {
  components: {
    draggable
  },
  data() {
    return {
      items: [
        { title: "First elem", order: 0 },
        { title: "Second elem", order: 1 },
        { title: "Third elem", order: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200
      };
    }
  },
  mounted() {},
  methods: {
    checkMove(e) {
      this.changeOrder();
    },

    changeOrder() {
      for(let i = 0; i < this.items.length; i++) {
        this.items[i].order = i;
      }
    }
  }
};
</script>

<style>
.ghost {
  opacity: 0.5;
}
</style>

