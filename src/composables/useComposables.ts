import { watch, Ref, watchEffect } from 'vue';

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
