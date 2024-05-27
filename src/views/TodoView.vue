<template>
  <div class="todo">
    <h1>TODOS</h1>
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
