<template>
  <div class="todo">
    <TodoList/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TodoList from "@/components/TodoList.vue";

export default defineComponent({
  name: "TodoView",
  components: {
    TodoList,
  },
});
</script>

<style scooped lang="scss">
.todo {
  position: relative;
  top: 90px;
  z-index: 1;
}
</style>
