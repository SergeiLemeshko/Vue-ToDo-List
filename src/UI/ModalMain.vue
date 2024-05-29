<template>
  <div v-if="isModalOpen || isEditModalOpen" class="modal-overlay">
    <div class="modal-content">
      <ButtonClose :onClick="closeThisModal"></ButtonClose>
      <h3>{{ title }}</h3>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Имя</label>
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
        <div v-if="currentPageTodo">
          <label for="category">Категория</label>
          <select v-model="categoryId" id="category">
            <option :value="null">Не выбрана</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <ButtonMain type="submit" size="medium" color="blue">{{ nameBtn }}</ButtonMain>
        <ButtonMain size="small" color="white" :onClick="closeThisModal">Закрыть</ButtonMain>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType } from 'vue';
import ButtonClose from '@/UI/ButtonClose.vue';
import ButtonMain from '@/UI/ButtonMain.vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useModalMainStore } from '../store/useModalMainStore';
import { Category } from "../store/useCategorieListStore";
import { useTodoListStore } from "../store/useTodoListStore";

export default defineComponent({
  name: 'ModalMain',
  components: {
    ButtonClose,
    ButtonMain,
  },
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
      type: Function as PropType<(formData: { id: number; name: string; description: string; categoryId: number}) => void>,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const store = useTodoListStore();
    const modalStore = useModalMainStore();
    const { fetchTasks } = store;
    const { closeMainModal } = modalStore;
    const { isModalOpen, isEditModalOpen } = storeToRefs(modalStore);

    const id = ref<number | null>(null);
    const name = ref<string>('');
    const description = ref<string>('');
    const categoryId = ref<number | null>(null);
    const categories = ref<Category[]>([]);

    onMounted(async () => {
      categories.value = await fetchTasks("/GetCategories");
    });

    // отправка формы
    const submitForm = () => {
      props.onSubmit({
        id: id.value || 0,
        name: name.value,
        description: description.value,
        categoryId: categoryId.value || 0,
      });
      closeMainModal();
      clearFieldsModal();
    };

    // закрываем модальное окно и чистим его поля
    const closeThisModal = () => {
      closeMainModal();
      clearFieldsModal();
    };

    // чистит поля модального окна
    const clearFieldsModal = () => {
      name.value = '',
      description.value = '',
      categoryId.value = null;
    };

    // для отображения или скрытия поля "Категория" в модальном окне
    const currentPageTodo = computed(() => route.path === "/todo");

    // валидация поля "Имя"
    const isNameValid = computed(() => name.value.length <= 255);

    return {
      id,
      name,
      description,
      categoryId,
      isModalOpen,
      isEditModalOpen,
      categories,
      isNameValid,
      currentPageTodo,
      submitForm,
      closeMainModal,
      closeThisModal,
      clearFieldsModal,
    };
  },
});
</script>

<style lang="scss">
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
  z-index: 3;
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

.no-overflow {
  overflow: hidden;
}
</style>