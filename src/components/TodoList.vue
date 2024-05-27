<template>
  <div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div class="test">{{ todo.id }}-{{ todo.name }}-{{ todo.description }}-{{ todo.categoryName }}</div> 
        <button  @click="confirmRemoveTask(todo.id)">Удалить</button>
        <button @click="editTask(todo)">Редактировать</button>
      </li>
    </ul>
    <ModalDelete
      ref="confirmModal"
      title="Удаление задачи"
      message="Вы уверены, что хотите удалить эту задачу?"
      :onConfirm="removeTask"
      :onCancel="cancelRemoveTask"
    />
    <ModalTodo
      title="Создание задачи"
      :onSubmit="createTask"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useTodoListStore } from "../store/useTodoListStore";
import { Task, Category } from "../store/useTodoListStore";
import ModalDelete from '@/UI/ModalDelete.vue';
import ModalTodo from '@/UI/ModalTodo.vue';

export default defineComponent({
  name: 'TodoList',
  components: {
    ModalDelete,
    ModalTodo,
  },
  setup() {
    const store = useTodoListStore();
    const { fetchTasks, updateTask, addTask, deleteTask } = store;
    const todos = ref<Task[]>([]);
    const categories = ref<Category[]>([]);
    const taskIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);

    onMounted(async () => {
      todos.value = await fetchTasks("/GetTasks");
      categories.value = await fetchTasks("/GetCategories");
    });

    //---создание---------------------------
    const createTask = async (newTask: Omit<Task, 'id'>) => {
      const addedTask = await addTask(newTask, "/AddTask");
      todos.value.push(addedTask);
      
      todos.value.forEach(todo => {
        const category = categories.value.find(c => c.id === todo.categoryId);
        if (category) {
          todo.categoryName = category.name;
        }
      });
      console.log(todos.value, 'todos.value')
    };

    //---удаление---------------------------
    const confirmRemoveTask = (taskId: number) => {
      taskIdToDelete.value = taskId;
      confirmModal.value?.show();
    };

    const removeTask = async () => {
      if (taskIdToDelete.value !== null) {
        await deleteTask(taskIdToDelete.value, "/RemoveTask/");
        todos.value = todos.value.filter(task => task.id !== taskIdToDelete.value);
        taskIdToDelete.value = null;
      }
    };

    const cancelRemoveTask = () => {
      taskIdToDelete.value = null;
    };

    //---редактирование(пока не реализовано)---------------------------
    const editTask = async (task: Task) => {
      // const updatedTask = { ...task, completed: !task.completed }; // Добавить/удалить свойство по необходимости
      const updatedTask = { ...task }; // Добавить/удалить свойство по необходимости
      const responseTask = await updateTask(updatedTask, "/UpdateTask");
      const index = todos.value.findIndex(t => t.id === task.id);
      todos.value[index] = responseTask;
    };

    return {
      todos,
      taskIdToDelete,
      confirmModal,
      createTask,
      editTask,
      removeTask,
      confirmRemoveTask,
      cancelRemoveTask,
    };
  },
});
</script>

<style scoped lang="scss">
.test {
  color: rgb(255, 247, 247)
}

.test2 {
  color: rgb(141, 45, 45);
}
</style>
