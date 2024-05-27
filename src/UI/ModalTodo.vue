<template>
  <div v-if="isModalOpen || isEditModal" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Название</label>
          <input 
          v-model="name" 
          id="name" 
          type="text" 
          required
          :class="{ 'is-invalid': !isNameValid }"
          />
        </div>
        <div>
          <label for="description">Описание</label>
          <input v-model="description" id="description" type="text" />
        </div>
        <div v-if="currentPage">
          <label for="category">Категория</label>
          <select v-model="categoryId" id="category">
            <option :value="null">Не выбрана</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <button type="submit">{{ nameBtn }}</button>
        <button type="button" @click="closeTodoModal">Закрыть</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useModalTodoStore } from '../store/useModalTodoStore';
import { Category } from "../store/useTodoListStore";
import { useTodoListStore } from "../store/useTodoListStore";

export default defineComponent({
  name: 'ModalTodo',
  props: {
    title: {
      type: String,
      required: true,
    },
    nameBtn: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const name = ref('');
    const description = ref('');
    const categoryId = ref<number | null>(null);
    const categories = ref<Category[]>([]);

    const route = useRoute();
    const modalStore = useModalTodoStore();
    const { closeModal } = modalStore;
    const { isModalOpen, isEditModal } = storeToRefs(modalStore);

    const store = useTodoListStore();
    const { fetchTasks } = store;

    onMounted(async () => {
      categories.value = await fetchTasks("/GetCategories");
    });


    const submitForm = () => {
      // if (name.value && description.value && categoryId.value !== null) {
        props.onSubmit({
          name: name.value,
          description: description.value,
          categoryId: categoryId.value || 0,
        });
        closeModal();
        clearFieldsTodoModal();
      // }
    };

    const closeTodoModal = () => {
      closeModal();
      clearFieldsTodoModal();
    };

    const clearFieldsTodoModal = () => {
      name.value = '',
      description.value = '',
      categoryId.value = null
    };

    const currentPage = computed(() => route.path === "/todo");

    const isNameValid = computed(() => name.value.length <= 255);

    return {
      name,
      description,
      categoryId,
      isModalOpen,
      isEditModal,
      categories,
      isNameValid,
      currentPage,
      submitForm,
      closeModal,
      closeTodoModal,
      clearFieldsTodoModal,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.is-invalid {
  border-color: #dc3545;
}
</style>