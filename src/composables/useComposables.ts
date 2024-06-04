import { watch, Ref, watchEffect, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

// watcher, который предотвращает возможность взаимодействия со списком под модальным окном
export function useBodyClass(visible: Ref<boolean>) {
  watch(visible, (newVal) => {
    if (newVal) {
      document.body.classList.add('no-overflow');
    } else {
      document.body.classList.remove('no-overflow');
    }
  });
}

// изменяет цвет 'Выберите категорию' в поле Категория в зависимости от того, открыт select или нет
export function useSelectClass(isOpenSelect: Ref<boolean>, currentSelect: Ref<HTMLDivElement | null>) {
  watchEffect(() => {
    if (!isOpenSelect.value && currentSelect.value) {
      if (currentSelect.value.textContent === 'Выберите категорию') {
        currentSelect.value.classList.add('text-categorie');
      }
    } else if (isOpenSelect.value && currentSelect.value) {
      currentSelect.value.classList.remove('text-categorie');
    }
  });
}

// валидация поля "Имя"
export const useNameValidation = () => {
  const isInvalidName = ref<boolean>(false);

  const validateName = (name: string) => {
    if (name.length >= 1 && name.length <= 255) {
      isInvalidName.value = false;
    } else {
      isInvalidName.value = true;
      setTimeout(function() {
        isInvalidName.value = false;
      }, 1500);
    }
  };

  return { isInvalidName, validateName };
};

// валидация поля "Описание"
export const useDescriptionValidation = () => {
  const route = useRoute();
  const isInvalidDesc = ref<boolean>(false);

  const validateDescription = (description: string) => {
    const currentPageTodo = computed(() => route.path !== "/categories");
    
    if ((description.length >= 1536 && currentPageTodo.value) ||
      (description.length >= 512 && !currentPageTodo.value)) {
      isInvalidDesc.value = true;
      setTimeout(function() {
        isInvalidDesc.value = false;
      }, 1500);
    } else {
      isInvalidDesc.value = false;
    }
  };

  return { isInvalidDesc, validateDescription };
};
