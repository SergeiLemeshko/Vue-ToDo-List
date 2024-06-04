<template>
  <div class="todo-list">
    <ul>
      <TodoItem 
        v-for="todo in todos" 
        :key="todo.id" 
        :item="todo"
        :isTodoPage="true"
        :confirmRemoveItem="confirmRemoveTask" 
        :openMainModal="openMainModal"
      />
    </ul>
    <ModalDelete
      ref="confirmModal"
      title="Удаление задачи"
      :message="titleToDelete"
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
    <SpinnerLoad :isLoading="isLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoListStore, Task } from "../store/useTodoListStore";
import { useModalMainStore } from '../store/useModalMainStore';
import { useCategorieListStore, Category } from "../store/useCategorieListStore";
import TodoItem from "@/components/TodoItem.vue";
import ModalDelete from '@/UI/ModalDelete.vue';
import ModalMain from '@/UI/ModalMain.vue';
import SpinnerLoad from '@/UI/SpinnerLoad.vue';

export default defineComponent({
  name: 'TodoList',
  components: {
    ModalDelete,
    ModalMain,
    TodoItem,
    SpinnerLoad,
  },
  setup() {
    const store = useTodoListStore();
    const modalStore = useModalMainStore();
    const storeCategorie = useCategorieListStore();
    const { fetchTasks, updateTask, addTask, deleteTask } = store;
    const { displayCategories } = storeCategorie;
    const { isModalOpen, isEditModalOpen } = storeToRefs(modalStore);
    const isLoading = ref<boolean>(false);

    const todos = ref<Task[]>([]);
    const categories = ref<Category[]>([]);
    const taskIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);
    const nameDeleteTodo = ref<string>('');

    onMounted(async () => {
      isLoading.value = true;
      todos.value = await fetchTasks("/GetTasks");
        if(todos.value) {
          setTimeout(function() {
          isLoading.value = false;
        }, 500);
      }
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
      nameDeleteTodo.value = todos.value.filter(t => t.id === taskIdToDelete.value)[0].name;
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

    const titleToDelete = computed(() => `Вы уверены, что хотите удалить задачу “${nameDeleteTodo.value}”?`);

    return {
      todos,
      taskIdToDelete,
      confirmModal,
      isModalOpen, 
      isEditModalOpen,
      titleToDelete,
      nameDeleteTodo,
      isLoading,
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
.todo-list {

}
</style>
