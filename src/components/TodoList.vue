<template>
  <div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div class="test">{{ "Название: " + todo.name }};  {{ "Описание: " + todo.description }};  {{ "Категория: " + todo.categoryName }}</div> 
        <button @click="confirmRemoveTask(todo.id)">Удалить</button>
        <button @click="openModal()">Редактировать</button>
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
      v-if="isModalOpen"
      title="Создание задачи"
      nameBtn="Создать"
      :onSubmit="createTask"
    />
    <ModalTodo
      v-if="isEditModal"
      title="Редактирование задачи"
      nameBtn="Сохранить"
      :onSubmit="editTask"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useTodoListStore } from "../store/useTodoListStore";
import { useModalTodoStore } from '../store/useModalTodoStore'
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
    const modalStore = useModalTodoStore();
    const { fetchTasks, updateTask, addTask, deleteTask, displayCategories } = store;
    const { isModalOpen, isEditModal } = storeToRefs(modalStore);

    const todos = ref<Task[]>([]);
    const categories = ref<Category[]>([]);
    const taskIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);

    onMounted(async () => {
      todos.value = await fetchTasks("/GetTasks");
      categories.value = await fetchTasks("/GetCategories");
      displayCategories(todos.value, categories.value);
    });

    //---создание---------------------------
    const createTask = async (newTask: Omit<Task, 'id'>) => {
      const addedTask = await addTask(newTask, "/AddTask");
      todos.value.push(addedTask);
      displayCategories(todos.value, categories.value);
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

    //---редактирование(500 ошибка)---------------------------
    const editTask = async (updatedTask: Task) => {
      const responseTask = await updateTask(updatedTask, "/UpdateTask");
      const index = todos.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        todos.value[index] = responseTask;
      }
    };

    const openModal = () => {
      modalStore.openModal(true);
    };

    return {
      todos,
      taskIdToDelete,
      confirmModal,
      isModalOpen, 
      isEditModal,
      createTask,
      editTask,
      removeTask,
      confirmRemoveTask,
      cancelRemoveTask,
      openModal,
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
