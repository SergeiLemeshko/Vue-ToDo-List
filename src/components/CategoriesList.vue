<template>
  <div>
    <ul>
      <li v-for="cat in categories" :key="cat.id">
        <div class="test">{{ "Название: " + cat.name }};  {{ "Описание: " + cat.description }}</div> 
        <button @click="confirmRemoveCategorie(cat.id)">Удалить</button>
        <button @click="openModal()">Редактировать</button>
      </li>
    </ul>
    <ModalDelete
      ref="confirmModal"
      title="Удаление категории"
      message="Вы уверены, что хотите удалить эту категорию?"
      :onConfirm="removeCategorie"
      :onCancel="cancelRemoveCategorie"
    />
    <ModalTodo
      v-if="isModalOpen"
      title="Создание категории"
      nameBtn="Создать"
      :onSubmit="createCategorie"
    />
    <ModalTodo
      v-if="isEditModal"
      title="Редактирование категории"
      nameBtn="Сохранить"
      :onSubmit="editCategory"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useCategorieListStore } from "../store/useCategorieListStore";
import { useModalTodoStore } from '../store/useModalTodoStore'
import { Category } from "../store/useTodoListStore";
import ModalDelete from '@/UI/ModalDelete.vue';
import ModalTodo from '@/UI/ModalTodo.vue';

export default defineComponent({
  name: "CategoriesList",
  components: {
    ModalDelete,
    ModalTodo,
  },
  setup() {
    const store = useCategorieListStore();
    const modalStore = useModalTodoStore();
    const { fetchCategorie, updateCategorie, addCategorie, deleteCategorie } = store;
    const { isModalOpen, isEditModal } = storeToRefs(modalStore);

    // const todos = ref<Task[]>([]);
    const categories = ref<Category[]>([]);
    const categorieIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);

    onMounted(async () => {
      // todos.value = await fetchTasks("/GetTasks");
      categories.value = await fetchCategorie("/GetCategories");
      // displayCategories(todos.value, categories.value);
    });

    
    //---создание---------------------------
    const createCategorie = async (newCategorie: Omit<Category, 'id'>) => {
      const addedCategorie = await addCategorie(newCategorie, "/AddCategory");
      categories.value.push(addedCategorie);
      // displayCategories(todos.value, categories.value);
    };

    //---удаление---------------------------
    const confirmRemoveCategorie = (categorieId: number) => {
      categorieIdToDelete.value = categorieId;
      confirmModal.value?.show();
    };

    const removeCategorie = async () => {
      if (categorieIdToDelete.value !== null) {
        await deleteCategorie(categorieIdToDelete.value, "/RemoveCategory/");
        categories.value = categories.value.filter(cat => cat.id !== categorieIdToDelete.value);
        categorieIdToDelete.value = null;
      }
    };

    const cancelRemoveCategorie = () => {
      categorieIdToDelete.value = null;
    };

      //---редактирование(500 ошибка)---------------------------
      const editCategory = async (updatedCategory: Category) => {
      const responseCategory = await updateCategorie(updatedCategory, "/categories");
      const index = categories.value.findIndex(cat => cat.id === updatedCategory.id);
      if (index !== -1) {
        categories.value[index] = responseCategory;
      }
    };

    const openModal = () => {
      modalStore.openModal(true);
    };

    return { 
      isModalOpen,
      isEditModal,
      categories,
      confirmModal,
      fetchCategorie, 
      updateCategorie, 
      addCategorie, 
      deleteCategorie,
      createCategorie,
      confirmRemoveCategorie,
      removeCategorie,
      cancelRemoveCategorie,
      editCategory,
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
