<template>
  <div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div class="test">{{ "Название: " + todo.name }};  {{ "Описание: " + todo.description }};  {{ "Категория: " + todo.categoryName }}</div> 
        <button @click="confirmRemoveTask(todo.id)">Удалить</button>
        <button @click="openMainModal()">Редактировать</button>
      </li>
    </ul>
    <ModalDelete
      ref="confirmModal"
      title="Удаление задачи"
      message="Вы уверены, что хотите удалить эту задачу?"
      :onConfirm="removeTask"
      :onCancel="cancelRemoveTask"
    />
    <ModalMain
      v-if="isModalOpen"
      title="Создание задачи"
      nameBtn="Создать"
      :onSubmit="createTask"
    />
    <ModalMain
      v-if="isEditModalOpen"
      title="Редактирование задачи"
      nameBtn="Сохранить"
      :onSubmit="editTask"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoListStore, Task } from "../store/useTodoListStore";
import { useModalMainStore } from '../store/useModalMainStore';
import { useCategorieListStore, Category } from "../store/useCategorieListStore";
import ModalDelete from '@/UI/ModalDelete.vue';
import ModalMain from '@/UI/ModalMain.vue';

export default defineComponent({
  name: 'TodoList',
  components: {
    ModalDelete,
    ModalMain,
  },
  setup() {
    const store = useTodoListStore();
    const modalStore = useModalMainStore();
    const storeCategorie = useCategorieListStore();
    const { fetchTasks, updateTask, addTask, deleteTask } = store;
    const { displayCategories } = storeCategorie;
    const { isModalOpen, isEditModalOpen } = storeToRefs(modalStore);

    const todos = ref<Task[]>([]);
    const categories = ref<Category[]>([]);
    const taskIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);

    onMounted(async () => {
      todos.value = await fetchTasks("/GetTasks");
      categories.value = await fetchTasks("/GetCategories");
      displayCategories(todos.value, categories.value);
    });

    // создание задачи
    const createTask = async (newTask: Omit<Task, 'id'>) => {
      const addedTask = await addTask(newTask, "/AddTask");
      todos.value.push(addedTask);
      displayCategories(todos.value, categories.value);
    };

    // получаем id задачи и показываем модальное окно
    const confirmRemoveTask = (taskId: number) => {
      taskIdToDelete.value = taskId;
      confirmModal.value?.show();
    };

    // удаление задачи
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

    // редактирование задачи
    const editTask = async (updatedTask: Task) => {
      const responseTask = await updateTask(updatedTask, "/UpdateTask");
      const index = todos.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        todos.value[index] = responseTask;
      }
    };

    // показываем модальное окно редактирования
    const openMainModal = () => {
      modalStore.openMainModal(true);
    };

    return {
      todos,
      taskIdToDelete,
      confirmModal,
      isModalOpen, 
      isEditModalOpen,
      createTask,
      editTask,
      removeTask,
      confirmRemoveTask,
      cancelRemoveTask,
      openMainModal,
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
