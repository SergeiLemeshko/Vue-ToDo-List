<template>
  <div>
    <ul>
      <TodoItem 
        v-for="cat in categories" 
        :key="cat.id" 
        :item="cat"
        :isTodoPage="false"
        :confirmRemoveItem="confirmRemoveCategorie" 
        :openMainModal="openMainModal"
      />
    </ul>
    <ModalDelete
      ref="confirmModal"
      title="Удаление категории"
      :message="titleToDelete"
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
  <SpinnerLoad :isLoading="isLoading" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMethodsStore, Category } from "../store/useMethodsStore";
import { useModalMainStore } from '../store/useModalMainStore';
import TodoItem from "@/components/TodoItem.vue";
import ModalDelete from '@/UI/ModalDelete.vue';
import ModalMain from '@/UI/ModalMain.vue';
import SpinnerLoad from '@/UI/SpinnerLoad.vue';

export default defineComponent({
  name: "CategoriesList",
  components: {
    ModalDelete,
    ModalMain,
    TodoItem,
    SpinnerLoad,
  },
  setup() {
    const store = useMethodsStore();
    const modalStore = useModalMainStore();
    const { fetchData, addElem, updateElem, deleteElem } = store;
    const { isModalOpen, isEditModalOpen } = storeToRefs(modalStore);

    const categories = ref<Category[]>([]);
    const categorieIdToDelete = ref<number | null>(null);
    const confirmModal = ref<InstanceType<typeof ModalDelete> | null>(null);
    const nameDeleteCategorie = ref<string>('');
    const isLoading = ref<boolean>(false);

    onMounted(async () => {
      isLoading.value = true;
      categories.value = await fetchData<Category[]>("/GetCategories");
        if(categories.value) {
          setTimeout(function() {
          isLoading.value = false;
        }, 500);
      }
    });

    // создание категории
    const createCategorie = async (newCategorie: Omit<Category, 'id'>) => {
      try {
        const addedCategorie = await addElem<Category>(newCategorie, "/AddCategory");
          categories.value.push(addedCategorie);
        } catch (error) {
          console.error("Ошибка при создании категории:", error);
        }
      };

    // получаем id категории и показываем модальное окно
    const confirmRemoveCategorie = (categorieId: number) => {
      categorieIdToDelete.value = categorieId;
      nameDeleteCategorie.value = categories.value.filter(с => с.id === categorieIdToDelete.value)[0].name;
      confirmModal.value?.show();
    };

    // удаление категории
    const removeCategorie = async () => {
      if (categorieIdToDelete.value !== null) {
        await deleteElem<Category>(categorieIdToDelete.value, "/RemoveCategory/");
        categories.value = categories.value.filter(cat => cat.id !== categorieIdToDelete.value);
        categorieIdToDelete.value = null;
      }
    };

    const cancelRemoveCategorie = () => {
      categorieIdToDelete.value = null;
    };

    // редактирование категории
    const editCategory = async (updatedCategory: Category) => {
      const responseCategory = await updateElem<Category>(updatedCategory, "/UpdateCategory");
      const index = categories.value.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        categories.value[index] = responseCategory;
      }
    };

    // показываем модальное окно редактирования
    const openMainModal = () => {
      modalStore.openMainModal(true);
    };

    const titleToDelete = computed(() => `Вы уверены, что хотите удалить категорию “${nameDeleteCategorie.value}”?`);

    return { 
      isModalOpen,
      isEditModalOpen,
      categories,
      confirmModal,
      nameDeleteCategorie,
      titleToDelete,
      isLoading,
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

</style>
