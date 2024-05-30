<template>
  <div v-if="isModalOpen || isEditModalOpen" class="modal-main">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>{{ title }}</h3>
        <ButtonClose :onClick="closeThisModal"></ButtonClose>
      </div>
      <form @submit.prevent="submitForm">
        <div class="modal-content__medium">
          <div :class="[currentPageTodo ? 'modal-content__medium-name' : 'modal-content__medium-cat']">
            <span :class="[currentPageTodo ? 'name-todo' : 'name-cat']">Имя</span>
            <input 
              v-model="name" 
              id="name" 
              type="text" 
              :placeholder="namePlaceholder"
              required
              :class="{ 'is-invalid': !isNameValid }"
            />
          </div>
          <div v-if="currentPageTodo" class="modal-content__medium-categorie">
            <span class="categorie-medium">Категория</span>
            <select 
              v-model="categoryId" 
              id="category"
              ref="currentSelect"
              @mousedown="toggleOpen"
              @blur="closeSelect" 
              @change="closeSelect"
            >
              <option :value="null">Выберите категорию</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-content__bottom">
          <span class="description">Описание</span>
          <textarea 
            v-model="description" 
            id="description" 
            type="text" 
            :placeholder="descriptionPlaceholder" 
          />
        </div>
        <div class="modal-content__btns">
          <ButtonMain type="submit" size="medium" color="blue">{{ nameBtn }}</ButtonMain>
          <ButtonMain size="small" color="white" :onClick="closeThisModal">Закрыть</ButtonMain>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType, Ref } from 'vue';
import ButtonClose from '@/UI/ButtonClose.vue';
import ButtonMain from '@/UI/ButtonMain.vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useModalMainStore } from '../store/useModalMainStore';
import { Category } from "../store/useCategorieListStore";
import { useTodoListStore } from "../store/useTodoListStore";
import { useSelectClass } from '@/composables/useComposables';

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
    const isOpenSelect = ref(false);
    const currentSelect: Ref<HTMLSelectElement | null> = ref(null);

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

    const namePlaceholder = computed(() => route.path === "/todo" ? "Введите имя задачи" : 'Введите имя категории');

    const descriptionPlaceholder = computed(() => route.path === "/todo" ? "Введите описание задачи" : 'Введите описание категории');

    // @mousedown вызывает toggleOpen, который добавляет/удаляет класс .open на элементе selecte
    const toggleOpen = (event: Event) => {
      const selectElement = event.target as HTMLSelectElement;
      if (!isOpenSelect.value) {
        selectElement.classList.add('open');
      } else {
        selectElement.classList.remove('open');
      }
      isOpenSelect.value = !isOpenSelect.value;
    };

    // @blur и @change вызывает closeSelect, чтобы убрать класс open, когда элемент теряет фокус и когда выбираем опцию
    const closeSelect = (event: Event) => {
      const selectElement = event.target as HTMLSelectElement;
      selectElement.classList.remove('open');
      isOpenSelect.value = false;
    };

    useSelectClass(isOpenSelect, currentSelect);

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
      isOpenSelect,
      currentSelect,
      namePlaceholder,
      descriptionPlaceholder,
      submitForm,
      closeMainModal,
      closeThisModal,
      clearFieldsModal,
      toggleOpen,
      closeSelect,
    };
  },
});
</script>

<style lang="scss">
.modal-main {
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
  background: #DBE2EF;
  padding: 24px;
  border-radius: 4px;
  text-align: center;
  width: 800px;
  height: 376px;
  box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.3);

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 13px;

    & h3 {
      font-size: 40px;
      font-weight: 500;
      color: #3F72AF;
    }
  }

  &__medium {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

    &-name {
      margin-left: -7px;
      margin-right: 28px;

      & input {
        width: 364px;
        height: 46px;
        border: 2px solid #3F72AF;
        border-radius: 4px;
        background-color: #DBE2EF;
        padding: 3px 10px 0px 9px;
        font-size: 20px;
        outline: none;
      }

      & input::placeholder {
        font-size: 20px;
      }
    }

    &-cat {

      & input {
        width: 752px;
        height: 46px;
        border: 2px solid #3F72AF;
        border-radius: 4px;
        background-color: #DBE2EF;
        padding: 3px 10px 0px 9px;
        font-size: 20px;
        outline: none;
      }

      & input::placeholder {
        font-size: 20px;
      }
    }

    &-categorie {

      & select {
        width: 364px;
        height: 46px;
      }
    }
  }
}

.name-todo {
  position: relative;
  top: 12px;
  right: 144px;
  padding: 0px 12px 0px 2px;
  background-color: #DBE2EF;
  color: #3F72AF;
  font-size: 18px;
}

.name-todo::after {
  content: url("../assets/asterisk.svg");
  position: absolute;
  top: 29%;
  right: 2px;
  transform: translateY(-50%);
  font-size: 16px;
}

.name-cat {
  position: relative;
  top: 12px;
  right: 339px;
  padding: 0px 12px 0px 2px;
  background-color: #DBE2EF;
  color: #3F72AF;
  font-size: 18px;
}

.name-cat::after {
  content: url("../assets/asterisk.svg");
  position: absolute;
  top: 29%;
  right: 2px;
  transform: translateY(-50%);
  font-size: 16px;
}

.categorie-medium {
  position: relative;
  top: 11px;
  right: 115px;
  padding: 0px 3px 0px 2px;
  background-color: #DBE2EF;
  color: #3F72AF;
  font-size: 18px;
}

.description {
  position: relative;
  top: 11px;
  right: 321px;
  padding: 0px 4px 0px 3px;
  background-color: #DBE2EF;
  color: #3F72AF;
  font-size: 18px;
}

.modal-content__medium-categorie {

  & select {
    border: 2px solid #3F72AF;
    border-radius: 4px;
    max-width: 346px;
    padding: 9px 10px 10px 9px;
    height: 46px;
    font-size: 20px;
    // color: #00000085;
    background-color: #DBE2EF;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    background-image: url('../assets/arrow.svg'); /* Стрелочка */
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 14px;
    outline: none;
  }

  & select::-ms-expand {
    display: none; /* Убираем стрелочку в IE */
  }

  & select.open {
    background-image: url('../assets/arrow-open.svg'); /* Перевернутая стрелочка */
  }
}

.modal-content__bottom {
  margin-bottom: 24px;

  & textarea {
    width: 364px;
    height: 46px;
    border: 2px solid #3F72AF;
    border-radius: 4px;
    background-color: #DBE2EF;
    width: 752px;
    height: 72px;
    resize: none;
    padding: 8px;
    font-size: 20px;
    font-family: Roboto;
    outline: none;
  }

  & textarea::placeholder {
        font-size: 20px;
      }

  & textarea::-webkit-resizer {
    display: none;
  }
}

.modal-content__btns {
  display: flex;
  align-items: center;
  justify-content: end;
}

.text-categorie {
  color: #00000085;
}

.is-invalid {
  border-color: #dc3545;
}

.no-overflow {
  overflow: hidden;
}
</style>