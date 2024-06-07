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
            <span :class="[currentPageTodo ? 'name-todo' : 'name-cat', { 'is-invalid__name': isInvalidName }]">Имя</span>
            <input 
              v-model="name" 
              id="name" 
              type="text"
              :placeholder="namePlaceholder"
              @focus="validateNameField"
              :class="{ 'is-invalid': isInvalidName }"
              required
            />
            <p v-if="isInvalidName" class="modal-content__medium-required">Поле должно быть обязательным от 1 до 255 символов</p>
          </div>
          <div v-if="currentPageTodo">
            <span class="categorie-medium">Категория</span>
            <CustomSelect 
              v-model="categoryId" 
              :categories="categories" 
            />
          </div>
        </div>
        <div class="modal-content__bottom">
          <span class="description" :class="{ 'is-invalid__name': isInvalidDesc }">Описание</span>
          <textarea 
            v-model="description" 
            id="description" 
            type="text" 
            :placeholder="descriptionPlaceholder"
            @focus="validateDescriptionField"
            :class="{ 'is-invalid': isInvalidDesc }" 
          />
          <p v-if="isInvalidDesc" class="modal-content__bottom-desc">Описание должно быть менее {{ numOfCharacters }} символов</p>
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
import { defineComponent, ref, computed, onMounted, PropType } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useModalMainStore } from '../store/useModalMainStore';
import { useMethodsStore, Category } from "../store/useMethodsStore";
import { useNameValidation, useDescriptionValidation } from '@/composables/useComposables';
import CustomSelect from "@/UI/CustomSelect.vue";
import ButtonClose from '@/UI/ButtonClose.vue';
import ButtonMain from '@/UI/ButtonMain.vue';

export default defineComponent({
  name: 'ModalMain',
  components: {
    ButtonClose,
    ButtonMain,
    CustomSelect,
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
    const store = useMethodsStore();
    const modalStore = useModalMainStore();
    const { fetchData } = store;
    const { closeMainModal } = modalStore;
    const { isModalOpen, isEditModalOpen } = storeToRefs(modalStore);

    const id = ref<number | null>(null);
    const name = ref<string>('');
    const description = ref<string>('');
    const categoryId = ref<number | null>(null);
    const categories = ref<Category[]>([]);
    const { isInvalidName, validateName } = useNameValidation();
    const { isInvalidDesc, validateDescription } = useDescriptionValidation();

    onMounted(async () => {
      categories.value = await fetchData<Category[]>("/GetCategories");
    });

    // отправка формы
    const submitForm = () => {
      validateNameField();
      validateDescription(description.value);
      if (isInvalidName.value || isInvalidDesc.value) {
        return;
      }
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
    const closeThisModal = (): void => {
      closeMainModal();
      clearFieldsModal();
    };

    // чистит поля модального окна
    const clearFieldsModal = (): void => {
      name.value = '',
      description.value = '',
      categoryId.value = null;
    };

    // для отображения или скрытия поля "Категория" в модальном окне
    const currentPageTodo = computed(() => route.path !== "/categories");

    const namePlaceholder = computed(() => route.path !== "/categories" ? "Введите имя задачи" : 'Введите имя категории');

    const descriptionPlaceholder = computed(() => route.path !== "/categories" ? "Введите описание задачи" : 'Введите описание категории');

    // валидация поля "Имя"
    const validateNameField = (): void => {
      validateName(name.value);
    };
    // валидация поля "Описание"
    const validateDescriptionField = (): void => {
      validateDescription(description.value);
    };

    const numOfCharacters = computed(() => route.path !== "/categories" ? "1536" : '512');

    return {
      id,
      name,
      description,
      categoryId,
      isModalOpen,
      isEditModalOpen,
      categories,
      currentPageTodo,
      namePlaceholder,
      descriptionPlaceholder,
      isInvalidName,
      isInvalidDesc,
      numOfCharacters,
      validateDescriptionField,
      validateNameField,
      submitForm,
      closeMainModal,
      closeThisModal,
      clearFieldsModal,
      validateName,
      validateDescription,
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

    & input:hover {
      border: 2px solid #257FEA;
      transition: all ease 0.3s;
    }

    & input:focus {
      border: 2px solid #257FEA;
      transition: all ease 0.3s;
    }

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
  right: 113px;
  padding: 0px 3px 0px 2px;
  background-color: #DBE2EF;
  color: #3F72AF;
  font-size: 18px;
  z-index: 1;
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

  & textarea:hover {
    border: 2px solid #257FEA;
    transition: all ease 0.3s;
  }

  & textarea:focus {
    border: 2px solid #257FEA;
    transition: all ease 0.3s;
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
  border: 2px solid #EC1D1D !important;
}

.is-invalid__name {
  color: #EC1D1D;
}

.no-overflow {
  overflow: hidden;
}

.modal-content__medium-required,
.modal-content__bottom-desc {
  position: absolute;
  color: #EC1D1D;
  margin-left: 15px;
  font-size: 15px;
}
</style>