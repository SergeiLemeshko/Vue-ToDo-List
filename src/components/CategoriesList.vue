<template>
  <div>
    <ul>
      <li v-for="cat in categories" :key="cat.id">
        <div class="test">{{ "Название: " + cat.name }};  {{ "Описание: " + cat.description }}</div> 
        <button @click="confirmRemoveCategorie(cat.id)">Удалить</button>
        <button @click="openMainModal()">Редактировать</button>
      </li>
    </ul>
    <ModalDelete
      ref="confirmModal"
      title="Удаление категории"
      message="Вы уверены, что хотите удалить эту категорию?"
      :onConfirm="removeCategorie"
      :onCancel="cancelRemoveCategorie"
    />
    <ModalMain
      v-if="isModalOpen"
      title="Создание категории"
      nameBtn="Создать"
      :onSubmit="createCategorie"
    />
    <ModalMain
      v-if="isEditModalOpen"
      title="Редактирование категории"
      nameBtn="Сохранить"
      :onSubmit="editCategory"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategorieListStore, Category } from "../store/useCategorieListStore";
import { useModalMainStore } from '../store/useModalMainStore';
import ModalDelete from '@/UI/ModalDelete.vue';
import ModalMain from '@/UI/ModalMain.vue';

export default defineComponent({
  name: "CategoriesList",
  components: {
    ModalDelete,
    ModalMain,
  },
  setup() {
    const store = useCategorieListStore();
    const modalStore = useModalMainStore();
    const { fetchCategorie, updateCategorie, addCategorie, deleteCategorie } = store;
    const { isModalOpen, isEditModalOpen } = storeToRefs(modalStore);

    const categories = ref<Category[]>([]);
    const categorieIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);

    onMounted(async () => {
      categories.value = await fetchCategorie("/GetCategories");
    });

    // создание категории
    const createCategorie = async (newCategorie: Omit<Category, 'id'>) => {
      const addedCategorie = await addCategorie(newCategorie, "/AddCategory");
      categories.value.push(addedCategorie);
    };

    // получаем id категории и показываем модальное окно
    const confirmRemoveCategorie = (categorieId: number) => {
      categorieIdToDelete.value = categorieId;
      confirmModal.value?.show();
    };

    // удаление категории
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

      // редактирование категории
      const editCategory = async (updatedCategory: Category) => {
      const responseCategory = await updateCategorie(updatedCategory, "/categories");
      const index = categories.value.findIndex(cat => cat.id === updatedCategory.id);
      if (index !== -1) {
        categories.value[index] = responseCategory;
      }
    };

    // показываем модальное окно редактирования
    const openMainModal = () => {
      modalStore.openMainModal(true);
    };

    return { 
      isModalOpen,
      isEditModalOpen,
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
